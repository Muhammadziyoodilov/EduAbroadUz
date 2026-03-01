import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store';
import { universities } from '../../data/universities';
import { X, Trophy, AlertCircle, TrendingUp, DollarSign, Award, Trash2, Plus, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';
import styles from './Compare.module.scss';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const Compare = () => {
  const { t } = useTranslation();
  const { compareList, toggleCompare, clearCompare } = useStore();

  const selectedUnis = useMemo(() => 
    universities.filter(u => compareList.includes(u.id))
  , [compareList]);

  const comparisonResult = useMemo(() => {
    if (selectedUnis.length !== 2) return null;

    const [u1, u2] = selectedUnis;
    
    // Formula: Lower rank is better, lower tuition is better, higher IELTS is better (prestige)
    const getScore = (u: any) => {
      const rankScore = (1000 - u.qsRank) / 10; // 0 to 100
      const tuitionScore = (60000 - u.tuitionMin) / 600; // 0 to 100
      const ieltsScore = u.ieltsMin * 10; // 50 to 90
      return rankScore + tuitionScore + ieltsScore;
    };

    const s1 = getScore(u1);
    const s2 = getScore(u2);

    return {
      winner: s1 > s2 ? u1.id : u2.id,
      scores: { [u1.id]: s1, [u2.id]: s2 },
      diff: Math.abs(s1 - s2)
    };
  }, [selectedUnis]);

  const rows = [
    { key: 'country', label: t('detail.country'), icon: <TrendingUp size={16} />, render: (u: any) => `${u.flag} ${u.country}` },
    { key: 'qsRank', label: t('detail.rank'), icon: <Award size={16} />, render: (u: any) => `QS #${u.qsRank}` },
    { key: 'tuitionMin', label: t('detail.tuition'), icon: <DollarSign size={16} />, render: (u: any) => u.tuitionMin === 0 ? t('universities.free') : `$${u.tuitionMin.toLocaleString()}` },
    { key: 'ieltsMin', label: t('detail.ielts'), icon: <Award size={16} />, render: (u: any) => `Min ${u.ieltsMin}+` },
    { key: 'acceptanceRate', label: t('detail.acceptance'), render: (u: any) => `${u.acceptanceRate}%` },
    { key: 'founded', label: t('detail.founded') },
  ];

  if (selectedUnis.length === 0) {
    return (
      <div className={clsx('container', styles.empty)}>
        <AlertCircle size={48} />
        <h1>{t('compare.title')}</h1>
        <p>{t('compare.empty')}</p>
        <Link to="/universities" className={styles.cta}>
          Universitetlarni ko'rish <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className={clsx('container', styles.comparePage)}>
      <div className={styles.header}>
        <h1>{t('compare.title')}</h1>
        <button onClick={clearCompare} className={styles.clearBtn}>
          <Trash2 size={18} /> {t('compare.clear')}
        </button>
      </div>

      {selectedUnis.length === 2 && comparisonResult && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={styles.winnerCard}
        >
          <div className={styles.winnerIcon}>
            <Trophy size={32} />
          </div>
          <div className={styles.winnerInfo}>
            <h3>{t('compare.winnerTitle')}</h3>
            <p>
              {selectedUnis.find(u => u.id === comparisonResult.winner).name} {t('compare.winnerDesc')}
            </p>
          </div>
        </motion.div>
      )}

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.labelCol}>{t('compare.criteria')}</th>
              {selectedUnis.map(uni => (
                <th key={uni.id} className={styles.uniCol}>
                  <div className={styles.uniHeader}>
                    <button className={styles.removeBtn} onClick={() => toggleCompare(uni.id)}>
                      <X size={16} />
                    </button>
                    <img src={uni.logo} alt={uni.name} className={styles.uniLogo} referrerPolicy="no-referrer" />
                    <span className={styles.uniName}>{uni.name}</span>
                    {comparisonResult?.winner === uni.id && (
                      <span className={styles.winnerBadge}>{t('compare.winner')}</span>
                    )}
                  </div>
                </th>
              ))}
              {selectedUnis.length < 3 && (
                <th className={styles.addCol}>
                  <Link to="/universities" className={styles.addBtn}>
                    <Plus size={24} />
                    <span>{t('compare.add')}</span>
                  </Link>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.key}>
                <td className={styles.labelCol}>
                  <div className={styles.criteriaLabel}>
                    {row.icon}
                    {row.label}
                  </div>
                </td>
                {selectedUnis.map(uni => (
                  <td key={uni.id} className={clsx(styles.valueCol, comparisonResult?.winner === uni.id && styles.winnerCell)}>
                    <span className={styles.value}>
                      {row.render ? row.render(uni) : uni[row.key as keyof typeof uni]}
                    </span>
                  </td>
                ))}
                {selectedUnis.length < 3 && <td className={styles.emptyCol}></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className={styles.mobileList}>
        {selectedUnis.map(uni => (
          <div key={uni.id} className={clsx(styles.mobileCard, comparisonResult?.winner === uni.id && styles.winnerCardMobile)}>
            <div className={styles.mobileCardHeader}>
              <img src={uni.logo} alt={uni.name} />
              <div className={styles.mobileCardTitle}>
                <h3>{uni.name}</h3>
                {comparisonResult?.winner === uni.id && <span className={styles.winnerBadge}>{t('compare.winner')}</span>}
              </div>
              <button onClick={() => toggleCompare(uni.id)}><X size={20} /></button>
            </div>
            <div className={styles.mobileCardGrid}>
              {rows.map(row => (
                <div key={row.key} className={styles.mobileStat}>
                  <span className={styles.mobileStatLabel}>{row.label}</span>
                  <span className={styles.mobileStatValue}>
                    {row.render ? row.render(uni) : uni[row.key as keyof typeof uni]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
        {selectedUnis.length < 3 && (
          <Link to="/universities" className={styles.mobileAddBtn}>
            <Plus size={24} />
            <span>Universitet qo'shish</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Compare;
