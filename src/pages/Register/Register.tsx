import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import styles from '../Login/Auth.module.scss';
import { clsx } from 'clsx';

const Register = () => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');

  const getStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length > 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strength = getStrength();

  return (
    <div className={styles.authPage}>
      <div className={styles.leftPanel}>
        <div className={styles.brand}>
          <Link to="/" className={styles.logo}>
            EduAbroad<span>UZ</span>
          </Link>
          <h2>{t('auth.welcome')}</h2>
          <p>Ro'yxatdan o'ting va o'z kelajagingizni rejalashtirishni boshlang.</p>
        </div>
      </div>
      <div className={styles.rightPanel}>
        <div className={styles.formWrapper}>
          <h1>{t('auth.registerTitle')}</h1>
          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>{t('auth.firstName')}</label>
                <input type="text" placeholder="Aziz" />
              </div>
              <div className={styles.inputGroup}>
                <label>{t('auth.lastName')}</label>
                <input type="text" placeholder="Azizov" />
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label>{t('auth.email')}</label>
              <input type="email" placeholder="email@example.com" />
            </div>
            <div className={styles.inputGroup}>
              <label>{t('auth.password')}</label>
              <div className={styles.passwordInput}>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className={styles.strengthBar}>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={clsx(styles.segment, i <= strength && styles[`segment--${strength}`])} />
                ))}
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label>{t('auth.confirmPassword')}</label>
              <input type="password" placeholder="••••••••" />
            </div>
            
            <label className={styles.checkbox}>
              <input type="checkbox" />
              <span>{t('auth.terms')}</span>
            </label>

            <button type="submit" className={styles.submitBtn}>
              {t('nav.register')}
            </button>
          </form>

          <div className={styles.divider}>
            <span>yoki</span>
          </div>

          <button className={styles.googleBtn}>
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
            {t('auth.google')}
          </button>

          <p className={styles.switchAuth}>
            {t('auth.hasAccount')} <Link to="/login">{t('nav.login')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
