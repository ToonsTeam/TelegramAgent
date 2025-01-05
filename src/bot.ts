import * as dotenv from 'dotenv';
dotenv.config();

import { Telegraf, Context } from 'telegraf';
import { Message } from 'telegraf/typings/core/types/typegram';
import { generatePrompt } from './prompt';
import { generateImage } from './image';
import { RequestQueue, QueueItem } from './queue';

const token = process.env.TELEGRAM_BOT_TOKEN!;
const ALLOWED_GROUP_IDS = (process.env.TELEGRAM_GROUP_IDS || '').split(',').map(Number).filter(Boolean);

if (!token) throw new Error('TELEGRAM_BOT_TOKEN must be provided!');
if (!ALLOWED_GROUP_IDS.length) throw new Error('TELEGRAM_GROUP_IDS must be provided!');

console.log('Environment variables:', {
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN?.slice(0, 5) + '...',
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY?.slice(0, 10) + '...',
  FAL_API_KEY: process.env.FAL_API_KEY?.slice(0, 10) + '...',
  TELEGRAM_GROUP_IDS: ALLOWED_GROUP_IDS
});

console.log('Starting bot with token:', token.slice(0, 5) + '...' + token.slice(-5));
console.log('Allowed group IDs:', ALLOWED_GROUP_IDS);

const bot = new Telegraf(token);

// Middleware to check if message is from allowed groups
bot.use(async (ctx, next) => {
  const chatId = ctx.chat?.id;
  const chatType = ctx.chat?.type;
  
  console.log('Received message from chat:', {
    id: chatId,
    type: chatType
  });
  
  if (!chatId || !ALLOWED_GROUP_IDS.includes(chatId)) {
    try {
      await ctx.reply(`This bot is not authorized for this chat.\nChat ID: ${chatId}\nTo authorize this chat, add this ID to your .env file as TELEGRAM_GROUP_IDS.`);
    } catch (error: any) {
      console.log('Could not send unauthorized message:', error?.message || 'Unknown error');
    }
    return;
  }
  
  return next();
});

// Create request queue
const requestQueue = new RequestQueue(async (item: QueueItem) => {
  try {
    console.log('Processing queue item:', item);
    const { prompt } = await generatePrompt(item.character);
    console.log('Generated prompt:', prompt);
    
    const { image } = await generateImage(prompt);
    console.log('Generated image URL:', image);

    const replyParams = item.ctx.message ? { 
      reply_parameters: { message_id: item.ctx.message.message_id } 
    } : undefined;

    await item.ctx.replyWithPhoto(image, replyParams);
    await item.ctx.reply(`Generated with prompt:\n${prompt}`, replyParams);
  } catch (error) {
    console.error('Error processing request:', error);
    await item.ctx.reply('Sorry, something went wrong. Please try again later.', 
      item.ctx.message ? { reply_parameters: { message_id: item.ctx.message.message_id } } : undefined
    );
  }
});

// Debug middleware
bot.use(async (ctx, next) => {
  console.log('Received update:', {
    updateType: ctx.updateType,
    chatId: ctx.chat?.id,
    fromId: ctx.from?.id,
  });
  await next();
});

bot.command('start', (ctx) => {
  console.log('Start command received');
  ctx.reply('Welcome! Use /prompt <character> to generate a thug life version of any character.\nExample: /prompt Mickey Mouse');
});

bot.command('queue', (ctx) => {
  console.log('Queue command received');
  const queueLength = requestQueue.getQueueLength();
  ctx.reply(`Current queue length: ${queueLength} request${queueLength === 1 ? '' : 's'}`);
});

bot.command('help', (ctx) => {
  console.log('Help command received');
  ctx.reply(
    'Available commands:\n' +
    '/prompt <character> - Generate a thug life version of a character\n' +
    '/queue - Check current queue length\n' +
    '/help - Show this help message'
  );
});

bot.command('prompt', async (ctx) => {
  console.log('Prompt command received:', ctx.message.text);
  const character = ctx.message.text.split('/prompt ')[1]?.trim();
  
  if (!character) {
    console.log('No character provided');
    await ctx.reply('Please provide a character name.\nExample: /prompt Mickey Mouse');
    return;
  }

  console.log('Processing character:', character);
  const queueItem: QueueItem = {
    ctx,
    character,
  };

  requestQueue.add(queueItem);
  
  const queueLength = requestQueue.getQueueLength();
  const position = queueLength > 0 ? queueLength : 'Processing...';
  
  await ctx.reply(`Request queued! Position: ${position}`, { 
    reply_parameters: { message_id: ctx.message.message_id }
  });
});

bot.command('getid', (ctx) => {
  const chatId = ctx.chat?.id;
  ctx.reply(`Current chat ID: ${chatId}`);
});

// Error handling
bot.catch((err, ctx) => {
  console.error('Bot error:', err);
  if (ctx.message) {
    ctx.reply('An error occurred').catch(e => console.error('Error sending error message:', e));
  }
});

console.log('Starting bot...');
bot.launch()
  .then(() => {
    console.log('Bot successfully started!');
  })
  .catch((error) => {
    console.error('Failed to start bot:', error);
    console.error('Error details:', {
      code: error.code,
      response: error.response,
      description: error.description
    });
    process.exit(1);
  });

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM')); 