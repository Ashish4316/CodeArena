import React from "react";

const LoadingSpinner = ({ fullScreen = true }) => {
    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-100 dark:from-gray-950 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center z-50">
                <div className="relative">
                    {/* Animated gradient orbs in background */}
                    <div className="absolute -inset-20 overflow-hidden">
                        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-2xl animate-pulse" />
                        <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }} />
                    </div>

                    {/* Main spinner */}
                    <div className="relative flex flex-col items-center gap-6">
                        {/* Spinning rings */}
                        <div className="relative w-20 h-20">
                            <div className="absolute inset-0 border-4 border-blue-200 dark:border-blue-900/50 rounded-full" />
                            <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin" />
                            <div className="absolute inset-2 border-4 border-transparent border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin-reverse" />

                            {/* Center logo */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-lg animate-pulse">
                                    CA
                                </div>
                            </div>
                        </div>

                        {/* Loading text */}
                        <div className="flex flex-col items-center gap-2">
                            <p className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Loading...
                            </p>
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" />
                                <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                                <div className="w-2 h-2 bg-pink-600 dark:bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            </div>
                        </div>
                    </div>
                </div>

                <style dangerouslySetInnerHTML={{
                    __html: `
          @keyframes spin-reverse {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
          }
          .animate-spin-reverse {
            animation: spin-reverse 1.5s linear infinite;
          }
        `}} />
            </div>
        );
    }

    // Inline spinner for smaller contexts
    return (
        <div className="flex items-center justify-center p-8">
            <div className="relative w-12 h-12">
                <div className="absolute inset-0 border-3 border-blue-200 dark:border-blue-900/50 rounded-full" />
                <div className="absolute inset-0 border-3 border-transparent border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin" />
            </div>
        </div>
    );
};

export default LoadingSpinner;
