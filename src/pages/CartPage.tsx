import React from "react";
import Header from "../components/Header";
import ChatAssistant from "../components/ChatAssistant";
import Cart from "../components/Cart";
import Footer from "../components/Footer";

const CartPage = () => {
    return (
        <main className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-emerald-800 via-teal-600 to-emerald-900">
            {/* Header cố định */}
            <Header />

            {/* Mỗi section = 1 màn hình */}
            <section

                className="w-screen h-screen flex-shrink-0 flex items-center justify-center"
            >
                <Cart />
            </section>
            <Footer />
            <ChatAssistant />
        </main>
    );
};

export default CartPage;
