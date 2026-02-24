import { api } from '../api.js';

export function renderSignIn(onSwitch) {
  const container = document.getElementById('app');
  container.innerHTML = `
    <div class="auth-container">
      <div class="auth-card" style="padding: 3rem 2rem; border-radius: var(--radius-lg); background: white; box-shadow: var(--shadow-premium);">
        <div style="text-align: center; margin-bottom: 2.5rem;">
          <div class="logo-large" style="width: 100px; height: 100px; margin: 0 auto 1.5rem; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.1));">
             <img src="/logo.jpg" alt="Logo" style="width: 100%; height: 100%; object-fit: contain; border-radius: 20px;">
          </div>
          <h1 style="font-family: 'Syne', sans-serif; font-weight: 800; font-size: 2.2rem; color: var(--text-main); margin-bottom: 0.5rem; letter-spacing: -1px;">Vastra</h1>
          <p style="color: var(--text-muted); font-size: 1rem;">Premium Fabric Care</p>
        </div>

        <form id="signin-form">
          <div class="form-group" style="margin-bottom: 1.25rem;">
            <label style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600; margin-bottom: 0.5rem; display: block;">MOBILE OR EMAIL</label>
            <input type="text" id="identifier" placeholder="9876543210" required style="padding: 1rem 1.25rem; border-radius: 12px; border: 1.5px solid #f1f5f9; background: #f8fafc; font-weight: 500;">
          </div>
          
          <div class="form-group" style="margin-bottom: 1.5rem;">
            <label style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600; margin-bottom: 0.5rem; display: block;">PASSWORD</label>
            <input type="password" id="password" placeholder="••••••••" required style="padding: 1rem 1.25rem; border-radius: 12px; border: 1.5px solid #f1f5f9; background: #f8fafc; font-weight: 500;">
          </div>

          <button type="submit" class="auth-btn" id="login-submit" style="background: var(--text-main); color: white; border-radius: 12px; height: 56px; font-weight: 700;">Login</button>
        </form>

        <div style="margin: 2rem 0; text-align: center; color: var(--text-muted); font-size: 0.8rem; letter-spacing: 1px;">
          OR
        </div>

        <button class="auth-btn" id="google-signin" style="background: white; color: var(--text-main); border: 1.5px solid #f1f5f9; border-radius: 12px; height: 56px; font-weight: 600; box-shadow: none;">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="20" height="20" alt="Google">
          Continue with Google
        </button>

        <div class="auth-footer" style="margin-top: 2rem; font-weight: 500;">
          New here? <a href="#" id="goto-signup" style="color: var(--primary); text-decoration: none; font-weight: 700;">Create Account</a>
        </div>
      </div>
    </div>
  `;

  const form = document.getElementById('signin-form');
  const submitBtn = document.getElementById('login-submit');
  const googleBtn = document.getElementById('google-signin');

  googleBtn.onclick = async () => {
    try {
      // Import dynamically to handle potentially unconfigured firebase.js
      const { auth, googleProvider, signInWithPopup } = await import('../firebase.js');

      if (auth.config && auth.config.apiKey === "YOUR_API_KEY") {
        alert("Please provide your Firebase Config in src/firebase.js first!");
        return;
      }

      googleBtn.innerText = 'Connecting...';
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Sync with our backend
      const response = await api.socialLogin({
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL
      });

      localStorage.setItem('vastra_user', JSON.stringify(response.user));
      window.location.reload();

    } catch (error) {
      console.error(error);
      alert(error.message);
      googleBtn.innerHTML = `
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" height="18" alt="Google">
        Continue with Google
      `;
    }
  };

  form.onsubmit = async (e) => {
    e.preventDefault();

    const identifierInput = document.getElementById('identifier');
    const passwordInput = document.getElementById('password');

    try {
      submitBtn.innerText = 'Logging in...';
      submitBtn.disabled = true;

      let identifier = identifierInput.value.trim();

      // Auto-prefix with +91 if it's a 10-digit mobile number
      if (/^\d{10}$/.test(identifier)) {
        identifier = `+91${identifier}`;
      }

      const credentials = {
        mobile: identifier,
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
