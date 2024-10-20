import { useEffect, useState } from "react";
import "./App.css";

function App() {
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


  const handleCreateThread = () => {
  };

  return (
    <div className="app">
      <header className="header">
        <h1 className="header-title">掲示板アプリ</h1>
        <button className="create-thread" onClick={handleCreateThread}>
          スレッドをたてる
        </button>
      </header>
      <main className="main-content">
        <h2 className="title">新着スレッド</h2>
        <div className="thread-list">
          {threads.map((thread) => (
            <button key={thread.id} className="thread-button">
              {thread.title}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
