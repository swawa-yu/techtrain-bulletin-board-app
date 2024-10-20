import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LatestThreads.css";

function LatestThreads() {
    const navigate = useNavigate();
    const [threads, setThreads] = useState([]);
    const [threadMap, setThreadMap] = useState({});
    const [latestThreadId, setLatestThreadId] = useState(null);
    const [offset, setOffset] = useState(0);
    const [isFetching, setIsFetching] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const fetchThreads = async (offset = 0) => {
        setIsFetching(true);
        const API_URL = `https://railway.bulletinboard.techtrain.dev/threads?offset=${offset}`;
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error("APIの呼び出しに失敗しました");
            }
            const data = await response.json();
            if (data.length === 0) {
                setHasMore(false);
                return;
            }
            if (offset === 0 && data.length > 0) {
                setLatestThreadId(data[0].id);
            }
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
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        setOffset(0);
        fetchThreads(0);
        setOffset(8);
        fetchThreads(8);
        setOffset(16);
        fetchThreads(16);
        setOffset(24);
        fetchThreads(24);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500) {
                if (hasMore && !isFetching) {
                    fetchMoreThreads();
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore, isFetching]);

    const fetchMoreThreads = () => {
        console.log("fetchMoreThreads");
        if (hasMore && !isFetching) {
            const newOffset = offset + 8;
            console.log("newOffset", newOffset);
            setOffset(newOffset);
            fetchThreads(newOffset);
        }
    };

    useEffect(() => {
        const threadList = [];
        let currentThreadId = latestThreadId;
        while (currentThreadId) {
            threadList.push(threadMap[currentThreadId]);
            currentThreadId = threadMap[currentThreadId].nextThread;
        }
        setThreads(threadList);
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
                {isFetching && <p>読み込み中...</p>}
            </div>
        </div>
    );
}

export default LatestThreads;
