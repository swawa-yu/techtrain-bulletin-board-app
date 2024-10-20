import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./ThreadDetail.css";

function ThreadDetail() {
    const location = useLocation();

    const { threadId } = useParams();
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState("");
    const [isPosting, setIsPosting] = useState(false);
    const [offset, setOffset] = useState(0);
    const [isFetching, setIsFetching] = useState(false);
    const [hasMore, setHasMore] = useState(true);

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
            setPosts((prevPosts) => [...prevPosts, ...data.posts]);
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setIsFetching(false);
        }
    }

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        if (newPost === "")
            return;

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

            // 新しい投稿が追加されたので、投稿リストをリフレッシュ
            setPosts([]);
            setOffset(0);
            setHasMore(true);
            fetchPosts(0);
            setNewPost("");
        } catch (error) {
            console.error("Error posting:", error);
            alert("投稿に失敗しました");
        } finally {
            setIsPosting(false);
        }
    }

    useEffect(() => {
        setPosts([]);
        setOffset(0);
        setHasMore(true);
        fetchPosts(0);
    }, [threadId]);

    useEffect(() => {
        const handleScroll = () => {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500) {
                if (hasMore && !isFetching) {
                    fetchMorePosts();
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore, isFetching]);

    const fetchMorePosts = () => {
        if (hasMore && !isFetching) {
            const newOffset = offset + 10; // 10件ずつ取得
            setOffset(newOffset);
            fetchPosts(newOffset);
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
                <button className="post-button" type="submit" disabled={isPosting || newPost === ""}>
                    {isPosting ? "投稿中..." : "投稿"}
                </button>
            </form>
            <div className="posts-container">
                {posts.map((post) => (
                    <div key={post.id} className="post-card">
                        <div className="post-content">{post.post}</div>
                    </div>
                ))}
                {isFetching && <p>読み込み中...</p>}
            </div>
        </div>
    );
}

export default ThreadDetail;
