import { ChatEntity } from "../repositories/entity/ChatEntity";

export const getId = (auth_by_phone: boolean, user_id: number, phone: string) => {
  if (auth_by_phone) {
    return Number(phone);
  }
  return Number(user_id);
}

export const validationAccessToChat = (auth_by_phone: boolean, user_id: Number, phone: string, chat: ChatEntity): boolean => {
  if (auth_by_phone) {
    return !chat || chat.user_id !== phone;
  }
  return !chat || chat.user_id !== String(user_id);
}