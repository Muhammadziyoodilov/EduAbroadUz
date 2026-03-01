import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, LayoutGrid, List as ListIcon } from 'lucide-react';
import { universities, allCountries, allFields, allDegrees } from '../../data/universities';
import UniversityCard from '../../components/UniversityCard/UniversityCard';
import Pagination from '../../components/Pagination/Pagination';
import styles from './Universities.module.scss';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'motion/react';

const Universities = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Filters from URL
  const search = searchParams.get('search') || '';
  const country = searchParams.get('country') || '';
  const degree = searchParams.get('degree') || '';
  const field = searchParams.get('field') || '';
  const sort = searchParams.get('sort') || 'qs';
  const page = parseInt(searchParams.get('page') || '1');
  const itemsPerPage = 10;

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    if (key !== 'page') {
      newParams.delete('page');
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const filteredUniversities = useMemo(() => {
    let result = universities.filter(u => {
      const matchesSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.country.toLowerCase().includes(search.toLowerCase());
      const matchesCountry = !country || u.country === country;
      const matchesDegree = !degree || u.degrees.includes(degree);
      const matchesField = !field || u.fields.includes(field);
      return matchesSearch && matchesCountry && matchesDegree && matchesField;
    });

    result.sort((a, b) => {
      if (sort === 'qs') return a.qsRank - b.qsRank;
      if (sort === 'ielts') return a.ieltsMin - b.ieltsMin;
      if (sort === 'tuition') return a.tuitionMin - b.tuitionMin;
      if (sort === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

    return result;
  }, [search, country, degree, field, sort]);

  const totalPages = Math.ceil(filteredUniversities.length / itemsPerPage);
  const paginatedUniversities = filteredUniversities.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  return (
    <div className={clsx('container', styles.universitiesPage)}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>{t('nav.universities')}</h1>
          <p>{t('universities.found', { count: filteredUniversities.length })}</p>
        </div>

        <div className={styles.controls}>
          <button className={styles.mobileFilterBtn} onClick={() => setIsSidebarOpen(true)}>
            <Filter size={18} /> {t('universities.filters')}
          </button>

          <div className={styles.sortWrapper}>
            <span>{t('universities.sort.label')}:</span>
            <select value={sort} onChange={(e) => updateFilter('sort', e.target.value)}>
              <option value="qs">{t('universities.sort.qs')}</option>
              <option value="ielts">{t('universities.sort.ielts')}</option>
              <option value="tuition">{t('universities.sort.tuition')}</option>
              <option value="name">{t('universities.sort.name')}</option>
            </select>
          </div>

          <div className={styles.viewToggle}>
            <button 
              className={clsx(view === 'grid' && styles['viewToggle--active'])}
              onClick={() => setView('grid')}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              className={clsx(view === 'list' && styles['viewToggle--active'])}
              onClick={() => setView('list')}
            >
              <ListIcon size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className={styles.layout}>
        <aside className={clsx(styles.sidebar, isSidebarOpen && styles['sidebar--open'])}>
          <div className={styles.sidebar__header}>
            <h3>{t('universities.filters')}</h3>
            <button onClick={clearFilters} className={styles.clearBtn}>{t('universities.clear')}</button>
            <button className={styles.closeBtn} onClick={() => setIsSidebarOpen(false)}><X size={20} /></button>
          </div>

          <div className={styles.filterGroup}>
            <label>{t('universities.search')}</label>
            <div className={styles.searchInput}>
              <Search size={16} />
              <input 
                type="text" 
                value={search} 
                onChange={(e) => updateFilter('search', e.target.value)}
                placeholder="Qidiruv..."
              />
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label>{t('universities.countries')}</label>
            <div className={styles.checkboxList}>
              {allCountries.map(c => (
                <label key={c.code} className={styles.checkboxItem}>
                  <input 
                    type="radio" 
                    name="country"
                    checked={country === c.name}
                    onChange={() => updateFilter('country', c.name)}
                  />
                  <span>{c.flag} {c.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label>{t('universities.degrees')}</label>
            <div className={styles.chipList}>
              {allDegrees.map(d => (
                <button 
                  key={d}
                  className={clsx(styles.chip, degree === d && styles['chip--active'])}
                  onClick={() => updateFilter('degree', degree === d ? '' : d)}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label>{t('universities.fields')}</label>
            <div className={styles.checkboxList}>
              {allFields.map(f => (
                <label key={f} className={styles.checkboxItem}>
                  <input 
                    type="radio" 
                    name="field"
                    checked={field === f}
                    onChange={() => updateFilter('field', f)}
                  />
                  <span>{f}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        <main className={styles.main}>
          <AnimatePresence mode="wait">
            <motion.div 
              key={view + page}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={clsx(view === 'grid' ? styles.grid : styles.list)}
            >
              {paginatedUniversities.map(uni => (
                <UniversityCard key={uni.id} university={uni} view={view} />
              ))}
            </motion.div>
          </AnimatePresence>

          <Pagination 
            currentPage={page} 
            totalPages={totalPages} 
            onPageChange={(p) => updateFilter('page', p.toString())} 
          />
        </main>
      </div>
    </div>
  );
};

export default Universities;
