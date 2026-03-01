import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe, LogIn, UserPlus } from 'lucide-react';
import styles from './Header.module.scss';
import { clsx } from 'clsx';

const Header = () => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/universities', label: t('nav.universities') },
    { path: '/compare', label: t('nav.compare') },
    { path: '/my-plan', label: t('nav.myPlan') },
  ];

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  return (
    <header className={styles.header}>
      <div className={clsx('container', styles.header__container)}>
        <Link to="/" className={styles.logo}>
          EduAbroad<span>UZ</span>
        </Link>

        <nav className={styles.nav}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={clsx(styles.nav__link, location.pathname === link.path && styles['nav__link--active'])}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <div className={styles.langSwitcher}>
            {['uz', 'ru', 'en'].map((lng) => (
              <button
                key={lng}
                onClick={() => changeLanguage(lng)}
                className={clsx(styles.langBtn, i18n.language === lng && styles['langBtn--active'])}
              >
                {lng.toUpperCase()}
              </button>
            ))}
          </div>

          <Link to="/login" className={styles.loginBtn}>
            {t('nav.login')}
          </Link>
          <Link to="/register" className={styles.registerBtn}>
            {t('nav.register')}
          </Link>

          <button className={styles.menuBtn} onClick={() => setIsMenuOpen(true)}>
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={clsx(styles.drawer, isMenuOpen && styles['drawer--open'])}>
        <div className={styles.drawer__header}>
          <Link to="/" className={styles.logo} onClick={() => setIsMenuOpen(false)}>
            EduAbroad<span>UZ</span>
          </Link>
          <button onClick={() => setIsMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <div className={styles.drawer__content}>
          <nav className={styles.drawer__nav}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={styles.drawer__link}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className={styles.drawer__lang}>
            {['uz', 'ru', 'en'].map((lng) => (
              <button
                key={lng}
                onClick={() => {
                  changeLanguage(lng);
                  setIsMenuOpen(false);
                }}
                className={clsx(styles.langBtn, i18n.language === lng && styles['langBtn--active'])}
              >
                {lng.toUpperCase()}
              </button>
            ))}
          </div>

          <div className={styles.drawer__actions}>
            <Link to="/login" className={styles.loginBtn} onClick={() => setIsMenuOpen(false)}>
              {t('nav.login')}
            </Link>
            <Link to="/register" className={styles.registerBtn} onClick={() => setIsMenuOpen(false)}>
              {t('nav.register')}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
