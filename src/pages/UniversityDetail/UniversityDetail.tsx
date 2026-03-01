import React, { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  MapPin,
  Globe,
  Award,
  DollarSign,
  Calendar,
  Users,
  CheckCircle2,
  ArrowRight,
  Bookmark,
  Copy,
  ExternalLink,
  ChevronRight,
  Search,
} from "lucide-react";
import { universities } from "../../data/universities";
import { useStore } from "../../store";
import styles from "./UniversityDetail.module.scss";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "motion/react";

const UniversityDetail = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const {
    toggleCompare,
    compareList,
    toggleSaved,
    savedUniversities,
    checklists,
    toggleChecklistItem,
  } = useStore();

  const university = universities.find((u) => u.id === id);
  const [activeTab, setActiveTab] = useState("general");
  const [programSearch, setProgramSearch] = useState("");

  // Calculator state
  const [calcData, setCalcData] = useState({ ielts: "", sat: "", gpa: "" });
  const [calcResult, setCalcResult] = useState<number | null>(null);

  if (!university) return <div>University not found</div>;

  const isCompared = compareList.includes(university.id);
  const isSaved = savedUniversities.includes(university.id);

  const tabs = [
    { id: "general", label: t("detail.tabs.general") },
    { id: "programs", label: t("detail.tabs.programs") },
    { id: "requirements", label: t("detail.tabs.requirements") },
    { id: "students", label: t("detail.tabs.students") },
    { id: "calculator", label: t("detail.tabs.calculator") },
  ];

  const handleCalculate = () => {
    const ieltsVal = parseFloat(calcData.ielts) || 0;
    const satVal = parseInt(calcData.sat) || 0;
    const gpaVal = parseFloat(calcData.gpa) || 0;

    let score = 0;
    if (ieltsVal >= university.ieltsMin) score += 30;
    if (satVal >= university.satMin) score += 30;
    if (gpaVal >= university.gpaMin) score += 40;

    // Add some randomness/weighting
    score = Math.min(100, score * (university.acceptanceRate / 50 + 0.5));
    setCalcResult(Math.round(score));
  };

  const filteredPrograms = university.programs.filter((p) =>
    p.name.toLowerCase().includes(programSearch.toLowerCase()),
  );

  const checklistItems = university.documents;
  const completedItems = checklists[university.id]
    ? Object.values(checklists[university.id]).filter(Boolean).length
    : 0;
  const progress = Math.round((completedItems / checklistItems.length) * 100);

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className="container">
          <nav className={styles.breadcrumb}>
            <Link to="/">{t("nav.home")}</Link>
            <ChevronRight size={14} />
            <Link to="/universities">{t("nav.universities")}</Link>
            <ChevronRight size={14} />
            <span>{university.name}</span>
          </nav>

          <div className={styles.header__content}>
            <div className={styles.header__main}>
              <div className={styles.rankBadge}>QS #{university.qsRank}</div>
              <h1>{university.name}</h1>
              <div className={styles.meta}>
                <MapPin size={18} /> {university.city}, {university.country}
                <span className={styles.dot}>•</span>
                <Calendar size={18} /> {t("detail.founded")}:{" "}
                {university.founded}
              </div>
            </div>
            <div className={styles.header__actions}>
              <a
                href={university.website}
                target="_blank"
                rel="noreferrer"
                className={styles.outlineBtn}
              >
                <ExternalLink size={18} /> {t("detail.website")}
              </a>
              <button
                className={clsx(
                  styles.outlineBtn,
                  isCompared && styles["outlineBtn--active"],
                )}
                onClick={() => toggleCompare(university.id)}
              >
                <Copy size={18} />{" "}
                {isCompared
                  ? t("detail.removeFromCompare")
                  : t("detail.addToCompare")}
              </button>
              <button
                className={clsx(
                  styles.saveBtn,
                  isSaved && styles["saveBtn--active"],
                )}
                onClick={() => toggleSaved(university.id)}
              >
                <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
                {isSaved ? t("detail.saved") : t("detail.save")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabsWrapper}>
        <div className="container">
          <div className={styles.tabs}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={clsx(
                  styles.tab,
                  activeTab === tab.id && styles["tab--active"],
                )}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="tab-underline"
                    className={styles.underline}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container">
        <div className={styles.layout}>
          <div className={styles.mainContent}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "general" && (
                  <div className={styles.tabContent}>
                    <section>
                      <h2>{t("detail.tabs.general")}</h2>
                      <p className={styles.description}>
                        {university.description}
                      </p>
                    </section>
                    <section>
                      <h3>{t("detail.keyFacts")}</h3>
                      <div className={styles.factsGrid}>
                        <div className={styles.factCard}>
                          <Users size={24} />
                          <div>
                            <div className={styles.factLabel}>
                              {t("detail.students")}
                            </div>
                            <div className={styles.factValue}>
                              {university.totalStudents.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className={styles.factCard}>
                          <CheckCircle2 size={24} />
                          <div>
                            <div className={styles.factLabel}>
                              {t("detail.acceptance")}
                            </div>
                            <div className={styles.factValue}>
                              {university.acceptanceRate}%
                            </div>
                          </div>
                        </div>
                        <div className={styles.factCard}>
                          <Globe size={24} />
                          <div>
                            <div className={styles.factLabel}>Language</div>
                            <div className={styles.factValue}>
                              {university.language}
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                )}

                {activeTab === "programs" && (
                  <div className={styles.tabContent}>
                    <div className={styles.programHeader}>
                      <h2>{t("detail.tabs.programs")}</h2>
                      <div className={styles.programSearch}>
                        <Search size={18} />
                        <input
                          type="text"
                          placeholder="Dastur qidirish..."
                          value={programSearch}
                          onChange={(e) => setProgramSearch(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className={styles.tableWrapper}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>Program</th>
                            <th>Daraja</th>
                            <th>Til</th>
                            <th>Muddat</th>
                            <th>Narx</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredPrograms.map((p, i) => (
                            <tr key={i}>
                              <td className={styles.bold}>{p.name}</td>
                              <td>{p.degree}</td>
                              <td>{p.language}</td>
                              <td>{p.duration}</td>
                              <td>${p.price.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === "requirements" && (
                  <div className={styles.tabContent}>
                    <section>
                      <h2>{t("detail.tabs.requirements")}</h2>
                      <div className={styles.reqGrid}>
                        <div className={styles.reqCard}>
                          <div className={styles.reqCard__title}>IELTS</div>
                          <div className={styles.reqCard__value}>
                            {university.ieltsMin}
                          </div>
                          <div className={styles.dots}>
                            {[1, 2, 3, 4, 5].map((d) => (
                              <div
                                key={d}
                                className={clsx(
                                  styles.dot,
                                  d <= Math.floor(university.ieltsMin / 2) &&
                                    styles["dot--active"],
                                )}
                              />
                            ))}
                          </div>
                        </div>
                        <div className={styles.reqCard}>
                          <div className={styles.reqCard__title}>SAT</div>
                          <div className={styles.reqCard__value}>
                            {university.satMin}
                          </div>
                        </div>
                        <div className={styles.reqCard}>
                          <div className={styles.reqCard__title}>GPA</div>
                          <div className={styles.reqCard__value}>
                            {university.gpaMin}
                          </div>
                        </div>
                      </div>
                    </section>

                    <section className={styles.checklistSection}>
                      <div className={styles.checklistHeader}>
                        <h3>{t("myPlan.checklist")}</h3>
                        <div className={styles.progressWrapper}>
                          <div className={styles.progressBar}>
                            <div
                              className={styles.progressFill}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span>{progress}%</span>
                        </div>
                      </div>
                      <div className={styles.checklist}>
                        {university.documents.map((doc) => (
                          <label key={doc.id} className={styles.checkItem}>
                            <input
                              type="checkbox"
                              checked={
                                checklists[university.id]?.[doc.id] || false
                              }
                              onChange={() =>
                                toggleChecklistItem(university.id, doc.id)
                              }
                            />
                            <span>{doc.name}</span>
                          </label>
                        ))}
                      </div>
                    </section>
                  </div>
                )}

                {activeTab === "students" && (
                  <div className={styles.tabContent}>
                    <h2>{t("detail.tabs.students")}</h2>
                    <div className={styles.storyGrid}>
                      {university.stories.map((story, i) => (
                        <div key={i} className={styles.storyCard}>
                          <p className={styles.storyCard__quote}>
                            "{story.quote[i18n.language as "uz" | "ru" | "en"]}"
                          </p>
                          <div className={styles.storyCard__author}>
                            <div className={styles.avatar}>{story.name[0]}</div>
                            <div>
                              <div className={styles.name}>{story.name}</div>
                              <div className={styles.meta}>
                                {story.year} • {story.field}
                              </div>
                            </div>
                            <div className={styles.score}>{story.score}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "calculator" && (
                  <div className={styles.tabContent}>
                    <div className={styles.calculator}>
                      <div className={styles.calcHeader}>
                        <h2>{t("detail.calculatorTitle")}</h2>
                        <p>{t("detail.calculatorDesc")}</p>
                      </div>
                      <div className={styles.calcForm}>
                        <div className={styles.inputGroup}>
                          <label>IELTS</label>
                          <input
                            type="number"
                            step="0.5"
                            placeholder="Masalan: 7.0"
                            value={calcData.ielts}
                            onChange={(e) =>
                              setCalcData({
                                ...calcData,
                                ielts: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className={styles.inputGroup}>
                          <label>SAT</label>
                          <input
                            type="number"
                            placeholder="Masalan: 1450"
                            value={calcData.sat}
                            onChange={(e) =>
                              setCalcData({ ...calcData, sat: e.target.value })
                            }
                          />
                        </div>
                        <div className={styles.inputGroup}>
                          <label>GPA</label>
                          <input
                            type="number"
                            step="0.1"
                            placeholder="Masalan: 3.8"
                            value={calcData.gpa}
                            onChange={(e) =>
                              setCalcData({ ...calcData, gpa: e.target.value })
                            }
                          />
                        </div>
                        <button
                          className={styles.calcBtn}
                          onClick={handleCalculate}
                        >
                          {t("detail.calculate")}
                        </button>
                      </div>

                      {calcResult !== null && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={styles.calcResult}
                        >
                          <div className={styles.resultCircle}>
                            <div className={styles.resultValue}>
                              {calcResult}%
                            </div>
                            <div className={styles.resultLabel}>
                              {t("detail.result")}
                            </div>
                          </div>
                          <div className={styles.advice}>
                            <h4>{t("detail.advice")}</h4>
                            <p>
                              {calcResult > 70
                                ? "Sizning imkoniyatlaringiz juda yuqori! Hujjatlarni tayyorlashni boshlashingiz mumkin."
                                : "Imkoniyatlaringizni oshirish uchun IELTS yoki SAT ballaringizni yaxshilashni tavsiya qilamiz."}
                            </p>
                            <table className={styles.breakdownTable}>
                              <tbody>
                                <tr>
                                  <td>IELTS ({university.ieltsMin}+)</td>
                                  <td>
                                    {parseFloat(calcData.ielts) >=
                                    university.ieltsMin
                                      ? "✅"
                                      : "❌"}
                                  </td>
                                </tr>
                                <tr>
                                  <td>SAT ({university.satMin}+)</td>
                                  <td>
                                    {parseInt(calcData.sat) >= university.satMin
                                      ? "✅"
                                      : "❌"}
                                  </td>
                                </tr>
                                <tr>
                                  <td>GPA ({university.gpaMin}+)</td>
                                  <td>
                                    {parseFloat(calcData.gpa) >=
                                    university.gpaMin
                                      ? "✅"
                                      : "❌"}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sticky Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.stickyCard}>
              <div className={styles.sidebarStat}>
                <div className={styles.label}>IELTS Min</div>
                <div className={styles.value}>{university.ieltsMin}</div>
              </div>
              <div className={styles.sidebarStat}>
                <div className={styles.label}>Tuition</div>
                <div className={styles.value}>
                  ${university.tuitionMin.toLocaleString()} - $
                  {university.tuitionMax.toLocaleString()}
                </div>
              </div>
              <div className={styles.sidebarStat}>
                <div className={styles.label}>{t("detail.deadline")}</div>
                <div className={styles.value}>
                  {university.deadlines[0].date}
                </div>
              </div>
              <button className={styles.applyBtn}>
                Hozir ariza topshirish <ArrowRight size={18} />
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default UniversityDetail;
