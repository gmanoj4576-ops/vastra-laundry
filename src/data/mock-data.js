export const MOCK_DATA = {
    userExtensions: {
        walletBalance: 150.00,
        vastraCoins: 240,
        savedAddresses: [
            { id: 1, type: 'Home', text: '123 Cotton Lane, Fabric City' },
            { id: 2, type: 'Work', text: '456 Silk Road, Textile Tech Park' }
        ],
        notifications: [
            { id: 1, text: 'Order #ORD-123 is now Washing.', time: '2 mins ago', read: false },
            { id: 2, text: 'You earned 50 Vastra Coins!', time: '1 hour ago', read: false },
            { id: 3, text: 'Welcome to Vastra Gold!', time: '1 day ago', read: true }
        ],
        subscription: null // 'Pro' or null
    },
    fabricCareTips: [
        { title: 'Silk Care', text: 'Always dry clean or hand wash in cold water.' },
        { title: 'Denim Life', text: 'Wash inside out to preserve color.' },
        { title: 'Woolen Warmth', text: 'Dry flat to prevent stretching.' }
    ],
    promoCodes: {
        'WELCOME50': 0.50, // 50% off
        'FREESHIP': 5.00   // Flat discount
    }
};

export function initializeUserData(user) {
    const key = `vastra_ext_${user.email}`;
    let data;
    try {
        data = JSON.parse(localStorage.getItem(key));
    } catch (e) {
        data = null;
    }

    // Deep merge or reset if missing keys (simple reset for now to ensure stability)
    if (!data || !data.walletBalance || !data.vastraCoins) {
        localStorage.setItem(key, JSON.stringify(MOCK_DATA.userExtensions));
    }
    return JSON.parse(localStorage.getItem(key));
}

export function getUserData(email) {
    return JSON.parse(localStorage.getItem(`vastra_ext_${email}`)) || MOCK_DATA.userExtensions;
}

export function updateUserData(email, data) {
    localStorage.setItem(`vastra_ext_${email}`, JSON.stringify(data));
}
