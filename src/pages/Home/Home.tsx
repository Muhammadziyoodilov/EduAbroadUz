import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./Home.module.scss";
import { clsx } from "clsx";
import SearchBar from "../../components/SearchBar/SearchBar";
import { popularCountries, universities } from "../../data/universities";
import { Link } from "react-router-dom";
import UniversityCard from "../../components/UniversityCard/UniversityCard";
import { CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

const Home = () => {
  const { t, i18n } = useTranslation();
  const featuredUni =
    universities.find((u) => u.qsRank < 50) || universities[0];

  const stats = [
    { label: t("home.stats.universities"), value: 100, suffix: "+" },
    { label: t("home.stats.countries"), value: 14, suffix: "" },
    { label: t("home.stats.students"), value: 5000, suffix: "+" },
    { label: t("home.stats.scholarships"), value: 200, suffix: "+" },
  ];

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <section className={clsx(styles.hero)}>
        <div className={clsx("container", styles.hero__container)}>
          <div className={styles.hero__content}>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={styles.hero__label}
            >
              {t("home.heroLabel")}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={styles.hero__title}
            >
              {t("home.heroTitle")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={styles.hero__desc}
            >
              {t("home.heroDesc")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={styles.hero__search}
            >
              <SearchBar />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className={styles.hero__popular}
            >
              <span>{t("home.popularCountries")}:</span>
              <div className={styles.hero__countryLinks}>
                {popularCountries.map((c) => (
                  <Link key={c.code} to={`/universities?country=${c.name}`}>
                    {c.flag} {c.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
          <div className={styles.hero__featured}>
            <div className={styles.featuredLabel}>Featured University</div>
            <UniversityCard university={featuredUni} />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className={clsx("section-padding", styles.howItWorks)}>
        <div className="container">
          <h2 className={styles.sectionTitle}>{t("home.howItWorks")}</h2>
          <div className={styles.steps}>
            {(
              t("home.howItWorksSteps", { returnObjects: true }) as string[]
            ).map((step, i) => (
              <div key={i} className={styles.step}>
                <div className={styles.step__number}>{i + 1}</div>
                <p className={styles.step__text}>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Countries */}
      <section className={clsx("section-padding", styles.countries)}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              {t("home.featuredCountries")}
            </h2>
            <Link to="/universities" className={styles.viewAll}>
              Barchasini ko'rish <ArrowRight size={16} />
            </Link>
          </div>
          <div className={styles.countryGrid}>
            {popularCountries.map((c, i) => (
              <Link
                key={c.code}
                to={`/universities?country=${c.name}`}
                className={styles.countryCard}
              >
                <span className={styles.countryCard__flag}>{c.flag}</span>
                <h3 className={styles.countryCard__name}>{c.name}</h3>
                <p className={styles.countryCard__count}>
                  {universities.filter((u) => u.country === c.name).length}{" "}
                  universitet
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className={styles.stats}>
        <div className={clsx("container", styles.stats__container)}>
          {stats.map((stat, i) => (
            <div key={i} className={styles.statItem}>
              <div className={styles.statItem__value}>
                {stat.value}
                {stat.suffix}
              </div>
              <div className={styles.statItem__label}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Student Stories */}
      <section className={clsx("section-padding", styles.stories)}>
        <div className="container">
          <h2 className={styles.sectionTitle}>{t("home.studentStories")}</h2>
          <div className={styles.storyGrid}>
            {universities.slice(0, 3).map((u, i) => {
              const story = u.stories[0];
              return (
                <div key={i} className={styles.storyCard}>
                  <p className={styles.storyCard__quote}>
                    "{story.quote[i18n.language as "uz" | "ru" | "en"]}"
                  </p>
                  <div className={styles.storyCard__author}>
                    <div className={styles.avatar}>{story.name[0]}</div>
                    <div>
                      <div className={styles.name}>{story.name}</div>
                      <div className={styles.uni}>{u.name}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
