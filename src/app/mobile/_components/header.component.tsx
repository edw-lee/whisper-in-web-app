"use client"

import { AppBar, Toolbar, Typography, useTheme } from "@mui/material";
import classNames from "classnames";

export default function Header({
    children,
    title,
    titleAlignment,
    leftComponent,
    rightComponent
}: {
    title?: string,
    titleAlignment?: "start" | "center" | "end",
    leftComponent?: React.ReactNode,
    rightComponent?: React.ReactNode,
} & React.PropsWithChildren) {
    return (
        <AppBar
            position="sticky"
            className="pt-sat"
            sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-end",
                minHeight: 88,
                paddingBottom: 2,
                paddingRight: 2,
                paddingLeft: 2,
                gap: 3,
                zIndex:1,
            }}>
            {
                children ?
                    children
                    :
                    <>
                        {leftComponent}

                        <label className={classNames(
                            "font-bold text-xl grow",
                            {
                                "absolute left-1/2 -translate-x-1/2 text-center": titleAlignment == "center",
                                "text-left": titleAlignment == "start",
                                "text-right": titleAlignment == "end"
                            }
                        )}>
                            {title}
                        </label>

                        {rightComponent}
                    </>
            }
        </AppBar>
    );
}