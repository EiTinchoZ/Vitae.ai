# CV Data Schema Documentation

This document explains the structure required for `cv-data.ts` to work correctly with Vitae.ai.

## Quick Start

1. Copy `cv-data.example.ts` to `cv-data.ts`
2. Replace placeholder data with your information
3. Run `npm run dev` to preview your CV

## Data Structure

### Personal Information

```typescript
const personal = {
  name: string;        // Display name (e.g., "John Doe")
  fullName: string;    // Full legal name
  location: string;    // City, Country
  phone: string;       // Optional - leave empty for privacy
  email: string;       // Contact email
  linkedin: string;    // Full LinkedIn URL
  github: string;      // Full GitHub URL
};
```

### Profile (Required)

A professional summary paragraph (2-4 sentences) describing your background, expertise, and career goals.

```typescript
profile: string;
```

**Tips:**
- Focus on your main specializations
- Mention key technologies or methodologies
- Keep it concise but impactful

### About Section

```typescript
about: {
  quote: string;           // Personal motto or tagline
  specialties: string[];   // 6-8 key skills/areas
  highlights: {
    educationValue: string;       // e.g., "Software Engineering"
    specializationValue: string;  // e.g., "Full Stack & AI"
    locationValue: string;        // e.g., "San Francisco, USA"
    languagesValue: string;       // e.g., "English, Spanish"
  };
};
```

### Skills

```typescript
skills: Array<{
  name: string;
  category: 'ai' | 'programming' | 'industrial' | 'technology';
}>;
```

**Categories:**
- `ai` - Machine Learning, Deep Learning, NLP, etc.
- `programming` - Languages, frameworks, tools
- `industrial` - Management, processes, methodologies
- `technology` - Platforms, cloud, infrastructure

### Education

```typescript
education: Array<{
  id: string;              // Unique ID (e.g., "edu-1")
  title: string;           // Degree/certification name
  institution: string;     // School/university name
  startYear: number | null;
  endYear: number | string; // Can be year or "Present"
  status: 'completed' | 'in_progress';
  description?: string;    // Optional details
}>;
```

### Certificates

```typescript
certificates: Array<{
  id: string;
  name: string;
  institution: string;
  period: string;          // e.g., "2023" or "Jan 2024"
  status: 'completed' | 'in_progress';
  description: string;
  category: 'master' | 'specialization' | 'technical' | 'languages' | 'programming';
  file?: string;           // Optional: PDF path in /public/cv/
  thumbnail?: string;      // Optional: Preview image path
}>;
```

### Experience

```typescript
experience: Array<{
  id: string;
  company: string;
  position: string;
  location: string;
  startPeriod: string;     // e.g., "Jan 2022"
  endPeriod: string;       // e.g., "Present" or "Dec 2023"
  duration?: string;       // Optional: e.g., "2 years"
  responsibilities: string[];  // 3-5 bullet points
  skills: string[];        // Relevant technologies used
}>;
```

### Projects

```typescript
projects: Array<{
  id: string;
  name: string;
  type: string;            // e.g., "Personal Project", "Hackathon Winner"
  event?: string;          // Optional: Related event/competition
  year: number;
  result?: string;         // Optional: e.g., "1st Place"
  shortDescription: string;    // 1 sentence for cards
  longDescription: string;     // Full description for modal
  features: string[];      // 3-5 key features
  technologies: string[];  // Tech stack used
  impact?: string;         // Optional: Measurable impact
  githubUrl?: string;      // Optional: Repository URL
  demoUrl?: string;        // Optional: Live demo URL
  images?: string[];       // Optional: Screenshot paths
  isHighlighted?: boolean; // Show prominently
}>;
```

### Languages

```typescript
languages: Array<{
  id: string;
  name: string;            // e.g., "English"
  level: string;           // e.g., "C2 Proficient", "Native"
  certification?: string;  // Optional: Related cert
  description: string;     // Brief description
}>;
```

## Multi-language Support

Vitae.ai supports 10 languages. You need to provide translations for each language you want to support:

| Code | Language |
|------|----------|
| `es` | Spanish |
| `en` | English |
| `pt` | Portuguese |
| `de` | German |
| `fr` | French |
| `zh` | Chinese |
| `ja` | Japanese |
| `ar` | Arabic |
| `hi` | Hindi |
| `ko` | Korean |

**Minimum required:** Spanish (`es`) and English (`en`)

For other languages, you can provide minimal data (just `profile`, `about`, and a few `skills`) and they will fall back to Spanish for missing sections.

## Best Practices

1. **Keep IDs consistent** across languages (e.g., `edu-1` should be the same education entry in all languages)

2. **Use professional language** - This will be shown to recruiters

3. **Be specific with impacts** - Use numbers when possible (e.g., "Increased sales by 25%")

4. **Order matters** - List items in reverse chronological order (newest first)

5. **Highlight what matters** - Use `isHighlighted: true` on your best projects

## Validation

Run the build to check for TypeScript errors:

```bash
npm run build
```

If there are type errors, check that all required fields are present and correctly typed.

## Example

See `cv-data.example.ts` for a complete working example with fictional data.
