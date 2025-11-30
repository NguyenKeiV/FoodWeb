// src/pages/RegisterPage.tsx
import React from "react";
import Header from "../components/Header";
import Register from "../components/Register";
import ChatAssistant from "../components/ChatAssistant";

const RegisterPage = () => {
    return (
        <main className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-emerald-800 via-teal-600 to-emerald-900">
            {/* Header cố định */}
            <Header />

            {/* Register Section */}
            <section className="w-screen h-screen flex-shrink-0 flex items-center justify-center">
                <Register />
            </section>

            <ChatAssistant />
        </main>
    );
};

export default RegisterPage;