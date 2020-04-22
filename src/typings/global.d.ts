
export interface FormatedMessage {
    message_id: number;
    from_id?: number;
    from_user?: string;
    chat_id: number;
    date: number;
    text?: string;
    reply_message_id?: number;
    voice_id?: string;
    image_id?: string;
    link?: string; 
}