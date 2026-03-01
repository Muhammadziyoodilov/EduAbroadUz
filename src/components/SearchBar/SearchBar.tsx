import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ChevronDown } from 'lucide-react';
import { allCountries } from '../../data/universities';
import styles from './SearchBar.module.scss';
import { clsx } from 'clsx';

const SearchBar = ({ className }: { className?: string }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (country) params.set('country', country);
    navigate(`/universities?${params.toString()}`);
  };

  return (
    <form className={clsx(styles.searchBar, className)} onSubmit={handleSearch}>
      <div className={styles.inputGroup}>
        <Search size={20} className={styles.icon} />
        <input
          type="text"
          placeholder={t('home.searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className={styles.divider} />
      <div className={styles.selectGroup}>
        <MapPin size={20} className={styles.icon} />
        <select value={country} onChange={(e) => setCountry(e.target.value)}>
          <option value="">{t('home.countrySelect')}</option>
          {allCountries.map((c) => (
            <option key={c.code} value={c.name}>
              {c.flag} {c.name}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className={styles.chevron} />
      </div>
      <button type="submit" className={styles.submitBtn}>
        {t('universities.search')}
      </button>
    </form>
  );
};

export default SearchBar;
