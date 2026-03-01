import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { grants } from '../../data/universities';
import { Award, MapPin, Calendar, ChevronRight, Globe } from 'lucide-react';
import { clsx } from 'clsx';
import styles from './Grants.module.scss';
import { motion } from 'motion/react';

const Grants = () => {
  const { t } = useTranslation();

  return (
    <div className={clsx('container', styles.grantsPage)}>
      <div className={styles.header}>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {t('nav.grants')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {t('grants.subtitle')}
        </motion.p>
      </div>

      <div className={styles.grid}>
        {grants.map((grant, index) => (
          <motion.div
            key={grant.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={`/grants/${grant.id}`} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.flag}>{grant.flag}</div>
                <div className={styles.typeBadge}>{grant.type}</div>
              </div>
              
              <h3 className={styles.name}>{grant.name}</h3>
              
              <div className={styles.meta}>
                <div className={styles.metaItem}>
                  <MapPin size={16} />
                  <span>{grant.country}</span>
                </div>
                <div className={styles.metaItem}>
                  <Globe size={16} />
                  <span>{grant.coverage} Coverage</span>
                </div>
              </div>

              <div className={styles.amount}>
                <span className={styles.amountLabel}>{t('grants.amount')}</span>
                <span className={styles.amountValue}>{grant.amount}</span>
              </div>

              <div className={styles.footer}>
                <div className={styles.deadline}>
                  <Calendar size={14} />
                  <span>Deadline: {grant.deadline}</span>
                </div>
                <ChevronRight size={20} className={styles.chevron} />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Grants;
