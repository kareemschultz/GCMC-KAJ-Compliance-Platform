# Changelog

All notable changes to the GCMC-KAJ Compliance Platform will be documented in this file.

## [2.1.0] - 2025-11-21

### Added
- Prisma ORM integration with PostgreSQL database
- Comprehensive database schema covering all business entities
- Database seed script with sample data for development
- Zod validation utilities with Guyana-specific calculators
- NIS contribution calculator (5.6% employee, 8.4% employer)
- PAYE/Income tax calculator with statutory free pay
- VAT calculator (14% rate)
- TIN and NIS number format validators
- Docker configuration with multi-stage build
- Docker Compose setup with PostgreSQL service
- Production configuration files (.gitignore, .env.example)
- Local Content page with dedicated navigation
- Functional file upload system in filing wizard
- Template download functionality for form requirements
- Working notification system with state management
- Comprehensive README with setup instructions

### Fixed
- All TypeScript build errors resolved
- Removed `ignoreBuildErrors` flag from next.config.mjs
- Added missing `ServiceRequest` type to types/index.ts
- Fixed `Progress` component with `indicatorClassName` prop
- Fixed agency type mismatches in filings data
- Fixed unused font variable references in app/layout.tsx
- Fixed hardcoded dates in portal (now dynamic)
- Fixed non-functional download buttons in portal
- Fixed contact support button functionality
- Fixed client detail page to properly use params.id
- Locked package versions from "latest" to specific versions
- Upgraded vaul to React 19 compatible version

### Changed
- Updated Next.js from 14 to 16
- Updated Tailwind CSS to v4
- Updated React to 19.2.0
- Added standalone output mode for Docker deployment
- Enhanced filing wizard with real file upload capability
- Improved notification dropdown with proper state management
- Updated all documentation to reflect current state

### Documentation
- Updated PROJECT_DOCS.md with Next.js 16 and database info
- Updated CONTRIBUTING.md with database workflow
- Updated README.md with correct repo name and setup steps
- Created CHANGELOG.md for version tracking

## [2.0.0] - 2025-11-15

### Added
- Initial platform release
- Client management system
- Tax filing workflows
- NIS and payroll calculators
- Immigration pipeline
- Property management module
- Expediting services tracker
- Training hub
- Partner network directory
- Paralegal document generator
- Client portal
- Appointment booking system

### Technical
- Next.js 14 App Router
- shadcn/ui components
- Mock API layer
- Brand context switching
- Client context system
