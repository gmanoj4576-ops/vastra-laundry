export function renderCart(cartItems, onCheckout, onBack) {
  const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const content = `
    <div class="page-content">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem;">
        <h2>My Laundry Bag</h2>
        <button id="back-home-cart" class="icon-btn">✕</button>
      </div>

      ${cartItems.length === 0 ? `
        <div style="text-align: center; padding: 4rem 1rem;">
          <div style="font-size: 4rem; margin-bottom: 1rem;">🧺</div>
          <h3>Your bag is empty</h3>
          <p style="color: #64748b; margin-top: 0.5rem;">Add some clothes to get started!</p>
          <button id="cart-start-shopping" class="auth-btn" style="margin-top: 2rem; width: auto; padding-left: 2rem; padding-right: 2rem;">Browse Services</button>
        </div>
      ` : `
        <div class="cart-items">
          ${cartItems.map((item, index) => `
            <div class="cart-item" style="display: flex; justify-content: space-between; padding: 1rem 0; border-bottom: 1px solid #f1f5f9;">
              <div>
                <h4 style="margin:0">${item.itemName}</h4>
                <p style="margin:0; font-size: 0.8rem; color: #64748b;">${item.serviceName} • $${item.price} x ${item.quantity}</p>
              </div>
              <div style="display: flex; align-items: center; gap: 1rem;">
                <span style="font-weight: 700;">$${(item.price * item.quantity).toFixed(2)}</span>
                <button class="remove-item" data-index="${index}" style="color: #ef4444; background: none; font-size: 1.2rem;">✕</button>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="promo-section" style="margin-top: 1.5rem; background: white; padding: 1rem; border-radius: 12px; border: 1px dashed #cbd5e1;">
          <div style="display: flex; gap: 0.5rem;">
            <input type="text" id="promo-input" placeholder="Enter Promo Code" style="flex: 1; padding: 0.8rem; border: 1px solid #e2e8f0; border-radius: 9999px; text-transform: uppercase;">
            <button id="apply-promo-btn" style="background: #3b82f6; color: white; padding: 0 1.5rem; border-radius: 9999px; font-weight: 600; cursor: pointer;">Apply</button>
          </div>
          <p id="promo-message" style="font-size: 0.8rem; margin-top: 0.5rem; display: none;"></p>
        </div>

        <div class="cart-summary" style="margin-top: 2rem; background: #f8fafc; padding: 1.5rem; border-radius: 12px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span>Subtotal</span>
            <span id="subtotal-display">$${total.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span>Service Fee</span>
            <span>$2.00</span>
          </div>
          <div id="discount-row" style="display: none; justify-content: space-between; margin-bottom: 0.5rem; color: #16a34a;">
            <span>Discount</span>
            <span id="discount-display">-$0.00</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-top: 1rem; padding-top: 1rem; border-top: 2px dashed #e2e8f0; font-weight: 800; font-size: 1.2rem;">
            <span>Total</span>
            <span id="total-display">$${(total + 2).toFixed(2)}</span>
          </div>
        </div>

        <button id="checkout-btn" class="auth-btn" style="margin-top: 2rem; height: 60px; font-size: 1.1rem;">
          Place Order
        </button>
      `}
    </div>
  `;

  return content;
}
