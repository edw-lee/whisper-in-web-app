"use client"

import { AppBar, Toolbar, Typography, useTheme } from "@mui/material";

export default function Header({ children, title }: { title?: string } & React.PropsWithChildren) {
    const theme = useTheme();

    return (
        <AppBar position="static" sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            minHeight: 88,
            paddingBottom: 2,
            paddingRight: 2,
            paddingLeft: 2
        }}>
            <label className="text-2xl">
                {title}
            </label>

            {children}
        </AppBar>
    );
}