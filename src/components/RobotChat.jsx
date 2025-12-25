import { useState, useRef, useEffect } from "react";

const RobotChat = ({ onClose }) => {
    const [messages, setMessages] = useState([
        { id: 1, text: "👋 Hi! I'm your CodeArena assistant. How can I help you today?", sender: "bot" },
    ]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { id: Date.now(), text: input, sender: "user" };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");

        // Simple Mock Responses
        setTimeout(() => {
            let botResponse = "I'm still learning! But you can find great DSA sheets in the 'Sheets' section.";
            const query = input.toLowerCase();

            if (query.includes("striver")) {
                botResponse = "Striver's SDE sheet is a community favorite! Check it out in the Sheets section for a complete roadmap.";
            } else if (query.includes("love babbar") || query.includes("450")) {
                botResponse = "Love Babbar's 450 DSA Cracker is excellent for interview prep. You can track your progress on it right here!";
            } else if (query.includes("faang") || query.includes("company")) {
                botResponse = "Preparing for FAANG? Check our Company Problems section for real interview questions.";
            } else if (query.includes("hi") || query.includes("hello")) {
                botResponse = "Hello there! Ready to solve some problems today?";
            }

            setMessages((prev) => [
                ...prev,
                { id: Date.now() + 1, text: botResponse, sender: "bot" },
            ]);
        }, 1000);
    };

    return (
        <div className="absolute right-0 bottom-full mb-6 w-80 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-white/20 dark:border-gray-800 animate-chat flex flex-col h-96">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gradient-to-r from-blue-600/10 to-purple-600/10">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="font-bold text-sm text-gray-800 dark:text-gray-100 uppercase tracking-wider">AI Assistant</span>
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm ${msg.sender === "user"
                                ? "bg-blue-600 text-white rounded-tr-none"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none"
                                }`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 bg-gray-50/50 dark:bg-gray-800/50">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask me anything..."
                        className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition pr-10"
                    />
                    <button
                        type="submit"
                        className="absolute right-2 p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RobotChat;
