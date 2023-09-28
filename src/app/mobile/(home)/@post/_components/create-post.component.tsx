"use client"

import { Box, Button } from "@mui/material";
import { AddAPhoto } from "@mui/icons-material";
import { ChangeEventHandler, useRef, useState } from "react";
import { PostType } from "@/dtos/content/post.dtos";
import AddPostButton from "./add-post-button.component";
import PostEditor from "./post-editor.component";
import { useSpinner } from "@/components/spinner.component";
import { useAlertPrompt } from "@/components/alert-prompt.component";
import * as postClientService from "@/app/_client-services/content/post.client-service";

export default function CreatePost() {
    const [file, setFile] = useState<File>();
    const [mediaType, setMediaType] = useState<PostType>(PostType.PHOTO);
    const [mediaURL, setMediaURL] = useState<string | undefined>();
    const { showSpinner } = useSpinner();
    const { promptAlert } = useAlertPrompt();

    const handleUpload: ChangeEventHandler<HTMLInputElement> = (e) => {
        if (e.currentTarget.files?.length) {
            const file = e.currentTarget.files.item(0)!;

            const url = URL.createObjectURL(file);
            setMediaURL(url);
            setMediaType(file.type.includes("video") ? PostType.VIDEO : PostType.PHOTO)
            setFile(file);
        }
    }

    const handleCancel = () => {
        setMediaURL(undefined);
    }

    const handleSubmit = async (description?: string) => {    
        try {
            if(!file) {
                throw "Uploaded file is missing."
            }

            showSpinner(true);

            await postClientService.createPost(file, description);

            promptAlert({
                title: "New Post Created!",
                message: "Post successfully created!"
            });

            setMediaURL(undefined);
        } catch (error) {
            promptAlert({
                title: "Create Post Failed",
                message: "Oops, failed to create post. Please try again."
            })
        } finally {
            showSpinner(false);
        }
    }

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            width: "100%",
            height: "100%"
        }}>
            {
                !mediaURL ?
                    <AddPostButton onChange={handleUpload} />
                    :
                    <PostEditor src={mediaURL}
                        type={mediaType}
                        onSave={handleSubmit}
                        onCancel={handleCancel} />
            }
        </Box>
    )
}