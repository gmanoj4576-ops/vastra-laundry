// Always use the live Vercel URL for API calls so local testing works without a local backend.
// Use local backend if running on localhost, otherwise use production URL
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
    async assignOrder(orderId, partnerId) {
        const res = await fetch(`${API_URL}/orders/${orderId}/assign`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ partnerId })
        });
        if (!res.ok) throw new Error('Failed to assign order');
        return res.json();
    },

    async bulkAssignOrders(orderIds, partnerId) {
        const res = await fetch(`${API_URL}/orders/bulk/assign`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderIds, partnerId })
        });
        if (!res.ok) throw new Error('Failed to assign orders in bulk');
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

    async updateLocation(orderId, lat, lng) {
        const res = await fetch(`${API_URL}/orders/${orderId}/location`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lat, lng })
        });
        if (!res.ok) throw new Error('Failed to update location');
        return res.json();
    },

    async getPartnerOrders(agentId) {
        const res = await fetch(`${API_URL}/orders/logistics/${agentId}`);
        if (!res.ok) throw new Error('Failed to fetch logistics orders');
        return res.json();
    },

    async getAllPartners() {
        const res = await fetch(`${API_URL}/auth/logistics`);
        if (!res.ok) throw new Error('Failed to fetch fleet agents');
        return res.json();
    },

    async getAllUsers() {
        const res = await fetch(`${API_URL}/auth/users`);
        if (!res.ok) throw new Error('Failed to fetch users');
        return res.json();
    },

    async getOrderByTrackingId(trackingId) {
        const res = await fetch(`${API_URL}/orders/tracking/${trackingId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Tracking ID not found');
        return data;
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
    },

    // God Mode Admin Routes
    async adminRegisterUser(userData) {
        const res = await fetch(`${API_URL}/admin/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },

    async adminUpdateWallet(userId, walletBalance) {
        const res = await fetch(`${API_URL}/admin/users/${userId}/wallet`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ walletBalance })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },

    async adminUpdateUser(userId, userData) {
        const res = await fetch(`${API_URL}/admin/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
    },

    async updateProfile(userId, updateData) {
        if (!userId) throw new Error('User ID is required for profile update');
        const res = await fetch(`${API_URL}/auth/profile/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
        });

        const contentType = res.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Update failed');
            return data;
        } else {
            const text = await res.text();
            console.error('Non-JSON response:', text);
            throw new Error('Server returned an invalid response. Please try again later.');
        }
    }
};
