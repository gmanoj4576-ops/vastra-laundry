// Automatically works for Local (via Vite Proxy) and Vercel (via Rewrites)
const API_URL = '/api';

export const api = {
    // Auth
    async signup(userData) {
        // userData: { name, mobile, password, email? }
        const res = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },

    async signin(credentials) {
        // credentials: { mobile, password }
        const res = await fetch(`${API_URL}/auth/signin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },

    // Orders
    async createOrder(orderData) {
        const res = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },

    async getUserOrders(emailOrMobile) {
        // Updated backend likely needs to support fetching by mobile or email
        // For now assuming the backend route handles the param
        const res = await fetch(`${API_URL}/orders/${emailOrMobile}`);
        if (!res.ok) throw new Error('Failed to fetch orders');
        return res.json();
    },

    async getAllOrders() {
        const res = await fetch(`${API_URL}/orders`);
        if (!res.ok) throw new Error('Failed to fetch orders');
        return res.json();
    }
};
