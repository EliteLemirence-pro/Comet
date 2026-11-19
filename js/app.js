const WEEKLY_SCHEDULE = [
  { id: 'ims564', code: 'IMS564', name: 'User Experience Design', day: 'Monday', start: 8, end: 11, timeStr: '08:00 AM - 11:00 AM', color: 'primary' },
  { id: 'ims565', code: 'IMS565', name: 'Information System Project Management', day: 'Monday', start: 11, end: 14, timeStr: '11:00 AM - 02:00 PM', color: 'secondary' },
  { id: 'ims566', code: 'IMS566', name: 'Advanced Web Design Development', day: 'Tuesday', start: 8, end: 12, timeStr: '08:00 AM - 12:00 PM', color: 'info' },
  { id: 'ims560', code: 'IMS560', name: 'Advanced Database Management System', day: 'Tuesday', start: 14, end: 17, timeStr: '02:00 PM - 05:00 PM', color: 'primary' },
  { id: 'lcc501', code: 'LCC501', name: 'English for Professional Correspondence', day: 'Wednesday', start: 8, end: 10, timeStr: '08:00 AM - 10:00 AM', color: 'warning' },
  { id: 'tgc451', code: 'TGC451', name: 'Introductory German (Level II)', day: 'Wednesday', start: 10, end: 12, timeStr: '10:00 AM - 12:00 PM', color: 'success' },
  { id: 'ctu554', code: 'CTU554', name: 'Values and Civilization II', day: 'Wednesday', start: 14, end: 16, timeStr: '02:00 PM - 04:00 PM', color: 'danger' },
  { id: 'ims562', code: 'IMS562', name: 'Information Security', day: 'Thursday', start: 14, end: 17, timeStr: '02:00 PM - 05:00 PM', color: 'success' }
];

function getCurrentWeekNumber() {
  const semesterStartDate = new Date('2026-09-28');
  const today = new Date();
  const daysPassed = Math.floor((today - semesterStartDate) / (1000 * 60 * 60 * 24));
  return Math.max(1, Math.min(14, Math.floor(daysPassed / 7) + 1));
}

document.addEventListener('DOMContentLoaded', function () {
  initLogin();
  initThemeToggle();
  initWeekBadge();
  initDashboardTodayClasses();
  initSchedulePage();
  initTasksPage();
  initEventsPage();
  initCharts();
  initFinancials();
  initStudentInfoPage();
});

function initLogin() {
  const loginForm = document.getElementById('login-form');
  if (!loginForm) return;

  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const alertBox = document.getElementById('login-alert');

    if (user === 'student' && pass === 'password123') {
      window.location.href = 'dashboard.html';
    } else if (alertBox) {
      alertBox.classList.remove('d-none');
    }
  });
}

function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const themeText = document.getElementById('theme-text');

  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-bs-theme', savedTheme);
  updateThemeButtonUI(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function () {
      const currentTheme = document.documentElement.getAttribute('data-bs-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-bs-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeButtonUI(newTheme);
    });
  }

  function updateThemeButtonUI(theme) {
    if (!themeIcon || !themeText) return;
    if (theme === 'dark') {
      themeIcon.className = 'bi bi-sun-fill me-1';
      themeText.innerText = 'Light Mode';
    } else {
      themeIcon.className = 'bi bi-moon-fill me-1';
      themeText.innerText = 'Dark Mode';
    }
  }
}

function initWeekBadge() {
  const weekBadge = document.getElementById('current-week-badge');
  if (weekBadge) {
    weekBadge.innerText = 'Current: Week ' + getCurrentWeekNumber();
  }
}

function initDashboardTodayClasses() {
  const todayClassList = document.getElementById('dashboard-today-classes');
  const todayDayBadge = document.getElementById('dashboard-today-day');
  if (!todayClassList) return;

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDayName = dayNames[new Date().getDay()];

  if (todayDayBadge) {
    todayDayBadge.innerText = currentDayName;
  }

  const todaysClasses = WEEKLY_SCHEDULE.filter(c => c.day === currentDayName);

  if (todaysClasses.length === 0) {
    todayClassList.innerHTML = `
      <li class="list-group-item text-center py-4 text-muted">
        <i class="bi bi-cup-hot fs-4 d-block mb-1 text-success"></i>
        No classes scheduled for <strong>${currentDayName}</strong>. Enjoy your free day!
      </li>`;
  } else {
    todayClassList.innerHTML = todaysClasses.map(c => `
      <li class="list-group-item d-flex justify-content-between align-items-center py-3">
        <div><strong>${c.code}</strong> (${c.name})</div>
        <span class="badge bg-${c.color}">${c.timeStr}</span>
      </li>
    `).join('');
  }
}

function initSchedulePage() {
  const timetableBody = document.getElementById('visual-timetable-body');
  const attendanceBody = document.getElementById('attendance-table-body');
  const resetBtn = document.getElementById('reset-attendance-btn');

  if (timetableBody) {
    renderVisualTimetable(timetableBody);
  }

  if (attendanceBody) {
    renderAttendanceTable(attendanceBody);

    attendanceBody.addEventListener('click', function (e) {
      const btn = e.target.closest('button[data-course][data-status]');
      if (!btn) return;
      const courseId = btn.getAttribute('data-course');
      const status = btn.getAttribute('data-status');
      markAttendance(courseId, status);
      renderAttendanceTable(attendanceBody);
    });
  }

  if (resetBtn && attendanceBody) {
    resetBtn.addEventListener('click', function () {
      localStorage.removeItem('studentAttendance');
      renderAttendanceTable(attendanceBody);
    });
  }
}

function renderVisualTimetable(tbody) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = dayNames[new Date().getDay()];

  const todayBadge = document.getElementById('today-indicator-badge');
  if (todayBadge) todayBadge.innerText = 'Today: ' + todayName;

  document.querySelectorAll('#visual-timetable th[data-day]').forEach(th => {
    if (th.getAttribute('data-day') === todayName) {
      th.classList.add('bg-primary', 'text-white');
    }
  });

  tbody.innerHTML = '';
  const skipMap = {};

  hours.forEach(hour => {
    const nextHour = hour + 1;
    const formatHr = h => (h > 12 ? h - 12 : h).toString().padStart(2, '0') + ':00 ' + (h >= 12 ? 'PM' : 'AM');
    let rowHtml = `<tr><td class="fw-semibold small text-muted bg-light">${formatHr(hour)}<br><span class="opacity-50">to</span><br>${formatHr(nextHour)}</td>`;

    days.forEach(day => {
      const key = `${day}-${hour}`;
      if (skipMap[key]) return;

      const cls = WEEKLY_SCHEDULE.find(c => c.day === day && c.start === hour);
      const isTodayCol = day === todayName ? 'bg-primary bg-opacity-10' : '';

      if (cls) {
        const duration = cls.end - cls.start;
        for (let i = 1; i < duration; i++) {
          skipMap[`${day}-${hour + i}`] = true;
        }
        rowHtml += `
          <td rowspan="${duration}" class="p-2 ${isTodayCol}">
            <div class="p-2 rounded-3 bg-${cls.color} bg-opacity-10 border border-${cls.color} border-opacity-50 h-100 d-flex flex-column justify-content-center">
              <span class="badge bg-${cls.color} mb-1 mx-auto">${cls.code}</span>
              <div class="fw-bold small">${cls.name}</div>
              <div class="text-muted" style="font-size: 0.72rem;">${cls.timeStr}</div>
            </div>
          </td>`;
      } else {
        rowHtml += `<td class="${isTodayCol} text-muted small opacity-25">—</td>`;
      }
    });

    rowHtml += '</tr>';
    tbody.innerHTML += rowHtml;
  });
}

function renderAttendanceTable(tbody) {
  const currentWeek = getCurrentWeekNumber();
  const savedAttendance = JSON.parse(localStorage.getItem('studentAttendance')) || {};
  tbody.innerHTML = '';

  WEEKLY_SCHEDULE.forEach(cls => {
    const record = savedAttendance[cls.id] || { statusThisWeek: 'present', missedWeeks: 0 };
    const attendedWeeks = Math.max(0, currentWeek - record.missedWeeks);
    const percentage = Math.round((attendedWeeks / currentWeek) * 100);

    let badgeClass = 'bg-success';
    if (percentage < 80 && percentage >= 60) badgeClass = 'bg-warning text-dark';
    else if (percentage < 60) badgeClass = 'bg-danger';

    const presentBtnClass = record.statusThisWeek === 'present' ? 'btn-success' : 'btn-outline-success';
    const absentBtnClass = record.statusThisWeek === 'absent' ? 'btn-danger' : 'btn-outline-danger';

    tbody.innerHTML += `
      <tr>
        <td class="ps-4 fw-bold text-${cls.color}">${cls.day}</td>
        <td>${cls.timeStr}</td>
        <td><strong>${cls.code}</strong> - ${cls.name}</td>
        <td>
          <span id="rate-${cls.id}" class="badge ${badgeClass} fs-6">${percentage}%</span>
          <small class="text-muted ms-1">(${attendedWeeks}/${currentWeek} wks)</small>
        </td>
        <td class="text-end pe-4">
          <button type="button" class="btn btn-sm ${presentBtnClass} me-1" data-course="${cls.id}" data-status="present">
            <i class="bi bi-check-lg"></i> Present
          </button>
          <button type="button" class="btn btn-sm ${absentBtnClass}" data-course="${cls.id}" data-status="absent">
            <i class="bi bi-x-lg"></i> Absent
          </button>
        </td>
      </tr>`;
  });
}

function markAttendance(courseId, status) {
  const savedAttendance = JSON.parse(localStorage.getItem('studentAttendance')) || {};
  const record = savedAttendance[courseId] || { statusThisWeek: 'present', missedWeeks: 0 };

  if (status === 'absent' && record.statusThisWeek !== 'absent') {
    record.missedWeeks += 1;
    record.statusThisWeek = 'absent';
  } else if (status === 'present' && record.statusThisWeek === 'absent') {
    record.missedWeeks = Math.max(0, record.missedWeeks - 1);
    record.statusThisWeek = 'present';
  }

  savedAttendance[courseId] = record;
  localStorage.setItem('studentAttendance', JSON.stringify(savedAttendance));
}

function initTasksPage() {
  const DEFAULT_TASKS = [
    { id: 'ims566-ind', course: 'IMS566', title: 'Individual Assignment', category: 'Individual Assignment', due: 'Week 8', status: 'In Progress', custom: false },
    { id: 'ims566-grp', course: 'IMS566', title: 'Group Assignment', category: 'Group Assignment', due: 'Week 12', status: 'Pending', custom: false },
    { id: 'ims566-test', course: 'IMS566', title: 'Final Test', category: 'Final Test', due: 'Week 14', status: 'Pending', custom: false },
    { id: 'ims560-ind', course: 'IMS560', title: 'Individual Assignment', category: 'Individual Assignment', due: 'Week 6', status: 'Completed', custom: false },
    { id: 'ims560-grp', course: 'IMS560', title: 'Group Assignment', category: 'Group Assignment', due: 'Week 11', status: 'In Progress', custom: false },
    { id: 'ims560-test', course: 'IMS560', title: 'Final Test', category: 'Final Test', due: 'Week 14', status: 'Pending', custom: false },
    { id: 'ims562-ind', course: 'IMS562', title: 'Individual Assignment', category: 'Individual Assignment', due: 'Week 9', status: 'Pending', custom: false },
    { id: 'ims562-grp', course: 'IMS562', title: 'Group Assignment', category: 'Group Assignment', due: 'Week 12', status: 'Pending', custom: false },
    { id: 'ims562-test', course: 'IMS562', title: 'Final Test', category: 'Final Test', due: 'Week 14', status: 'Pending', custom: false },
    { id: 'ims564-ind', course: 'IMS564', title: 'Individual Assignment', category: 'Individual Assignment', due: 'Week 5', status: 'Completed', custom: false },
    { id: 'ims564-grp', course: 'IMS564', title: 'Group Assignment', category: 'Group Assignment', due: 'Week 10', status: 'In Progress', custom: false },
    { id: 'ims564-test', course: 'IMS564', title: 'Final Test', category: 'Final Test', due: 'Week 14', status: 'Pending', custom: false },
    { id: 'ims565-ind', course: 'IMS565', title: 'Individual Assignment', category: 'Individual Assignment', due: 'Week 6', status: 'Completed', custom: false },
    { id: 'ims565-grp', course: 'IMS565', title: 'Group Assignment', category: 'Group Assignment', due: 'Week 11', status: 'Completed', custom: false },
    { id: 'ims565-test', course: 'IMS565', title: 'Final Test', category: 'Final Test', due: 'Week 13', status: 'In Progress', custom: false },
    { id: 'ctu554-ind', course: 'CTU554', title: 'Individual Assignment', category: 'Individual Assignment', due: 'Week 6', status: 'Completed', custom: false },
    { id: 'ctu554-grp', course: 'CTU554', title: 'Group Assignment', category: 'Group Assignment', due: 'Week 10', status: 'In Progress', custom: false },
    { id: 'ctu554-test', course: 'CTU554', title: 'Final Test', category: 'Final Test', due: 'Week 13', status: 'Pending', custom: false },
    { id: 'lcc501-ind', course: 'LCC501', title: 'Individual Assignment', category: 'Individual Assignment', due: 'Week 5', status: 'Completed', custom: false },
    { id: 'lcc501-grp', course: 'LCC501', title: 'Group Assignment', category: 'Group Assignment', due: 'Week 9', status: 'In Progress', custom: false },
    { id: 'lcc501-test', course: 'LCC501', title: 'Final Test', category: 'Final Test', due: 'Week 13', status: 'Pending', custom: false },
    { id: 'tgc451-test1', course: 'TGC451', title: 'Test 1', category: 'Test', due: 'Week 5', status: 'Completed', custom: false },
    { id: 'tgc451-test2', course: 'TGC451', title: 'Test 2', category: 'Test', due: 'Week 9', status: 'In Progress', custom: false },
    { id: 'tgc451-roleplay', course: 'TGC451', title: 'Roleplay Assessment', category: 'Roleplay', due: 'Week 12', status: 'Pending', custom: false }
  ];

  function getTasks() {
    return JSON.parse(localStorage.getItem('studentTaskList')) || DEFAULT_TASKS;
  }

  function saveTasks(tasks) {
    localStorage.setItem('studentTaskList', JSON.stringify(tasks));
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const inProgress = tasks.filter(t => t.status === 'In Progress').length;
    const pending = tasks.filter(t => t.status === 'Pending').length;
    localStorage.setItem('taskCounts', JSON.stringify({ completed, inProgress, pending }));
  }

  if (!localStorage.getItem('studentTaskList')) {
    saveTasks(DEFAULT_TASKS);
  }

  const tbody = document.getElementById('tasks-table-body');
  if (!tbody) return;

  const courseFilter = document.getElementById('filter-task-course');
  const statusFilter = document.getElementById('filter-task-status');

  function renderTasks() {
    const tasks = getTasks();
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const inProgress = tasks.filter(t => t.status === 'In Progress').length;
    const pending = tasks.filter(t => t.status === 'Pending').length;
    const total = tasks.length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

    document.getElementById('badge-completed').innerText = 'Completed: ' + completed;
    document.getElementById('badge-progress').innerText = 'In Progress: ' + inProgress;
    document.getElementById('badge-pending').innerText = 'Pending: ' + pending;
    document.getElementById('tasks-progress-label').innerText = `${completed} / ${total} Completed (${pct}%)`;
    document.getElementById('tasks-progress-bar').style.width = pct + '%';

    const selectedCourse = courseFilter ? courseFilter.value : 'ALL';
    const selectedStatus = statusFilter ? statusFilter.value : 'ALL';

    const filtered = tasks.filter(t =>
      (selectedCourse === 'ALL' || t.course === selectedCourse) &&
      (selectedStatus === 'ALL' || t.status === selectedStatus)
    );

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-muted">No tasks match the selected filter.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(t => `
      <tr>
        <td class="ps-4 fw-bold">${t.course}</td>
        <td>${t.title} ${t.custom ? '<span class="badge bg-info text-dark ms-1">Custom</span>' : ''}</td>
        <td>${t.category}</td>
        <td><span class="text-muted small">${t.due}</span></td>
        <td class="text-end pe-4">
          <div class="d-inline-flex align-items-center gap-1">
            <select data-id="${t.id}" class="form-select form-select-sm w-auto task-status-dropdown">
              <option value="Completed" ${t.status === 'Completed' ? 'selected' : ''}>Completed</option>
              <option value="In Progress" ${t.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
              <option value="Pending" ${t.status === 'Pending' ? 'selected' : ''}>Pending</option>
            </select>
            ${t.custom ? `<button type="button" class="btn btn-sm btn-outline-danger" data-delete-task="${t.id}" title="Delete task"><i class="bi bi-trash"></i></button>` : ''}
          </div>
        </td>
      </tr>
    `).join('');
  }

  tbody.addEventListener('change', function (e) {
    const sel = e.target.closest('.task-status-dropdown');
    if (!sel) return;
    const tasks = getTasks();
    const target = tasks.find(t => t.id === sel.getAttribute('data-id'));
    if (target) {
      target.status = sel.value;
      saveTasks(tasks);
      renderTasks();
    }
  });

  tbody.addEventListener('click', function (e) {
    const delBtn = e.target.closest('[data-delete-task]');
    if (!delBtn) return;
    const id = delBtn.getAttribute('data-delete-task');
    const updated = getTasks().filter(t => t.id !== id);
    saveTasks(updated);
    renderTasks();
  });

  if (courseFilter) courseFilter.addEventListener('change', renderTasks);
  if (statusFilter) statusFilter.addEventListener('change', renderTasks);

  const addTaskForm = document.getElementById('add-task-form');
  const addTaskModalEl = document.getElementById('addTaskModal');
  if (addTaskForm && addTaskModalEl) {
    addTaskForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const tasks = getTasks();
      tasks.unshift({
        id: 'custom-' + Date.now(),
        course: document.getElementById('task-course').value,
        title: document.getElementById('task-title').value.trim(),
        category: document.getElementById('task-category').value,
        due: document.getElementById('task-due').value.trim(),
        status: document.getElementById('task-status').value,
        custom: true
      });
      saveTasks(tasks);
      renderTasks();
      bootstrap.Modal.getOrCreateInstance(addTaskModalEl).hide();
      this.reset();
    });
  }

  const resetTasksBtn = document.getElementById('reset-tasks-btn');
  if (resetTasksBtn) {
    resetTasksBtn.addEventListener('click', function () {
      localStorage.removeItem('studentTaskList');
      saveTasks(DEFAULT_TASKS);
      if (courseFilter) courseFilter.value = 'ALL';
      if (statusFilter) statusFilter.value = 'ALL';
      renderTasks();
    });
  }

  renderTasks();
}

function initEventsPage() {
  const DEFAULT_EVENTS = [
    { id: 'ev-1', name: 'UiTM Computing Innovation Workshop', role: 'Participant', org: 'Faculty of Computing & Informatics', date: '15 Oct 2026', merit: 25, custom: false },
    { id: 'ev-2', name: 'Kolej Community Sports Day', role: 'Committee Member', org: 'UiTM Puncak Perdana JPK', date: '02 Sep 2026', merit: 30, custom: false },
    { id: 'ev-3', name: 'Web Design & UI/UX Hackathon', role: 'Competitor', org: 'Academic Society (IMSA)', date: '18 Jun 2026', merit: 20, custom: false },
    { id: 'ev-4', name: 'UiTM Campus Cleanliness Campaign', role: 'Volunteer', org: 'Student Affairs Division', date: '10 May 2026', merit: 10, custom: false }
  ];

  function getEvents() {
    return JSON.parse(localStorage.getItem('studentEventsList')) || DEFAULT_EVENTS;
  }

  const eventsList = getEvents();
  const totalMerit = eventsList.reduce((sum, ev) => sum + Number(ev.merit), 0);

  const dashMeritEl = document.getElementById('dashboard-merit-count');
  if (dashMeritEl) {
    dashMeritEl.innerText = totalMerit + ' Pts';
  }

  const tbody = document.getElementById('events-table-body');
  if (!tbody) return;

  function renderEvents() {
    const events = getEvents();
    const meritSum = events.reduce((sum, ev) => sum + Number(ev.merit), 0);
    const targetMerit = 80;
    const pct = Math.min(100, Math.round((meritSum / targetMerit) * 100));

    document.getElementById('events-total-merit-badge').innerHTML = `<i class="bi bi-star-fill me-1"></i> Total Merit: ${meritSum} Pts`;
    document.getElementById('events-count-display').innerText = `${events.length} Events`;

    const residencyEl = document.getElementById('residency-status-display');
    if (meritSum >= targetMerit) {
      residencyEl.className = 'fw-bold mb-0 text-success';
      residencyEl.innerText = `Eligible (${meritSum} Pts)`;
    } else {
      residencyEl.className = 'fw-bold mb-0 text-warning';
      residencyEl.innerText = `Need ${targetMerit - meritSum} More Pts`;
    }

    document.getElementById('merit-progress-label').innerText = `${meritSum} / ${targetMerit} Pts (${pct}%)`;
    const bar = document.getElementById('merit-progress-bar');
    bar.style.width = pct + '%';
    bar.className = meritSum >= targetMerit ? 'progress-bar bg-success' : 'progress-bar bg-warning';

    tbody.innerHTML = events.map(ev => `
      <tr>
        <td class="ps-4 fw-bold">${ev.name}</td>
        <td>${ev.role}</td>
        <td>${ev.org}</td>
        <td>${ev.date}</td>
        <td><span class="badge bg-success">+${ev.merit} Pts</span></td>
        <td class="text-end pe-4">
          ${ev.custom
            ? `<button type="button" class="btn btn-sm btn-outline-danger" data-delete-event="${ev.id}" title="Remove event"><i class="bi bi-trash"></i></button>`
            : `<span class="text-muted small">Verified</span>`}
        </td>
      </tr>
    `).join('');
  }

  const addEventForm = document.getElementById('add-event-form');
  const addEventModalEl = document.getElementById('addEventModal');
  if (addEventForm && addEventModalEl) {
    addEventForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const events = getEvents();
      events.unshift({
        id: 'ev-' + Date.now(),
        name: document.getElementById('ev-name').value.trim(),
        role: document.getElementById('ev-role').value,
        org: document.getElementById('ev-org').value.trim(),
        date: document.getElementById('ev-date').value.trim(),
        merit: parseInt(document.getElementById('ev-merit').value, 10) || 0,
        custom: true
      });
      localStorage.setItem('studentEventsList', JSON.stringify(events));
      renderEvents();
      bootstrap.Modal.getOrCreateInstance(addEventModalEl).hide();
      this.reset();
    });
  }

  tbody.addEventListener('click', function (e) {
    const delBtn = e.target.closest('[data-delete-event]');
    if (!delBtn) return;
    const id = delBtn.getAttribute('data-delete-event');
    const updated = getEvents().filter(ev => ev.id !== id);
    localStorage.setItem('studentEventsList', JSON.stringify(updated));
    renderEvents();
  });

  const resetEventsBtn = document.getElementById('reset-events-btn');
  if (resetEventsBtn) {
    resetEventsBtn.addEventListener('click', function () {
      localStorage.removeItem('studentEventsList');
      renderEvents();
    });
  }

  renderEvents();
}

function initCharts() {
  const gpaCtx = document.getElementById('gpaChart');
  if (gpaCtx) {
    new Chart(gpaCtx, {
      type: 'line',
      data: {
        labels: ['Diploma (Sem 4)', 'Diploma (Sem 5)', 'Degree (Sem 3)'],
        datasets: [{
          label: 'GPA / CGPA Record',
          data: [3.48, 3.48, 4.00],
          borderColor: '#0d6efd',
          backgroundColor: 'rgba(13, 110, 253, 0.1)',
          fill: true,
          tension: 0.3,
          borderWidth: 3,
          pointRadius: 5
        }]
      },
      options: {
        responsive: true,
        scales: { y: { min: 3.0, max: 4.0 } }
      }
    });
  }

  const taskCtx = document.getElementById('taskChart');
  if (taskCtx) {
    const savedCounts = JSON.parse(localStorage.getItem('taskCounts')) || { completed: 10, inProgress: 6, pending: 8 };
    const pendingCardText = document.getElementById('dashboard-pending-count');
    if (pendingCardText) pendingCardText.innerText = savedCounts.pending + ' Tasks';

    new Chart(taskCtx, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'In Progress', 'Pending'],
        datasets: [{
          data: [savedCounts.completed, savedCounts.inProgress, savedCounts.pending],
          backgroundColor: ['#198754', '#ffc107', '#dc3545']
        }]
      },
      options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });
  }
}

function initFinancials() {
  if (!localStorage.getItem('financialData')) {
    const defaultFinancialData = {
      income: 1200.00,
      expense: 148.00,
      transactions: [
        { date: '17 Nov 2026', desc: 'Dinner: Nasi Goreng & Teh O Ais', cat: 'Food & Meals', amount: -10.00, type: 'expense' },
        { date: '17 Nov 2026', desc: 'Lunch: Economy Rice (Nasi Campur)', cat: 'Food & Meals', amount: -10.00, type: 'expense' },
        { date: '16 Nov 2026', desc: 'Dinner: Chicken Rice Set', cat: 'Food & Meals', amount: -10.00, type: 'expense' },
        { date: '16 Nov 2026', desc: 'Lunch: Fried Noodles & Mineral Water', cat: 'Food & Meals', amount: -10.00, type: 'expense' },
        { date: '14 Nov 2026', desc: 'dobiQueen Commercial Laundry (Alam Budiman)', cat: 'Utilities', amount: -18.00, type: 'expense' },
        { date: '10 Nov 2026', desc: 'Shopee Express Parcel Pickup (Setia Alam Hub)', cat: 'Shopping', amount: -45.00, type: 'expense' },
        { date: '07 Nov 2026', desc: 'Dinner: Burger & Beverage', cat: 'Food & Meals', amount: -10.00, type: 'expense' },
        { date: '07 Nov 2026', desc: 'Lunch: Mixed Rice Stall', cat: 'Food & Meals', amount: -10.00, type: 'expense' },
        { date: '03 Nov 2026', desc: 'Ride-hailing to Campus & Back', cat: 'Transportation', amount: -15.00, type: 'expense' }
      ]
    };
    localStorage.setItem('financialData', JSON.stringify(defaultFinancialData));
  }

  loadFinancialData();

  document.querySelectorAll('[data-tx-modal]').forEach(btn => {
    btn.addEventListener('click', function () {
      openTransactionModal(this.getAttribute('data-tx-modal'));
    });
  });

  const txForm = document.getElementById('transaction-form');
  const transactionModalEl = document.getElementById('transactionModal');
  if (txForm && transactionModalEl) {
    txForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const type = document.getElementById('tx-type').value;
      const amount = parseFloat(document.getElementById('tx-amount').value);
      const desc = document.getElementById('tx-desc').value;
      const category = document.getElementById('tx-category').value;

      const dateOptions = { day: '2-digit', month: 'short', year: 'numeric' };
      const formattedDate = new Date().toLocaleDateString('en-GB', dateOptions);
      const data = JSON.parse(localStorage.getItem('financialData'));
      const finalAmount = type === 'income' ? Math.abs(amount) : -Math.abs(amount);

      if (type === 'income') data.income += Math.abs(amount);
      else data.expense += Math.abs(amount);

      data.transactions.unshift({ date: formattedDate, desc: desc, cat: category, amount: finalAmount, type: type });
      localStorage.setItem('financialData', JSON.stringify(data));
      loadFinancialData();

      const modalInstance = bootstrap.Modal.getInstance(transactionModalEl);
      if (modalInstance) modalInstance.hide();
      this.reset();
    });
  }
}

function openTransactionModal(type) {
  const typeInput = document.getElementById('tx-type');
  const modalTitle = document.getElementById('modalTitle');
  const txAmount = document.getElementById('tx-amount');
  const txDesc = document.getElementById('tx-desc');
  const modalEl = document.getElementById('transactionModal');
  const modalInstance = bootstrap.Modal.getInstance(modalEl) || (modalEl ? new bootstrap.Modal(modalEl) : null);

  if (typeInput && modalTitle && txAmount && txDesc && modalInstance) {
    typeInput.value = type;
    modalTitle.innerText = type === 'income' ? 'Add Money / Income' : 'Deduct Money / Expense';
    txAmount.value = '';
    txDesc.value = '';
    modalInstance.show();
  }
}

function loadFinancialData() {
  const data = JSON.parse(localStorage.getItem('financialData'));
  if (!data) return;
  const balance = data.income - data.expense;

  const colorClass = balance >= 1000 ? 'text-success' : (balance >= 500 ? 'text-warning' : 'text-danger');
  const badgeBgClass = balance >= 1000 ? 'bg-success' : (balance >= 500 ? 'bg-warning text-dark' : 'bg-danger');

  const cardInc = document.getElementById('card-income');
  const cardExp = document.getElementById('card-expense');
  const cardBal = document.getElementById('card-balance');
  const badgeBal = document.getElementById('badge-balance');

  if (cardInc) cardInc.innerText = 'RM ' + data.income.toFixed(2);
  if (cardExp) cardExp.innerText = 'RM ' + data.expense.toFixed(2);
  if (cardBal) { cardBal.innerText = 'RM ' + balance.toFixed(2); cardBal.className = 'fw-bold mb-0 ' + colorClass; }
  if (badgeBal) { badgeBal.className = 'badge ' + badgeBgClass + ' px-3 py-2 fs-6'; badgeBal.innerText = 'Balance Left: RM ' + balance.toFixed(2); }

  const dashCardBal = document.getElementById('dashboard-balance-card');
  const dashSummaryBal = document.getElementById('dashboard-balance-summary');
  const dashIncomeSummary = document.getElementById('dashboard-income-summary');

  if (dashCardBal) { dashCardBal.innerText = 'RM ' + balance.toFixed(2); dashCardBal.className = 'fw-bold mb-0 ' + colorClass; }
  if (dashSummaryBal) { dashSummaryBal.innerText = 'RM ' + balance.toFixed(2); dashSummaryBal.className = 'fw-bold ' + colorClass; }
  if (dashIncomeSummary) dashIncomeSummary.innerText = 'RM ' + data.income.toFixed(2);

  const tableNovInc = document.getElementById('table-nov-income');
  const tableNovExp = document.getElementById('table-nov-expense');
  const tableNovBal = document.getElementById('table-nov-balance');

  if (tableNovInc) tableNovInc.innerText = 'RM ' + data.income.toFixed(2);
  if (tableNovExp) tableNovExp.innerText = 'RM ' + data.expense.toFixed(2);
  if (tableNovBal) { tableNovBal.innerText = 'RM ' + balance.toFixed(2); tableNovBal.className = 'fw-bold ' + colorClass; }

  const tbody = document.getElementById('transaction-table-body');
  if (tbody && data.transactions) {
    tbody.innerHTML = '';
    data.transactions.forEach(tx => {
      const isInc = tx.type === 'income';
      const amtStr = (isInc ? '+RM ' : '-RM ') + Math.abs(tx.amount).toFixed(2);
      const amtClass = isInc ? 'text-success' : 'text-danger';
      tbody.innerHTML += `<tr>
        <td class="ps-4">${tx.date}</td>
        <td>${tx.desc}</td>
        <td>${tx.cat}</td>
        <td class="text-end pe-4 fw-bold ${amtClass}">${amtStr}</td>
      </tr>`;
    });
  }
}

function initStudentInfoPage() {
  const copyBtn = document.getElementById('copy-matric-btn');
  const matricText = document.getElementById('matric-id-text');
  if (copyBtn && matricText) {
    copyBtn.addEventListener('click', function () {
      navigator.clipboard.writeText(matricText.innerText.trim()).then(() => {
        const originalHtml = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="bi bi-check2 me-1"></i> Copied!';
        copyBtn.classList.replace('btn-light', 'btn-success');
        setTimeout(() => {
          copyBtn.innerHTML = originalHtml;
          copyBtn.classList.replace('btn-success', 'btn-light');
        }, 2000);
      });
    });
  }

  const editButtons = document.querySelectorAll('[data-edit-section]');
  const modalEl = document.getElementById('sectionEditModal');
  if (editButtons.length === 0 || !modalEl) return;

  const DEFAULT_STUDENT_DATA = {
    advisor: {
      advisor: 'Christopher Reed',
      advisorEmail: 'Christopher@uitm.edu.my'
    },
    personal: {
      fullName: 'Aliy Aiman',
      ageGender: '21 Years Old / Male',
      hometown: 'Beaufort, Sabah',
      phone: '+60 12-830 4230',
      email: '2026117415@student.uitm.edu.my',
      residency: 'NR (Space Castle Shah Alam)',
      emergency: 'Anos Voldigoad (+60 13-8856 935)'
    },
    academic: {
      progCode: 'SI262',
      progName: 'Bachelor of Information Science (Hons.) Information Systems Management',
      faculty: 'Faculty of Information System',
      campus: 'UiTM Puncak Perdana, Selangor',
      modeSem: 'Full-Time / Semester 4'
    },
    education: {
      dipInst: 'UiTM Kampus Samarahan, Sarawak',
      dipProg: 'CDIM110 (Diploma in Information Management)',
      dipResult: 'CGPA 3.48',
      spmInst: 'SMK Beaufort II, Sabah',
      spmProg: 'Sijil Pelajaran Malaysia (SPM)',
      spmResult: '5A, 2B, 1C'
    }
  };

  const SECTION_CONFIG = {
    advisor: {
      title: 'Edit Academic Advisor (PA)',
      fields: [
        { key: 'advisor', label: 'Advisor Name', type: 'text', col: 'col-12' },
        { key: 'advisorEmail', label: 'Advisor Email', type: 'email', col: 'col-12' }
      ]
    },
    personal: {
      title: 'Edit Personal & Contact Particulars',
      fields: [
        { key: 'fullName', label: 'Full Name', type: 'text', col: 'col-12 col-sm-6' },
        { key: 'ageGender', label: 'Age / Gender', type: 'text', col: 'col-12 col-sm-6' },
        { key: 'hometown', label: 'Hometown', type: 'text', col: 'col-12 col-sm-6' },
        { key: 'phone', label: 'Phone Number', type: 'text', col: 'col-12 col-sm-6' },
        { key: 'email', label: 'Student Email', type: 'email', col: 'col-12' },
        { key: 'residency', label: 'Current Residency', type: 'text', col: 'col-12' },
        { key: 'emergency', label: 'Emergency Contact', type: 'text', col: 'col-12' }
      ]
    },
    academic: {
      title: 'Edit Current Academic Enrollment',
      fields: [
        { key: 'progCode', label: 'Programme Code', type: 'text', col: 'col-12 col-sm-6' },
        { key: 'modeSem', label: 'Mode / Current Semester', type: 'text', col: 'col-12 col-sm-6' },
        { key: 'progName', label: 'Programme Name', type: 'text', col: 'col-12' },
        { key: 'faculty', label: 'Faculty', type: 'text', col: 'col-12' },
        { key: 'campus', label: 'Campus', type: 'text', col: 'col-12' }
      ]
    },
    education: {
      title: 'Edit Educational Background',
      fields: [
        { key: 'dipInst', label: 'Diploma Institution', type: 'text', col: 'col-12' },
        { key: 'dipProg', label: 'Diploma Programme', type: 'text', col: 'col-12 col-sm-8' },
        { key: 'dipResult', label: 'Diploma Result', type: 'text', col: 'col-12 col-sm-4' },
        { key: 'spmInst', label: 'High School Institution', type: 'text', col: 'col-12' },
        { key: 'spmProg', label: 'High School Qualification', type: 'text', col: 'col-12 col-sm-8' },
        { key: 'spmResult', label: 'SPM Result', type: 'text', col: 'col-12 col-sm-4' }
      ]
    }
  };

  let activeSection = null;

  function getStudentStore() {
    const saved = JSON.parse(localStorage.getItem('studentProfileSections')) || {};
    return {
      advisor: { ...DEFAULT_STUDENT_DATA.advisor, ...saved.advisor },
      personal: { ...DEFAULT_STUDENT_DATA.personal, ...saved.personal },
      academic: { ...DEFAULT_STUDENT_DATA.academic, ...saved.academic },
      education: { ...DEFAULT_STUDENT_DATA.education, ...saved.education }
    };
  }

  function renderAllStudentSections() {
    const store = getStudentStore();

    Object.values(store).forEach(sectionObj => {
      Object.entries(sectionObj).forEach(([key, val]) => {
        const el = document.getElementById('display-' + key);
        if (el) el.innerText = val;
      });
    });

    const cardName = document.getElementById('card-display-name');
    const cardProg = document.getElementById('card-display-prog');
    const cardCampus = document.getElementById('card-display-campus');
    const mailBtn = document.getElementById('advisor-mailto-btn');

    if (cardName) cardName.innerText = store.personal.fullName.toUpperCase();
    if (cardProg) cardProg.innerText = store.academic.progCode;
    if (cardCampus) cardCampus.innerText = store.academic.campus.split(',')[0];
    if (mailBtn) mailBtn.href = 'mailto:' + store.advisor.advisorEmail;
  }

  function openSectionModal(sectionKey) {
    const config = SECTION_CONFIG[sectionKey];
    if (!config) return;

    activeSection = sectionKey;
    const store = getStudentStore();
    const sectionValues = store[sectionKey];

    document.getElementById('sectionEditModalLabel').innerText = config.title;
    const fieldsContainer = document.getElementById('section-edit-fields');

    fieldsContainer.innerHTML = config.fields.map(f => `
      <div class="${f.col}">
        <label for="field-${f.key}" class="form-label small fw-semibold">${f.label}</label>
        <input type="${f.type}" class="form-control form-control-sm" id="field-${f.key}" name="${f.key}" value="${sectionValues[f.key] || ''}" required>
      </div>
    `).join('');

    bootstrap.Modal.getOrCreateInstance(modalEl).show();
  }

  editButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      openSectionModal(this.getAttribute('data-edit-section'));
    });
  });

  const sectionForm = document.getElementById('section-edit-form');
  if (sectionForm) {
    sectionForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!activeSection) return;

      const store = getStudentStore();
      const config = SECTION_CONFIG[activeSection];

      config.fields.forEach(f => {
        const input = document.getElementById('field-' + f.key);
        if (input) store[activeSection][f.key] = input.value.trim();
      });

      localStorage.setItem('studentProfileSections', JSON.stringify(store));
      renderAllStudentSections();
      bootstrap.Modal.getOrCreateInstance(modalEl).hide();
    });
  }

  const resetSectionBtn = document.getElementById('reset-section-btn');
  if (resetSectionBtn) {
    resetSectionBtn.addEventListener('click', function () {
      if (!activeSection) return;
      const store = getStudentStore();
      store[activeSection] = { ...DEFAULT_STUDENT_DATA[activeSection] };
      localStorage.setItem('studentProfileSections', JSON.stringify(store));
      renderAllStudentSections();
      openSectionModal(activeSection);
    });
  }

  renderAllStudentSections();
}
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const showRegisterBtn = document.getElementById("show-register");
  const showLoginBtn = document.getElementById("show-login");
  const authAlert = document.getElementById("auth-alert");
  const portalTitle = document.getElementById("portal-title");
  const demoInfo = document.getElementById("demo-info");

  // Helper to show feedback alerts
  function showAlert(message, type = "danger") {
    authAlert.textContent = message;
    authAlert.className = `alert alert-${type} small py-2`;
    authAlert.classList.remove("d-none");
  }

  // Toggle to Registration Form
  if (showRegisterBtn) {
    showRegisterBtn.addEventListener("click", (e) => {
      e.preventDefault();
      loginForm.classList.add("d-none");
      registerForm.classList.remove("d-none");
      demoInfo.classList.add("d-none");
      authAlert.classList.add("d-none");
      portalTitle.textContent = "Create Account";
    });
  }

  // Toggle back to Login Form
  if (showLoginBtn) {
    showLoginBtn.addEventListener("click", (e) => {
      e.preventDefault();
      registerForm.classList.add("d-none");
      loginForm.classList.remove("d-none");
      demoInfo.classList.remove("d-none");
      authAlert.classList.add("d-none");
      portalTitle.textContent = "Student Portal";
    });
  }

  // Handle Registration Submission
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const fullName = document.getElementById("reg-fullname").value.trim();
      const username = document.getElementById("reg-username").value.trim();
      const password = document.getElementById("reg-password").value;
      const confirmPassword = document.getElementById("reg-confirm-password").value;

      if (password !== confirmPassword) {
        showAlert("Passwords do not match!", "danger");
        return;
      }

      // Retrieve existing users from localStorage
      const users = JSON.parse(localStorage.getItem("registeredUsers")) || [];

      // Prevent duplicate Student IDs
      if (username.toLowerCase() === "student" || users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        showAlert("This Student ID is already registered.", "warning");
        return;
      }

      // Save new user
      users.push({ fullName, username, password });
      localStorage.setItem("registeredUsers", JSON.stringify(users));

      // Reset form, switch to login, and pre-fill username
      registerForm.reset();
      showLoginBtn.click();
      document.getElementById("username").value = username;
      document.getElementById("password").value = "";
      showAlert("Registration successful! Please sign in.", "success");
    });
  }

  // Handle Login Submission (Update your existing login listener with this logic)
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const usernameInput = document.getElementById("username").value.trim();
      const passwordInput = document.getElementById("password").value;

      const users = JSON.parse(localStorage.getItem("registeredUsers")) || [];
      const matchedUser = users.find(
        u => u.username === usernameInput && u.password === passwordInput
      );

      // Check default demo account OR newly registered users
      if ((usernameInput === "student" && passwordInput === "password123") || matchedUser) {
        const displayName = matchedUser ? matchedUser.fullName : "Student Demo";
        localStorage.setItem("currentUser", JSON.stringify({ username: usernameInput, fullName: displayName }));
        
        // Redirect to your dashboard page (adjust filename if yours is named differently)
        window.location.href = "dashboard.html"; 
      } else {
        showAlert("Invalid student ID or password!", "danger");
      }
    });
  }
});