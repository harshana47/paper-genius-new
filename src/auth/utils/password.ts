const hashString = (value: string) => {
    let hash = 0;
    for (let index = 0; index < value.length; index += 1) {
        hash = (hash * 31 + value.charCodeAt(index)) % 1000000007;
    }
    return hash;
};

export const generatePasswordForUser = (username: string) => {
    const normalizedUsername = username.trim().toLowerCase();
    const hashedValue = hashString(normalizedUsername);
    return `PG#${hashedValue}X9!`;
};
