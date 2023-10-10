"use client"

import MessageList from "./message-list.component";
import ChatInputBar from "./input-bar.component";
import { useState } from "react";
import { IUserChatDto } from "@/dtos/chats/chats.dtos";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Header from "@/app/mobile/_components/header.component";
import { Avatar } from "@mui/material";
import { fetchChatCompletion, insertNewUserChatMessage, setChatAudioReply } from "@/store/thunks/chats.thunks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh, faVolumeMute } from "@fortawesome/free-solid-svg-icons";
import { ChatFeature } from "@/store/states/chats.states";
import BackButton from "@/app/mobile/_components/back-button.component";
import Link from "next/link";

export default function ChatSection({ className, chat }
    : { className?: string, chat: IUserChatDto }) {
    const me = useAppSelector((state) => state.user.me);
    const _chat = useAppSelector((state) => state.chats.chats.find((c) => c.chatId == chat.chatId));
    const profile = chat.profiles.findLast((profile) => profile._id != me?._id)!;
    const [isReplying, setIsReplying] = useState(false);
    const dispatch = useAppDispatch();

    const hasAudioReply = chat.features.includes(ChatFeature.AUDIO);

    const getChatCompletion = async (message: string) => {
        setIsReplying(true);
        try {
            await dispatch(fetchChatCompletion({
                chatId: chat.chatId,
                contactId: profile._id,
                message
            }));
        } catch (error) {

        } finally {
            setIsReplying(false);
        }
    }

    const onSend = (message: string | undefined) => {
        if (!message?.length || !me) {
            return
        }

        dispatch(insertNewUserChatMessage({
            chatId: chat.chatId,
            message,
        }));

        if (profile.isBlocked) {
            return;
        }

        getChatCompletion(message);
    }

    const onToggleAudioReplies = () => {
        dispatch(setChatAudioReply({
            chatId: chat.chatId,
            isAudioOn: !_chat?.isAudioOn
        }));
    }

    return (
        <>
            <Header>
                <div className="flex gap-5 items-center w-full">
                    <div className="flex grow items-center gap-5">
                        <BackButton />

                        <Link href={`/profile/${profile._id}`}>
                            <Avatar src={profile.avatar} sx={{ width: 40, height: 40 }} />
                        </Link>

                        <label className="font-bold text-lg">{profile.name}</label>
                    </div>

                    {
                        hasAudioReply &&
                        <button onClick={onToggleAudioReplies}>
                            <FontAwesomeIcon icon={!_chat?.isAudioOn ? faVolumeMute : faVolumeHigh} fontSize={20} />
                        </button>
                    }
                </div>
            </Header>

            <MessageList className="grow"
                userId={me?._id}
                chatId={chat.chatId}
                isTyping={isReplying} />

            <ChatInputBar onSend={onSend} />

        </>
    )
}