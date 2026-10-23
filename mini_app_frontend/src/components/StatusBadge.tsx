interface StatusBadgeProps {
    status: 'ACTIVE' | 'EXPIRED' | 'FROZEN';
    daysRemaining?: number;
}

const StatusBadge = ({ status, daysRemaining }: StatusBadgeProps) => {
    const getStatusStyles = () => {
        switch (status) {
            case 'ACTIVE':
                return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'EXPIRED':
                return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'FROZEN':
                return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            default:
                return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
        }
    };

    return (
        <div className={`inline-flex items-center px-3 py-1.5 rounded-full border ${getStatusStyles()}`}>
            <span className="w-2 h-2 rounded-full bg-current mr-2 animate-pulse"></span>
            <span className="text-sm font-medium">
                {status}
                {status === 'ACTIVE' && daysRemaining !== undefined && ` • ${daysRemaining}d`}
            </span>
        </div>
    );
};

export default StatusBadge;
