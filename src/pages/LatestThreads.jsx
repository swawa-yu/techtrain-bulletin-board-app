import React from "react";
import { useEffect, useState, useRef } from "react";
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

    const observerRef = useRef();

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
    }, []);

    useEffect(() => {
        let observer;
        if (observerRef.current) {
            const options = {
                root: null,
                rootMargin: '0px',
                threshold: 0.1,
            };

            observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore && !isFetching) {
                    fetchMoreThreads();
                }
            }, options);

            observer.observe(observerRef.current);
        }

        return () => {
            if (observer && observerRef.current) {
                observer.unobserve(observerRef.current);
            }
        };
    }, [observerRef.current, hasMore, isFetching]);

    const fetchMoreThreads = () => {
        if (hasMore && !isFetching) {
            const newOffset = offset + 8;
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
                {threads.map((thread, index) => {
                    if (index === threads.length - 1) {
                        return (
                            <button
                                key={thread.id}
                                ref={observerRef}
                                className="thread-button"
                                onClick={() => handleNavigate(thread.id, thread.title)}
                            >
                                {thread.title}
                            </button>
                        );
                    } else {
                        return (
                            <button
                                key={thread.id}
                                className="thread-button"
                                onClick={() => handleNavigate(thread.id, thread.title)}
                            >
                                {thread.title}
                            </button>
                        );
                    }
                })}
                {isFetching && <p>読み込み中...</p>}
            </div>
        </div>
    );
}

export default LatestThreads;
