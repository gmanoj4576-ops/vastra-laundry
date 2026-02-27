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
        { title: 'Silk Care', text: 'Always dry clean or hand wash in cold water with mild detergent. Avoid twisting or wringing.' },
        { title: 'Denim Life', text: 'Wash inside out to preserve color and avoid frequent washing to maintain shape.' },
        { title: 'Woolen Warmth', text: 'Use specific wool detergent. Dry flat on a towel to prevent stretching.' },
        { title: 'Linen Love', text: 'Linen gets softer with each wash. Iron while slightly damp for best results.' },
        { title: 'Stain Emergency', text: 'Blot, don\'t rub! Use cold water for biological stains like blood.' }
    ],
    proPackages: [
        { id: 'monthly', name: 'Monthly Pro', price: 349, duration: '1 Month', features: ['Free Delivery < 10km', 'Priority Support', '10% Extra Vastra Coins'] },
        { id: 'quarterly', name: 'Quarterly Pro', price: 899, duration: '3 Months', features: ['Free Delivery < 10km', 'Priority Support', '15% Extra Vastra Coins', '1 Free Express Wash'] },
        { id: 'annual', name: 'Annual Pro', price: 2999, duration: '1 Year', features: ['Free Delivery < 10km', 'Priority Support', '25% Extra Vastra Coins', '4 Free Express Washes'] }
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

    // Ensure keys exist without overwriting 0 values
    if (!data) {
        data = { ...MOCK_DATA.userExtensions };
        localStorage.setItem(key, JSON.stringify(data));
    } else {
        // Ensure all required fields exist
        let changed = false;
        if (data.walletBalance === undefined) { data.walletBalance = 150.00; changed = true; }
        if (data.vastraCoins === undefined) { data.vastraCoins = 240; changed = true; }
        if (!data.savedAddresses) { data.savedAddresses = []; changed = true; }
        if (!data.notifications) { data.notifications = []; changed = true; }
        if (changed) localStorage.setItem(key, JSON.stringify(data));
    }
    return JSON.parse(localStorage.getItem(key));
}

export function getUserData(email) {
    return JSON.parse(localStorage.getItem(`vastra_ext_${email}`)) || MOCK_DATA.userExtensions;
}

export function updateUserData(email, data) {
    localStorage.setItem(`vastra_ext_${email}`, JSON.stringify(data));
}
