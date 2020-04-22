import * as telegramBot from 'node-telegram-bot-api';

export default (token: string) => {
    return  new telegramBot(token, {polling: true});
}
