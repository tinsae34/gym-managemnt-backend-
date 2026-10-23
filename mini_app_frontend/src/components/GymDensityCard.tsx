import { Users } from 'lucide-react';
import { useEffect, useState } from 'react';

const GymDensityCard = () => {
    const [density, setDensity] = useState<{
        percentage: number;
        status: 'quiet' | 'moderate' | 'busy' | 'crowded';
    }>({
        percentage: 35,
        status: 'quiet',
    });

    useEffect(() => {
        // Simulate real-time density (in production, fetch from API)
        const interval = setInterval(() => {
            const randomPercentage = Math.floor(Math.random() * 100);
            let status: 'quiet' | 'moderate' | 'busy' | 'crowded' = 'quiet';

            if (randomPercentage > 80) status = 'crowded';
            else if (randomPercentage > 60) status = 'busy';
            else if (randomPercentage > 35) status = 'moderate';

            setDensity({ percentage: randomPercentage, status });
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const getStatusColor = () => {
        switch (density.status) {
            case 'quiet':
                return 'text-green-400';
            case 'moderate':
                return 'text-yellow-400';
            case 'busy':
                return 'text-orange-400';
            case 'crowded':
                return 'text-red-400';
        }
    };

    const getStatusText = () => {
        switch (density.status) {
            case 'quiet':
                return 'Quiet Time 🎯';
            case 'moderate':
                return 'Moderate Activity';
            case 'busy':
                return 'Getting Busy';
            case 'crowded':
                return 'Peak Hours 🔥';
        }
    };

    return (
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    <h3 className="font-semibold text-slate-200">Gym Density</h3>
                </div>
                <span className={`text-sm font-medium ${getStatusColor()}`}>
                    {density.percentage}%
                </span>
            </div>

            <div className="w-full bg-slate-700 rounded-full h-2 mb-3 overflow-hidden">
                <div
                    className={`h-full transition-all duration-500 ${density.status === 'quiet' ? 'bg-green-500' :
                        density.status === 'moderate' ? 'bg-yellow-500' :
                            density.status === 'busy' ? 'bg-orange-500' :
                                'bg-red-500'
                        }`}
                    style={{ width: `${density.percentage}%` }}
                />
            </div>

            <p className={`text-sm font-medium ${getStatusColor()}`}>
                {getStatusText()}
            </p>
        </div>
    );
};

export default GymDensityCard;
