// Always use the live Vercel URL for API calls so local testing works without a local backend.
const API_URL = 'https://vastra-green.vercel.app/api';

export const api = {
    // Auth
    async signup(userData) {
        const res = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Signup failed');
        return data;
    },

    async sendOTP(email) {
        const res = await fetch(`${API_URL}/auth/send-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },

    async verifyOTP(email, otp) {
        const res = await fetch(`${API_URL}/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp })
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
    },

    // Partner/Admin Actions
    async assignOrder(orderId, partnerId, partnerPayout) {
        const res = await fetch(`${API_URL}/orders/${orderId}/assign`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ partnerId, partnerPayout })
        });
        if (!res.ok) throw new Error('Failed to assign order');
        return res.json();
    },

    async updateOrderStatus(orderId, status) {
        const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        if (!res.ok) throw new Error('Failed to update status');
        return res.json();
    },

    async getPartnerOrders(partnerId) {
        const res = await fetch(`${API_URL}/orders/partner/${partnerId}`);
        if (!res.ok) throw new Error('Failed to fetch partner orders');
        return res.json();
    },

    async getAllPartners() {
        const res = await fetch(`${API_URL}/auth/partners`);
        if (!res.ok) throw new Error('Failed to fetch partners');
        return res.json();
    },

    async getAllUsers() {
        const res = await fetch(`${API_URL}/auth/users`);
        if (!res.ok) throw new Error('Failed to fetch users');
        return res.json();
    },

    async socialLogin(userData) {
        // userData: { name, email, avatar }
        const res = await fetch(`${API_URL}/auth/social-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    }
};
