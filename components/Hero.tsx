"use client";

export default function Hero() {
    return (
        <div className="hero h-screen flex flex-col items-center justify-center bg-gray-100">
            <h1 className="hero__title">Welcome to My Website</h1>
            <p className="hero__subtitle">This is a simple hero section.</p>
            <a href="/about" className="hero__button">Learn More</a>
        </div>
    );
}