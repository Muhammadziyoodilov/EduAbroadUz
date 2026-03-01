import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import styles from './Auth.module.scss';
import { clsx } from 'clsx';

const Login = () => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.authPage}>
      <div className={styles.leftPanel}>
        <div className={styles.brand}>
          <Link to="/" className={styles.logo}>
            EduAbroad<span>UZ</span>
          </Link>
          <h2>{t('auth.welcome')}</h2>
          <p>Dunyo bo'ylab ta'lim imkoniyatlarini biz bilan kashf qiling.</p>
        </div>
      </div>
      <div className={styles.rightPanel}>
        <div className={styles.formWrapper}>
          <h1>{t('auth.loginTitle')}</h1>
          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            <div className={styles.inputGroup}>
              <label>{t('auth.email')}</label>
              <input type="email" placeholder="email@example.com" />
            </div>
            <div className={styles.inputGroup}>
              <div className={styles.labelRow}>
                <label>{t('auth.password')}</label>
                <a href="#" className={styles.forgot}>{t('auth.forgot')}</a>
              </div>
              <div className={styles.passwordInput}>
                <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" className={styles.submitBtn}>
              {t('nav.login')}
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
            {t('auth.noAccount')} <Link to="/register">{t('nav.register')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
