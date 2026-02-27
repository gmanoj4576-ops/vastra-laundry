import './style.css'
import { renderSignIn } from './src/auth/signin.js'
import { renderSignUp } from './src/auth/signup.js'
import { renderHeader } from './src/components/header.js'
import { renderBottomNav } from './src/components/bottom-nav.js'
import { renderHome } from './src/home/home.js'
import { renderServiceDetail } from './src/services/service-detail.js'
import { renderCart } from './src/cart/cart.js'
import { renderCheckout, renderSuccess, setupCheckoutEvents } from './src/order/checkout.js'
import { renderTracking } from './src/order/tracking.js'
import { renderProfile } from './src/profile/profile.js'
import { renderAdminPanel } from './src/dashboards/admin-panel.js'
// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('SW Registered'))
            .catch(err => console.log('SW Registration Failed', err));
    });
}

// Android Back Button Handling (Capacitor)
import { App } from '@capacitor/app';
if (window.Capacitor) {
    App.addListener('backButton', () => {
        // App object will handle the pop
        if (app && typeof app.goBack === 'function') {
            app.goBack();
        } else {
            App.exitApp();
        }
    });
}

import { api } from './src/api.js'
import { overrideNativePopups } from './src/components/modals.js'
import { initializeUserData, updateUserData, MOCK_DATA, getUserData } from './src/data/mock-data.js'

overrideNativePopups();

const app = {
    state: {
        user: null,
        cart: [],
        view: 'home',
        history: ['home'], // Initialize history array
        activeService: null,
        orders: JSON.parse(localStorage.getItem('vastra_orders')) || []
    },

    async init() {
        this.state.user = JSON.parse(localStorage.getItem('vastra_user'));

        if (this.state.user) {
            // Synchronize with extension storage (which the header and other components use)
            const ext = initializeUserData(this.state.user);
            this.state.user = { ...this.state.user, ...ext };

            document.body.classList.add('customer-theme');

            // Refresh user data from DB to ensure coins/wallet/addresses are up to date
            try {
                const users = await api.getAllUsers();
                const freshUser = users.find(u => u._id === this.state.user._id || u.mobile === this.state.user.mobile || u.email === this.state.user.email);

                if (freshUser) {
                    // Update state with fresh DB data
                    this.state.user = { ...this.state.user, ...freshUser };

                    // Migration: If DB has 0 but local has balance, update DB once
                    const ext = getUserData(this.state.user.email);
                    if ((freshUser.walletBalance === 0 || freshUser.walletBalance === undefined) && ext.walletBalance > 0) {
                        console.log('Migrating local balance to DB:', ext.walletBalance);
                        const updated = await api.updateProfile(freshUser._id, { walletBalance: ext.walletBalance });
                        this.state.user = { ...this.state.user, ...updated.user };
                    }

                    if ((freshUser.vastraCoins === 0 || freshUser.vastraCoins === undefined) && ext.vastraCoins > 0) {
                        const updated = await api.updateProfile(freshUser._id, { vastraCoins: ext.vastraCoins });
                        this.state.user = { ...this.state.user, ...updated.user };
                    }

                    localStorage.setItem('vastra_user', JSON.stringify(this.state.user));

                    // Sync extensions to match DB
                    updateUserData(this.state.user.email, {
                        ...ext,
                        walletBalance: this.state.user.walletBalance,
                        vastraCoins: this.state.user.vastraCoins,
                        savedAddresses: this.state.user.savedAddresses || ext.savedAddresses,
                        notifications: this.state.user.notifications || ext.notifications
                    });

                    // Fetch Order History from DB
                    try {
                        const dbOrders = await api.getUserOrders(this.state.user.mobile);
                        if (dbOrders && Array.isArray(dbOrders)) {
                            this.state.orders = dbOrders;
                            localStorage.setItem('vastra_orders', JSON.stringify(this.state.orders));
                        }
                    } catch (orderErr) {
                        console.warn('Failed to fetch orders from DB:', orderErr);
                    }
                }
            } catch (err) {
                console.warn('Could not refresh user data from DB:', err);
            }
        }
        this.render();
        // Hide loading overlay after initial render
        const loader = document.getElementById('loading-overlay');
        if (loader) {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => loader.style.display = 'none', 500);
            }, 1000); // Show for at least 1 second for the animation
        }
    },

    render() {
        const container = document.getElementById('app');

        if (!this.state.user) {
            this.showAuth('signin');
            return;
        }

        // Customer main shell
        container.innerHTML = `
        ${renderHeader(this.state.user, (view) => this.navigateTo(view), this.state.cart.length)}
        <div id="main-content" style="padding-bottom: 80px;">
          ${this.renderActiveView()}
        </div>
        ${!['admin', 'checkout'].includes(this.state.view) ? renderBottomNav(this.state.view, this.state.cart.length) : ''}
      `;


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
                const orderToTrack = this.state.activeTrackingOrder || this.state.orders[this.state.orders.length - 1];
                return orderToTrack ? renderTracking(orderToTrack) : `<div class="page-content animate-fade-in" style="text-align:center; padding: 4rem 2rem;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">📦</div>
                    <h2>No Order Selected</h2>
                    <p style="color: #64748b; margin-bottom: 2rem;">Enter a tracking ID on the home screen to see status.</p>
                    <button id="track-home-btn" class="auth-btn">Back to Home</button>
                    </div>`;
            case 'profile':
                return renderProfile(this.state.user, this.state.orders, () => this.logout());
            case 'vastra-pro':
                return this.renderVastraPro();
            default:
                return `<h2>Coming Soon</h2>`;
        }
    },

    renderVastraPro() {
        const packages = MOCK_DATA.proPackages;
        return `
            <div class="page-content fade-in">
                <div class="checkout-header" style="margin-bottom: 2rem;">
                    <button id="back-home-pro" class="icon-btn"><i class="fas fa-arrow-left"></i></button>
                    <h1>Vastra Pro 💎</h1>
                </div>
                
                <div style="text-align: center; margin-bottom: 2.5rem;">
                    <h2 style="font-size: 1.8rem; color: #1e293b; margin-bottom: 0.5rem;">Elevate Your Laundry Experience</h2>
                    <p style="color: #64748b;">Choose a plan that fits your lifestyle.</p>
                </div>

                <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                    ${packages.map(pkg => `
                        <div class="glass-card" style="padding: 2rem; border-radius: 24px; border: 2px solid ${pkg.id === 'monthly' ? '#e2e8f0' : '#4f46e5'}; position: relative; overflow: hidden;">
                            ${pkg.id === 'quarterly' ? '<div style="position: absolute; top: 1rem; right: -2rem; background: #4f46e5; color: white; padding: 0.5rem 3rem; transform: rotate(45deg); font-size: 0.75rem; font-weight: 800;">POPULAR</div>' : ''}
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                                <div>
                                    <h3 style="margin: 0; font-size: 1.4rem;">${pkg.name}</h3>
                                    <p style="margin: 0; color: #64748b; font-size: 0.9rem;">${pkg.duration}</p>
                                </div>
                                <div style="text-align: right;">
                                    <span style="font-size: 1.8rem; font-weight: 800; color: #1e293b;">₹${pkg.price}</span>
                                </div>
                            </div>
                            <ul style="margin: 1.5rem 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 0.75rem;">
                                ${pkg.features.map(f => `<li style="display: flex; align-items: center; gap: 10px; font-size: 0.95rem; color: #475569;"><i class="fas fa-check-circle" style="color: #10b981;"></i> ${f}</li>`).join('')}
                            </ul>
                            <button class="auth-btn buy-pro-btn" data-id="${pkg.id}" data-price="${pkg.price}" style="background: ${pkg.id === 'monthly' ? '#1e293b' : 'linear-gradient(135deg, #4f46e5, #6366f1)'}; color: white; border: none; margin-top: 1rem;">Subscribe Now</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    showAuth(type) {
        if (type === 'signin') {
            renderSignIn(() => this.showAuth('signup'));
        } else {
            renderSignUp(() => this.showAuth('signin'));
        }
    },

    navigateTo(view, data = null, isBack = false) {
        if (!isBack && this.state.view !== view) {
            this.state.history.push(this.state.view);
        }
        this.state.view = view;
        if (view === 'services') this.state.activeService = data;
        this.render();
    },

    goBack() {
        if (this.state.history.length > 0) {
            const previousView = this.state.history.pop();
            this.navigateTo(previousView, null, true);
        } else {
            // If Android, exit. Otherwise, regular back.
            if (window.Capacitor) {
                App.exitApp();
            } else {
                window.history.back();
            }
        }
    },

    addToCart(itemName, price, quantity, skipNavigate = false) {
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
        if (!skipNavigate) {
            this.navigateTo('home');
        } else {
            this.render();
        }
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

        // Coin Modal Toggle
        const coinBtn = document.getElementById('coin-btn');
        if (coinBtn) {
            coinBtn.onclick = () => {
                const modal = document.getElementById('coin-modal');
                const overlay = document.getElementById('coin-modal-overlay');
                if (modal && overlay) {
                    modal.style.opacity = '1';
                    modal.style.pointerEvents = 'all';
                    modal.style.transform = 'translate(-50%, -50%) scale(1)';
                    overlay.style.opacity = '1';
                    overlay.style.pointerEvents = 'all';
                }
            };
        }

        const closeCoinBtn = document.getElementById('close-coin-modal');
        const coinOverlay = document.getElementById('coin-modal-overlay');
        const closeCoinModal = () => {
            const modal = document.getElementById('coin-modal');
            const overlay = document.getElementById('coin-modal-overlay');
            if (modal && overlay) {
                modal.style.opacity = '0';
                modal.style.pointerEvents = 'none';
                modal.style.transform = 'translate(-50%, -50%) scale(0.9)';
                overlay.style.opacity = '0';
                overlay.style.pointerEvents = 'none';
            }
        };

        if (closeCoinBtn) closeCoinBtn.onclick = closeCoinModal;
        if (coinOverlay) coinOverlay.onclick = closeCoinModal;

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

        // Bottom Nav Events
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.onclick = () => {
                this.navigateTo(btn.dataset.view);
            };
        });

        // Header and Side Menu Events
        const profileBtn = document.getElementById('profile-btn');
        if (profileBtn) profileBtn.onclick = () => this.navigateTo('profile');

        const cartBtn = document.getElementById('cart-btn');
        if (cartBtn) cartBtn.onclick = () => this.navigateTo('cart');

        const logo = document.getElementById('logo');
        if (logo) logo.onclick = () => this.navigateTo('home');

        // Side Menu functional links
        const payBtn = document.getElementById('menu-payment-btn');
        if (payBtn) payBtn.onclick = () => {
            closeMenu();
            this.navigateTo('profile');
            setTimeout(() => {
                const historySection = document.querySelector('.history-list');
                if (historySection) historySection.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        };

        const walletBtn = document.getElementById('menu-wallet-btn');
        if (walletBtn) walletBtn.onclick = () => {
            closeMenu();
            this.navigateTo('profile');
            setTimeout(() => {
                const walletSection = document.querySelector('.profile-section').previousElementSibling; // Digital Wallet card
                if (walletSection) walletSection.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        };

        const addrBtn = document.getElementById('menu-address-btn');
        if (addrBtn) addrBtn.onclick = () => {
            closeMenu();
            this.navigateTo('profile');
            setTimeout(() => {
                const addrSection = document.getElementById('add-address-btn').closest('.profile-section');
                if (addrSection) addrSection.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        };

        const logoutMenuBtn = document.getElementById('menu-logout-btn');
        if (logoutMenuBtn) logoutMenuBtn.onclick = () => { closeMenu(); this.logout(); };

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

        // Exchange Coins Logic
        const exchangeCoinsBtn = document.getElementById('exchange-coins-btn');
        if (exchangeCoinsBtn) {
            exchangeCoinsBtn.onclick = async () => {
                const user = this.state.user;
                if ((user.vastraCoins || 0) < 100) {
                    alert('You need at least 100 coins to exchange.');
                    return;
                }
                const coinsToExchange = Math.floor(ext.vastraCoins / 100) * 100;
                const cashReceived = coinsToExchange / 100;

                if (confirm(`Exchange ${coinsToExchange} coins for ₹${cashReceived}?`)) {
                    try {
                        const updateData = {
                            vastraCoins: ext.vastraCoins - coinsToExchange,
                            walletBalance: (ext.walletBalance || 0) + cashReceived
                        };
                        const result = await api.updateProfile(this.state.user._id, updateData);
                        this.state.user = result.user;
                        localStorage.setItem('vastra_user', JSON.stringify(this.state.user));
                        updateUserData(this.state.user.email, {
                            ...getUserData(this.state.user.email),
                            vastraCoins: this.state.user.vastraCoins,
                            walletBalance: this.state.user.walletBalance
                        });
                        alert(`Success! Exchanged ${coinsToExchange} coins for ₹${cashReceived}.`);
                        this.render();
                    } catch (err) {
                        alert('Exchange failed: ' + err.message);
                    }
                }
            };
        }

        // Home events
        const homeCards = document.querySelectorAll('.service-card');
        homeCards.forEach(card => {
            card.onclick = () => this.navigateTo('services', card.dataset.id);
        });

        // Pro Badge Button
        const proBadgeBtns = document.querySelectorAll('.pro-badge-btn');
        proBadgeBtns.forEach(btn => {
            btn.onclick = () => this.navigateTo('vastra-pro');
        });

        const trackBtnHome = document.getElementById('track-btn-home');
        if (trackBtnHome) {
            trackBtnHome.onclick = async () => {
                const input = document.getElementById('tracking-input').value.trim();
                const errorEl = document.getElementById('tracking-error-home');
                if (!input) return;

                trackBtnHome.innerText = '...';
                try {
                    const order = await api.getOrderByTrackingId(input);
                    this.state.activeTrackingOrder = order;
                    this.navigateTo('track');
                } catch (err) {
                    errorEl.innerText = "Invalid Tracking ID. Please check your email.";
                    errorEl.style.display = 'block';
                    trackBtnHome.innerText = 'Track';
                }
            };
        }

        // Daily Check-In Logic
        const checkinBtn = document.getElementById('daily-checkin-btn');
        if (checkinBtn) {
            const lastCheckin = this.state.user.lastCheckinDate; // format: 'YYYY-MM-DD'
            const today = new Date().toISOString().split('T')[0];

            if (lastCheckin === today) {
                checkinBtn.innerText = 'Checked-In Today ✅';
                checkinBtn.disabled = true;
                checkinBtn.style.background = '#e2e8f0';
                checkinBtn.style.color = '#94a3b8';
                checkinBtn.style.cursor = 'default';
            } else {
                checkinBtn.onclick = async () => {
                    try {
                        const updateData = {
                            vastraCoins: (this.state.user.vastraCoins || 0) + 50,
                            lastCheckinDate: today
                        };
                        const result = await api.updateProfile(this.state.user._id, updateData);
                        this.state.user = result.user;
                        localStorage.setItem('vastra_user', JSON.stringify(this.state.user));

                        // Sync results to extension storage (header uses this)
                        updateUserData(this.state.user.email, {
                            ...getUserData(this.state.user.email),
                            vastraCoins: this.state.user.vastraCoins
                        });

                        alert('Congrats! You earned 50 Vastra Coins for checking in today.');
                        this.render();
                    } catch (err) {
                        alert('Check-in failed: ' + err.message);
                    }
                };
            }
        }

        // Service Detail events
        const backBtn = document.getElementById('back-to-home');
        if (backBtn) backBtn.onclick = () => this.goBack();

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

                let added = false;
                Object.entries(qtys).forEach(([item, qty]) => {
                    if (qty > 0) {
                        this.addToCart(item, itemPricing[item], qty, true);
                        added = true;
                    }
                });
                if (added) {
                    alert('Items added to cart!');
                    this.navigateTo('home');
                }
            };
        }

        // Cart events
        const backCart = document.getElementById('back-home-cart');
        if (backCart) backCart.onclick = () => this.goBack();

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

        const placeOrderBtn = document.getElementById('place-order-btn');
        if (placeOrderBtn) {
            placeOrderBtn.onclick = async () => {
                const addrRadio = document.querySelector('input[name="addressSelect"]:checked');
                let finalAddress = addrRadio ? addrRadio.value : '';
                if (finalAddress === 'custom') {
                    finalAddress = document.getElementById('address-input').value.trim();
                    if (!finalAddress) {
                        alert('Please enter a custom address');
                        return;
                    }
                }

                const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
                const total = this.state.cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

                if (paymentMethod === 'wallet' && (this.state.user.walletBalance || 0) < total) {
                    alert('Insufficient wallet balance!');
                    return;
                }

                placeOrderBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                placeOrderBtn.disabled = true;

                const userEmailDefault = this.state.user.email || 'guest';
                const order = {
                    userEmail: this.state.user.email || undefined,
                    userMobile: this.state.user.mobile,
                    items: [...this.state.cart],
                    totalAmount: total,
                    address: finalAddress,
                    date: new Date().toLocaleDateString('en-IN'),
                    status: 'Order Received',
                    trackingId: 'VST-' + Math.random().toString(36).substr(2, 9).toUpperCase()
                };

                try {
                    const savedOrder = await api.createOrder(order);

                    const earnedCoins = Math.floor(total / 100) * 10;
                    const newNotifications = [...(this.state.user.notifications || [])];
                    newNotifications.unshift({
                        text: `Order ${order.trackingId} placed! Tracking ID: ${order.trackingId}`,
                        date: new Date().toLocaleDateString('en-IN'),
                        read: false
                    });

                    const updateData = {
                        vastraCoins: (this.state.user.vastraCoins || 0) + earnedCoins,
                        notifications: newNotifications
                    };

                    if (paymentMethod === 'wallet') {
                        updateData.walletBalance = (this.state.user.walletBalance || 0) - total;
                    }

                    const result = await api.updateProfile(this.state.user._id, updateData);
                    this.state.user = result.user;
                    localStorage.setItem('vastra_user', JSON.stringify(this.state.user));
                    updateUserData(userEmailDefault, {
                        ...getUserData(userEmailDefault),
                        vastraCoins: this.state.user.vastraCoins,
                        walletBalance: this.state.user.walletBalance,
                        notifications: this.state.user.notifications
                    });

                    this.state.orders.unshift(savedOrder);
                    this.state.cart = [];
                    localStorage.removeItem('vastra_cart');
                    this.navigateTo('success');
                } catch (error) {
                    alert('Failed to place order: ' + error.message);
                    console.error(error);
                    placeOrderBtn.innerHTML = 'Place Order <i class="fas fa-chevron-right"></i>';
                    placeOrderBtn.disabled = false;
                }
            };
        }

        const trackBtn = document.getElementById('track-order-btn');
        if (trackBtn) trackBtn.onclick = () => this.navigateTo('track');

        const backHomeTrack = document.getElementById('back-home-track');
        if (backHomeTrack) backHomeTrack.onclick = () => this.goBack();

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
                const pastOrder = this.state.orders.find(o => (o._id || o.id) === orderId);
                if (pastOrder) {
                    this.state.cart = [...pastOrder.items];
                    this.navigateTo('checkout');
                }
            };
        });

        // Add Money
        const addMoneyBtn = document.getElementById('add-money-btn');
        const headerWalletBtn = document.getElementById('wallet-btn');

        const handleAddMoney = async () => {
            const amountStr = await window.customPrompt('Enter amount to add:', '50');
            if (!amountStr || isNaN(amountStr)) return;
            const amount = parseFloat(amountStr);

            try {
                // 1. Create Razorpay Order
                const API_URL = 'https://vastra-green.vercel.app/api'; // Or fallback to env/config
                const orderRes = await fetch(`${API_URL}/payment/create-order`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount })
                });
                const orderData = await orderRes.json();

                if (!orderData.success) throw new Error(orderData.message || 'Could not create order');

                // 2. Open Razorpay Checkout
                const options = {
                    key: "rzp_test_dummykey12345", // Replace with real key in production
                    amount: orderData.order.amount,
                    currency: "INR",
                    name: "Vastra Laundry",
                    description: "Wallet Top-up",
                    image: "/logo.jpg",
                    order_id: orderData.order.id,
                    handler: async function (response) {
                        try {
                            // 3. Verify Payment
                            const verifyRes = await fetch(`${API_URL}/payment/verify-payment`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature
                                })
                            });
                            const verifyData = await verifyRes.json();

                            if (verifyData.success) {
                                // 4. Update Wallet 
                                const updateData = { walletBalance: (app.state.user.walletBalance || 0) + amount };
                                const result = await api.updateProfile(app.state.user._id, updateData);
                                app.state.user = result.user;
                                localStorage.setItem('vastra_user', JSON.stringify(app.state.user));

                                const userEmail = app.state.user.email || 'guest';
                                updateUserData(userEmail, {
                                    ...getUserData(userEmail),
                                    walletBalance: app.state.user.walletBalance
                                });

                                app.render(); // Re-render to show new balance
                                await window.customAlert(`Payment Successful! Added ₹${amount} to wallet.`, 'Success');
                            } else {
                                await window.customAlert('Payment verification failed.', 'Error');
                            }
                        } catch (err) {
                            await window.customAlert('Error verifying payment: ' + err.message, 'Error');
                        }
                    },
                    prefill: {
                        name: this.state.user.name,
                        contact: this.state.user.mobile,
                        email: this.state.user.email || ""
                    },
                    theme: {
                        color: "#4f46e5"
                    }
                };

                const rzp = new window.Razorpay(options);
                rzp.on('payment.failed', async function (response) {
                    await window.customAlert('Payment Failed: ' + response.error.description, 'Failed');
                });
                rzp.open();

            } catch (err) {
                await window.customAlert('Payment initialization failed: ' + err.message, 'Error');
            }
        };

        if (addMoneyBtn) addMoneyBtn.onclick = handleAddMoney;
        if (headerWalletBtn) headerWalletBtn.onclick = handleAddMoney;

        const addAddrBtn = document.getElementById('add-address-btn');
        if (addAddrBtn) {
            addAddrBtn.onclick = async () => {
                const type = await window.customPrompt('Location Type (e.g. Gym, Parents):', 'Gym');
                if (type) {
                    const newAddresses = [...(this.state.user.savedAddresses || [])];
                    newAddresses.push({
                        id: Date.now(),
                        type: type,
                        text: '123 New Place, Vastra City'
                    });

                    try {
                        const result = await api.updateProfile(this.state.user._id, { savedAddresses: newAddresses });
                        this.state.user = result.user;
                        localStorage.setItem('vastra_user', JSON.stringify(this.state.user));
                        this.render();
                    } catch (err) {
                        alert('Failed to add address: ' + err.message);
                    }
                }
            };
        }

        // Address Management (Edit Logic)
        const addrModalOverlay = document.getElementById('addr-modal-overlay');
        const addrModal = document.getElementById('addr-modal');
        const closeAddrBtn = document.getElementById('close-addr-modal');

        const openAddrModal = (addr = null) => {
            if (!addrModalOverlay) return;
            addrModalOverlay.style.display = 'flex';
            setTimeout(() => {
                addrModalOverlay.style.opacity = '1';
                addrModal.style.transform = 'translateY(0)';
            }, 10);

            if (addr) {
                document.getElementById('addr-modal-title').innerText = 'Edit Address';
                document.getElementById('edit-addr-id').value = addr.id;
                document.getElementById('edit-addr-type').value = addr.type;

                // Parse address text "Door No, Street Name, Village, City"
                const parts = addr.text.split(',').map(p => p.trim());
                document.getElementById('edit-addr-door').value = parts[0] || '';
                document.getElementById('edit-addr-street').value = parts[1] || '';
                document.getElementById('edit-addr-village').value = parts[2] || '';
                document.getElementById('edit-addr-city').value = parts[3] || '';
            } else {
                document.getElementById('addr-modal-title').innerText = 'Add New Address';
                document.getElementById('edit-addr-id').value = '';
                document.getElementById('edit-addr-type').value = '';
                document.getElementById('edit-addr-door').value = '';
                document.getElementById('edit-addr-street').value = '';
                document.getElementById('edit-addr-village').value = '';
                document.getElementById('edit-addr-city').value = '';
            }
        };

        const closeAddrModal = () => {
            if (!addrModalOverlay) return;
            addrModalOverlay.style.opacity = '0';
            addrModal.style.transform = 'translateY(20px)';
            setTimeout(() => {
                addrModalOverlay.style.display = 'none';
            }, 300);
        };

        if (closeAddrBtn) closeAddrBtn.onclick = closeAddrModal;
        if (addrModalOverlay) addrModalOverlay.onclick = (e) => {
            if (e.target === addrModalOverlay) closeAddrModal();
        };

        document.querySelectorAll('.edit-address-btn').forEach(btn => {
            btn.onclick = () => {
                const ext = initializeUserData(this.state.user);
                const addr = ext.savedAddresses.find(a => a.id == btn.dataset.id);
                if (addr) openAddrModal(addr);
            };
        });

        if (addAddrBtn) addAddrBtn.onclick = () => openAddrModal();

        const saveAddrBtn = document.getElementById('save-addr-btn');
        if (saveAddrBtn) {
            saveAddrBtn.onclick = async () => {
                const id = document.getElementById('edit-addr-id').value;
                const type = document.getElementById('edit-addr-type').value.trim();
                const door = document.getElementById('edit-addr-door').value.trim();
                const street = document.getElementById('edit-addr-street').value.trim();
                const village = document.getElementById('edit-addr-village').value.trim();
                const city = document.getElementById('edit-addr-city').value.trim();

                if (!type || !street || !city) {
                    alert('Please fill in required fields (Category, Street, City)');
                    return;
                }

                const fullText = `${door ? door + ', ' : ''}${street}, ${village ? village + ', ' : ''}${city}`;
                const ext = this.state.user;
                const newAddresses = [...(ext.savedAddresses || [])];

                if (id) {
                    // Update
                    const addrIdx = newAddresses.findIndex(a => a.id == id || a._id == id);
                    if (addrIdx !== -1) {
                        newAddresses[addrIdx] = { ...newAddresses[addrIdx], type, text: fullText };
                    }
                } else {
                    // Add New
                    newAddresses.push({
                        id: Date.now(),
                        type: type,
                        text: fullText
                    });
                }

                try {
                    const result = await api.updateProfile(this.state.user._id, { savedAddresses: newAddresses });
                    this.state.user = result.user;
                    localStorage.setItem('vastra_user', JSON.stringify(this.state.user));
                    closeAddrModal();
                    this.render();
                } catch (err) {
                    console.error('Save address error:', err);
                    alert('Failed to save address. Please check your connection.');
                }
            };
        }

        // Pro Package Subscription
        document.querySelectorAll('.buy-pro-btn').forEach(btn => {
            btn.onclick = async () => {
                const price = parseFloat(btn.dataset.price);
                if (confirm(`Subscribe to ${btn.dataset.id} for ₹${price}?`)) {
                    if ((this.state.user.walletBalance || 0) < price) {
                        alert('Insufficient wallet balance!');
                        return;
                    }
                    try {
                        const updateData = {
                            walletBalance: this.state.user.walletBalance - price,
                            subscription: 'Pro'
                        };
                        const result = await api.updateProfile(this.state.user._id, updateData);
                        this.state.user = result.user;
                        localStorage.setItem('vastra_user', JSON.stringify(this.state.user));
                        updateUserData(this.state.user.email, {
                            ...getUserData(this.state.user.email),
                            walletBalance: this.state.user.walletBalance,
                            subscription: this.state.user.subscription
                        });
                        alert('Congratulations! You are now a Vastra Pro Member! 💎');
                        this.navigateTo('home');
                    } catch (err) {
                        alert('Subscription failed: ' + err.message);
                    }
                }
            };
        });

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
            setupCheckoutEvents(this.state.cart, total, (newOrder) => {
                if (newOrder) {
                    this.state.orders.unshift(newOrder); // Add to top of list
                    this.saveOrders();
                }
                this.state.cart = [];
                this.navigateTo('success');
            });
        }

        const backPro = document.getElementById('back-home-pro');
        if (backPro) backPro.onclick = () => this.goBack();

        const proBtnHome = document.querySelector('.welcome-section .auth-btn');
        if (proBtnHome && proBtnHome.innerText.includes('Pro')) {
            proBtnHome.onclick = () => this.navigateTo('vastra-pro');
        }

        const joinNowBtn = document.querySelector('.promo-banner .auth-btn');
        if (joinNowBtn) {
            joinNowBtn.onclick = () => this.navigateTo('vastra-pro');
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
};

app.init();
