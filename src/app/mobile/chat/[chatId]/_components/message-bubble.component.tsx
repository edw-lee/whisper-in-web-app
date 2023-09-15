"use client"

import classNames from "classnames";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { animated, useSpringValue } from "@react-spring/web";
import { ChatMessage } from "@/store/states/chats.states";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPauseCircle, faPlay, faPlayCircle, faStopCircle } from "@fortawesome/free-solid-svg-icons";
import { idb } from "@/store/indexedDB";
import { useLiveQuery } from "dexie-react-hooks";

const convertTime = (time: Date | string) => {
    time = typeof time == "string" ? new Date(time) : time;

    return time.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

function MessageBubbleWrapper({ className, isPrimary, children }: { className?: string, isPrimary?: boolean } & PropsWithChildren) {
    return (
        <div className={classNames(
            "p-2 w-fit",
            className,
            {
                "bg-primary text-onPrimary rounded-tr-2xl rounded-l-2xl self-end": isPrimary,
                "bg-secondary text-onSecondary rounded-bl-2xl rounded-r-2xl": !isPrimary
            }
        )}>
            {children}
        </div>
    );
}

export default function MessageBubble({ className, message, isUser }
    : { className?: string, message: ChatMessage, isUser?: boolean }) {

    const time = convertTime(message.updatedAt!);

    return (
        <MessageBubbleWrapper className={classNames(
            "max-w-[80%]",
            className
        )} isPrimary={isUser}>
            <div className="flex gap-2 p-1 items-end">
                <div className="p-1 whitespace-pre-wrap">
                    {message.message}
                </div>

                <div className="text-xs">
                    {time}
                </div>
            </div>
        </MessageBubbleWrapper>
    );
}

const WAVEFORM_BARS = 50;
const WAVEFORM_WIDTH = 200;
const WAVEFORM_HEIGHT = 50;
const WAVEFORM_GAP = 1;
const WAVEFORM_AMPLIFICATION = 2;

export function MessageBubbleAudio({ className, message, isUser }
    : { className?: string, message: ChatMessage, isUser?: boolean }) {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    const [audioURL, setAudioURL] = useState<string | undefined>();
    const [isPlaying, setIsPlaying] = useState(false);
    const audioSeekerValue = useSpringValue(0);

    const time = convertTime(message.updatedAt!);

    const audio = useLiveQuery(async () =>
        await idb.audios.where('id').equals(message.audioId!).first(),
        [message.audioId]
    );

    const audioContext = new AudioContext();

    const getWaveformChannelData = async (arrayBuffer: ArrayBuffer) => {
        const buffer = await audioContext.decodeAudioData(arrayBuffer);

        const rawChannelData = buffer.getChannelData(0);
        const channelData: number[] = [];

        const channelSkipCount = Math.round((rawChannelData.length - 1) / WAVEFORM_BARS);

        for (let i = 0; i < WAVEFORM_BARS; i++) {
            channelData.push(rawChannelData[i * channelSkipCount]);
        }

        return channelData;
    }

    const generateWaveform = async (arrayBuffer: ArrayBuffer) => {
        const channelData = await getWaveformChannelData(arrayBuffer);
        const context = canvasRef.current!.getContext("2d")!;

        context.save();

        //Draw wave strokes
        context.translate(0, WAVEFORM_HEIGHT / 2);

        const barWidth = WAVEFORM_WIDTH / WAVEFORM_BARS - WAVEFORM_GAP;

        context.beginPath();
        for (let i = 0; i < WAVEFORM_BARS; i++) {
            const x = i * (barWidth + WAVEFORM_GAP);
            const height = Math.max(Math.abs(channelData[i]) * WAVEFORM_HEIGHT * WAVEFORM_AMPLIFICATION * 2, 1);
            context.rect(x, -height / 2, barWidth, height)
        }
        context.clip();

        context.fillStyle = "#aaa";
        context.translate(0, -WAVEFORM_HEIGHT / 2);
        context.fillRect(0, 0, WAVEFORM_WIDTH, WAVEFORM_HEIGHT);
    }

    const resetAudioSeeker = () => {
        const context = canvasRef.current!.getContext("2d")!;

        context.fillStyle = "#aaa";
        context.fillRect(0, 0, WAVEFORM_WIDTH, WAVEFORM_HEIGHT);
    }

    const updateAudioSeeker = () => {
        const context = canvasRef.current!.getContext("2d")!;

        const progress = audioSeekerValue.get() / 100;

        context.fillStyle = "#FFF";
        context.fillRect(0, 0, WAVEFORM_WIDTH * progress, WAVEFORM_HEIGHT);
    }

    useEffect(() => {
        if (audio) {
            const blob = new Blob([audio.arrayBuffer!], { type: "audio/mpeg" });
            const url = URL.createObjectURL(blob);

            setAudioURL(url);
        }
    }, [audio]);

    useEffect(() => {
        if (audio && canvasRef.current) {
            generateWaveform(audio.arrayBuffer);
        }
    }, [audio, canvasRef.current]);


    const toggleAudio = async () => {
        if (audioRef.current) {
            if (!isPlaying) {
                resetAudioSeeker();

                audioRef.current.currentTime = 0;

                audioSeekerValue.start({
                    from: 0,
                    to: 100,
                    config: {
                        duration: audioRef.current.duration * 1000
                    },
                    onChange: updateAudioSeeker
                });

                await audioRef.current.play()
            } else {
                audioSeekerValue.stop();
                await audioRef.current.pause();
            }
        }
    }

    return (
        <MessageBubbleWrapper className={classNames(
            className
        )} isPrimary={isUser}>
            <div className="flex gap-5 p-2 items-center">
                <button onClick={toggleAudio}>
                    <FontAwesomeIcon icon={!isPlaying ? faPlayCircle : faStopCircle} fontSize={35} />
                </button>

                <canvas ref={canvasRef} width={WAVEFORM_WIDTH} height={WAVEFORM_HEIGHT}></canvas>
            </div>

            <div className="flex justify-end text-xs mr-2">
                {time}
            </div>

            <audio ref={audioRef} src={audioURL}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
            />
        </MessageBubbleWrapper>
    );
}

export function MessageBubbleTyping({ isUser }: { isUser?: boolean }) {
    const dotCount = 3;
    const dotRadius = 3;
    const gap = 5;
    const padding = 5;
    const bottomPadding = 10
    const height = 25;
    const width = dotRadius * 2 * dotCount + (gap * dotCount - 2) + padding * 2

    const angle = useSpringValue(Math.PI * 2);

    useEffect(() => {
        angle.start(0, {
            loop: true,
            config: {
                duration: 1200
            }
        });
    }, []);

    const defaultCY = height - dotRadius * 2 - bottomPadding;
    const dotGap = (dotRadius * 2 + gap);
    const defaultCX = dotRadius + padding;

    const getCY = (value: number, idx: number) => {
        const offsetAngle = Math.PI / 2;
        const offset = idx * offsetAngle;
        return (Math.sin(value + offset) + 1) / 2 * defaultCY + dotRadius + padding;
    }

    return (
        <MessageBubbleWrapper isPrimary={isUser}>
            <svg width={width} height={height} fill="grey">
                {
                    [...Array.from(Array(dotCount).keys())].map((idx) =>
                        <animated.circle
                            key={idx}
                            cx={defaultCX + dotGap * idx}
                            cy={angle.to((value) => getCY(value, idx))}
                            r={dotRadius} />
                    )
                }
            </svg>
        </MessageBubbleWrapper>
    );
}