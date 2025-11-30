import React from "react";
import Header from "../components/Header";
import UserProfile from "../components/UserProfile";
import ChatAssistant from "../components/ChatAssistant";
import Footer from "../components/Footer";

const ProfilePage = () => {
    return (
        <main className="relative w-full min-h-screen bg-gradient-to-br from-emerald-800 via-teal-600 to-emerald-900">
            {/* Header cố định */}
            <Header />

            {/* Profile Section */}
            <section className="w-full min-h-[calc(100vh-80px)] flex items-start justify-center pt-6 overflow-y-auto cart-scroll">
                <UserProfile />
            </section>

            <Footer />
            <ChatAssistant />
        </main>
    );
};

export default ProfilePage;