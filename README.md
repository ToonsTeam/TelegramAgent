# ToonsAI Telegram Bot 🎮🎨

A Telegram bot that generates stylized "thug life" character images using Claude AI for creative prompts and Flux LoRA for image generation. 🔥

## ✨ Features

- 🎯 Generate thug life versions of any character(s)
- 👥 Support for multiple characters in one prompt
- ⚡️ Queue system for handling multiple requests
- 🖼️ High-quality image generation with consistent style
- 🤖 Automatic prompt engineering for best results

## 🚀 Setup

1. Clone the repository:
```bash
git clone https://github.com/ToonsAI/TelegramAgent.git
cd TelegramAgent
```

2. Install dependencies:
```bash
npm install
```

3. Copy `.env.example` to `.env` and fill in your API keys:
```bash
cp .env.example .env
```

4. Get required API keys:
- 🤖 Telegram Bot Token: Create a bot through [@BotFather](https://t.me/botfather)
- 🧠 Claude API Key: Sign up at [Anthropic](https://anthropic.com)
- 🎨 Fal.ai API Key: Sign up at [Fal.ai](https://fal.ai)

5. Add the bot to your Telegram group and get the group ID:
```
1. 👋 Add bot to group
2. 🔍 Send /getid command in group
3. ✏️ Copy the returned ID to your .env file
```

## 💫 Usage

Start the bot:
```bash
npm run dev
```

Commands:
- 🎯 `/prompt <character>` - Generate a thug life version of any character
- 📊 `/queue` - Check current queue length
- ℹ️ `/help` - Show help message
- 🔍 `/getid` - Get current chat ID

Examples:
```
/prompt Pikachu
/prompt Mario and Luigi
/prompt Spongebob, Patrick and Squidward
```

## 🔑 Environment Variables

Required environment variables (see `.env.example`):
- 🤖 `TELEGRAM_BOT_TOKEN`: Your Telegram bot token
- 🧠 `ANTHROPIC_API_KEY`: Your Claude API key
- 🎨 `FAL_API_KEY`: Your Fal.ai API key
- 💬 `TELEGRAM_GROUP_ID`: ID of the Telegram group where bot should work

## 🛠️ Development

Built with:
- 📝 TypeScript
- 💻 Node.js
- 🤖 Telegraf (Telegram Bot Framework)
- 🧠 Claude AI (Anthropic)
- 🎨 Flux LoRA (Fal.ai)

## 📄 License

MIT License 🔓 