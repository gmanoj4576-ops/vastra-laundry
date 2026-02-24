import { api } from '../api.js';

export function renderSignUp(onSwitch) {
  const container = document.getElementById('app');
  container.innerHTML = `
    <div class="auth-container">
      <div class="auth-card" style="padding: 3rem 2rem; border-radius: var(--radius-lg); background: white; box-shadow: var(--shadow-premium);">
        <div style="text-align: center; margin-bottom: 2.5rem;">
          <div class="logo-large" style="width: 80px; height: 80px; margin: 0 auto 1.5rem; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.1));">
             <img src="/logo.jpg" alt="Logo" style="width: 100%; height: 100%; object-fit: contain; border-radius: 18px;">
          </div>
          <h1 style="font-family: 'Syne', sans-serif; font-weight: 800; font-size: 2.2rem; color: var(--text-main); margin-bottom: 0.5rem; letter-spacing: -1px;">Join Vastra</h1>
          <p id="auth-subtitle" style="color: var(--text-muted); font-size: 1rem;">Create your premium account</p>
        </div>
        
        <form id="signup-form">
          <div id="details-section">
            <div class="form-group" style="margin-bottom: 1.25rem;">
              <label style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600; margin-bottom: 0.5rem; display: block;">FULL NAME</label>
              <input type="text" id="name" placeholder="John Doe" required style="padding: 1rem 1.25rem; border-radius: 12px; border: 1.5px solid #f1f5f9; background: #f8fafc; font-weight: 500;">
            </div>

            <div class="form-group" style="margin-bottom: 1.25rem;">
              <label style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600; margin-bottom: 0.5rem; display: block;">MOBILE NUMBER</label>
              <div style="display: flex; gap: 0.5rem;">
                 <span style="padding: 1rem; background: #f1f5f9; border: 1.5px solid #f1f5f9; border-radius: 12px; color: var(--text-muted); font-weight: 600;">+91</span>
                 <input type="tel" id="mobile" placeholder="9876543210" pattern="[0-9]{10}" required maxlength="10" style="padding: 1rem 1.25rem; border-radius: 12px; border: 1.5px solid #f1f5f9; background: #f8fafc; font-weight: 500;">
              </div>
            </div>

            <div class="form-group" style="margin-bottom: 1.25rem;">
              <label style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600; margin-bottom: 0.5rem; display: block;">EMAIL ADDRESS</label>
              <input type="email" id="email" placeholder="john@example.com" required style="padding: 1rem 1.25rem; border-radius: 12px; border: 1.5px solid #f1f5f9; background: #f8fafc; font-weight: 500;">
            </div>

            <div class="form-group" style="margin-bottom: 1.5rem;">
              <label style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600; margin-bottom: 0.5rem; display: block;">PASSWORD</label>
              <input type="password" id="password" placeholder="••••••••" required minlength="6" style="padding: 1rem 1.25rem; border-radius: 12px; border: 1.5px solid #f1f5f9; background: #f8fafc; font-weight: 500;">
            </div>

            <button type="button" class="auth-btn" id="send-otp-btn" style="background: var(--text-main); color: white; border-radius: 12px; height: 56px; font-weight: 700;">Send Verification Code</button>
          </div>

          <div id="social-section">
            <div style="margin: 2rem 0; text-align: center; color: var(--text-muted); font-size: 0.8rem; letter-spacing: 1px;">OR</div>
            <button type="button" class="auth-btn" id="google-signup" style="background: white; color: var(--text-main); border: 1.5px solid #f1f5f9; border-radius: 12px; height: 56px; font-weight: 600; box-shadow: none;">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="20" height="20" alt="Google">
              Sign up with Google
            </button>
          </div>

          <div id="otp-section" class="hidden">
            <div class="form-group" style="margin-bottom: 1.5rem;">
              <label style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600; margin-bottom: 0.5rem; display: block;">VERIFICATION CODE</label>
              <input type="text" id="otp" placeholder="123456" maxlength="6" style="padding: 1rem 1.25rem; border-radius: 12px; border: 1.5px solid #f1f5f9; background: #f8fafc; font-weight: 600; text-align: center; font-size: 1.5rem; letter-spacing: 4px;">
              <p style="font-size: 0.8rem; margin-top: 0.75rem; color: var(--text-muted); text-align: center;">Enter the 6-digit code sent to your email.</p>
            </div>
            <button type="submit" class="auth-btn" id="signup-submit" style="background: var(--text-main); color: white; border-radius: 12px; height: 56px; font-weight: 700;">Verify & Create Account</button>
            <button type="button" class="text-btn" id="change-email" style="margin-top: 1rem; width: 100%; color: var(--primary); font-weight: 600;">Edit details</button>
          </div>
        </form>

        <div class="auth-footer" id="auth-footer" style="margin-top: 2rem; font-weight: 500; text-align: center;">
          Already have an account? <a href="#" id="goto-signin" style="color: var(--primary); text-decoration: none; font-weight: 700;">Sign In</a>
        </div>
      </div>
    </div>
  `;

  const form = document.getElementById('signup-form');
  const sendOtpBtn = document.getElementById('send-otp-btn');
  const googleBtn = document.getElementById('google-signup');
  const signupBtn = document.getElementById('signup-submit');
  const detailsSection = document.getElementById('details-section');
  const otpSection = document.getElementById('otp-section');
  const subtitle = document.getElementById('auth-subtitle');
  const changeEmailBtn = document.getElementById('change-email');

  let isOtpSent = false;

  googleBtn.onclick = async () => {
    try {
      const { auth, googleProvider, signInWithPopup } = await import('../firebase.js');

      if (auth.config && auth.config.apiKey === "YOUR_API_KEY") {
        alert("Please provide your Firebase Config in src/firebase.js first!");
        return;
      }

      googleBtn.innerText = 'Connecting...';
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

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
        Sign up with Google
      `;
    }
  };

  sendOtpBtn.onclick = async () => {
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const mobile = document.getElementById('mobile').value;
    const password = document.getElementById('password').value;

    if (!email || !name || !mobile || !password) {
      alert('Please fill in all details first.');
      return;
    }

    if (mobile.length !== 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }

    try {
      sendOtpBtn.innerText = 'Sending Code...';
      sendOtpBtn.disabled = true;

      await api.sendOTP(email);

      // Switch UI on success
      detailsSection.classList.add('hidden');
      document.getElementById('social-section').classList.add('hidden');
      otpSection.classList.remove('hidden');
      subtitle.innerText = `Verify your email: ${email}`;
      isOtpSent = true;

    } catch (error) {
      console.error(error);
      alert(error.message);
      sendOtpBtn.innerText = 'Send Verification Code';
      sendOtpBtn.disabled = false;
    }
  };

  changeEmailBtn.onclick = () => {
    detailsSection.classList.remove('hidden');
    document.getElementById('social-section').classList.remove('hidden');
    otpSection.classList.add('hidden');
    subtitle.innerText = 'Create your account';
    sendOtpBtn.innerText = 'Send Verification Code';
    sendOtpBtn.disabled = false;
    isOtpSent = false;
  };

  form.onsubmit = async (e) => {
    e.preventDefault();

    if (!isOtpSent) return;

    const name = document.getElementById('name').value;
    const mobile = document.getElementById('mobile').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    const otp = document.getElementById('otp').value;

    if (!otp || otp.length !== 6) {
      alert('Please enter a valid 6-digit code');
      return;
    }

    try {
      signupBtn.innerText = 'Verifying...';
      signupBtn.disabled = true;

      // 1. Verify OTP first
      await api.verifyOTP(email, otp);

      // 2. Proceed with Signup
      signupBtn.innerText = 'Creating Account...';
      const userData = {
        name,
        mobile: `+91${mobile}`,
        password,
        email,
        otpVerified: true
      };

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
      signupBtn.innerText = 'Verify & Create Account';
      signupBtn.disabled = false;
    }
  };

  document.getElementById('goto-signin').onclick = (e) => { e.preventDefault(); onSwitch(); };
}
