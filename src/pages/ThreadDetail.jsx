import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./ThreadDetail.css";

function ThreadDetail() {
    const { threadId } = useParams();
    const [posts, setPosts] = useState([]);

    const location = useLocation();
    const threadTitle = location.state ? location.state.threadTitle : "(スレッドタイトルを取得できませんでした)";

    const fetchPosts = async (offset) => {
        const API_URL = `https://railway.bulletinboard.techtrain.dev/threads/${threadId}/posts?offset=${offset}`;
        console.log(API_URL);
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error("APIの呼び出しに失敗しました");
            }
            const data = await response.json();
            setPosts([...posts, ...data.posts]);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    }

    useEffect(() => {
        fetchPosts(0);
        fetchPosts(10);
        fetchPosts(20);
    }, []);

    return (
        <div className="thread-detail-container">
            <h2>{threadTitle}</h2>
            <div className="posts-container">
                {posts.map((post) => (
                    <div key={post.id} className="post-card">
                        <pre className="post-content">{post.post}</pre>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ThreadDetail;
