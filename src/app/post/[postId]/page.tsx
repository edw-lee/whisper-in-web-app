import { getPostDetails } from "@/store/services/content/post.service";
import { notFound } from "next/navigation";
import Post from "@/app/_components/post.component";
import BackButton from "@/app/_components/back-button.component";
import { useGetPostDetails } from "@/store/hooks/content.hooks";
import { Stack } from "@mui/material";

export default async function PostPage({ params, searchParams }
    : { params: { postId: string }, searchParams: { [key: string]: string | string[] } }) {
    const showAvatar = searchParams["showAvatar"] == "true";

    return (
        <Stack flexGrow={1}>
            <Post postId={params.postId} hideAvatar={!showAvatar} />

            <BackButton/>
        </Stack>
    );
}