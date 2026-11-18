# eBook – Free Online Digital Library

> **Free Books | No Registration | Easy Reading | No Ads While Reading | Revenue Through Advertisements**

A modern, responsive, and completely free online digital library where visitors can discover, browse, and read books without creating an account or logging in.

---

## 🌟 Key Features

### 1. Public Visitor Experience (Zero Login Required)
- **Instant Access:** Read any book directly in your browser without registration, emails, passwords, or paywalls.
- **Distraction-Free Online Reader:** High-performance PDF/EPUB reader powered by PDF.js with:
  - 4 Reading Themes: **Light**, **Sepia**, **Night / Dark**, and **OLED Black**.
  - Font size controls (A- / A+) and custom typography (Serif, Sans, Mono).
  - Page navigation via buttons, keyboard arrow keys (Left/Right), and jump-to-page.
  - Fullscreen mode.
- **100% Ad-Free Reading Screen:** Strictly zero ads appear inside the reading interface.
- **Automatic Progress Persistence:** Automatically records current page and progress percentage in the reader's browser `LocalStorage`.
- **My Shelf:** Private personal library containing:
  - "Continue Reading" resume cards with progress bars.
  - Bookmark manager (save favorite pages and jump back anytime).
  - Chronological reading history.
  - Zero server tracking; data remains on the user's device.
- **Search & Discovery:** Instant keyword search across titles, authors, and descriptions, with category and license filters (Public Domain, Creative Commons, Authorized).
- **Responsive Design:** Optimized for mobile phones, tablets, laptops, and ultra-wide desktops using Tailwind CSS.

### 2. Advertisement System (Google AdSense)
- Non-intrusive revenue generation configured across public pages:
  - Homepage Hero Leaderboard.
  - Homepage Feed between card sections.
  - Category Banners.
  - Book Detail Sidebar and Bottom banners.
- Controlled via the Admin Dashboard (enable/disable individual slots, update Publisher ID `ca-pub-XXX`, Slot IDs, or custom HTML snippets).

### 3. Private Administrative Dashboard (`/admin`)
- Accessible privately (does not appear in public navigation).
- **Secure Authentication:** JWT-based session security with bcrypt password hashing.
- **Dashboard Analytics:** Live metrics for total books, published vs. draft books, categories, reader view counters, and DMCA claims.
- **Book Management:** Add, edit, delete books, upload PDF/EPUB files and vector/image covers.
- **Publish & Feature Controls:** One-click instant toggle to publish/unpublish or feature books on the homepage.
- **Copyright & License Verification:** Built-in compliance module documenting Public Domain, Creative Commons, and written authorizations.
- **Category Management:** Create, edit, and delete book genres and tags.
- **Copyright & DMCA Inbox:** Review and process legal takedown notices submitted by rights holders.
- **Settings & Profile:** Customize library name, tagline, description, legal texts, and update administrator credentials.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
|---|---|---|
| **Frontend** | React 18 + Vite | Lightning-fast Single Page Application (SPA) |
| **Styling** | Tailwind CSS + Lucide Icons | Responsive modern UI with dark mode support |
| **Backend** | Python Flask + SQLAlchemy | RESTful API server with database ORM |
| **Database** | PostgreSQL / SQLite | SQLite out-of-the-box for instant local running, PostgreSQL for production |
| **Reader** | PDF.js (Canvas High-DPI Engine) | Smooth in-browser rendering with zero plugins required |
| **Storage** | Local disk / Cloudflare R2 | Uploads handler with optional Cloudflare R2 / S3 storage |
| **Progress** | Browser `LocalStorage` | Private client-side state without reader login |
| **Auth** | PyJWT + Werkzeug | Encrypted tokens and salted password hashing |

---

## 📁 Repository Structure

```
ebook-library/
├── backend/
│   ├── app/
│   │   ├── __init__.py          # Flask app factory, CORS, blueprints
│   │   ├── config.py            # SQLite / PostgreSQL & JWT configuration
│   │   ├── models.py            # SQLAlchemy models (Admin, Book, Category, AdConfig, etc.)
│   │   ├── auth.py              # JWT authentication & @admin_required decorator
│   │   ├── storage.py           # File uploader (Local filesystem + Cloudflare R2)
│   │   ├── routes_public.py     # Public endpoints (books, categories, ads, DMCA)
│   │   ├── routes_admin.py      # Admin dashboard CRUD endpoints
│   │   └── seed_data.py         # Seeds default admin, categories, & real PDF books
│   ├── uploads/
│   │   ├── books/               # Storage for uploaded PDF & EPUB books
│   │   └── covers/              # Storage for book cover art
│   ├── requirements.txt         # Python dependencies
│   ├── run.py                   # Backend entry point
│   ├── test_api.py              # Automated backend test suite
│   └── .env.example             # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Public navigation bar (no admin links)
│   │   │   ├── Footer.jsx       # Public footer & legal links
│   │   │   ├── BookCard.jsx     # Card with cover, badges, and read button
│   │   │   ├── ContinueReading.jsx # Reactive resume reading widget
│   │   │   ├── AdBanner.jsx     # Google AdSense slot container
│   │   │   ├── ReportModal.jsx  # Copyright & DMCA inquiry popup
│   │   │   ├── reader/
│   │   │   │   ├── PdfReader.jsx     # High-DPI PDF.js reader canvas
│   │   │   │   └── ReaderToolbar.jsx # Distraction-free reader controls
│   │   │   └── admin/
│   │   │       └── AdminLayout.jsx   # Admin sidebar & secure navigation
│   │   ├── context/
│   │   │   ├── ReadingContext.jsx    # Reactive LocalStorage manager
│   │   │   └── AdminAuthContext.jsx  # Admin token & login state
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Homepage with hero, featured books, categories
│   │   │   ├── Books.jsx        # Full catalog search & filters
│   │   │   ├── BookDetail.jsx   # Details, synopsis, copyright box, ad slots
│   │   │   ├── ReaderView.jsx   # 100% ad-free fullscreen online reader
│   │   │   ├── Categories.jsx   # Category listing
│   │   │   ├── CategoryDetail.jsx # Books by category
│   │   │   ├── MyShelf.jsx      # Private bookmarks & history
│   │   │   ├── LegalPage.jsx    # Privacy, Terms, DMCA, About
│   │   │   └── admin/
│   │   │       ├── AdminLogin.jsx      # Admin login form
│   │   │       ├── AdminDashboard.jsx  # Metrics and stats
│   │   │       ├── AdminBooks.jsx      # Books table & actions
│   │   │       ├── AdminBookForm.jsx   # Add / Edit book wizard
│   │   │       ├── AdminCategories.jsx # Category manager
│   │   │       ├── AdminAds.jsx        # AdSense slot configuration
│   │   │       ├── AdminReports.jsx    # Review copyright claims
│   │   │       └── AdminSettings.jsx   # Platform branding & password
│   │   ├── services/
│   │   │   └── api.js           # Frontend API client
│   │   ├── utils/
│   │   │   └── storage.js       # LocalStorage wrapper
│   │   ├── App.jsx              # Router & layout routes
│   │   ├── index.css            # Tailwind directives & reader styles
│   │   └── main.jsx             # React entry point
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── start-dev.bat                # One-click launcher for Windows
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.10+ (Python 3.14 supported)
- Node.js 18+ & npm

### Step 1: Start Backend Server
```bash
cd backend
python -m pip install -r requirements.txt
python run.py
```
*The database (`ebook.db`), default admin, and 6 sample public domain books with valid multi-page PDFs and vector covers will be seeded automatically on first run.*
- **Backend API URL:** `http://127.0.0.1:5000`

### Step 2: Start Frontend Server
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
- **Public Website:** `http://localhost:5173`
- **Private Admin Dashboard:** `http://localhost:5173/admin/login`

### Default Admin Credentials
- **Username:** `admin`
- **Password:** `admin123`
*(Password can be updated anytime inside the Admin Dashboard under Site Settings).*

---

## 🧪 Testing Backend Endpoints

An automated test suite is included in `backend/test_api.py`. Run:
```bash
cd backend
python test_api.py
```
All tests should pass with status 200.

---

## 🌐 Production Deployment

### 1. Database (PostgreSQL)
Set the `DATABASE_URL` environment variable:
```bash
DATABASE_URL=postgresql://username:password@hostname:5432/ebook_db
```

### 2. Backend on Render
1. Create a **New Web Service** pointing to the `backend` directory.
2. Build Command: `pip install -r requirements.txt`
3. Start Command: `gunicorn run:app`
4. Set Environment Variables:
   - `SECRET_KEY`: Random 64-character string
   - `JWT_SECRET`: Random 64-character string
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `UPLOAD_FOLDER`: `/var/data/uploads` (or Cloudflare R2 credentials)

### 3. Cloudflare R2 Storage (Optional)
If you wish to store files on Cloudflare R2 instead of the local server disk, set:
- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET_NAME`
- `R2_PUBLIC_URL`

### 4. Frontend on Vercel
1. Import repository on Vercel and select root directory `frontend`.
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Configure rewrite rule in `vercel.json` to proxy `/api/*` requests to your backend Render URL.
