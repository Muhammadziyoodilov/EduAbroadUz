import universityData from './universities.json';
import grantData from './grants.json';

export const universities = universityData;
export const grants = grantData;

// Dynamically derive countries from the university data
export const allCountries = Array.from(
  new Map(universities.map(u => [u.countryCode, { name: u.country, code: u.countryCode, flag: u.flag }])).values()
).sort((a, b) => a.name.localeCompare(b.name));

export const popularCountries = allCountries.slice(0, 6);

// Dynamically derive fields
export const allFields = Array.from(new Set(universities.flatMap(u => u.fields))).sort();

// Dynamically derive degrees
export const allDegrees = Array.from(new Set(universities.flatMap(u => u.degrees))).sort();
