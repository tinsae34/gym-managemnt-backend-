import { useState } from 'react';
import { getTelegramUser, hapticFeedback, showAlert } from '../lib/telegram';
import { memberApi } from '../lib/api';
import { Member } from '../types';
import { UserPlus } from 'lucide-react';

interface OnboardingScreenProps {
    onComplete: (member: Member) => void;
}

const OnboardingScreen = ({ onComplete }: OnboardingScreenProps) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const telegramUser = getTelegramUser();

    const handleRegister = async () => {
        setErrorMessage('');

        if (!phoneNumber.trim()) {
            hapticFeedback.error();
            setErrorMessage('Please enter your phone number');
            return;
        }

        if (!telegramUser) {
            hapticFeedback.error();
            setErrorMessage('Telegram user data not available');
            return;
        }

        setIsLoading(true);
        hapticFeedback.medium();

        try {
            const fullName = `${telegramUser.first_name} ${telegramUser.last_name || ''}`.trim();

            console.log('Registering member:', {
                fullName,
                phoneNumber: phoneNumber.trim(),
                telegramId: telegramUser.id.toString(),
            });

            const newMember = await memberApi.registerMember({
                fullName,
                phoneNumber: phoneNumber.trim(),
                telegramId: telegramUser.id.toString(),
            });

            console.log('Registration successful:', newMember);
            hapticFeedback.success();
            onComplete(newMember);
        } catch (error: any) {
            console.error('Registration error:', error);
            console.error('Error response:', error.response?.data);
            hapticFeedback.error();
            const errorMsg = error.response?.data?.message || error.message || 'Registration failed. Please try again.';
            setErrorMessage(errorMsg);
            showAlert(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-black rounded-full mb-4">
                        <UserPlus className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-black mb-2">Welcome to the Gym!</h1>
                    <p className="text-gray-600">
                        Hi {telegramUser?.first_name}! Let's set up your membership
                    </p>
                </div>

                <div className="bg-white rounded-2xl p-6 border-2 border-black">
                    {errorMessage && (
                        <div className="mb-4 p-3 bg-white border-2 border-black rounded-lg">
                            <p className="text-black text-sm">{errorMessage}</p>
                        </div>
                    )}

                    <div className="mb-6">
                        <label htmlFor="phone" className="block text-sm font-medium text-black mb-2">
                            Phone Number
                        </label>
                        <input
                            id="phone"
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="+251912345678"
                            className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-black"
                            disabled={isLoading}
                        />
                        <p className="mt-2 text-xs text-gray-500">
                            Enter the phone number you registered with
                        </p>
                    </div>

                    <button
                        onClick={handleRegister}
                        disabled={isLoading}
                        className="w-full py-3 bg-black hover:bg-gray-900 disabled:bg-gray-300 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Registering...
                            </>
                        ) : (
                            'Complete Registration'
                        )}
                    </button>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">
                        By continuing, you agree to our terms of service
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OnboardingScreen;
