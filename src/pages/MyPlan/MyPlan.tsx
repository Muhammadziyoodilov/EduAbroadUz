import React from 'react';
import { useTranslation } from 'react-i18next';
import { universities } from '../../data/universities';
import { useStore } from '../../store';
import styles from './MyPlan.module.scss';
import { clsx } from 'clsx';
import { Link } from 'react-router-dom';
import { 
  ChevronDown, ChevronUp, Clock, 
  CheckCircle2, AlertCircle, Trash2, 
  ArrowRight, FileText
} from 'lucide-react';

const MyPlan = () => {
  const { t } = useTranslation();
  const { 
    savedUniversities, toggleSaved, checklists, 
    toggleChecklistItem, notes, updateNote 
  } = useStore();

  const [expandedUni, setExpandedUni] = React.useState<string | null>(null);

  const savedUnis = universities.filter(u => savedUniversities.includes(u.id));

  if (savedUnis.length === 0) {
    return (
      <div className={clsx('container', styles.empty)}>
        <h1>{t('myPlan.title')}</h1>
        <p>{t('myPlan.empty')}</p>
        <Link to="/universities" className={styles.cta}>
          Universitetlarni qidirish <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className={clsx('container', styles.myPlanPage)}>
      <div className={styles.header}>
        <h1>{t('myPlan.title')}</h1>
      </div>

      <div className={styles.uniList}>
        {savedUnis.map(uni => {
          const checklistItems = uni.documents;
          const uniChecklist = checklists[uni.id] || {};
          const completedCount = Object.values(uniChecklist).filter(Boolean).length;
          const progress = Math.round((completedCount / checklistItems.length) * 100);
          const isExpanded = expandedUni === uni.id;

          // Deadline calculation
          const deadlineDate = new Date(uni.deadlines[0].date);
          const today = new Date();
          const diffTime = deadlineDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const isExpired = diffDays < 0;

          return (
            <div key={uni.id} className={clsx(styles.uniCard, isExpanded && styles['uniCard--expanded'])}>
              <div className={styles.uniCard__header} onClick={() => setExpandedUni(isExpanded ? null : uni.id)}>
                <div className={styles.uniCard__info}>
                  <div className={styles.flag}>{uni.flag}</div>
                  <div>
                    <h3>{uni.name}</h3>
                    <div className={styles.meta}>
                      <span className={clsx(styles.deadline, isExpired && styles['deadline--expired'])}>
                        {isExpired ? (
                          <><AlertCircle size={14} /> {t('myPlan.expired')}</>
                        ) : (
                          <><Clock size={14} /> {t('myPlan.daysLeft', { count: diffDays })}</>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className={styles.uniCard__progress}>
                  <div className={styles.progressLabel}>
                    <span>{t('myPlan.progress')}</span>
                    <strong>{progress}%</strong>
                  </div>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <div className={styles.uniCard__actions}>
                  <button 
                    className={styles.removeBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaved(uni.id);
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                  {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </div>
              </div>

              {isExpanded && (
                <div className={styles.uniCard__content}>
                  <div className={styles.contentGrid}>
                    <div className={styles.checklistSection}>
                      <h4><CheckCircle2 size={18} /> {t('myPlan.checklist')}</h4>
                      <div className={styles.checklist}>
                        {checklistItems.map(item => (
                          <label key={item.id} className={styles.checkItem}>
                            <input 
                              type="checkbox" 
                              checked={uniChecklist[item.id] || false}
                              onChange={() => toggleChecklistItem(uni.id, item.id)}
                            />
                            <span>{item.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className={styles.notesSection}>
                      <h4><FileText size={18} /> {t('myPlan.notes')}</h4>
                      <textarea 
                        placeholder="Universitet haqida eslatmalar..."
                        value={notes[uni.id] || ''}
                        onChange={(e) => updateNote(uni.id, e.target.value)}
                      />
                    </div>
                  </div>
                  <div className={styles.contentFooter}>
                    <Link to={`/universities/${uni.id}`} className={styles.viewBtn}>
                      Universitet sahifasiga o'tish <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyPlan;
