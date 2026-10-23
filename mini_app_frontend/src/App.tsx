import { useEffect, useState } from 'react';
import { getTelegramUser, initTelegram } from './lib/telegram';
import { memberApi } from './lib/api';
import { Member } from './types';
import OnboardingScreen from './pages/OnboardingScreen';
import HomeScreen from './pages/HomeScreen';
import GuideScreen from './pages/GuideScreen';
import LoadingScreen from './components/LoadingScreen';

type Screen = 'home' | 'guide';

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [member, setMember] = useState<Member | null>(null);
    const [currentScreen, setCurrentScreen] = useState<Screen>('home');
    const [needsOnboarding, setNeedsOnboarding] = useState(false);

    useEffect(() => {
        initTelegram();
        checkMembership();
    }, []);

    const checkMembership = async () => {
        try {
            const telegramUser = getTelegramUser();

            if (!telegramUser) {
                console.warn('Running outside Telegram');
                setIsLoading(false);
                setNeedsOnboarding(true); // Show onboarding if not in Telegram
                return;
            }

            // Try to find member by Telegram ID
            const existingMember = await memberApi.searchMember(
                undefined,
                telegramUser.id.toString()
            );

            if (existingMember) {
                setMember(existingMember);
                setNeedsOnboarding(false);
            } else {
                setNeedsOnboarding(true);
            }
        } catch (error: any) {
            console.error('Error checking membership:', error);

            // If it's a 404 (member not found), show onboarding
            if (error?.response?.status === 404) {
                setNeedsOnboarding(true);
            } else {
                // For other errors, show onboarding anyway (they can try to register)
                setNeedsOnboarding(true);
                console.warn('API error, showing onboarding screen');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleOnboardingComplete = (newMember: Member) => {
        setMember(newMember);
        setNeedsOnboarding(false);
    };

    const handleMemberUpdate = (updatedMember: Member) => {
        setMember(updatedMember);
    };

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (needsOnboarding) {
        return <OnboardingScreen onComplete={handleOnboardingComplete} />;
    }

    if (!member) {
        return (
            <div className="flex items-center justify-center min-h-screen p-6 bg-slate-900">
                <div className="text-center">
                    <p className="text-slate-300 mb-4">Unable to load membership data</p>
                    <button
                        onClick={checkMembership}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900">
            {currentScreen === 'home' && (
                <HomeScreen member={member} onMemberUpdate={handleMemberUpdate} />
            )}
            {currentScreen === 'guide' && <GuideScreen />}

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 safe-area-bottom">
                <div className="flex items-center justify-around h-16">
                    <button
                        onClick={() => setCurrentScreen('home')}
                        className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${currentScreen === 'home' ? 'text-blue-500' : 'text-slate-400'
                            }`}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span className="text-xs mt-1">Home</span>
                    </button>
                    <button
                        onClick={() => setCurrentScreen('guide')}
                        className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${currentScreen === 'guide' ? 'text-blue-500' : 'text-slate-400'
                            }`}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <span className="text-xs mt-1">Guide</span>
                    </button>
                </div>
            </nav>
        </div>
    );
}

export default App;
