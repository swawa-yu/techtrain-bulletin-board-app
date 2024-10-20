import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import "./Layout.css";

function Layout() {
    return (
        <div>
            <Header />
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;