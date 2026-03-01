import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styles from './Footer.module.scss';
import { clsx } from 'clsx';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className={styles.footer}>
      <div className={clsx('container', styles.footer__container)}>
        <div className={styles.footer__top}>
          <div className={styles.footer__brand}>
            <Link to="/" className={styles.logo}>
              EduAbroad<span>UZ</span>
            </Link>
            <p className={styles.footer__desc}>
              {t('home.heroDesc')}
            </p>
          </div>
          <div className={styles.footer__links}>
            <div className={styles.footer__group}>
              <h4>Platforma</h4>
              <Link to="/">{t('nav.home')}</Link>
              <Link to="/universities">{t('nav.universities')}</Link>
              <Link to="/compare">{t('nav.compare')}</Link>
              <Link to="/my-plan">{t('nav.myPlan')}</Link>
            </div>
            <div className={styles.footer__group}>
              <h4>Yordam</h4>
              <a href="#">FAQ</a>
              <a href="#">Bog'lanish</a>
              <a href="#">Shartlar</a>
            </div>
          </div>
        </div>
        <div className={styles.footer__bottom}>
          <p>© 2026 EduAbroad UZ. Barcha huquqlar himoyalangan.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
