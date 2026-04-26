import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-100 dark:from-gray-950 dark:via-slate-900 dark:to-indigo-950 px-4 relative overflow-hidden">
            {/* Background orbs */}
            <div className="absolute top-20 -left-32 w-96 h-96 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 -right-32 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

            <div className="text-center relative z-10 max-w-lg">
                {/* 404 number with gradient */}
                <h1 className="text-[8rem] sm:text-[10rem] font-black leading-none bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent select-none">
                    404
                </h1>

                {/* Message */}
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-2 mb-3">
                    Page Not Found
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm sm:text-base">
                    Oops! The page you're looking for doesn't exist or has been moved.
                </p>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                        to="/"
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                        ← Back to Home
                    </Link>
                    <Link
                        to="/sheets"
                        className="px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105 transition-all duration-300"
                    >
                        Browse Sheets
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
