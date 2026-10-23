import { useState } from 'react';
import { Member, PlanOption } from '../types';
import { hapticFeedback, showAlert, showConfirm } from '../lib/telegram';
import { paymentApi, memberApi } from '../lib/api';
import { X, CreditCard, Check } from 'lucide-react';

interface RenewalModalProps {
    member: Member;
    onClose: () => void;
    onSuccess: (updatedMember: Member) => void;
}

const PLANS: PlanOption[] = [
    { id: '1month', name: '1 Month', duration: 30, price: 1500 },
    { id: '3months', name: '3 Months', duration: 90, price: 4000, discount: 11 },
    { id: '6months', name: '6 Months', duration: 180, price: 7500, discount: 17 },
];

const RenewalModal = ({ member, onClose, onSuccess }: RenewalModalProps) => {
    const [selectedPlan, setSelectedPlan] = useState<PlanOption>(PLANS[0]);
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePlanSelect = (plan: PlanOption) => {
        hapticFeedback.selection();
        setSelectedPlan(plan);
    };

    const handlePayment = async () => {
        hapticFeedback.medium();
        setIsProcessing(true);

        try {
            // Generate transaction reference
            const transactionRef = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

            // In production, redirect to Chapa/Telebirr payment gateway
            showConfirm(
                `Redirect to payment gateway to pay ${selectedPlan.price} ETB?`,
                async (confirmed) => {
                    if (confirmed) {
                        // Simulate payment - in production, wait for webhook callback
                        await new Promise(resolve => setTimeout(resolve, 2000));

                        // Process payment and extend membership
                        await paymentApi.createPayment({
                            memberId: member.id,
                            amount: selectedPlan.price,
                            paymentMethod: 'DIGITAL',
                            transactionRef,
                        });

                        // Fetch updated member data
                        const updatedMember = await memberApi.getMember(member.id);

                        hapticFeedback.success();
                        showAlert('Payment successful! Your membership has been renewed.', () => {
                            onSuccess(updatedMember);
                            onClose();
                        });
                    } else {
                        setIsProcessing(false);
                    }
                }
            );
        } catch (error: any) {
            hapticFeedback.error();
            const errorMessage = error.response?.data?.message || 'Payment failed. Please try again.';
            showAlert(errorMessage);
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end">
            <div className="bg-slate-900 rounded-t-3xl w-full max-h-[85vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-slate-900 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Renew Membership</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-slate-400" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Plans */}
                    <div className="space-y-3">
                        {PLANS.map((plan) => (
                            <button
                                key={plan.id}
                                onClick={() => handlePlanSelect(plan)}
                                className={`w-full p-4 rounded-xl border-2 transition-all ${selectedPlan.id === plan.id
                                    ? 'border-blue-500 bg-blue-500/10'
                                    : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="text-left">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-white">{plan.name}</h3>
                                            {plan.discount && (
                                                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                                                    Save {plan.discount}%
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-400 mt-1">{plan.duration} days access</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-white">{plan.price} ETB</p>
                                            <p className="text-xs text-slate-400">
                                                {Math.round(plan.price / plan.duration)} ETB/day
                                            </p>
                                        </div>
                                        {selectedPlan.id === plan.id && (
                                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Payment Summary */}
                    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                        <h3 className="font-semibold text-slate-200 mb-3">Payment Summary</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Plan</span>
                                <span className="text-slate-200">{selectedPlan.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Duration</span>
                                <span className="text-slate-200">{selectedPlan.duration} days</span>
                            </div>
                            {selectedPlan.discount && (
                                <div className="flex justify-between text-green-400">
                                    <span>Discount</span>
                                    <span>-{selectedPlan.discount}%</span>
                                </div>
                            )}
                            <div className="pt-2 mt-2 border-t border-slate-700 flex justify-between font-semibold">
                                <span className="text-slate-200">Total</span>
                                <span className="text-white text-lg">{selectedPlan.price} ETB</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Button */}
                    <button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                        {isProcessing ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Processing...
                            </>
                        ) : (
                            <>
                                <CreditCard className="w-5 h-5" />
                                Pay {selectedPlan.price} ETB
                            </>
                        )}
                    </button>

                    <p className="text-xs text-slate-500 text-center">
                        Secure payment powered by Chapa • Your membership will be extended immediately after payment
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RenewalModal;
