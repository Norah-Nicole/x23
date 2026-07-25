"use client";

export default function ContactForm() {
    return (
        <div className="contact-form">
            <h2>Contact Us</h2>
            <form>
                <input type="text" placeholder="Your Name" />
                <input type="email" placeholder="Your Email" />
                <textarea placeholder="Your Message"></textarea>
                <button type="submit">Send Message</button>
            </form>
        </div>
    );
}
