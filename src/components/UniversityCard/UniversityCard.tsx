import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  MapPin,
  GraduationCap,
  DollarSign,
  Award,
  ChevronRight,
  Star,
  Plus,
  Check,
} from "lucide-react";
import styles from "./UniversityCard.module.scss";
import { clsx } from "clsx";
import { useStore } from "../../store";

interface UniversityCardProps {
  university: any;
  view?: "grid" | "list";
}

const UniversityCard: React.FC<UniversityCardProps> = ({
  university,
  view = "grid",
}) => {
  const { t } = useTranslation();
  const { toggleCompare, compareList } = useStore();
  const isCompared = compareList.includes(university.id);

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCompare(university.id);
  };

  return (
    <Link
      to={`/universities/${university.id}`}
      className={clsx(styles.card, styles[`card--${view}`])}
    >
      <div
        className={styles.header}
        style={
          view === "grid"
            ? {
                backgroundImage: `linear-gradient(rgba(0,0,0,0.18), rgba(0,0,0,0.18)), url('${university.photo}')`,
              }
            : undefined
        }
      >
        <div className={styles.logoWrapper}>
          <img
            src={university.logo}
            alt={university.name}
            referrerPolicy="no-referrer"
          />
        </div>
        <div className={styles.rank}>
          <Star size={12} fill="currentColor" />
          <span>QS #{university.qsRank}</span>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.titleSection}>
          <h3 className={styles.name}>{university.name}</h3>
          <div className={styles.location}>
            <MapPin size={14} />
            <span>
              {university.city}, {university.country} {university.flag}
            </span>
          </div>
        </div>

        <div className={styles.tags}>
          {university.fields.slice(0, 2).map((f: string) => (
            <span key={f} className={styles.tag}>
              {f}
            </span>
          ))}
          {university.hasScholarship && (
            <span className={clsx(styles.tag, styles["tag--scholarship"])}>
              <Award size={12} /> {t("universities.scholarship")}
            </span>
          )}
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <GraduationCap size={16} />
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>IELTS</span>
              <span className={styles.statValue}>{university.ieltsMin}+</span>
            </div>
          </div>
          <div className={styles.stat}>
            <DollarSign size={16} />
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>{t("detail.tuition")}</span>
              <span className={styles.statValue}>
                {university.tuitionMin === 0
                  ? t("universities.free")
                  : `$${university.tuitionMin.toLocaleString()}`}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            className={clsx(
              styles.compareBtn,
              isCompared && styles["compareBtn--active"],
            )}
            onClick={handleCompare}
          >
            {isCompared ? <Check size={16} /> : <Plus size={16} />}
            <span>{isCompared ? t("compare.added") : t("compare.add")}</span>
          </button>
          <ChevronRight size={20} className={styles.chevron} />
        </div>
      </div>
    </Link>
  );
};

export default UniversityCard;
