import React from "react";
import Header from "../components/Header";
import Login from "../components/Login";
import ChatAssistant from "../components/ChatAssistant";
import OrderHistory from "../components/OrderHistory";

const OrderHistoryPage = () => {
    return (
        <main className="relative w-full h-screen bg-gradient-to-br from-emerald-800 via-teal-600 to-emerald-900">
            {/* Header cố định */}
            <Header />

            {/* Section có thể scroll */}
            <section className="w-full h-[calc(100vh-80px)] overflow-y-auto cart-scroll flex items-start justify-center pt-6">
                <OrderHistory />
            </section>

            <ChatAssistant />
        </main>
    );
};

export default OrderHistoryPage;