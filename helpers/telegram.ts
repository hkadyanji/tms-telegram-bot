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
      if (msg.text.match(/\/start/)) {
      const welcomeMessage = `
        Welcome to the unoffical tms vehicle check bot:
        - Send a license plate in the format of T111AAA and get the results of any traffic issues.`;

        await this.bot.sendMessage(chatId, welcomeMessage);
        return;
      }

      const result = await getMessage(msg.text);
      await this.bot.sendMessage(chatId, result);
    });
  }
}
