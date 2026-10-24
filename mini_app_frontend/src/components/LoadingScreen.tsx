const LoadingScreen = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="text-center">
                <div className="inline-block w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-sm text-gray-500 font-medium">Loading your membership...</p>
            </div>
        </div>
    );
};

export default LoadingScreen;
