import { api } from '../api.js';

export function renderSignUp(onSwitch) {
  const container = document.getElementById('app');
  container.innerHTML = `
    <div class="auth-container">
      <div class="auth-card glass-card">
        <div style="text-align: center; margin-bottom: 2rem;">
          <div class="logo-large" style="width: 80px; height: 80px; margin: 0 auto 1rem;">
             <img src="/logo.svg" alt="Logo" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">
          </div>
          <h1>Join Vastra Service</h1>
          <p>Create your account</p>
        </div>
        
        <form id="signup-form">
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" id="name" placeholder="John Doe" required>
          </div>

          <div class="form-group">
            <label>Mobile Number</label>
            <div style="display: flex; gap: 0.5rem;">
               <span style="padding: 1rem; background: rgba(255,255,255,0.6); border: 1px solid rgba(0,0,0,0.08); border-radius: var(--radius-sm); color: var(--text-muted);">+91</span>
               <input type="tel" id="mobile" placeholder="9876543210" pattern="[0-9]{10}" required maxlength="10">
            </div>
          </div>

          <div class="form-group">
            <label>Set Password</label>
            <input type="password" id="password" placeholder="******" required minlength="6">
          </div>

          <div class="form-group">
            <label>Email (Optional)</label>
            <input type="email" id="email" placeholder="john@example.com">
          </div>

          <button type="submit" class="auth-btn" id="signup-submit">Create Account</button>
        </form>

        <div class="auth-footer">
          Already have an account? <a href="#" id="goto-signin">Sign In</a>
        </div>
      </div>
    </div>
  `;

  const form = document.getElementById('signup-form');
  const submitBtn = document.getElementById('signup-submit');

  form.onsubmit = async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const mobile = document.getElementById('mobile').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;

    if (mobile.length !== 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }

    try {
      submitBtn.innerText = 'Creating Account...';
      submitBtn.disabled = true;

      const userData = {
        name,
        mobile: `+91${mobile}`, // Add country code standard
        password,
        email
      };

      // Call API
      const response = await api.signup(userData);

      // Save User & Redirect
      localStorage.setItem('vastra_user', JSON.stringify(response.user));

      // Success Animation
      container.innerHTML = `
            <div class="loading-overlay">
                <div class="washing-machine-loader">
                    <div class="machine-body"><div class="door"><div class="water"></div><div class="clothes">👕</div></div></div>
                </div>
                <h2>Account Created!</h2>
                <p>Welcome to Vastra, ${name}.</p>
            </div>
        `;
      setTimeout(() => window.location.reload(), 2000);

    } catch (error) {
      console.error(error);
      alert(error.message);
      submitBtn.innerText = 'Create Account';
      submitBtn.disabled = false;
    }
  };

  document.getElementById('goto-signin').onclick = (e) => { e.preventDefault(); onSwitch(); };
}
