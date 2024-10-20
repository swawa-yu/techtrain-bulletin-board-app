import React from "react";
import { useEffect, useState } from "react";
import "./LatestThreads.css";

function LatestThreads() {
    const [threads, setThreads] = useState([]);

    const fetchThreads = async () => {
        const API_URL = "https://railway.bulletinboard.techtrain.dev/threads";
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error("APIの呼び出しに失敗しました");
            }
            const data = await response.json();
            setThreads(data);
        } catch (error) {
            console.error("Error fetching threads:", error);
        }
    };

    useEffect(() => {
        fetchThreads();
    }, []);

    return (
        <div>
            <h2 className="title">新着スレッド</h2>
            <div className="thread-list">
                {threads.map((thread) => (
                    <button key={thread.id} className="thread-button">
                        {thread.title}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default LatestThreads;