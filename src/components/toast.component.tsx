"use client"

import { Alert, AlertProps, Box, Drawer } from "@mui/material";
import { PropsWithChildren, createContext, useEffect, useState, useContext } from "react";

export enum ToastDuration {
    SHORT, LONG
}

const LONG_DURATION = 3000;
const SHORT_DURATION = 1000;

export type ToastProps = {
    message: string,
    duration: ToastDuration
} & AlertProps

const ToastContext = createContext<{ showToast: (props: ToastProps) => void }>({
    showToast: () => { },
});

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: PropsWithChildren) {
    const [open, setOpen] = useState(false);
    const [props, setProps] = useState<ToastProps>();

    let timeout: NodeJS.Timeout;

    const showToast = (props: ToastProps) => {
        setProps(props);
        setOpen(true);
    }

    useEffect(() => {
        if (open) {
            clearTimeout(timeout);

            const duration = props?.duration == ToastDuration.LONG ? LONG_DURATION : SHORT_DURATION;

            timeout = setTimeout(() => {
                setOpen(false);
            }, duration);
        }
    }, [open, props?.message]);

    return (
        <ToastContext.Provider value={{ showToast }}>
            <Toast open={open} {...props}>
                {props?.message}
            </Toast>

            {children}
        </ToastContext.Provider>
    )
}

export default function Toast({ children, open, ...props }
    : { open: boolean } & AlertProps & PropsWithChildren) {
    return (
        <Drawer
            PaperProps={{
                sx: {
                    m: 1,
                    backgroundColor: "transparent"
                }
            }}
            open={open}
            anchor="bottom">
            <Alert severity="info" {...props}>
                {children}
            </Alert>
        </Drawer>
    )
}