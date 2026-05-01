let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
let institutions = [];
let reports = [];
let blockedUsers = [];

const adminPassword = "admin123";

const citizenLoginForm = document.getElementById("citizenLoginForm");
const registerForm = document.getElementById("registerForm");
const authorityLoginForm = document.getElementById("authorityLoginForm");
const adminLoginForm = document.getElementById("adminLoginForm");
const institutionForm = document.getElementById("institutionForm");
const reportForm = document.getElementById("reportForm");
const welcomeText = document.getElementById("welcomeText");

const authorityRole = document.getElementById("authorityRole");
const reportCategory = document.getElementById("reportCategory");
const filterCategory = document.getElementById("filterCategory");
const passwordHint = document.getElementById("passwordHint");

function updateNavbar() {
  document.getElementById("guestNav").classList.add("hidden");
  document.getElementById("citizenNav").classList.add("hidden");
  document.getElementById("authorityNav").classList.add("hidden");
  document.getElementById("adminNav").classList.add("hidden");

  if (!currentUser) {
    document.getElementById("guestNav").classList.remove("hidden");
  } else if (currentUser.role === "citizen") {
    document.getElementById("citizenNav").classList.remove("hidden");
  } else if (currentUser.role === "admin") {
    document.getElementById("adminNav").classList.remove("hidden");
  } else {
    document.getElementById("authorityNav").classList.remove("hidden");
  }
}

function showSection(id) {
  document.querySelectorAll("main section.card").forEach(section => {
    section.classList.add("hidden");
  });

  const section = document.getElementById(id);
  if (section) section.classList.remove("hidden");
}

function loadInstitutions() {
  fetch("get_institutions.php")
    .then(res => res.json())
    .then(data => {
      institutions = data;
      fillInstitutions();
      renderInstitutionsList();
      renderAuthorityReports();
      renderAdminDashboard();
    })
    .catch(() => alert("تعذر تحميل الجهات الخدمية"));
}

function loadReports() {
  fetch("get_reports.php")
    .then(res => res.json())
    .then(data => {
      reports = data;
      renderReports();
      renderAuthorityReports();
      renderContributors();
      renderAdminDashboard();
    })
    .catch(() => alert("خطأ في تحميل البلاغات"));
}

function loadBlockedUsers() {
  fetch("get_blocked_users.php")
    .then(res => res.json())
    .then(data => {
      blockedUsers = data;
      renderAuthorityReports();
    })
    .catch(() => console.log("تعذر تحميل المحظورين"));
}

function generateId() {
  let id;
  do {
    id = Math.floor(100000 + Math.random() * 900000);
  } while (reports.some(r => Number(r.id) === id));
  return id;
}

function getNow() {
  return new Date().toLocaleString("ar-LY");
}

function fillInstitutions() {
  authorityRole.innerHTML = `<option value="">اختر الجهة</option>`;
  reportCategory.innerHTML = `<option value="">اختر التصنيف</option>`;
  filterCategory.innerHTML = `<option value="">كل التصنيفات</option>`;

  institutions.forEach(inst => {
    authorityRole.innerHTML += `<option value="${inst.role}">${inst.name}</option>`;
    reportCategory.innerHTML += `<option value="${inst.category}">${inst.category}</option>`;
    filterCategory.innerHTML += `<option value="${inst.category}">${inst.category}</option>`;
  });

  passwordHint.innerHTML = "اختر الجهة وأدخل كلمة المرور الخاصة بها.";
}

function getInstitutionByRole(role) {
  return institutions.find(inst => inst.role === role);
}

function getInstitutionByCategory(category) {
  return institutions.find(inst => inst.category === category);
}

function showReportsPage() {
  if (!currentUser) {
    alert("يجب تسجيل الدخول أولًا");
    showSection("citizenLoginSection");
    return;
  }

  showSection("reportsSection");
  loadReports();
}

function showContributors() {
  showSection("contributorsSection");
  renderContributors();
}

function showManageInstitutions() {
  if (!currentUser || currentUser.role !== "admin") {
    alert("هذه الصفحة خاصة بالجهة المسؤولة فقط");
    return;
  }

  showSection("manageInstitutionsSection");
  renderInstitutionsList();
}

function showAdminDashboard() {
  if (!currentUser || currentUser.role !== "admin") {
    alert("هذه الصفحة خاصة بالجهة المسؤولة فقط");
    return;
  }

  showSection("adminDashboardSection");
  renderAdminDashboard();
}

function renderAdminDashboard() {
  const dashReports = document.getElementById("dashReports");
  if (!dashReports) return;

  dashReports.textContent = reports.length;
  document.getElementById("dashInstitutions").textContent = institutions.length;

  const citizens = new Set(reports.map(r => r.citizenPhone));
  document.getElementById("dashCitizens").textContent = citizens.size;

  document.getElementById("dashRejected").textContent =
    reports.filter(r => r.status === "مرفوض").length;

  const box = document.getElementById("latestReports");
  box.innerHTML = "";

  reports.slice(0, 5).forEach(r => {
    box.innerHTML += `
      <div class="report-box">
        <h3>${r.title}</h3>
        <p><b>رقم البلاغ:</b> ${r.id}</p>
        <p><b>الحالة:</b> <span class="${getStatusClass(r.status)}">${r.status}</span></p>
        <p><b>الجهة:</b> ${r.authority}</p>
        <button onclick="openReportMap('${r.gps || ""}')">فتح الموقع</button>
      </div>
    `;
  });
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
}

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

function updateWelcome() {
  if (currentUser) {
    welcomeText.textContent = "مرحبًا " + currentUser.username + " - " + currentUser.displayRole;
  } else {
    welcomeText.textContent = "لم يتم تسجيل الدخول بعد";
  }
}

function generateInstitutionPassword() {
  const password = Math.floor(100000 + Math.random() * 900000);
  document.getElementById("institutionPassword").value = password;
}

function renderInstitutionsList() {
  const box = document.getElementById("institutionsList");
  if (!box) return;

  if (!currentUser || currentUser.role !== "admin") {
    box.innerHTML = "<p>لا توجد صلاحية لعرض الجهات.</p>";
    return;
  }

  if (institutions.length === 0) {
    box.innerHTML = "<p>لا توجد جهات مسجلة.</p>";
    return;
  }

  box.innerHTML = "<h3>الجهات الخدمية الحالية</h3>";

  institutions.forEach(inst => {
    box.innerHTML += `
      <div class="report-box">
        <p><b>الاسم:</b> ${inst.name}</p>
        <p><b>التصنيف:</b> ${inst.category}</p>
        <p><b>الاسم الداخلي:</b> ${inst.role}</p>
        <p><b>كلمة المرور:</b> ${inst.password}</p>
        <p><b>الشعار:</b> ${inst.logo || "بدون شعار"}</p>
        ${inst.logo ? `<img src="${inst.logo}" class="authority-logo" alt="${inst.name}">` : ""}
        <button class="danger" onclick="deleteInstitution('${inst.role}')">حذف الجهة</button>
      </div>
    `;
  });
}

if (institutionForm) {
  institutionForm.addEventListener("submit", function(e) {
    e.preventDefault();

    if (!currentUser || currentUser.role !== "admin") {
      alert("إضافة الجهات خاصة بالجهة المسؤولة فقط");
      return;
    }

    const name = document.getElementById("institutionName").value.trim();
    const category = document.getElementById("institutionCategory").value.trim();
    const role = document.getElementById("institutionRole").value.trim();
    const logo = document.getElementById("institutionLogo").value.trim();
    let password = document.getElementById("institutionPassword").value.trim();

    if (!name || !category || !role) {
      alert("الرجاء تعبئة اسم الجهة والتصنيف والاسم الداخلي");
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(role)) {
      alert("الاسم الداخلي يجب أن يكون إنجليزي بدون مسافات. مثال: health");
      return;
    }

    if (!password) {
      password = String(Math.floor(100000 + Math.random() * 900000));
      document.getElementById("institutionPassword").value = password;
    }

    fetch("add_institution.php", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ name, category, role, password, logo })
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === "success") {
        alert("تمت إضافة الجهة بنجاح. كلمة المرور: " + password);
        institutionForm.reset();
        loadInstitutions();
      } else {
        alert("حدث خطأ. قد يكون الاسم الداخلي مستخدمًا مسبقًا.");
      }
    })
    .catch(() => alert("تعذر الاتصال بملف add_institution.php"));
  });
}

function deleteInstitution(role) {
  if (!currentUser || currentUser.role !== "admin") {
    alert("حذف الجهات خاص بالجهة المسؤولة فقط");
    return;
  }

  if (!confirm("هل أنت متأكد من حذف هذه الجهة؟")) return;

  fetch("delete_institution.php", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ role })
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === "success") {
      alert("تم حذف الجهة");
      loadInstitutions();
      loadReports();
    } else {
      alert("حدث خطأ أثناء حذف الجهة");
    }
  })
  .catch(() => alert("تعذر الاتصال بملف delete_institution.php"));
}

registerForm.addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("registerName").value.trim();
  const phone = document.getElementById("registerPhone").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value;

  fetch("register.php", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ name, phone, email, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === "success") {
      alert("تم إنشاء الحساب بنجاح");
      registerForm.reset();
      showSection("citizenLoginSection");
    } else if (data.status === "exists") {
      alert("رقم الهاتف مستخدم مسبقًا");
    } else {
      alert("حدث خطأ أثناء إنشاء الحساب");
    }
  })
  .catch(() => alert("تعذر الاتصال بملف register.php"));
});

citizenLoginForm.addEventListener("submit", function(e) {
  e.preventDefault();

  const phone = document.getElementById("citizenPhone").value.trim();
  const password = document.getElementById("citizenPassword").value.trim();

  if (!phone || !password) {
    alert("رقم الهاتف وكلمة المرور مطلوبان");
    return;
  }

  if (blockedUsers.includes(phone)) {
    alert("هذا المواطن محظور ولا يمكنه تسجيل الدخول");
    return;
  }

  fetch("login.php", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ phone, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === "success") {
      currentUser = {
        username: data.user.full_name,
        fullName: data.user.full_name,
        phone: data.user.phone,
        email: data.user.email || "",
        role: "citizen",
        displayRole: "المواطن"
      };

      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      updateWelcome();
      updateNavbar();
      showSection("userSection");
      loadReports();
    } else {
      alert("رقم الهاتف أو كلمة المرور غير صحيحة");
    }
  })
  .catch(() => alert("تعذر الاتصال بملف login.php"));
});

authorityLoginForm.addEventListener("submit", function(e) {
  e.preventDefault();

  const role = authorityRole.value;
  const password = document.getElementById("authorityPassword").value;
  const institution = getInstitutionByRole(role);

  if (!institution || !password) {
    alert("الرجاء تعبئة كل البيانات");
    return;
  }

  if (password !== institution.password) {
    alert("كلمة المرور غير صحيحة");
    return;
  }

  currentUser = {
    username: institution.name,
    role: institution.role,
    displayRole: institution.name
  };

  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  updateWelcome();
  updateNavbar();
  showAuthorityPage();
  loadReports();
});

adminLoginForm.addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("adminName").value.trim();
  const password = document.getElementById("adminPassword").value;

  if (password !== adminPassword) {
    alert("كلمة المرور غير صحيحة");
    return;
  }

  currentUser = {
    username: name,
    role: "admin",
    displayRole: "الجهة المسؤولة"
  };

  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  updateWelcome();
  updateNavbar();
  showAdminDashboard();
});

function forgotPassword() {
  const phone = document.getElementById("citizenPhone").value.trim();

  if (!phone) {
    alert("اكتب رقم الهاتف أولًا");
    return;
  }

  alert("تم إرسال طلب استرجاع كلمة المرور للرقم: " + phone);
}

function getCurrentLocation() {
  if (!navigator.geolocation) {
    alert("المتصفح لا يدعم تحديد الموقع");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    position => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      document.getElementById("reportGps").value = lat + ", " + lng;
      window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
    },
    () => alert("تعذر الحصول على الموقع")
  );
}

function openMapOnly() {
  window.open("https://www.google.com/maps", "_blank");
}

function openReportMap(gps) {
  if (!gps) {
    alert("لا يوجد موقع لهذا البلاغ");
    return;
  }

  window.open("https://www.google.com/maps?q=" + encodeURIComponent(gps), "_blank");
}

function showCitizenPage() {
  if (!currentUser || currentUser.role !== "citizen") {
    alert("يجب تسجيل الدخول كمواطن");
    showSection("citizenLoginSection");
    return;
  }

  if (blockedUsers.includes(currentUser.phone)) {
    alert("أنت محظور ولا يمكنك إضافة بلاغات");
    logout();
    return;
  }

  showSection("userSection");
}

function showAuthorityPage() {
  if (!currentUser || currentUser.role === "citizen") {
    alert("هذه الواجهة خاصة بالجهات الخدمية أو الجهة المسؤولة");
    showSection("authorityLoginSection");
    return;
  }

  if (currentUser.role === "admin") {
    showAdminDashboard();
    return;
  }

  showSection("authoritySection");
  renderAuthorityReports();
}

reportForm.addEventListener("submit", function(e) {
  e.preventDefault();

  if (!currentUser || currentUser.role !== "citizen") {
    alert("يجب تسجيل الدخول كمواطن");
    return;
  }

  const title = document.getElementById("reportTitle").value;
  const category = document.getElementById("reportCategory").value;
  const priority = document.getElementById("reportPriority").value;
  const desc = document.getElementById("reportDesc").value;
  const gps = document.getElementById("reportGps").value;
  const file = document.getElementById("reportImage").files[0];
  const institution = getInstitutionByCategory(category);

  function saveReport(imageData) {
    const id = generateId();
    const now = getNow();

    const newReport = {
      id,
      citizenName: currentUser.fullName,
      citizenPhone: currentUser.phone,
      citizenEmail: currentUser.email || "",
      title,
      category,
      priority,
      desc,
      gps,
      image: imageData || "",
      authority: institution ? institution.name : "غير محدد",
      authorityRole: institution ? institution.role : "",
      status: "جديد",
      institutionNote: "",
      createdAt: now,
      updatedAt: now
    };

    fetch("save_report.php", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(newReport)
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === "success") {
        reportForm.reset();
        loadReports();
        showSection("reportsSection");
        alert("تم حفظ البلاغ. رقم البلاغ: " + id);
      } else {
        alert("خطأ أثناء الحفظ");
      }
    })
    .catch(() => alert("تعذر الاتصال بملف save_report.php"));
  }

  if (file) {
    const reader = new FileReader();
    reader.onload = e => saveReport(e.target.result);
    reader.readAsDataURL(file);
  } else {
    saveReport("");
  }
});

function getStatusClass(status) {
  if (status === "جديد") return "status-new";
  if (status === "قيد المعالجة") return "status-progress";
  if (status === "تم الحل") return "status-done";
  if (status === "مرفوض") return "status-rejected";
  return "";
}

function getPriorityClass(priority) {
  if (priority === "عادي") return "priority-normal";
  if (priority === "مهم") return "priority-important";
  if (priority === "عاجل") return "priority-urgent";
  return "";
}

function updateStats(list = reports) {
  document.getElementById("statAll").textContent = list.length;
  document.getElementById("statNew").textContent = list.filter(r => r.status === "جديد").length;
  document.getElementById("statProgress").textContent = list.filter(r => r.status === "قيد المعالجة").length;
  document.getElementById("statDone").textContent = list.filter(r => r.status === "تم الحل").length;
}

function renderReports() {
  const table = document.getElementById("reportsTable");
  const searchId = document.getElementById("searchId").value.trim();
  const status = document.getElementById("filterStatus").value;
  const category = document.getElementById("filterCategory").value;
  const priority = document.getElementById("filterPriority").value;

  let visibleReports = reports;

  if (currentUser && currentUser.role === "citizen") {
    visibleReports = reports.filter(r => r.citizenPhone === currentUser.phone);
  }

  let filtered = visibleReports.filter(r =>
    (!searchId || String(r.id).includes(searchId)) &&
    (!status || r.status === status) &&
    (!category || r.category === category) &&
    (!priority || r.priority === priority)
  );

  updateStats(filtered);
  table.innerHTML = "";

  filtered.forEach(r => {
    table.innerHTML += `
      <tr>
        <td>${r.id}</td>
        <td>${currentUser && currentUser.role === "citizen" ? "سري" : (r.citizenName || "-")}</td>
        <td>${r.image ? `<img src="${r.image}" class="report-img">` : "بدون صورة"}</td>
        <td>${currentUser && currentUser.role === "citizen" ? "سري" : r.citizenPhone}</td>
        <td>${r.title}</td>
        <td>${r.category}</td>
        <td class="${getPriorityClass(r.priority)}">${r.priority || "عادي"}</td>
        <td>${r.authority}</td>
        <td class="${getStatusClass(r.status)}">${r.status}</td>
        <td>${r.createdAt || "-"}</td>
        <td>${r.updatedAt || "-"}</td>
        <td>
          <button onclick="openReportMap('${r.gps || ""}')">الخريطة</button>
          ${
            currentUser && currentUser.role !== "citizen"
            ? `<button class="danger" onclick="deleteReport(${r.id})">حذف</button>`
            : ""
          }
        </td>
      </tr>
    `;
  });
}

function renderAuthorityStats(list) {
  document.getElementById("authAll").textContent = list.length;
  document.getElementById("authNew").textContent = list.filter(r => r.status === "جديد").length;
  document.getElementById("authProgress").textContent = list.filter(r => r.status === "قيد المعالجة").length;
  document.getElementById("authDone").textContent = list.filter(r => r.status === "تم الحل").length;
}

function renderAuthorityReports() {
  const box = document.getElementById("authorityReports");
  const header = document.getElementById("authorityHeader");

  box.innerHTML = "";
  header.innerHTML = "";

  if (!currentUser || currentUser.role === "citizen" || currentUser.role === "admin") return;

  const institution = getInstitutionByRole(currentUser.role);
  if (!institution) return;

  const list = reports.filter(r => r.authorityRole === institution.role);

  header.innerHTML = `
    <div class="authority-header">
      <img src="${institution.logo}" class="authority-logo">
      <h2 class="authority-title">${institution.name}</h2>
    </div>
  `;

  renderAuthorityStats(list);

  if (list.length === 0) {
    box.innerHTML = "<p>لا توجد بلاغات لهذه الجهة حاليًا.</p>";
    return;
  }

  list.forEach(r => {
    const isBlocked = blockedUsers.includes(r.citizenPhone);

    box.innerHTML += `
      <div class="report-box">
        <h3>${r.title}</h3>
        <p><b>رقم البلاغ:</b> ${r.id}</p>
        <p><b>اسم المواطن:</b> ${r.citizenName}</p>
        <p><b>رقم المواطن:</b> ${r.citizenPhone}</p>
        <p><b>البريد:</b> ${r.citizenEmail || "غير مضاف"}</p>
        <p><b>الوصف:</b> ${r.desc}</p>
        <p><b>الموقع:</b> ${r.gps || "غير محدد"}</p>

        <button onclick="openReportMap('${r.gps || ""}')">فتح الموقع على الخريطة</button>

        ${r.image ? `<img src="${r.image}" class="full-img">` : ""}

        <p><b>الحالة:</b> <span class="${getStatusClass(r.status)}">${r.status}</span></p>

        <select onchange="updateStatus(${r.id}, this.value)">
          <option ${r.status === "جديد" ? "selected" : ""}>جديد</option>
          <option ${r.status === "قيد المعالجة" ? "selected" : ""}>قيد المعالجة</option>
          <option ${r.status === "تم الحل" ? "selected" : ""}>تم الحل</option>
          <option ${r.status === "مرفوض" ? "selected" : ""}>مرفوض</option>
        </select>

        <textarea id="note-${r.id}">${r.institutionNote || ""}</textarea>
        <button onclick="saveInstitutionNote(${r.id})">حفظ الملاحظة</button>

        ${
          isBlocked
          ? `<button class="success" onclick="unblockUser('${r.citizenPhone}')">إلغاء حظر المواطن</button>`
          : `<button class="danger" onclick="blockUser('${r.citizenPhone}')">حظر المواطن</button>`
        }

        <button class="danger" onclick="deleteReport(${r.id})">حذف البلاغ</button>
      </div>
    `;
  });
}

function renderContributors() {
  const box = document.getElementById("contributorsList");
  box.innerHTML = "";

  if (reports.length === 0) {
    box.innerHTML = "<p>لا توجد مساهمات بعد.</p>";
    return;
  }

  const counts = {};

  reports.forEach(r => {
    if (!counts[r.citizenPhone]) {
      counts[r.citizenPhone] = {
        name: r.citizenName,
        phone: r.citizenPhone,
        count: 0
      };
    }
    counts[r.citizenPhone].count++;
  });

  Object.values(counts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .forEach((item, index) => {
      box.innerHTML += `
        <div class="contributor">
          <div>
            <h3>${index + 1}. ${item.name}</h3>
            <p>${item.phone}</p>
          </div>
          <strong>${item.count} بلاغ</strong>
        </div>
      `;
    });
}

function updateStatus(id, status) {
  const updatedAt = getNow();

  fetch("update_status.php", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ id, status, updatedAt })
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === "success") {
      loadReports();
      alert("تم تحديث الحالة");
    }
  });
}

function saveInstitutionNote(id) {
  const note = document.getElementById("note-" + id).value;
  const updatedAt = getNow();

  fetch("save_note.php", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ id, note, updatedAt })
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === "success") {
      loadReports();
      alert("تم حفظ الملاحظة");
    }
  });
}

function deleteReport(id) {
  if (!currentUser || currentUser.role === "citizen") {
    alert("لا تملك صلاحية الحذف");
    return;
  }

  if (!confirm("هل أنت متأكد من الحذف؟")) return;

  fetch("delete_report.php", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ id })
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === "success") {
      loadReports();
      alert("تم الحذف");
    }
  });
}

function blockUser(phone) {
  fetch("block_user.php", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ phone })
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === "success") {
      loadBlockedUsers();
      alert("تم حظر المواطن");
    }
  });
}

function unblockUser(phone) {
  fetch("unblock_user.php", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ phone })
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === "success") {
      loadBlockedUsers();
      alert("تم إلغاء الحظر");
    }
  });
}

function trackReport() {
  const id = Number(document.getElementById("trackId").value);
  const result = document.getElementById("trackResult");
  const report = reports.find(r => Number(r.id) === id);

  if (!report) {
    result.innerHTML = `<div class="track-result">لم يتم العثور على البلاغ</div>`;
    return;
  }

  result.innerHTML = `
    <div class="track-result">
      <h3>نتيجة التتبع</h3>
      <p><b>رقم البلاغ:</b> ${report.id}</p>
      <p><b>العنوان:</b> ${report.title}</p>
      <p><b>الحالة:</b> <span class="${getStatusClass(report.status)}">${report.status}</span></p>
      <p><b>الجهة:</b> ${report.authority}</p>
      <p><b>ملاحظات الجهة:</b> ${report.institutionNote || "لا توجد ملاحظات"}</p>
      <button onclick="openReportMap('${report.gps || ""}')">فتح الموقع</button>
    </div>
  `;
}

function logout() {
  currentUser = null;
  localStorage.removeItem("currentUser");
  updateWelcome();
  updateNavbar();
  showSection("citizenLoginSection");
}

loadInstitutions();
updateWelcome();
updateNavbar();
loadReports();
loadBlockedUsers();

if (currentUser) {
  if (currentUser.role === "citizen") {
    showSection("userSection");
  } else if (currentUser.role === "admin") {
    showAdminDashboard();
  } else {
    showAuthorityPage();
  }
} else {
  showSection("aboutSection");
}
function toggleMobileMenu() {
  const menus = document.querySelectorAll(".mobile-side-menu");

  menus.forEach(menu => {
    if (!menu.closest(".hidden")) {
      menu.classList.toggle("active");
    }
  });
}
document.addEventListener("click", function(e) {
  if (e.target.closest(".mobile-side-menu button")) {
    document.querySelectorAll(".mobile-side-menu").forEach(menu => {
      menu.classList.remove("active");
    });
  }
});