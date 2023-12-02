"use client"

import { useEffect, useState } from "react";
import RecommendedTypesNav from "../_components/recommended-types.component";
import classNames from "classnames";
import PostFeed from "../_components/post-feed.component";
import { useGetRecommendedPosts } from "@/store/hooks/content.hooks";
import { Box, Stack, Toolbar } from "@mui/material";

export type RecommendedTypes = "FOLLOWING" | "FORYOU";

export default function Home() {
    const [recommendedType, setRecommendedType] = useState<RecommendedTypes>("FORYOU");
    const postsPerLoad = 10;

    const {
        data: forYouPosts,
        isLoading: isForYouPostsLoading,
        size: forYouPostsSize,
        setSize: forYouPostsSetSize,
    } = useGetRecommendedPosts(postsPerLoad)

    const {
        data: followingPosts,
        isLoading: isFollowingPostsLoading,
        size: followingPostsSize,
        setSize: followingPostsSetSize
    } = useGetRecommendedPosts(postsPerLoad, true)

    const onForYouScrollEnd = (() => {
        if (recommendedType == "FORYOU") {
            if (!isForYouPostsLoading) {
                forYouPostsSetSize(forYouPostsSize + 1);
            }
        }
    })

    const onFollowingScrollEnd = (() => {
        if (recommendedType == "FOLLOWING") {
            if (!isFollowingPostsLoading) {
                followingPostsSetSize(followingPostsSize + 1);
            }
        }
    })

    return (
        <Stack component="main"
            height={"100dvh"}
            overflow="hidden">
            <Box bgcolor="black"
                position="relative"
                flexGrow={1}
                overflow="hidden">
                <RecommendedTypesNav className={`absolute top-sat pt-5 left-1/2 -translate-x-1/2 z-10`}
                    onRecommendTypeChange={(recommendedType) => setRecommendedType(recommendedType)}
                    currentRecommendedType={recommendedType} />

                <PostFeed className={classNames({
                    "hidden": recommendedType != "FOLLOWING"
                })} posts={followingPosts?.flat()}
                    isLoading={isFollowingPostsLoading}
                    onScrollEnd={onFollowingScrollEnd}
                    placeholder="No posts found. Follow someone now to view their latest posts in your feed." />

                <PostFeed className={classNames({
                    "hidden": recommendedType != "FORYOU"
                })} posts={forYouPosts?.flat()}
                    isLoading={isForYouPostsLoading}
                    onScrollEnd={onForYouScrollEnd}
                    placeholder="No posts found." />
            </Box >

            <Toolbar />
        </Stack>
    );
}