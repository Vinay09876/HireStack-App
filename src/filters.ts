import { ExperienceLevel, JobType } from './types';

export interface JobFilters {
  location: string;
  company: string;
  jobTypes: JobType[];
  experienceLevels: ExperienceLevel[];
}

export const emptyFilters: JobFilters = {
  location: '',
  company: '',
  jobTypes: [],
  experienceLevels: [],
};

export const ALL_JOB_TYPES: JobType[] = ['Full-time', 'Internship', 'Contract'];
export const ALL_EXPERIENCE_LEVELS: ExperienceLevel[] = ['Entry', 'Mid', 'Senior', 'Lead'];

export function hasActiveFilters(filters: JobFilters): boolean {
  return (
    filters.location !== '' ||
    filters.company !== '' ||
    filters.jobTypes.length > 0 ||
    filters.experienceLevels.length > 0
  );
}
