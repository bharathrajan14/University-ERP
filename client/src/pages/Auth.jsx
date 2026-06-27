import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginApi, registerApi } from '../services/authService';
import styles from './Auth.module.css';

const Auth = ({ initialTab = 'login' }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(initialTab);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [loginErrors, setLoginErrors] = useState({});
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginToast, setLoginToast] = useState(null);

  // Register state
  const [regFn, setRegFn] = useState('');
  const [regLn, setRegLn] = useState('');
  const [regEm, setRegEm] = useState('');
  const [regDept, setRegDept] = useState('');
  const [regRole, setRegRole] = useState('');
  const [regPw, setRegPw] = useState('');
  const [showRegPw, setShowRegPw] = useState(false);
  const [regErrors, setRegErrors] = useState({});
  const [regLoading, setRegLoading] = useState(false);
  const [regToast, setRegToast] = useState(null);

  const validEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const showToast = (setToastFunc, msg, type = '') => {
    setToastFunc({ msg, type });
    setTimeout(() => setToastFunc(null), 4000);
  };

  // Password strength logic
  const getPasswordStrength = () => {
    if (!regPw) return { score: 0, label: '', color: '' };
    let s = 0;
    if (regPw.length >= 8) s++;
    if (/[A-Z]/.test(regPw) && /[0-9]/.test(regPw)) s++;
    if (/[^A-Za-z0-9]/.test(regPw)) s++;
    const labs = ['', 'Weak', 'Fair', 'Strong'];
    const cols = ['', '#c0392b', '#C4952A', '#27ae60'];
    return { score: s, label: labs[s], color: cols[s] };
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!validEmail(loginEmail.trim())) errs.email = 'Enter a valid email';
    if (!loginPass) errs.pass = 'Password is required';

    setLoginErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoginLoading(true);
    try {
      const res = await loginApi({
        email: loginEmail.trim(),
        password: loginPass,
      });

      if (res.success && res.token) {
        // Store JWT token in localStorage
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.data));
        showToast(setLoginToast, 'Login successful!', 'success');
        setTimeout(() => navigate('/dashboard'), 1000);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      showToast(setLoginToast, msg);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!regFn.trim()) errs.fn = 'Required';
    if (!regLn.trim()) errs.ln = 'Required';
    if (!validEmail(regEm.trim())) errs.em = 'Enter a valid email';
    if (!regDept) errs.dept = 'Required';
    if (!regRole) errs.role = 'Required';
    if (regPw.length < 8) errs.pw = 'Min. 8 characters required';

    setRegErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setRegLoading(true);
    try {
      const res = await registerApi({
        fullName: `${regFn.trim()} ${regLn.trim()}`,
        email: regEm.trim(),
        password: regPw,
        role: regRole.toLowerCase(),
        department: regDept,
      });

      if (res.success) {
        showToast(setRegToast, '✓ Account created! You can now sign in.', 'success');
        setTimeout(() => setActiveTab('login'), 1500);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      showToast(setRegToast, msg);
    } finally {
      setRegLoading(false);
    }
  };

  const pwStrength = getPasswordStrength();

  return (
    <div className={styles.authContainer}>
      <div className={styles.wrapper}>
        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'login' ? styles.active : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Sign in
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'register' ? styles.active : ''}`}
            onClick={() => setActiveTab('register')}
          >
            Register
          </button>
        </div>

        {/* LOGIN PANEL */}
        {activeTab === 'login' && (
          <form className={styles.formPanel} onSubmit={handleLogin} noValidate>
            <h2 className={styles.panelHeading}>
              Welcome <span className={styles.gold}>back</span>
            </h2>
            <p className={styles.panelSub}>Sign in to your university account</p>

            {loginToast && (
              <div
                className={`${styles.toast} ${
                  loginToast.type === 'success'
                    ? styles.toastSuccess
                    : loginToast.type === 'info'
                    ? styles.toastInfo
                    : ''
                }`}
              >
                {loginToast.msg}
              </div>
            )}

            <div className={styles.field}>
              <label>Email address</label>
              <input
                type="email"
                placeholder="you@university.edu"
                value={loginEmail}
                onChange={(e) => {
                  setLoginEmail(e.target.value);
                  if (loginErrors.email) setLoginErrors((prev) => ({ ...prev, email: null }));
                }}
                className={loginErrors.email ? styles.error : ''}
              />
              {loginErrors.email && <span className={styles.fieldError}>{loginErrors.email}</span>}
            </div>

            <div className={styles.field}>
              <label>Password</label>
              <div className={styles.pwWrap}>
                <input
                  type={showLoginPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={loginPass}
                  onChange={(e) => {
                    setLoginPass(e.target.value);
                    if (loginErrors.pass) setLoginErrors((prev) => ({ ...prev, pass: null }));
                  }}
                  className={loginErrors.pass ? styles.error : ''}
                />
                <button
                  type="button"
                  className={styles.togglePw}
                  onClick={() => setShowLoginPw((prev) => !prev)}
                  aria-label="Toggle password"
                >
                  <i className={`ti ${showLoginPw ? 'ti-eye-off' : 'ti-eye'}`} aria-hidden="true"></i>
                </button>
              </div>
              {loginErrors.pass && <span className={styles.fieldError}>{loginErrors.pass}</span>}
            </div>

            <button
              type="button"
              className={styles.forgot}
              onClick={() => showToast(setLoginToast, 'Reset link will be sent to your email.', 'info')}
            >
              Forgot password?
            </button>

            <button type="submit" className={styles.btn} disabled={loginLoading}>
              {loginLoading && <span className={styles.spinner}></span>}
              <span>Sign in</span>
            </button>

            <p className={styles.formFooter}>
              Don't have an account?{' '}
              <button type="button" onClick={() => setActiveTab('register')}>
                Register here
              </button>
            </p>
          </form>
        )}

        {/* REGISTER PANEL */}
        {activeTab === 'register' && (
          <form className={styles.formPanel} onSubmit={handleRegister} noValidate>
            <h2 className={styles.panelHeading}>
              Join the <span className={styles.gold}>university</span>
            </h2>
            <p className={styles.panelSub}>Create your ERP account to get started</p>

            {regToast && (
              <div
                className={`${styles.toast} ${
                  regToast.type === 'success'
                    ? styles.toastSuccess
                    : regToast.type === 'info'
                    ? styles.toastInfo
                    : ''
                }`}
              >
                {regToast.msg}
              </div>
            )}

            <div className={styles.row2}>
              <div className={styles.field}>
                <label>First name</label>
                <input
                  type="text"
                  placeholder="Ada"
                  value={regFn}
                  onChange={(e) => {
                    setRegFn(e.target.value);
                    if (regErrors.fn) setRegErrors((prev) => ({ ...prev, fn: null }));
                  }}
                  className={regErrors.fn ? styles.error : ''}
                />
                {regErrors.fn && <span className={styles.fieldError}>{regErrors.fn}</span>}
              </div>

              <div className={styles.field}>
                <label>Last name</label>
                <input
                  type="text"
                  placeholder="Lovelace"
                  value={regLn}
                  onChange={(e) => {
                    setRegLn(e.target.value);
                    if (regErrors.ln) setRegErrors((prev) => ({ ...prev, ln: null }));
                  }}
                  className={regErrors.ln ? styles.error : ''}
                />
                {regErrors.ln && <span className={styles.fieldError}>{regErrors.ln}</span>}
              </div>
            </div>

            <div className={styles.field}>
              <label>University email</label>
              <input
                type="email"
                placeholder="a.lovelace@university.edu"
                value={regEm}
                onChange={(e) => {
                  setRegEm(e.target.value);
                  if (regErrors.em) setRegErrors((prev) => ({ ...prev, em: null }));
                }}
                className={regErrors.em ? styles.error : ''}
              />
              {regErrors.em && <span className={styles.fieldError}>{regErrors.em}</span>}
            </div>

            <div className={styles.row2}>
              <div className={styles.field}>
                <label>Department</label>
                <div className={styles.selectWrap}>
                  <select
                    value={regDept}
                    onChange={(e) => {
                      setRegDept(e.target.value);
                      if (regErrors.dept) setRegErrors((prev) => ({ ...prev, dept: null }));
                    }}
                    className={regErrors.dept ? styles.error : ''}
                  >
                    <option value="">Select…</option>
                    <option>Computer Science</option>
                    <option>Engineering</option>
                    <option>Mathematics</option>
                    <option>Physics</option>
                    <option>Biology</option>
                    <option>Economics</option>
                    <option>Law</option>
                    <option>Medicine</option>
                    <option>Business</option>
                    <option>Administration</option>
                  </select>
                </div>
                {regErrors.dept && <span className={styles.fieldError}>{regErrors.dept}</span>}
              </div>

              <div className={styles.field}>
                <label>Role</label>
                <div className={styles.selectWrap}>
                  <select
                    value={regRole}
                    onChange={(e) => {
                      setRegRole(e.target.value);
                      if (regErrors.role) setRegErrors((prev) => ({ ...prev, role: null }));
                    }}
                    className={regErrors.role ? styles.error : ''}
                  >
                    <option value="">Select…</option>
                    <option>Student</option>
                    <option>Faculty</option>
                    <option>Admin</option>
                    <option>Staff</option>
                  </select>
                </div>
                {regErrors.role && <span className={styles.fieldError}>{regErrors.role}</span>}
              </div>
            </div>

            <div className={`${styles.field} ${regPw ? styles[`pwS${pwStrength.score}`] : ''}`}>
              <label>Password</label>
              <div className={styles.pwWrap}>
                <input
                  type={showRegPw ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  value={regPw}
                  onChange={(e) => {
                    setRegPw(e.target.value);
                    if (regErrors.pw) setRegErrors((prev) => ({ ...prev, pw: null }));
                  }}
                  className={regErrors.pw ? styles.error : ''}
                />
                <button
                  type="button"
                  className={styles.togglePw}
                  onClick={() => setShowRegPw((prev) => !prev)}
                  aria-label="Toggle password"
                >
                  <i className={`ti ${showRegPw ? 'ti-eye-off' : 'ti-eye'}`} aria-hidden="true"></i>
                </button>
              </div>
              {regErrors.pw && <span className={styles.fieldError}>{regErrors.pw}</span>}
              <div className={styles.strengthBar}>
                <span></span>
                <span></span>
                <span></span>
              </div>
              {regPw && (
                <div className={styles.strengthLabel} style={{ color: pwStrength.color }}>
                  {pwStrength.label}
                </div>
              )}
            </div>

            <button type="submit" className={styles.btn} disabled={regLoading}>
              {regLoading && <span className={styles.spinner}></span>}
              <span>Create account</span>
            </button>

            <p className={styles.formFooter}>
              Already have an account?{' '}
              <button type="button" onClick={() => setActiveTab('login')}>
                Sign in
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Auth;
