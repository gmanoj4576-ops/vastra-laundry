import './style.css'
import { renderSignIn } from './src/auth/signin.js'
import { renderSignUp } from './src/auth/signup.js'
import { renderHeader } from './src/components/header.js'
import { renderHome } from './src/home/home.js'
import { renderServiceDetail } from './src/services/service-detail.js'
import { renderCart } from './src/cart/cart.js'
import { renderCheckout, renderSuccess, setupCheckoutEvents } from './src/order/checkout.js'
import { renderTracking } from './src/order/tracking.js'
import { renderProfile } from './src/profile/profile.js'
import { renderAdminPanel } from './src/dashboards/admin-panel.js'
import { api } from './src/api.js'

import { initializeUserData, updateUserData } from './src/data/mock-data.js'

const app = {
    state: {
        user: null,
        cart: [],
        view: 'home',
        activeService: null,
        orders: JSON.parse(localStorage.getItem('vastra_orders')) || []
    },

    async init() {
        this.state.user = JSON.parse(localStorage.getItem('vastra_user'));

        if (this.state.user) {
            initializeUserData(this.state.user);
            document.body.classList.add('customer-theme');

            // Fetch Real Orders
            try {
                if (this.state.user.role === 'admin') {
                    this.state.orders = await api.getAllOrders();
                } else {
                    // Use mobile or email
                    const identifier = this.state.user.mobile || this.state.user.email;
                    this.state.orders = await api.getUserOrders(identifier);
                }
            } catch (err) {
                console.error('Failed to fetch orders:', err);
                // Fallback to local if offline? Or just empty.
            }
        }
        this.render();
    },

    render() {
        const container = document.getElementById('app');

        if (!this.state.user) {
            this.showAuth('signin');
            return;
        }

        // Role-based main shell
        container.innerHTML = renderAdminPanel(this.state.user, this.state.orders);
        if (this.state.user.role === 'admin') {
            container.innerHTML = renderAdminPanel(this.state.user, this.state.orders);
        } else {
            container.innerHTML = `
        ${renderHeader(this.state.user, (view) => this.navigateTo(view), this.state.cart.length)}
        <div id="main-content">
          ${this.renderActiveView()}
        </div>
      `;
        }

        this.attachEvents();
    },

    renderActiveView() {
        switch (this.state.view) {
            case 'home':
                return renderHome(this.state.user);
            case 'services':
                return renderServiceDetail(this.state.activeService, this.state.cart);
            case 'cart':
                return renderCart(this.state.cart);
            case 'checkout':
                const total = this.state.cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
                return renderCheckout(this.state.cart, total);
            case 'success':
                return renderSuccess();
            case 'track':
                const latestOrder = this.state.orders[this.state.orders.length - 1];
                return latestOrder ? renderTracking(latestOrder) : `<div class="page-content"><h2>No active orders</h2><button id="track-home-btn" class="auth-btn">Go Home</button></div>`;
            case 'profile':
                return renderProfile(this.state.user, this.state.orders, () => this.logout());
            default:
                return `<h2>Coming Soon</h2>`;
        }
    },

    showAuth(type) {
        if (type === 'signin') {
            renderSignIn(() => this.showAuth('signup'));
        } else {
            renderSignUp(() => this.showAuth('signin'));
        }
    },

    navigateTo(view, data = null) {
        this.state.view = view;
        if (view === 'services') this.state.activeService = data;
        this.render();
    },

    addToCart(itemName, price, quantity) {
        if (quantity <= 0) return;
        const existing = this.state.cart.find(i => i.itemName === itemName && i.serviceName === this.state.activeService);
        if (existing) {
            existing.quantity += quantity;
        } else {
            this.state.cart.push({
                itemName,
                price,
                quantity,
                serviceName: this.state.activeService
            });
        }
        this.navigateTo('home');
    },

    attachEvents() {
        // Menu Toggle
        const menuBtn = document.getElementById('menu-btn');
        if (menuBtn) {
            menuBtn.onclick = () => {
                const sidebar = document.getElementById('side-menu');
                const overlay = document.getElementById('menu-overlay');
                if (sidebar) {
                    sidebar.classList.add('open');
                    overlay.classList.add('open');
                }
            };
        }

        const closeMenuBtn = document.getElementById('close-menu-btn');
        const menuOverlay = document.getElementById('menu-overlay');
        const closeMenu = () => {
            const sidebar = document.getElementById('side-menu');
            const overlay = document.getElementById('menu-overlay');
            if (sidebar) {
                sidebar.classList.remove('open');
                overlay.classList.remove('open');
            }
        };

        if (closeMenuBtn) closeMenuBtn.onclick = closeMenu;
        if (menuOverlay) menuOverlay.onclick = closeMenu;

        document.querySelectorAll('.menu-link').forEach(link => {
            link.onclick = (e) => {
                e.preventDefault();
                closeMenu();
                this.navigateTo(link.dataset.view);
            }
        });

        // Header events
        const profileBtn = document.getElementById('profile-btn');
        if (profileBtn) profileBtn.onclick = () => this.navigateTo('profile');

        const cartBtn = document.getElementById('cart-btn');
        if (cartBtn) cartBtn.onclick = () => this.navigateTo('cart');

        const logo = document.getElementById('logo');
        if (logo) logo.onclick = () => this.navigateTo('home');

        // Notification Toggle
        const notifBtn = document.getElementById('notif-btn');
        const notifDropdown = document.getElementById('notif-dropdown');
        if (notifBtn && notifDropdown) {
            notifBtn.onclick = (e) => {
                e.stopPropagation();
                notifDropdown.classList.toggle('active');
            };

            // Close on click outside
            document.addEventListener('click', (e) => {
                if (!notifBtn.contains(e.target) && !notifDropdown.contains(e.target)) {
                    notifDropdown.classList.remove('active');
                }
            });
        }

        // Home events
        const homeCards = document.querySelectorAll('.service-card');
        homeCards.forEach(card => {
            card.onclick = () => this.navigateTo('services', card.dataset.id);
        });

        // Service Detail events
        const backBtn = document.getElementById('back-to-home');
        if (backBtn) backBtn.onclick = () => this.navigateTo('home');

        // Custom Request Submit
        const submitCustom = document.getElementById('submit-custom-req');
        if (submitCustom) {
            submitCustom.onclick = () => {
                const text = document.getElementById('custom-request-text').value;
                const budget = document.getElementById('custom-budget').value;
                if (!text) { alert('Please describe your request'); return; }

                const existing = this.state.cart.find(i => i.isCustom && i.serviceName === this.state.activeService);
                if (existing) {
                    existing.details = text;
                    existing.budget = budget;
                } else {
                    this.state.cart.push({
                        itemName: 'Custom Request',
                        price: 0,
                        quantity: 1,
                        serviceName: this.state.activeService,
                        isCustom: true,
                        details: text,
                        budget: budget,
                        displayPrice: 'Quote Pending'
                    });
                }
                alert('Request added to cart! We will providing a quote shortly.');
                this.navigateTo('home');
            };
        }

        const qtys = {};
        document.querySelectorAll('.qty-btn').forEach(btn => {
            btn.onclick = () => {
                const item = btn.dataset.item;
                const display = document.getElementById(`qty-${item.replace(/\W/g, '-')}`);
                let val = parseInt(display.innerText);
                if (btn.classList.contains('plus')) val++;
                else if (val > 0) val--;
                display.innerText = val;
                qtys[item] = val;
            };
        });

        const addMulti = document.getElementById('add-to-cart-multi');
        if (addMulti) {
            addMulti.onclick = () => {
                // Determine which pricing list to use based on active service
                const serviceItems = {
                    'washing': { 'Shirt': 2, 'Trousers': 2.5, 'T-Shirt': 1.5, 'Shorts': 1.5, 'Towel': 1 },
                    'ironing': { 'Shirt': 1.5, 'Trousers': 2, 'Saree': 3, 'Suit': 4, 'Bedsheet': 2 },
                    'dryclean': { 'Suit (2pc)': 6, 'Saree (Heavy)': 8, 'Lehenga': 12, 'Blazer': 5, 'Jacket': 6 },
                    'women': { 'Saree (Silk)': 6, 'Kurta Set': 4, 'Dupatta': 2, 'Gown': 8, 'Blouse': 3 },
                    'kids': { 'Frock': 2, 'School Uniform': 3, 'Small Shirt': 1, 'Shorts': 1, 'Jumpsuit': 2.5 },
                    'premium': { 'Luxury Shirt': 5, 'Designer Saree': 15, 'Tuxedo': 12, 'Leather Jacket': 10 }
                };

                const itemPricing = serviceItems[this.state.activeService] || {};

                Object.entries(qtys).forEach(([item, qty]) => {
                    if (qty > 0) this.addToCart(item, itemPricing[item], qty);
                });
            };
        }

        // Cart events
        const backCart = document.getElementById('back-home-cart');
        if (backCart) backCart.onclick = () => this.navigateTo('home');

        const startShop = document.getElementById('cart-start-shopping');
        if (startShop) startShop.onclick = () => this.navigateTo('home');

        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.onclick = () => {
                this.state.cart.splice(btn.dataset.index, 1);
                this.render();
            };
        });

        // Promo Code Logic
        const applyPromoBtn = document.getElementById('apply-promo-btn');
        if (applyPromoBtn) {
            applyPromoBtn.onclick = () => {
                const code = document.getElementById('promo-input').value.toUpperCase();
                const msg = document.getElementById('promo-message');
                const discountRow = document.getElementById('discount-row');
                const discountDisplay = document.getElementById('discount-display');
                const totalDisplay = document.getElementById('total-display');
                const subtotal = this.state.cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

                if (code === 'WELCOME50') {
                    const discount = subtotal * 0.5;
                    discountRow.style.display = 'flex';
                    discountDisplay.innerText = `-$${discount.toFixed(2)}`;
                    totalDisplay.innerText = `$${(subtotal - discount + 2).toFixed(2)}`;
                    msg.innerText = 'Success! 50% discount applied.';
                    msg.style.color = '#16a34a';
                    msg.style.display = 'block';
                } else {
                    msg.innerText = 'Invalid Promo Code';
                    msg.style.color = '#ef4444';
                    msg.style.display = 'block';
                    discountRow.style.display = 'none';
                    totalDisplay.innerText = `$${(subtotal + 2).toFixed(2)}`;
                }
            };
        }

        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) checkoutBtn.onclick = () => this.navigateTo('checkout');

        // Checkout events
        const locateBtn = document.getElementById('locate-me-btn');
        if (locateBtn) {
            locateBtn.onclick = () => {
                const status = document.getElementById('location-status');
                status.style.display = 'block';
                if (!navigator.geolocation) {
                    status.innerText = 'Geolocation not supported';
                    return;
                }
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        document.getElementById('address').value = `Vastra Area (${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)})`;
                        status.innerText = 'Location detected!';
                        status.style.color = '#10b981';
                    },
                    () => {
                        status.innerText = 'Unable to fetch location.';
                        status.style.color = '#ef4444';
                    }
                );
            };
        }

        const confirmOrderBtn = document.getElementById('confirm-order-btn');
        if (confirmOrderBtn) {
            confirmOrderBtn.onclick = () => {
                const order = {
                    id: 'ORD-' + Math.floor(Math.random() * 10000),
                    items: [...this.state.cart],
                    date: new Date().toLocaleDateString(),
                    status: 'Order Received'
                };
                this.state.orders.push(order);
                this.saveOrders();
                this.state.cart = [];
                this.navigateTo('success');
            };
        }

        const trackBtn = document.getElementById('track-order-btn');
        if (trackBtn) trackBtn.onclick = () => this.navigateTo('track');

        const backHomeTrack = document.getElementById('back-home-track');
        if (backHomeTrack) backHomeTrack.onclick = () => this.navigateTo('home');

        const trackHomeBtn = document.getElementById('track-home-btn');
        if (trackHomeBtn) trackHomeBtn.onclick = () => this.navigateTo('home');

        // Dashboard events
        document.querySelectorAll('.status-update-btn').forEach(btn => {
            btn.onclick = () => {
                const order = this.state.orders.find(o => o.id === btn.dataset.id);
                if (order) {
                    order.status = btn.dataset.status;
                    this.saveOrders();
                    this.render();
                }
            };
        });

        const staffLogout = document.getElementById('staff-logout');
        if (staffLogout) staffLogout.onclick = () => this.logout();

        const adminLogout = document.getElementById('admin-logout');
        if (adminLogout) adminLogout.onclick = () => this.logout();

        // Profile events
        const logoutBtnReal = document.getElementById('logout-btn-real');
        if (logoutBtnReal) logoutBtnReal.onclick = () => this.logout();

        document.querySelectorAll('.reorder-btn').forEach(btn => {
            btn.onclick = () => {
                const orderId = btn.dataset.id;
                const pastOrder = this.state.orders.find(o => o.id === orderId);
                if (pastOrder) {
                    this.state.cart = [...pastOrder.items];
                    this.navigateTo('checkout');
                }
            };
        });

        // Add Money
        const addMoneyBtn = document.getElementById('add-money-btn');
        if (addMoneyBtn) {
            addMoneyBtn.onclick = () => {
                const amount = prompt('Enter amount to add:', '50');
                if (amount && !isNaN(amount)) {
                    const ext = initializeUserData(this.state.user);
                    ext.walletBalance += parseFloat(amount);
                    updateUserData(this.state.user.email, ext);
                    this.render();
                    alert(`Successfully added $${amount} to wallet!`);
                }
            };
        }

        // Add Address
        const addAddrBtn = document.getElementById('add-address-btn');
        if (addAddrBtn) {
            addAddrBtn.onclick = () => {
                const type = prompt('Location Type (e.g. Gym, Parents):', 'Gym');
                if (type) {
                    const ext = initializeUserData(this.state.user);
                    ext.savedAddresses.push({
                        id: Date.now(),
                        type: type,
                        text: '123 New Place, Vastra City'
                    });
                    updateUserData(this.state.user.email, ext);
                    this.render();
                }
            };
        }

        // Copy Referral
        const copyRefBtn = document.getElementById('copy-referral-btn');
        if (copyRefBtn) {
            copyRefBtn.onclick = () => {
                const code = 'VASTRA-MAHA-2026';
                navigator.clipboard.writeText(code).then(() => {
                    copyRefBtn.innerText = 'Copied!';
                    setTimeout(() => copyRefBtn.innerText = 'Copy', 2000);
                });
            };
        }

        // Checkout Events
        if (this.state.view === 'checkout') {
            const total = this.state.cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            setupCheckoutEvents(this.state.cart, total, () => {
                this.state.cart = [];
                // Add temp order to local state for immediate feedback if needed, 
                // but re-init will fetch it.
                this.navigateTo('success');
            });
        }

        // Success Events
        if (this.state.view === 'success') {
            setupCheckoutEvents(); // Reuse for back button
        }
    },

    saveOrders() {
        localStorage.setItem('vastra_orders', JSON.stringify(this.state.orders));
    },

    logout() {
        localStorage.removeItem('vastra_user');
        window.location.reload();
    }
}

app.init();
