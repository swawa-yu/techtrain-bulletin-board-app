import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://railway.bulletinboard.techtrain.dev/threads";

function App() {
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => setThreads(data))
      .catch((error) => console.error("Error fetching threads:", error));
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
            console.log(thread),
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
