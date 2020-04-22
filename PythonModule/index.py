from telethon import TelegramClient, events
import json

api_id =  0
api_hash = ''
client = TelegramClient('weaver', api_id, api_hash)

    # message_id: number;
    # from_id?: number;
    # from_user?: string;
    # chat_id: number;
    # date: number;
    # text?: string;
    # reply_message_id?: number;
    # voice_id?: string;
    # image_id?: string;
    # link?: string; 

async def GetHistory():
    f = open('./storage/messages.json', 'a')
    f.write('[')

    async for message in client.iter_messages('InterNationalChatting', 500):
        # print('ID:', message.id, 'Text:', message.text)
        content = {
            "message_id": message.id,
            "from_id": message.from_id,
            "chat_id": message.to_id.channel_id,
            "date": message.date.timestamp(),
            "text": message.message,
            "reply_message_id": message.reply_to_msg_id
        }

        try:
            if message.media.photo:
                # download
                path = await message.download_media('./storage/'+str(content["chat_id"])+'/'+str(message.media.photo.id))
                content['image_path'] = path
                content['image_id'] = message.media.photo.id
        except:
            pass

        try:
            if message.media.document.mime_type == 'audio/ogg':
                # download
                path = await message.download_media('./storage/'+str(content["chat_id"])+'/'+str(message.media.document.id))
                content['voice_path'] = path
                content['voice_id'] = message.media.document.id
        except:
            pass
        f.write(str(json.dumps(content))+',')

        print(content)
    f.write(']')
    f.close()
    

with client:
    client.loop.run_until_complete(GetHistory())