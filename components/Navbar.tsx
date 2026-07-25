"use client";

export default function Navbar(){
    return(
        <div className="navbar">
            <div className="navbar__logo">
                {/* <img src="/logo.png" alt="Logo" /> */}
            </div>
            <div className="navbar__links">
                <a href="/">Home</a>
                <a href="/about">About</a>
                <a href="/contact">Contact</a>
            </div>
        </div>
    );
}