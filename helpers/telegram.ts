import TelegramBot from 'npm:node-telegram-bot-api';

import { getMessage } from './fines.ts';

export class Bot {
  private bot: TelegramBot;

  constructor(token: string) {
    this.bot = new TelegramBot(token, { polling: true });
  }

  async initialize() {
    this.bot.on('message', async (msg) => {
      const chatId = msg.chat.id;
      const text = msg.text || 'I can\'t understand that.';
      const result = await getMessage(msg.text);
      await this.bot.sendMessage(chatId, result);
    });
  }
}
