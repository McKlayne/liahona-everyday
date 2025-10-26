# Liahona Everyday - Book of Mormon Study App

A personal study platform designed to deepen your love and understanding of the Book of Mormon through topic-based, contextual study across different areas of life.

## Overview

Liahona Everyday helps you organize and track your Book of Mormon study by connecting scriptures and gospel resources to real-life scenarios in Personal, Marriage, Parenting, Calling, and Work contexts.

### Key Features

- **Topic-Based Organization**: Create study topics categorized by life area (Personal, Marriage, Parenting, Calling, Work)
- **Study Timer**: Track time spent studying each topic
- **Automated Resource Discovery**: Automatically generates suggested sources from churchofjesuschrist.org
- **Progress Tracking**: Monitor completed topics and total study time
- **Beautiful Solarized Dark Theme**: Easy on the eyes for extended study sessions
- **President Nelson's Promise**: Featured on the home page as a reminder of the blessings of daily Book of Mormon study

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/liahona-everyday.git
cd liahona-everyday
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Then edit `.env.local` and configure:
- `AUTH_SECRET`: Generate with `openssl rand -base64 32`
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: Get from [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
- `NEXTAUTH_URL`: Set to `http://localhost:3000` for local development

**Important**: The app requires Google OAuth for authentication. Without proper credentials, you'll get 500 errors on API calls.

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Use

### 1. Create a Topic

Navigate to any category page (Personal, Marriage, Parenting, Calling, or Work) and click "Add Topic". Fill in:
- **Title**: A brief phrase describing your topic
- **Description**: Explain the scenario, desire, or question you're studying

The app will automatically generate suggested Book of Mormon passages, General Conference talks, and other Gospel Library resources.

### 2. Study Your Topic

Click on any topic to open the study view where you can:
- **Start Timer**: Click the play button to track your study time
- **View Sources**: Access suggested scriptures and conference talks
- **Add Custom Sources**: Include additional resources you discover
- **Mark Complete**: Track which topics you've finished studying

### 3. Monitor Progress

Return to the Home page to see:
- Total topics created
- Topics completed
- Total time spent studying
- Breakdown by category

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: CSS Modules with Solarized Dark theme
- **Authentication**: NextAuth.js with Google OAuth
- **Storage**: File-based (development) / Vercel Postgres (production)
- **Content**: Links to churchofjesuschrist.org resources

## Data Storage

The app uses an adaptive storage strategy:
- **Development**: File-based storage in the `/data` directory for quick local development
- **Production**: Vercel Postgres database for scalable, reliable cloud storage
- **Authentication**: Secure user authentication via Google OAuth
- Data is automatically synced to the appropriate storage backend based on environment

## Content Sources

The app generates search links to official Church resources including:
- Book of Mormon scriptures
- General Conference talks
- Gospel Library materials

**Note**: The Church of Jesus Christ of Latter-day Saints does not provide a public API. This app creates helpful search links to churchofjesuschrist.org where you can find relevant study materials.

## Future Enhancements

Potential features for future versions:
- Cloud sync across devices
- Export/import study data
- Notes and highlights for each source
- Study reminders
- Integration with Open Scripture API
- Sharing topics with family/friends

## Contributing

This is a personal project, but suggestions and contributions are welcome! Please feel free to open an issue or submit a pull request.

## License

See the LICENSE file for details.

## Acknowledgments

- Inspired by President Russell M. Nelson's invitation to study the Book of Mormon daily
- Uses the Solarized color scheme by Ethan Schoonover
- Built with gratitude for the Book of Mormon and its teachings

---

"My dear brothers and sisters, I promise that as you prayerfully study the Book of Mormon every day, you will make better decisions—every day. I promise that as you ponder what you study, the windows of heaven will open, and you will receive answers to your own questions and direction for your own life." - President Russell M. Nelson 
