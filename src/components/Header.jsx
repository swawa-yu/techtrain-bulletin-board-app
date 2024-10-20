import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {
    const navigate = useNavigate();

    return (
        <header className="header">
            <h1 className="header-title" onClick={() => { navigate("/"); }}>
                掲示板アプリ
            </h1>
            <button className="create-thread" onClick={() => { navigate("/threads/new"); }}>
                スレッドをたてる
            </button>
        </header>
    );
}

export default Header;
