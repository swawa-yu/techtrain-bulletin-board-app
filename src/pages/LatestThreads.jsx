import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LatestThreads.css";

function LatestThreads() {
    const navigate = useNavigate();
    const [threads, setThreads] = useState([]);
    const [threadMap, setThreadMap] = useState({}); // linked listのように前後のthreadIdを持つ
    const [latestThreadId, setLatestThreadId] = useState(null);


    const fetchThreads = async (offset = 0) => {
        const API_URL = `https://railway.bulletinboard.techtrain.dev/threads?offset=${offset}`;
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error("APIの呼び出しに失敗しました");
            }
            const data = await response.json();
            setThreads(data);
            setLatestThreadId(data[0].id);
            // 現在のthreadMapにthreadIdがなければ追加、あれば値を更新する形でthreadMapを更新
            // 値を更新する時には、prevThreadやnextThreadがあればそのまま、なければ追加
            setThreadMap((prevThreadMap) => {
                const newThreadMap = { ...prevThreadMap };
                data.forEach((thread, index) => {
                    if (!newThreadMap[thread.id]) {
                        newThreadMap[thread.id] = {
                            id: thread.id,
                            title: thread.title,
                            prevThread: null,
                            nextThread: null,
                        };
                    }
                    if (!newThreadMap[thread.id].prevThread) {
                        newThreadMap[thread.id].prevThread = index === 0 ? null : data[index - 1].id;
                    }
                    if (!newThreadMap[thread.id].nextThread) {
                        newThreadMap[thread.id].nextThread = index === data.length - 1 ? null : data[index + 1].id;
                    }
                });
                return newThreadMap;
            });
        } catch (error) {
            console.error("Error fetching threads:", error);
        }
    };

    useEffect(() => {
        for (let i = 0; i < 20; i++) {
            fetchThreads(i * 8);
            // ちょっと待つ
            new Promise((resolve) => setTimeout(resolve, 300));
        }
    }, []);

    useEffect(() => {
        // threadMapを元に、最新のスレッドから遡っていき、最新のスレッドまでのリストを作成し、stateにセット
        const threadList = [];
        let currentThreadId = latestThreadId;
        while (currentThreadId) {
            threadList.unshift(threadMap[currentThreadId]);
            currentThreadId = threadMap[currentThreadId].prevThread;
        }
        setThreads(threadList);
        console.log(threadList);
    }, [threadMap]);

    const handleNavigate = (id, title) => {
        navigate(`/threads/${id}`, { state: { threadTitle: title } });
    }

    return (
        <div>
            <h2 className="title">新着スレッド</h2>
            <div className="thread-list">
                {threads.map((thread) => (
                    <button key={thread.id} className="thread-button" onClick={() => {
                        handleNavigate(thread.id, thread.title);
                    }}>
                        {thread.title}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default LatestThreads;