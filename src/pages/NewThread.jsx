import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NewThread.css";

function NewThread() {
    const [title, setTitle] = useState("");
    const navigate = useNavigate();

    const handleCreateThread = async () => {
        const API_URL = "https://railway.bulletinboard.techtrain.dev/threads";
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title }),
            });

            if (!response.ok) {
                throw new Error(`Failed to create thread: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Thread created:", data);
            // navigate(`/thread/{data.threadId}`); // 作成したスレッドに遷移
        } catch (error) {
            console.error("Error creating thread:", error);
            alert("スレッドの作成に失敗しました。もう一度試してください。");
        }
    };

    return (
        <div className="new-thread-container">
            <h2>スレッド新規作成</h2>
            <input
                type="text"
                className="input-field"
                placeholder="スレッドタイトル"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <div className="button-group">
                <button className="back-button" onClick={() => navigate("/")}>
                    Topに戻る
                </button>
                <button className="create-button" onClick={handleCreateThread}>
                    作成
                </button>
            </div>
        </div>
    );
}

export default NewThread;
