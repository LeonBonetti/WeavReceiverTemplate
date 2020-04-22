import telegramBot from '../Bot';
import {Message} from 'node-telegram-bot-api';
import * as fs from 'fs';
import {FormatedMessage} from '../typings/global';

export default (bot_token: string) => {

    const bot = telegramBot(bot_token);

    const SendMessage = async (to: string | number, message: string) => {
        const send = await bot.sendMessage(to, message);
        return send.chat.id;
    }

    const ObservableMessages = async (chat_id?: string) => {
        bot.on('message', async msg => {
            //if(chat_id && msg.chat.id !== chat_id) return;

            console.log('Receive message...');
            const messageToSave = await ParseMessage(msg);
            console.log('Saving message...');
            fs.appendFile(`./storage/${msg.chat.id}.txt`, JSON.stringify(messageToSave) + ' \n', (err)=>{
                if(err) console.log('Error on save message: ', err.message);
                console.log('Message saved!');
                bot.sendMessage(chat_id || '', msg.text || 'I save your message, ok?');
            });
        });
    }

    const GetHistoryChat = async (chat_id: string) => {
        const chat = bot.getChat(chat_id);
        
    }
    
    const ParseMessage = async (msg: Message) => {
        const ParsedMessage: FormatedMessage = {
            message_id: msg.message_id,
            from_id: msg.from?.id,
            from_user: msg.from?.username,
            chat_id: msg.chat.id,
            date: msg.date,
        }
    
        if(msg.text) ParsedMessage.text = msg.text;
    
        if(msg.reply_to_message?.message_id) ParsedMessage.reply_message_id = msg.reply_to_message.message_id;
    
        if(msg.entities) {
            let links = '';
            for(const entitie of msg.entities){
                links += msg.text?.substr(entitie.offset, entitie.length);
            }
            if(links.length > 0) ParsedMessage.link = links;
        }
    
        
        if(msg.voice){
            const name = await bot.downloadFile(msg.voice.file_id, `./storage/`);
            ParsedMessage.voice_id = name;
        }

        if(msg.photo){
            const name = await bot.downloadFile(msg.photo[msg.photo.length -1].file_id, `./storage/`);
            ParsedMessage.image_id = name;
        }

        return ParsedMessage;
    }

    return {
        SendMessage,
        ObservableMessages
    }
}
