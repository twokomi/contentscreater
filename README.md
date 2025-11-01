# YCPA - YouTube Content Producer App

> AI-powered YouTube content creation assistant for scriptwriting, trend analysis, and shorts generation

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Status](https://img.shields.io/badge/status-MVP-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🎯 Overview

YCPA (YouTube Content Producer App) is a comprehensive web application designed to help content creators produce professional YouTube videos efficiently. It provides AI-powered script generation, trend analysis, SEO optimization, and shorts creation tools.

### Key Features

✅ **Currently Implemented (MVP Mode)**

- ✨ **Template-Based Script Generation** - Create professional video scripts without API keys
- 📊 **Trend Analysis** - Analyze keyword trends with mock data visualization
- 🎬 **Project Management** - Organize multiple video projects with status tracking
- 📝 **Script Editor** - Edit opening, body steps, and ending sections
- 🎯 **Persona-Based Angles** - Generate multiple content angles for different audiences
- 🔗 **SEO Optimization** - Auto-generate titles, descriptions, hashtags, and chapters
- 📱 **Shorts Generator** - Convert longform content into 3 short-form variations (15-60s)
- 💼 **Product Integration** - Add affiliate/product links with automatic UTM tracking
- 🎨 **B-roll Hints** - Get keyword suggestions for B-roll footage
- 📥 **Export Functions** - Download scripts as TXT, SRT (subtitles), or JSON
- 🌓 **Dark Mode** - Full light/dark theme support
- ⌨️ **Keyboard Shortcuts** - Power user features (Ctrl+S, Ctrl+K, J/K navigation)
- 💾 **Auto-save** - 2-second debounced auto-save with status indicator

## 🚀 Quick Start

### Installation

No installation required! This is a static web application using CDN resources.

1. Clone the repository or download files
2. Open `index.html` in a modern web browser
3. Start creating content!

### Usage

#### 1. Create a New Project

1. Navigate to the **Projects** tab
2. Fill in the project details:
   - **Topic**: Your video topic/title
   - **Length**: Short (1-3 min), Medium (3-8 min), or Long (8-15 min)
   - **Tone**: Casual, Professional, Energetic, or Educational
   - **Target Audience**: Who is this content for?
3. Click **Generate** to create your project

#### 2. Edit Your Script

1. Double-click on a project to expand it
2. Navigate through tabs: Script, Angles, SEO, Shorts, Product
3. Edit script sections (Opening, Body Steps, Ending)
4. Auto-save activates after 2 seconds of inactivity
5. Click **Save Script** to manually save changes

#### 3. Generate Shorts

1. Open a project detail panel
2. Go to the **Shorts** tab
3. Click **Generate Shorts (3 variations)**
4. Get 3 different short-form video scripts (15s, 30s, 45s)

#### 4. Analyze Trends

1. Navigate to the **Trends** tab
2. Enter a keyword to analyze
3. Select region and time range
4. Click **Analyze** to see:
   - Interest over time chart
   - Top related queries
   - Rising queries
   - Content recommendations (Go/Wait/Seasonal)
   - Persona-based angles
5. Click **Create Project from This Trend** to start a new project

#### 5. Export Your Content

- **TXT**: Download full script as plain text
- **SRT**: Export subtitles with timestamps
- **JSON**: Export complete project data

## 📁 Project Structure

```
ycpa-web/
├── index.html              # Main application entry point
├── css/
│   └── main.css           # Custom styles and theme
├── js/
│   ├── main.js            # Application initialization & routing
│   ├── utils.js           # Utility functions (UUID, date, toast, etc.)
│   ├── storage.js         # Table API integration
│   ├── templates.js       # Template-based content generation
│   ├── projects.js        # Projects module (CRUD, editing)
│   └── trends.js          # Trends analysis module
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore rules
├── package.json           # Project metadata
└── README.md             # This file
```

## 🗄️ Data Models

The application uses the following data models (Table API):

### Projects
- `id`, `topic`, `audience`, `tone`, `length`, `status`, `createdAt`, `updatedAt`

### Scripts
- `id`, `projectId`, `opening`, `bodyJson`, `ending`, `fullMarkdown`, `wordCount`, `version`

### Angles
- `id`, `projectId`, `persona`, `angleTitle`, `hook`, `thumbnailCopy`

### CTAs (Call-to-Actions)
- `id`, `projectId`, `timing`, `text`, `onScreenText`, `destination`

### SEO
- `id`, `projectId`, `titleA`, `titleB`, `description`, `hashtagsJson`, `chaptersJson`

### Products
- `id`, `projectId`, `name`, `description`, `url`, `buttonText`, `utm`

### Shorts
- `id`, `projectId`, `durationSec`, `hook`, `captionsJson`, `overlayTextsJson`

### Asset Hints
- `id`, `projectId`, `brollKeywordsJson`, `subtitleCuesJson`

### Trend Queries
- `id`, `keyword`, `locale`, `range`, `resultJson`, `createdAt`

## ⌨️ Keyboard Shortcuts

- **Ctrl/Cmd + S**: Save current script
- **Ctrl/Cmd + K**: Open command palette
- **J**: Navigate to next item (in list view)
- **K**: Navigate to previous item (in list view)
- **Escape**: Close modals/panels

## 🎨 Features in Detail

### Template-Based Generation (MVP Mode)

The application works **without any API keys** by using intelligent rule-based templates:

- **Hook Templates**: Different hooks based on tone (casual, professional, energetic, educational)
- **Body Structure**: Automatically generates steps based on video length
- **CTA Variations**: Multiple call-to-action timings (opening, mid, ending)
- **SEO Patterns**: Auto-generates titles, descriptions, and hashtags
- **Shorts Logic**: Extracts key moments and creates 3 variations

### Trend Analysis

- **Mock Data Generation**: Realistic trend visualization without API calls
- **Volatility Calculation**: Analyzes search interest stability
- **Recommendation Engine**: Go/Wait/Seasonal suggestions
- **Related Queries**: Top and rising search terms
- **Persona Angles**: Beginner/Intermediate/Advanced content angles

### Product Monetization

- **Auto UTM Tracking**: Automatically adds `utm_source=ycpa&utm_medium=short&utm_campaign={projectId}`
- **Multiple Placements**: Endscreen, description, pinned comment suggestions
- **Link Verification**: Ensures proper URL formatting

## 🔄 Status & Roadmap

### Current Status: MVP Mode ✅

All core features are fully functional without API keys.

### Upcoming Features (Pro Mode) 🚧

- 🤖 **OpenAI Integration**: GPT-4 powered script generation
- 📊 **YouTube Data API**: Real trend data and search volumes
- 🔍 **Google Trends API**: Actual keyword trend analysis
- 🎥 **Video Analysis**: Analyze top-performing videos
- 📈 **Analytics Dashboard**: Track project performance
- 🔐 **User Authentication**: Multi-user support
- ☁️ **Cloud Sync**: Cross-device project synchronization
- 🎨 **Thumbnail Generator**: AI-powered thumbnail design
- 🗣️ **Voice-over Scripts**: Audio timing optimization

### Enhancement Requests

- [ ] Multi-language support
- [ ] Team collaboration features
- [ ] Version history with rollback
- [ ] Content calendar integration
- [ ] Advanced SEO scoring
- [ ] Competitor analysis
- [ ] Batch operations
- [ ] Custom template creation

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Optional: For Pro Mode features
OPENAI_API_KEY=         # OpenAI API key for AI generation
YOUTUBE_API_KEY=        # YouTube Data API key
GOOGLE_API_KEY=         # Google Trends API key
APP_URL=                # Your application URL
```

**Note**: The MVP mode works perfectly without any API keys!

## 🌐 API Integration

### Table API Endpoints

The application uses relative URLs for the built-in Table API:

- `GET tables/{table}` - List records
- `GET tables/{table}/{id}` - Get single record
- `POST tables/{table}` - Create record
- `PATCH tables/{table}/{id}` - Update record
- `DELETE tables/{table}/{id}` - Delete record

All data is automatically persisted using the platform's Table API.

## 🎯 Use Cases

### Content Creators
- Plan video content strategy
- Generate script outlines quickly
- Optimize for SEO
- Repurpose content into shorts

### Marketing Teams
- Create product video scripts
- Analyze trending topics
- A/B test video titles
- Track campaign links

### Educators
- Structure educational content
- Create course video scripts
- Generate learning materials
- Plan video series

### Agencies
- Manage multiple client projects
- Standardize content workflow
- Export deliverables efficiently
- Track project status

## 🎨 Design & UX

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Mode**: Full dark theme support with system preference detection
- **Intuitive Navigation**: Tab-based interface with keyboard shortcuts
- **Real-time Feedback**: Toast notifications and auto-save indicators
- **Accessibility**: Semantic HTML and ARIA labels

## 🔒 Security & Privacy

- ✅ No data sent to external servers (MVP mode)
- ✅ All data stored locally using Table API
- ✅ No cookies or tracking
- ✅ No personal information collected
- ✅ API keys (when used) stored in backend only
- ✅ Client-side operations only

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues, questions, or feature requests, please open an issue in the repository.

## 🙏 Acknowledgments

- **Tailwind CSS**: Utility-first CSS framework
- **Font Awesome**: Icon library
- **Pretendard**: Korean web font
- **Table API**: Built-in data persistence

---

**Made with ❤️ for Content Creators**

Start creating amazing YouTube content today! 🎬✨

