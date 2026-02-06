import type { CVData, PersonalInfo, AboutContent } from '@/types';

const EMPTY_PERSONAL: PersonalInfo = {
  name: '',
  fullName: '',
  location: '',
  phone: '',
  email: '',
  linkedin: '',
  github: '',
};

const EMPTY_ABOUT: AboutContent = {
  quote: '',
  specialties: [],
  highlights: {
    educationValue: '',
    specializationValue: '',
    locationValue: '',
    languagesValue: '',
  },
};

export const EMPTY_CV_DATA: CVData = {
  personal: EMPTY_PERSONAL,
  profile: '',
  about: EMPTY_ABOUT,
  skills: [],
  education: [],
  certificates: [],
  experience: [],
  projects: [],
  languages: [],
};

export function mergeCvData(base: CVData, override?: Partial<CVData>): CVData {
  if (!override) return base;

  return {
    personal: {
      ...base.personal,
      ...(override.personal ?? {}),
    },
    profile: override.profile ?? base.profile,
    about: {
      ...base.about,
      ...(override.about ?? {}),
      highlights: {
        ...base.about.highlights,
        ...(override.about?.highlights ?? {}),
      },
    },
    skills: override.skills?.length ? override.skills : base.skills,
    education: override.education?.length ? override.education : base.education,
    certificates: override.certificates?.length ? override.certificates : base.certificates,
    experience: override.experience?.length ? override.experience : base.experience,
    projects: override.projects?.length ? override.projects : base.projects,
    languages: override.languages?.length ? override.languages : base.languages,
  };
}

