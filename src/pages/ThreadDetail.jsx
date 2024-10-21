import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./ThreadDetail.css";

function ThreadDetail() {
    const location = useLocation();
    const { threadId } = useParams();

    const [posts, setPosts] = useState([]);
    const [postMap, setPostMap] = useState({});
    const [latestPostId, setLatestPostId] = useState(null);
    const [offset, setOffset] = useState(0);
    const [isFetching, setIsFetching] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [newPost, setNewPost] = useState("");
    const [isPosting, setIsPosting] = useState(false);

    const observer = useRef(null);

    const threadTitle = location.state ? location.state.threadTitle : "(スレッドタイトルを取得できませんでした)";

    const fetchPosts = async (offset = 0) => {
        setIsFetching(true);
        const API_URL = `https://railway.bulletinboard.techtrain.dev/threads/${threadId}/posts?offset=${offset}`;
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error("APIの呼び出しに失敗しました");
            }
            const data = await response.json();
            if (data.posts.length === 0) {
                setHasMore(false);
                return;
            }
            if (offset === 0 && data.posts.length > 0) {
                setLatestPostId(data.posts[0].id);
            }
            setPostMap((prevPostMap) => {
                const newPostMap = { ...prevPostMap };
                data.posts.forEach((post, index) => {
                    if (!newPostMap[post.id]) {
                        newPostMap[post.id] = {
                            id: post.id,
                            post: post.post,
                            prevPost: null,
                            nextPost: null,
                        };
                    }
                    if (!newPostMap[post.id].prevPost) {
                        newPostMap[post.id].prevPost = index === 0 ? null : data.posts[index - 1].id;
                    }
                    if (!newPostMap[post.id].nextPost) {
                        newPostMap[post.id].nextPost = index === data.posts.length - 1 ? null : data.posts[index + 1].id;
                    }
                });
                return newPostMap;
            });
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        setOffset(0);
        setPostMap({});
        setHasMore(true);
        fetchPosts(0);
    }, [threadId]);

    const lastPostElementRef = useCallback(node => {
        if (isFetching) return;

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                fetchMorePosts();
            }
        });

        if (node) observer.current.observe(node);
    }, [isFetching, hasMore]);

    const fetchMorePosts = () => {
        if (hasMore && !isFetching) {
            const newOffset = offset + 8;
            setOffset(newOffset);
            fetchPosts(newOffset);
        }
    };

    useEffect(() => {
        // postMapを元に投稿リストを構築
        const postList = [];
        let currentPostId = latestPostId;
        while (currentPostId) {
            postList.push(postMap[currentPostId]);
            currentPostId = postMap[currentPostId].nextPost;
        }
        setPosts(postList);
    }, [postMap]);

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        if (newPost === "") return;

        const API_URL = `https://railway.bulletinboard.techtrain.dev/threads/${threadId}/posts`;
        setIsPosting(true);

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ post: newPost }),
            });

            if (!response.ok) {
                throw new Error("投稿の送信に失敗しました");
            }

            setNewPost("");

            // 投稿後、データをリセットして再取得
            setOffset(0);
            setLatestPostId(null);
            setPostMap({});
            setHasMore(true);
            fetchPosts(0);
        } catch (error) {
            console.error("Error posting:", error);
            alert("投稿に失敗しました");
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <div className="thread-detail-container">
            <h2 className="thread-title">{threadTitle}</h2>
            <form className="post-form" onSubmit={handlePostSubmit}>
                <textarea
                    className="post-input"
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="新しい投稿を入力..."
                    rows="4"
                />
                <button
                    className="post-button"
                    type="submit"
                    disabled={isPosting || newPost === ""}
                >
                    {isPosting ? "投稿中..." : "投稿"}
                </button>
            </form>
            <div className="posts-container">
                {posts.map((post, index) => {
                    if (index === posts.length - 1) {
                        return (
                            <div key={post.id} className="post-card" ref={lastPostElementRef}>
                                <div className="post-content">{post.post}</div>
                            </div>
                        );
                    } else {
                        return (
                            <div key={post.id} className="post-card">
                                <div className="post-content">{post.post}</div>
                            </div>
                        );
                    }
                })}
                {isFetching && <p>読み込み中...</p>}
            </div>
        </div>
    );
}

export default ThreadDetail;
