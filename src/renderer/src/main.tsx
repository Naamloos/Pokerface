import "./style/base.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { MemoryRouter, Route, Routes } from "react-router";
import Home from "./pages/Home";

// event handler to disable page back and forward buttons
window.addEventListener("click", (e) => {
    if(e.button === 3 || e.button === 4) {
        e.preventDefault();
        e.stopPropagation();
    }
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <MemoryRouter>
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
        </MemoryRouter>
    </React.StrictMode>
);
