import { api } from '../api.js';

export function renderSignIn(onSwitch) {
  const container = document.getElementById('app');
  container.innerHTML = `
    <div class="auth-container">
      <div class="auth-card glass-card">
        <div style="text-align: center; margin-bottom: 2rem;">
          <div class="logo-large" style="width: 80px; height: 80px; margin: 0 auto 1rem;">
             <img src="/logo.svg" alt="Logo" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">
          </div>
          <h1>Vastra Laundry Service</h1>
          <p>Welcome Back</p>
        </div>

        <form id="signin-form">
          <div class="form-group">
            <label>Mobile Number</label>
            <div style="display: flex; gap: 0.5rem;">
               <span style="padding: 1rem; background: rgba(255,255,255,0.6); border: 1px solid rgba(0,0,0,0.08); border-radius: var(--radius-sm); color: var(--text-muted);">+91</span>
               <input type="tel" id="mobile" placeholder="9876543210" pattern="[0-9]{10}" required maxlength="10">
            </div>
          </div>
          
          <div class="form-group">
            <label>Password</label>
            <input type="password" id="password" placeholder="******" required>
          </div>

          <button type="submit" class="auth-btn" id="login-submit">Login</button>
        </form>

        <div class="auth-footer">
          Don't have an account? <a href="#" id="goto-signup">Sign Up</a><br><br>
          <a href="/admin/" style="font-size: 12px; color: var(--text-muted); text-decoration: none; opacity: 0.7; transition: all 0.2s;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.7">⊞ Admin Portal</a>
        </div>
      </div>
    </div>
  `;

  const form = document.getElementById('signin-form');
  const submitBtn = document.getElementById('login-submit');

  form.onsubmit = async (e) => {
    e.preventDefault();

    const mobileInput = document.getElementById('mobile');
    const passwordInput = document.getElementById('password');

    if (mobileInput.value.length !== 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }

    try {
      submitBtn.innerText = 'Logging in...';
      submitBtn.disabled = true;

      const credentials = {
        mobile: `+91${mobileInput.value}`,
        password: passwordInput.value
      };

      // Call API
      const response = await api.signin(credentials);

      // Save User & Redirect
      localStorage.setItem('vastra_user', JSON.stringify(response.user));

      // Success Animation
      container.innerHTML = `
            <div class="loading-overlay">
                <div class="washing-machine-loader">
                    <div class="machine-body"><div class="door"><div class="water"></div><div class="clothes">👕</div></div></div>
                </div>
                <h2>Welcome back!</h2>
                <p>Logging you in...</p>
            </div>
        `;
      setTimeout(() => window.location.reload(), 2000);

    } catch (error) {
      console.error(error);
      alert(error.message);
      submitBtn.innerText = 'Login';
      submitBtn.disabled = false;
    }
  };

  document.getElementById('goto-signup').onclick = (e) => { e.preventDefault(); onSwitch(); };
}
