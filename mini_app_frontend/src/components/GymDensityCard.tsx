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

    const getStatusLabel = () => {
        switch (density.status) {
            case 'quiet':    return 'Quiet — great time to train';
            case 'moderate': return 'Moderate activity';
            case 'busy':     return 'Getting busy';
            case 'crowded':  return 'Peak hours — expect queues';
        }
    };

    // Greyscale fill: quiet=light, crowded=dark
    const getFillClass = () => {
        switch (density.status) {
            case 'quiet':    return 'bg-gray-300';
            case 'moderate': return 'bg-gray-500';
            case 'busy':     return 'bg-gray-700';
            case 'crowded':  return 'bg-black';
        }
    };

    return (
        <div className="bg-white border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-black" />
                    <h3 className="text-sm font-semibold text-black">Gym Density</h3>
                </div>
                <span className="text-sm font-semibold text-black">{density.percentage}%</span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-100 h-1.5 mb-3 overflow-hidden">
                <div
                    className={`h-full transition-all duration-500 ${getFillClass()}`}
                    style={{ width: `${density.percentage}%` }}
                />
            </div>

            <p className="text-xs text-gray-500">{getStatusLabel()}</p>
        </div>
    );
};

export default GymDensityCard;

