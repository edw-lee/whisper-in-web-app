import { IUserChatMessageDto } from "@/dtos/chats/chats.dtos";
import OpenAI from "openai";
import axiosInstance from "../axios";

  const route = "chat-gpt";
  
  export const MAX_PREV_MESSAGES_LIMIT = 100;
  
  export const getChatCompletion = async (
    profileId: string,
    message: string,
    prevMessages: OpenAI.Chat.ChatCompletionMessageParam[]
  ): Promise<IUserChatMessageDto> => {
    try {
      const result = await axiosInstance.post(`${route}/chat-completion`, {
        message,
        profileId,
        prevMessages,
      });
  
      return result.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  