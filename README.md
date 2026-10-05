# Zoho Task Tracker - Responsive Live Dashboard

A modern, responsive Next.js web application that reads task records from Google Sheets and displays them in a user-friendly, interactive dashboard.

## 🔒 100% Read-Only Safety Guarantee
- **Zero Sheet Modifications:** The application connects exclusively using the read-only Google Sheets scope (`https://www.googleapis.com/auth/spreadsheets.readonly`).
- **No Mutation Endpoints:** No write, update, append, batchUpdate, or delete operations exist in the codebase.
- **Client-Side Filtering & Sorting:** All sorting, grouping, filtering, searching, and calculations are computed dynamically in-memory in the web application without touching or altering the underlying sheet data.

---

## 🌟 Key Features

1. **Today's Trackers Tab:**
   - One-click filter that isolates tasks scheduled for today (`isTodayDate`), displaying the count and total allocated hours.
2. **All Trackers Till Date:**
   - Full dataset inspection (6,800+ tasks) with sub-second in-memory search and multi-criteria filtering.
3. **Quick Timeframe Filters:**
   - **Today's Trackers**
   - **Yesterday**
   - **This Week**
   - **All Trackers Till Date**
   - **Custom Date Range** (calendar date picker: From / To)
4. **Interactive Filters & Search:**
   - Instant search across Task Name, Project Name, User/Owner, Created By, Assignee Email, and Zoho Task ID.
   - Filter dropdown by Project Name (sorted alphabetically).
   - Filter dropdown by Assignee / Owner (sorted alphabetically).
   - Multi-field sorting by Start Date, Created On, Hours, Task Name, and Project Name with Asc/Desc toggle.
5. **Deduplication / Group by Task ID:**
   - Zoho Project tasks often have multiple assignees recorded on separate sheet rows.
   - The **"Group Task IDs"** toggle merges rows sharing the same Task ID, combining assignee names and aggregating their individual hours.
6. **Responsive Layouts:**
   - **Table View:** Clean, paginated data table with sticky headers, initials avatars, and badges.
   - **Card Grid View:** Modern card layout ideal for mobile, tablet, and visual task review.
7. **Task Inspection Drawer:**
   - Click any task to inspect complete Zoho metadata (Task ID, Project ID, timestamps, owner emails) with one-click copy buttons.
8. **Export to CSV:**
   - Instantly download any filtered or sorted view directly as a CSV spreadsheet.
9. **Live Sync & Auto-Refresh:**
   - Header sync button triggers an immediate live fetch from the Google Sheet.
   - Configurable background auto-sync interval (Every 30s, 1 min, 5 min, or Off).
10. **🌓 Dark Mode Support:**
   - One-click toggle in the header between light and dark themes.
   - Automatically detects system preference (`prefers-color-scheme`) and persists choice in `localStorage`.
   - Complete dark styling across stats cards, filter controls, data tables, cards, and modal drawers.

---

## 🚀 Getting Started

### 1. Environment Variables (`.env.local`)
The application is pre-configured with:
```env
GOOGLE_SHEET_ID=1MSI5D3YsS0hpS15YcDGPbRRdy2GbrZsRgMbBJ4OmPQ8
GOOGLE_SHEET_TAB=AllTracker
SERVICE_ACCOUNT_PATH=./service_account.json
```

### 2. Run the Development Server
```bash
cd zoho-tracker-dashboard
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Production Build
```bash
npm run build
npm run start
```
