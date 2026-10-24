export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(date);
};

export const getDaysRemaining = (expiryDate: string): number => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

export const isExpired = (expiryDate: string): boolean => {
    return new Date(expiryDate) < new Date();
};

export const getExpiryStatus = (expiryDate: string): {
    isExpired: boolean;
    daysRemaining: number;
    message: string;
} => {
    const daysRemaining = getDaysRemaining(expiryDate);
    const expired = isExpired(expiryDate);

    let message = '';
    if (expired) {
        message = `Expired ${Math.abs(daysRemaining)} days ago`;
    } else if (daysRemaining === 0) {
        message = 'Expires today';
    } else if (daysRemaining === 1) {
        message = 'Expires tomorrow';
    } else if (daysRemaining <= 3) {
        message = `Expires in ${daysRemaining} days`;
    } else {
        message = `${daysRemaining} days remaining`;
    }

    return {
        isExpired: expired,
        daysRemaining,
        message,
    };
};
