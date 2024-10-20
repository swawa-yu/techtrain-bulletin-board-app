import React from "react";

function NewThread() {
    return (
        <div>
            <p>新しいスレッドを作成するページ</p>
            <form>
                <input type="text" placeholder="スレッドのタイトル" />
                <button type="submit">作成する</button>
            </form>
        </div>
    );
}

export default NewThread;