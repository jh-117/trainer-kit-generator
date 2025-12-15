# TrainerKit GenAI - Complete Documentation

## Overview

**TrainerKit GenAI** is an AI-powered training content generation platform that helps trainers, educators, and instructional designers create comprehensive training materials in minutes. The application leverages OpenAI's GPT-4 to automatically generate complete training kits including slides, flashcards, handouts, and facilitator guides.

## Table of Contents

- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [User Flow](#user-flow)
- [Generated Content](#generated-content)
- [File Upload & Reference Material](#file-upload--reference-material)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Usage Guide](#usage-guide)
- [API Integration](#api-integration)
- [Development Notes](#development-notes)

---

## Key Features

### 1. AI-Powered Training Plan Generation
- Input industry and topic to generate customized training plans
- Automatically creates learning objectives, modules, and target audience analysis
- Provides suggested enhancements for training effectiveness

### 2. Reference Material Support
- Upload PDF, DOCX, or TXT files as reference material
- AI uses document content to generate more accurate and relevant training content
- Supports files up to 10MB with automatic text extraction
- Content truncation for large documents (50,000 character limit)

### 3. Complete Training Kit Generation
Generate comprehensive training materials including:
- **Presentation Slides**: 8-12 professional slides with speaker notes
- **Flashcards**: 10-15 interactive flashcards for knowledge retention
- **Participant Handout**: Detailed markdown document for learners
- **Facilitator Guide**: Complete guide with timing, tips, and activities

### 4. Professional PowerPoint Export
- Download presentations as PPTX files
- Clean, professional design with blue color scheme
- Two-tone layout with header bars and accent elements
- Includes speaker notes for each slide
- Ready-to-use format for training delivery

### 5. Multiple Export Formats
- **PPTX**: PowerPoint presentation
- **PDF**: Downloadable handouts and guides
- **Markdown**: Editable documentation
- **ZIP**: Complete training kit package

### 6. Interactive Content Editing
- Edit slides directly in the interface
- Modify flashcards on the fly
- Real-time preview of changes
- Save customizations before download

### 7. Template Library
- Browse pre-generated training templates
- Quick-start with ready-made content
- Covers various industries and topics

---

## Tech Stack

### Frontend
- **React 19**: UI framework
- **TypeScript**: Type-safe development
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon library
- **React Router DOM**: Navigation
- **React Markdown**: Markdown rendering
- **Remark GFM**: GitHub Flavored Markdown support

### Document Processing
- **pdfjs-dist**: PDF text extraction
- **mammoth**: DOCX/DOC parsing
- **FileReader API**: Text file reading

### Document Generation
- **PptxGenJS**: PowerPoint generation
- **jsPDF**: PDF generation
- **JSZip**: ZIP file creation

### Backend
- **Supabase Edge Functions**: Serverless API endpoints
- **Deno**: Runtime for edge functions
- **OpenAI API**: GPT-4 powered content generation

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   User Interface                     │
│  (React Components + TypeScript + Tailwind CSS)     │
└──────────────────┬──────────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────────────┐
│              File Processing Layer                   │
│  (PDF Parser + DOCX Parser + Text Reader)           │
└──────────────────┬──────────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────────────┐
│           Supabase Edge Functions                    │
│  ┌─────────────────────┬─────────────────────────┐  │
│  │ generate-training-  │  generate-full-kit      │  │
│  │       plan          │                         │  │
│  └──────────┬──────────┴─────────────┬───────────┘  │
└─────────────┼────────────────────────┼──────────────┘
              ↓                        ↓
┌─────────────────────────────────────────────────────┐
│                  OpenAI API                          │
│             (GPT-4o-mini Model)                      │
└──────────────────┬──────────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────────────┐
│            Document Generation Layer                 │
│  (PPTX Generator + PDF Generator + ZIP Creator)     │
└─────────────────────────────────────────────────────┘
```

---

## User Flow

### Step 1: Landing Page
- User lands on the homepage
- Two options: "Create New Training Kit" or "Browse Templates"

### Step 2: Input Phase
**Create New Kit:**
- Select industry from dropdown
- Enter training topic
- Optionally upload reference document (PDF/DOCX/TXT)
- Click "Generate Training Plan"

**Browse Templates:**
- View pre-generated templates
- Select a template to use
- Skip to results view

### Step 3: Analyzing Phase
- AI processes input and reference material
- Generates structured training plan
- Typically takes 5-15 seconds

### Step 4: Plan Review
- Review generated training plan:
  - Title and target audience
  - Learning objectives
  - Training modules with durations
  - Suggested enhancements
- Options: "Generate Training Kit" or "Start Over"

### Step 5: Generating Phase
- AI creates complete training kit
- Generates slides, flashcards, handouts, and guides
- Typically takes 15-30 seconds

### Step 6: Results View
- View and interact with generated content:
  - **Slides Tab**: Navigate through presentation slides
  - **Flashcards Tab**: Flip through interactive flashcards
  - **Handout Tab**: Read participant materials
  - **Guide Tab**: Review facilitator instructions
- Edit content as needed
- Download in preferred format

---

## Generated Content

### 1. Training Plan
```typescript
{
  title: string;                    // Overall training title
  targetAudience: string;           // Who this training is for
  learningObjectives: string[];     // 3-5 key objectives
  modules: TrainingModule[];        // 4-6 training modules
  suggestedEnhancements: string[];  // 3-4 improvement ideas
}
```

### 2. Presentation Slides
```typescript
{
  title: string;              // Slide title
  content: string[];          // Bullet points (3-5 per slide)
  speakerNotes: string;       // Presenter notes and guidance
  visualSearchTerm: string;   // Image description for visuals
}
```

### 3. Flashcards
```typescript
{
  front: string;  // Question or term
  back: string;   // Answer or definition
}
```

### 4. Documentation
- **Handout**: Comprehensive participant guide in markdown format
- **Facilitator Guide**: Detailed instructor notes with timing and activities

---

## File Upload & Reference Material

### Supported File Types
- **PDF** (.pdf): Extracts text from all pages
- **DOCX/DOC** (.docx, .doc): Parses Word documents
- **TXT** (.txt): Reads plain text files

### How It Works

1. **File Selection**: User uploads document via drag-and-drop or file picker
2. **Text Extraction**:
   - PDF: Uses pdfjs-dist to extract text from each page
   - DOCX: Uses mammoth to parse and extract text
   - TXT: Reads file content directly
3. **Content Processing**:
   - Validates file size (max 10MB)
   - Extracts text content
   - Truncates if over 50,000 characters
   - Checks for empty content
4. **AI Integration**: Extracted content is sent to OpenAI with this prompt structure:
   ```
   Industry: [user input]
   Topic: [user input]

   Reference Material:
   [extracted file content]
   ```
5. **Generation**: AI uses reference material to create more accurate, context-aware training content

### Benefits
- **More Relevant Content**: AI generates materials specific to your organization
- **Consistent Terminology**: Uses terms and concepts from your documents
- **Accurate Information**: Based on your actual training materials
- **Time Saving**: No need to manually input reference information

---

## Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Supabase account
- OpenAI API key

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd trainerkit-genai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase Edge Functions**

   The project includes two edge functions that need to be deployed:
   - `generate-training-plan`
   - `generate-full-kit`

   Set the OpenAI API key in Supabase:
   ```bash
   # Via Supabase Dashboard:
   # Project Settings > Edge Functions > Secrets
   # Add: OPENAI_API_KEY = your_openai_api_key
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

6. **Build for production**
   ```bash
   npm run build
   ```

---

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://xxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGciOiJIUzI1...` |

### Edge Function Variables

| Variable | Description | Set In |
|----------|-------------|--------|
| `OPENAI_API_KEY` | OpenAI API key for GPT-4 | Supabase Dashboard |

---

## Project Structure

```
trainerkit-genai/
├── components/
│   ├── InputSection.tsx           # Input form for industry/topic/file
│   ├── PlanReview.tsx             # Review generated training plan
│   ├── KitResults.tsx             # Display generated training kit
│   ├── LandingPage.tsx            # Homepage with CTA
│   ├── LibrarySelector.tsx        # Template browser
│   ├── PrivacyPolicy.jsx          # Privacy policy page
│   ├── BackgroundMusic.jsx        # Background audio component
│   └── kit/
│       ├── SlideView.tsx          # Presentation slide viewer
│       ├── FlashcardView.tsx      # Interactive flashcards
│       ├── MarkdownView.tsx       # Handout/guide viewer
│       └── EditSlideModal.tsx     # Slide editing modal
├── utils/
│   ├── aiGenerator.ts             # API calls to edge functions
│   ├── fileParser.ts              # PDF/DOCX/TXT parsing
│   ├── pptxGenerator.ts           # PowerPoint generation
│   ├── pdfGenerator.ts            # PDF generation
│   └── downloadKit.ts             # ZIP package creation
├── supabase/
│   └── functions/
│       ├── generate-training-plan/
│       │   └── index.ts           # Training plan generation API
│       └── generate-full-kit/
│           └── index.ts           # Full kit generation API
├── assets/
│   ├── kadoshAI.png               # App logo
│   └── trainer-theme.mp3          # Background music
├── App.tsx                        # Main application component
├── types.ts                       # TypeScript type definitions
├── index.tsx                      # Application entry point
├── vite.config.ts                 # Vite configuration
├── tsconfig.json                  # TypeScript configuration
└── package.json                   # Dependencies and scripts
```

---

## Usage Guide

### Creating a Training Kit

1. **Navigate to Input**
   - Click "Get Started" from homepage
   - Or click "TrainerKit GenAI" logo to return to input

2. **Fill in Details**
   - Select industry (e.g., Technology, Healthcare, Finance)
   - Enter specific topic (e.g., "Agile Methodology")
   - Upload reference document (optional but recommended)

3. **Review Plan**
   - Check generated learning objectives
   - Review module breakdown
   - Confirm target audience
   - Click "Generate Training Kit" or "Start Over"

4. **Explore Content**
   - **Slides**: Click through presentation, edit as needed
   - **Flashcards**: Click to flip, review all cards
   - **Handout**: Read participant materials
   - **Guide**: Review facilitator instructions

5. **Download Materials**
   - Click "Download as PowerPoint" for PPTX
   - Click "Download Complete Kit" for ZIP with all files
   - Individual PDFs available for handouts and guides

### Using Templates

1. Click "Browse Templates" from homepage
2. Browse available pre-generated kits
3. Click on a template to view
4. Edit and download as needed

### Editing Content

**Edit Slides:**
- Click edit icon on any slide
- Modify title and bullet points
- Save changes
- Changes apply to PPTX download

**Edit Flashcards:**
- Changes are currently view-only
- Future update will add editing capability

---

## API Integration

### Edge Function: generate-training-plan

**Endpoint:** `POST /functions/v1/generate-training-plan`

**Request Body:**
```json
{
  "industry": "Technology",
  "topic": "Agile Methodology",
  "fileContent": "Optional extracted text from uploaded document"
}
```

**Response:**
```json
{
  "title": "Agile Methodology in Technology: Welcome & Overview",
  "targetAudience": "Software developers and project managers",
  "learningObjectives": [
    "Understand core Agile principles",
    "Apply Scrum framework effectively"
  ],
  "modules": [
    {
      "title": "Introduction to Agile",
      "description": "Overview of Agile principles",
      "durationMinutes": 30
    }
  ],
  "suggestedEnhancements": [
    "Include hands-on exercises",
    "Add real-world case studies"
  ]
}
```

### Edge Function: generate-full-kit

**Endpoint:** `POST /functions/v1/generate-full-kit`

**Request Body:**
```json
{
  "title": "Training title",
  "targetAudience": "Target audience",
  "learningObjectives": ["objective 1", "objective 2"],
  "modules": [
    {
      "title": "Module title",
      "description": "Module description",
      "durationMinutes": 30
    }
  ],
  "suggestedEnhancements": ["enhancement 1"]
}
```

**Response:**
```json
{
  "slides": [
    {
      "title": "Slide title",
      "content": ["Bullet 1", "Bullet 2"],
      "speakerNotes": "Presenter guidance",
      "visualSearchTerm": "Image description"
    }
  ],
  "flashcards": [
    {
      "front": "Question",
      "back": "Answer"
    }
  ],
  "handoutMarkdown": "# Handout content...",
  "facilitatorGuideMarkdown": "# Guide content...",
  "backgroundImagePrompt": "Image description"
}
```

---

## Development Notes

### Document Parsing

The `fileParser.ts` utility handles multiple file formats:

- **PDF Parsing**: Uses `pdfjs-dist` with web worker for text extraction
- **DOCX Parsing**: Uses `mammoth` library for Word document processing
- **TXT Files**: Direct FileReader API usage
- **Error Handling**: Graceful fallback if parsing fails
- **Content Limits**: 50,000 characters max, truncates with warning

### PowerPoint Generation

The `pptxGenerator.ts` creates professional presentations:

- **Layout**: 16:9 widescreen format
- **Title Slide**: Dark background with centered title and accent line
- **Content Slides**: Two-tone design with header bar
- **Typography**: Calibri font, properly sized text
- **Color Scheme**: Blue theme (not purple/indigo)
- **Bullet Points**: Properly formatted with spacing
- **Speaker Notes**: Included for all slides

### Best Practices

1. **File Size Limits**: Keep uploaded files under 10MB
2. **Content Quality**: More detailed topics generate better results
3. **Reference Materials**: Well-structured documents yield best AI output
4. **Error Handling**: Always check console logs for debugging
5. **Testing**: Test with various file types before production use

### Known Limitations

1. Edge functions have 60-second timeout (usually sufficient)
2. Large reference documents may be truncated
3. PPTX uses solid colors instead of images for reliability
4. Flashcard editing not yet implemented
5. Template library is hardcoded (future: database storage)

---

## Future Enhancements

- [ ] Database storage for user-generated kits
- [ ] User authentication and saved libraries
- [ ] Collaborative editing features
- [ ] More export formats (Google Slides, Keynote)
- [ ] Custom branding and themes
- [ ] Analytics and usage tracking
- [ ] Multi-language support
- [ ] Advanced AI models (GPT-4, Claude)
- [ ] Video content generation
- [ ] Assessment and quiz generation

---

## Support & Contributing

For issues, feature requests, or contributions:
1. Check existing issues
2. Create detailed bug reports
3. Submit pull requests with clear descriptions
4. Follow code style guidelines
5. Add tests for new features

---

## License

Copyright © 2024 TrainerKit GenAI. All rights reserved.

---

## Credits

Built with:
- React, TypeScript, and Vite
- OpenAI GPT-4 API
- Supabase Edge Functions
- PptxGenJS, jsPDF, and other open-source libraries

---

*Last Updated: December 2024*
