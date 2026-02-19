import { api } from '../api.js';

export function renderCheckout(cart, total) {
  if (!cart) cart = [];
  return `
    <div class="checkout-container fade-in">
      <div class="checkout-header">
        <button id="back-to-home" class="icon-btn"><i class="fas fa-arrow-left"></i></button>
        <h1>Checkout</h1>
      </div>

      <div class="checkout-content">
        <!-- Order Summary -->
        <div class="order-summary glass-card">
          <h3>Order Summary</h3>
          <div class="cart-items-list">
            ${cart.map(item => `
              <div class="summary-item">
                <div class="item-info">
                  <span class="item-name">${item.itemName || item.name}</span>
                  <span class="item-service">${item.serviceName || item.service}</span>
                </div>
                <div class="item-qty">x${item.quantity || item.qty}</div>
                <div class="item-price">₹${(item.price * (item.quantity || item.qty)).toFixed(2)}</div>
              </div>
            `).join('')}
          </div>
          <div class="summary-total">
            <span>Total Amount</span>
            <span>₹${total}</span>
          </div>
        </div>

        <!-- Address Section -->
         <div class="address-section glass-card">
          <h3><i class="fas fa-map-marker-alt"></i> Pickup Address</h3>
          <div class="current-address">
            <p><strong>Home</strong></p>
            <p>123, Vastra Lane, Fabric City, Mumbai - 400001</p>
          </div>
          <button class="text-btn">Change Address</button>
        </div>

        <!-- Payment Section -->
        <div class="payment-section glass-card">
          <h3><i class="fas fa-wallet"></i> Payment Method</h3>
          <div class="payment-options">
             <label class="payment-option selected">
               <input type="radio" name="payment" value="cod" checked>
               <span class="radio-custom"></span>
               <div class="pay-label">
                 <i class="fas fa-money-bill-wave"></i>
                 <span>Cash on Delivery</span>
               </div>
             </label>
             <label class="payment-option">
               <input type="radio" name="payment" value="online">
               <span class="radio-custom"></span>
               <div class="pay-label">
                 <i class="fas fa-credit-card"></i>
                 <span>Pay Online</span>
               </div>
             </label>
          </div>
        </div>
      </div>

      <div class="checkout-footer glass-card">
         <div class="total-display">
           <small>To Pay</small>
           <strong>₹${total}</strong>
         </div>
         <button id="place-order-btn" class="primary-btn pulse-btn">
           Place Order <i class="fas fa-chevron-right"></i>
         </button>
      </div>
    </div>
  `;
}

export function renderSuccess() {
  return `
    <div class="order-success fade-in" style="text-align: center; padding: 4rem 2rem;">
        <div class="success-icon" style="font-size: 4rem; color: #16a34a; margin-bottom: 1rem;">
            <i class="fas fa-check-circle"></i>
        </div>
        <h2 style="margin-bottom: 0.5rem; color: #1e293b;">Order Placed Successfully!</h2>
        <p style="color: #64748b; margin-bottom: 2rem;">Your clothes are in good hands.</p>
        <button id="success-home-btn" class="primary-btn">Back to Home</button>
    </div>
  `;
}

export function setupCheckoutEvents(cart, total, onSuccess) {
  const backBtn = document.getElementById('back-to-home');
  if (backBtn) {
    backBtn.onclick = () => window.location.reload();
  }

  const successHomeBtn = document.getElementById('success-home-btn');
  if (successHomeBtn) {
    successHomeBtn.onclick = () => window.location.reload();
  }

  const placeOrderBtn = document.getElementById('place-order-btn');
  if (placeOrderBtn) {
    placeOrderBtn.onclick = async () => {
      placeOrderBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
      placeOrderBtn.disabled = true;

      try {
        const user = JSON.parse(localStorage.getItem('vastra_user'));
        if (!user) {
          alert('Please login to place an order');
          window.location.reload();
          return;
        }

        const orderData = {
          userEmail: user.mobile || user.email,
          items: cart.map(item => ({
            itemName: item.itemName || item.name,
            serviceName: item.serviceName || item.service,
            price: item.price,
            quantity: item.quantity || item.qty
          })),
          totalAmount: total,
          date: new Date().toLocaleDateString('en-IN'),
          status: 'Order Received'
        };

        await api.createOrder(orderData);

        // Clear Cart
        localStorage.removeItem('vastra_cart');

        // Callback to switch view
        if (onSuccess) onSuccess();

      } catch (error) {
        console.error(error);
        alert('Failed to place order: ' + error.message);
        placeOrderBtn.innerHTML = 'Place Order <i class="fas fa-chevron-right"></i>';
        placeOrderBtn.disabled = false;
      }
    };
  }
}
