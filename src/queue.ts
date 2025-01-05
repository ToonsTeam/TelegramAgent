import { Context } from 'telegraf';

export interface QueueItem {
  ctx: Context;
  character: string;
}

export class RequestQueue {
  private queue: QueueItem[] = [];
  private isProcessing = false;
  private processCallback: (item: QueueItem) => Promise<void>;

  constructor(processCallback: (item: QueueItem) => Promise<void>) {
    this.processCallback = processCallback;
  }

  add(item: QueueItem) {
    this.queue.push(item);
    this.process();
  }

  private async process() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    const item = this.queue.shift()!;

    try {
      await this.processCallback(item);
    } catch (error) {
      console.error('Error processing queue item:', error);
    }

    this.isProcessing = false;
    this.process();
  }

  getQueueLength(): number {
    return this.queue.length;
  }
} 