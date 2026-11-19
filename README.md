# COMET — Student Performance Tracker

**COMET (Student Performance Tracker)** is a responsive web application interface built for **IMS566 (Advanced Web Design Development and Content Management)** at Universiti Teknologi MARA (UiTM). It centralizes a student's academic records, class schedule, live attendance, co-curricular merit points, coursework deadlines, and monthly budget into one unified portal.

---

## Features Included

* **Authentication Portal (Login & Registration):**
  * Tabbed Sign In and Student Registration interface on `index.html` with input validation, error feedback alerts, and simulated `localStorage` account creation.
* **Interactive Dashboard (`dashboard.html`):**
  * Displays real-time summary metrics (Current CGPA, Pending Tasks, Remaining Balance, and Merit Points).
  * Automatically detects the current day of the week to display today's scheduled classes.
  * Includes two **Chart.js** data visualizations: a GPA Progression line chart and a live Task & Test Completion doughnut chart synced with task updates.
* **Student Information & Digital e-Matric Card (`student-info.html`):**
  * Features an interactive UiTM e-Matric Card with one-click ID copy, degree credit progression tracking, and editable personal, academic, advisor, and educational background sections saved via `localStorage`.
* **Academic Information (`courses.html`):**
  * Displays current Semester 4 enrolled courses, credit units, groups, attendance rates, and historical CGPA records.
* **Visual Weekly Schedule & Live Attendance Tracker (`schedule.html`):**
  * Renders a color-coded weekly timetable highlighting the current day and semester week, paired with an interactive attendance logger that dynamically recalculates attendance percentages.
* **Events, Achievements & Merit Tracker (`events.html`):**
  * Tracks campus events, academic awards (Dean's List), and co-curricular merit points against the 80-point college residency requirement, with support for logging new events.
* **Task & Test Manager (`assignments.html`):**
  * Tracks semester assignments and tests across all enrolled courses with live status dropdowns, course/status filters, a completion progress bar, and custom task creation.
* **Financial Status & Budget Log (`financial.html`):**
  * Tracks monthly income, expenses, remaining wallet balance, and a categorized transaction log with modals to add new income or expense entries.
* **Responsive Design & Light/Dark Mode:**
  * Collapsible offcanvas navigation drawer for mobile viewports and persistent Light/Dark theme switching across all pages.

---

## Instructions to Test Login & Registration

1. **Default Demo Account (Login Tab):**
   * Open the live site (`index.html`).
   * Enter the pre-configured credentials (pre-filled for convenience):
     * **Username / Student ID:** `student`
     * **Password:** `password123`
   * Click **Sign In** to access `dashboard.html`.
   * *(Tip: Entering any other username/password will trigger the validation error alert.)*

2. **Testing Registration (Register Tab):**
   * Switch to the **Register** tab on `index.html`.
   * Fill in your Full Name, Student ID, and Password, then submit the form to create a new simulated account and log in with those credentials.

---

## Frameworks & Libraries Used

* **HTML5 & CSS3** (Custom responsive styling and theme variables in `js/css/style.css`)
* **Vanilla JavaScript (ES6+)** (`localStorage` state persistence and DOM rendering in `js/app.js`)
* **[Bootstrap 5.3.2](https://getbootstrap.com/)** (Responsive grid, offcanvas mobile navigation, modals, cards, tables, and tabs)
* **[Bootstrap Icons 1.11.1](https://icons.getbootstrap.com/)** (UI iconography)
* **[Chart.js](https://www.chartjs.org/)** (Interactive GPA progression and task completion charts)

---

## Project Structure

```text
├── index.html          # Login & Registration authentication page
├── dashboard.html      # Main landing dashboard with summary cards & charts
├── student-info.html   # Digital e-Matric card & editable student profile
├── courses.html        # Enrolled subjects & previous semester CGPA history
├── schedule.html       # Visual weekly timetable & live attendance tracker
├── events.html         # Campus events, recognitions & merit point tracker
├── assignments.html    # Coursework & test tracker with filters
├── financial.html      # Monthly budget summary & transaction logger
├── js/
│   ├── app.js          # Application logic, charts & localStorage management
│   └── css/
│       └── style.css   # Custom styling & dark mode theme overrides
├── images/             # Profile photo and favicon assets
└── README.md           # Project documentation
