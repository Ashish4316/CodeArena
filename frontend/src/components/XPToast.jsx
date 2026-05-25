import React, { useEffect, useState } from "react";

const XPToast = () => {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        const handleXP = (e) => {
            const { xp, levelUp, newLevel, badges } = e.detail;
            const id = Date.now();

            const newToasts = [];

            if (xp > 0) {
                newToasts.push({
                    id: id,
                    type: "xp",
                    message: `+${xp} XP`,
                    icon: "⚡"
                });
            }

            if (levelUp) {
                setTimeout(() => {
                    setToasts(prev => [...prev, {
                        id: id + 1,
                        type: "level",
                        message: `Level Up! Level ${newLevel}`,
                        icon: "🎉"
                    }]);
                }, 500);
            }

            if (badges && badges.length > 0) {
                badges.forEach((badge, idx) => {
                    setTimeout(() => {
                        setToasts(prev => [...prev, {
                            id: id + 2 + idx,
                            type: "badge",
                            message: `Badge: ${badge.title}`,
                            icon: badge.icon
                        }]);
                    }, 1000 + (idx * 500));
                });
            }

            setToasts(prev => [...prev, ...newToasts]);
        };

        window.addEventListener("xpGained", handleXP);
        return () => window.removeEventListener("xpGained", handleXP);
    }, []);

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
            {toasts.map(toast => (
                <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
            ))}
        </div>
    );
};

const ToastItem = ({ toast, onRemove }) => {
    useEffect(() => {
        const timer = setTimeout(onRemove, 3500);
        return () => clearTimeout(timer);
    }, [onRemove]);

    const getColors = () => {
        switch (toast.type) {
            case "level": return "bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-yellow-300";
            case "badge": return "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-300";
            default: return "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-blue-500 shadow-xl";
        }
    };

    return (
        <div className={`
            pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border animate-enter
            ${getColors()}
        `}>
            <span className="text-2xl">{toast.icon}</span>
            <span className="font-bold text-sm tracking-tight">{toast.message}</span>
        </div>
    );
};

export default XPToast;
