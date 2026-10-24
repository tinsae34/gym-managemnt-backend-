import { Member } from '../types';
import { formatDate, getExpiryStatus } from '../utils/dateUtils';
import { hapticFeedback } from '../lib/telegram';
import QRDisplay from '../components/QRDisplay';
import StatusBadge from '../components/StatusBadge';
import GymDensityCard from '../components/GymDensityCard';
import { Calendar, CreditCard, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import RenewalModal from '../components/RenewalModal';

interface HomeScreenProps {
    member: Member;
    onMemberUpdate: (member: Member) => void;
}

const HomeScreen = ({ member, onMemberUpdate }: HomeScreenProps) => {
    const [showRenewalModal, setShowRenewalModal] = useState(false);
    const expiryStatus = getExpiryStatus(member.expiryDate);

    const handleRenewClick = () => {
        hapticFeedback.medium();
        setShowRenewalModal(true);
    };

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Header */}
            <div className="bg-black px-6 pt-8 pb-6">
                <h1 className="text-2xl font-bold text-white mb-1">My Digital Pass</h1>
                <p className="text-gray-400 text-sm">Welcome back, {member.fullName.split(' ')[0]}!</p>
            </div>

            <div className="px-6 space-y-6">
                {/* Membership Status Card */}
                <div className={`rounded-2xl p-6 border-2 ${expiryStatus.isExpired
                    ? 'bg-white border-black'
                    : 'bg-black border-black'
                    }`}>
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <StatusBadge
                                status={member.status}
                                daysRemaining={expiryStatus.isExpired ? undefined : expiryStatus.daysRemaining}
                            />
                            <p className={`text-2xl font-bold mt-3 ${expiryStatus.isExpired ? 'text-black' : 'text-white'
                                }`}>
                                {expiryStatus.message}
                            </p>
                        </div>
                        <Calendar className={`w-8 h-8 ${expiryStatus.isExpired ? 'text-black' : 'text-white'
                            }`} />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <span className={expiryStatus.isExpired ? 'text-gray-600' : 'text-gray-400'}>Expires on</span>
                        <span className={`font-medium ${expiryStatus.isExpired ? 'text-black' : 'text-white'}`}>{formatDate(member.expiryDate)}</span>
                    </div>

                    {expiryStatus.isExpired && (
                        <button
                            onClick={handleRenewClick}
                            className="w-full mt-4 py-3 bg-black hover:bg-gray-900 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                            <RefreshCw className="w-5 h-5" />
                            Renew Membership Now
                        </button>
                    )}

                    {!expiryStatus.isExpired && expiryStatus.daysRemaining <= 7 && (
                        <button
                            onClick={handleRenewClick}
                            className="w-full mt-4 py-3 bg-white hover:bg-gray-100 text-black font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 border border-white"
                        >
                            <CreditCard className="w-5 h-5" />
                            Renew Early & Save
                        </button>
                    )}
                </div>

                {/* QR Code Display */}
                {!expiryStatus.isExpired && (
                    <div>
                        <h2 className="text-lg font-semibold text-black mb-3">Access QR Code</h2>
                        <QRDisplay token={member.qrCodeToken} memberName={member.fullName} />
                    </div>
                )}

                {/* Gym Density */}
                <div>
                    <h2 className="text-lg font-semibold text-black mb-3">Live Status</h2>
                    <GymDensityCard />
                </div>

                {/* Quick Info */}
                <div className="bg-white rounded-xl p-4 border-2 border-black">
                    <h3 className="font-semibold text-black mb-3">Membership Info</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Member ID</span>
                            <span className="text-black font-mono">{member.id.slice(0, 8)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Phone</span>
                            <span className="text-black">{member.phoneNumber}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Start Date</span>
                            <span className="text-black">{formatDate(member.startDate)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Renewal Modal */}
            {showRenewalModal && (
                <RenewalModal
                    member={member}
                    onClose={() => setShowRenewalModal(false)}
                    onSuccess={onMemberUpdate}
                />
            )}
        </div>
    );
};

export default HomeScreen;
