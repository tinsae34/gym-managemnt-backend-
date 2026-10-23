const LoadingScreen = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900">
            <div className="text-center">
                <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-slate-300">Loading your membership...</p>
            </div>
        </div>
    );
};

export default LoadingScreen;
