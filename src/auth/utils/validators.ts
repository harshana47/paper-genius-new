export const isValidEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
};

export const normalizeAuthIdentifier = (value: string) => {
    const normalizedValue = value.trim().replace(/\s+/g, '');
    if (normalizedValue.includes('@')) {
        return normalizedValue.toLowerCase();
    }

    if (normalizedValue.startsWith('+')) {
        return normalizedValue.slice(1);
    }

    return normalizedValue;
};

export const isValidPhoneNumber = (value: string) => {
    return /^[0-9]{10,15}$/.test(value);
};

export const isValidAuthIdentifier = (value: string) => {
    const normalizedValue = normalizeAuthIdentifier(value);

    if (normalizedValue.includes('@')) {
        return isValidEmail(normalizedValue);
    }

    return isValidPhoneNumber(normalizedValue);
};
