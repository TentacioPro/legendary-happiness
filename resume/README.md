# Resume Directory

Place your resume PDF file here with the filename: `Abishek_Maharajan_Resume.pdf`

## Instructions

1. Export your resume as a PDF
2. Name it exactly: `Abishek_Maharajan_Resume.pdf`
3. Place it in this directory (`public/resume/`)
4. Update the version in `src/utils/resume-version.ts` when you make changes

## Version Tracking

The resume version is managed in `src/utils/resume-version.ts`. Update the following fields when you upload a new version:

```typescript
export const RESUME_VERSION: ResumeVersion = {
  version: "v2.4.1", // Update this (semantic versioning)
  lastUpdated: "2024-11-29", // Update this (YYYY-MM-DD)
  fileName: "Abishek_Maharajan_Resume.pdf",
};
```

## Accessing the Resume

- **View Online**: Visit `/resume` on your portfolio site
- **Direct Link**: `https://your-domain.com/resume/Abishek_Maharajan_Resume.pdf`

## Security Notes

- The resume is publicly accessible (not indexed by search engines via robots.txt)
- No authentication required for viewing
- Served with appropriate MIME type headers
