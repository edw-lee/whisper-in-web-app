"use client"

import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Snackbar } from "@mui/material";
import { ChangeEvent, useRef, useState } from "react";

export default function ChatInputBar({ onChange, onSend }
    : { onChange?: (input: string) => void, onSend?: (input: string | undefined) => void }) {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const [initialTextAreaHeight, setInitialTextAreaHeight] = useState(0);
    const [showSnackbar, setShowsnackbar] = useState(false);

    const updateTextAreaHeight = (target: HTMLTextAreaElement) => {
        target.style.height = `${initialTextAreaHeight}px`
        target.style.height = `${target.scrollHeight}px`
    }

    const _onChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const target = event.currentTarget;
        updateTextAreaHeight(target);

        if (onChange) {
            onChange(target.value);
        }
    }

    const _onSend = () => {
        if (textAreaRef.current) {
            if (onSend) {
                onSend(textAreaRef.current.value);
            }

            textAreaRef.current.value = "";

            updateTextAreaHeight(textAreaRef.current)
        }
    }

    return (
        <>
            <div className="flex px-2 py-3 gap-3 items-end">
                <textarea ref={textAreaRef} className="bg-secondary rounded-2xl resize-none p-2 grow max-h-[100px] outline-none"
                    rows={1} onLoad={(e) => setInitialTextAreaHeight(e.currentTarget.clientHeight)} onChange={_onChange} />

                <button className="rounded-full p-2 bg-primary w-[40px] h-[40px]" onClick={_onSend}>
                    <FontAwesomeIcon className="text-white" icon={faArrowUp} />
                </button>
            </div>
        </>
    )
}