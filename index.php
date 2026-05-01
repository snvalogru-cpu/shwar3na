<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>شوارعنا</title>
  <link rel="stylesheet" href="style.css?v=4000">
</head>

<body>

<header>
  <img src="assetsimages/logo.svg" alt="شعار شوارعنا">
  <h1>شوارعنا</h1>
  <p>بلاغك يصنع الفرق… معًا نحو مدينة أفضل</p>
</header>

<nav id="mainNav">

  <button class="mobile-menu-btn" onclick="toggleMobileMenu()">☰ القائمة</button>

  <div id="guestNav">
    <button class="mobile-main-login" onclick="showSection('citizenLoginSection')">دخول المواطن</button>

    <div class="mobile-side-menu" id="mobileSideMenu">
      <button onclick="showSection('registerSection')">إنشاء حساب</button>
      <button onclick="showSection('authorityLoginSection')">دخول الجهات الخدمية</button>
      <button onclick="showSection('adminLoginSection')">دخول الجهة المسؤولة</button>
      <button onclick="showSection('aboutSection')">عن النظام</button>
      <button onclick="showSection('usageSection')">طريقة الاستخدام</button>
      <button onclick="toggleTheme()">فاتح / داكن</button>
    </div>
  </div>

  <div id="citizenNav" class="hidden">
    <div class="mobile-side-menu" id="citizenSideMenu">
      <button onclick="showCitizenPage()">إضافة بلاغ</button>
      <button onclick="showReportsPage()">بلاغاتي</button>
      <button onclick="showSection('trackSection')">تتبع بلاغ</button>
      <button onclick="showContributors()">أبرز المساهمين</button>
      <button onclick="toggleTheme()">فاتح / داكن</button>
      <button class="danger" onclick="logout()">خروج</button>
    </div>
  </div>

  <div id="authorityNav" class="hidden">
    <div class="mobile-side-menu" id="authoritySideMenu">
      <button onclick="showAuthorityPage()">بلاغات الجهة</button>
      <button onclick="toggleTheme()">فاتح / داكن</button>
      <button class="danger" onclick="logout()">خروج</button>
    </div>
  </div>

  <div id="adminNav" class="hidden">
    <div class="mobile-side-menu" id="adminSideMenu">
      <button onclick="showAdminDashboard()">لوحة التحكم</button>
      <button onclick="showReportsPage()">كل البلاغات</button>
      <button onclick="showManageInstitutions()">إدارة الجهات الخدمية</button>
      <button onclick="showContributors()">أبرز المساهمين</button>
      <button onclick="toggleTheme()">فاتح / داكن</button>
      <button class="danger" onclick="logout()">خروج</button>
    </div>
  </div>

</nav>

<main class="container">

  <section class="hero-gallery">
    <img src="assetsimages/1.jpeg" alt="صورة 1">
    <img src="assetsimages/2.jpeg" alt="صورة 2">
    <img src="assetsimages/3.jpeg" alt="صورة 3">
    <img src="assetsimages/4.jpeg" alt="صورة 4">
  </section>

  <section class="card" id="aboutSection">
    <h2>عن النظام</h2>
    <p>
      نظام شوارعنا هو منصة إلكترونية تساعد المواطن على إرسال البلاغات
      إلى الجهات الخدمية المختصة ومتابعة حالة البلاغ بسهولة.
    </p>
  </section>

  <section class="card hidden" id="usageSection">
    <h2>طريقة الاستخدام</h2>
    <p>1. أنشئ حساب مواطن.</p>
    <p>2. سجل الدخول برقم الهاتف وكلمة المرور.</p>
    <p>3. أضف بلاغًا جديدًا مع التصنيف والموقع والصورة إن وجدت.</p>
    <p>4. تابع حالة البلاغ من صفحة التتبع.</p>
  </section>

  <p class="welcome" id="welcomeText">لم يتم تسجيل الدخول بعد</p>

  <section class="card hidden" id="citizenLoginSection">
    <h2>تسجيل دخول المواطن</h2>

    <form id="citizenLoginForm">
      <label>رقم الهاتف</label>
      <input type="tel" id="citizenPhone" placeholder="مثال: 0912345678" required>

      <label>كلمة المرور</label>
      <input type="password" id="citizenPassword" placeholder="أدخل كلمة المرور" required>

      <button type="submit">دخول المواطن</button>
      <button type="button" class="gray" onclick="forgotPassword()">هل نسيت كلمة المرور؟</button>
    </form>
  </section>

  <section class="card hidden" id="registerSection">
    <h2>إنشاء حساب مواطن</h2>

    <form id="registerForm">
      <label>اسم المواطن</label>
      <input type="text" id="registerName" placeholder="اكتب اسمك الكامل" required>

      <label>رقم الهاتف</label>
      <input type="tel" id="registerPhone" placeholder="مثال: 0912345678" required>

      <label>البريد الإلكتروني اختياري</label>
      <input type="email" id="registerEmail" placeholder="example@email.com">

      <label>كلمة المرور</label>
      <input type="password" id="registerPassword" placeholder="أدخل كلمة المرور" required>

      <button type="submit">إنشاء الحساب</button>
    </form>
  </section>

  <section class="card hidden" id="authorityLoginSection">
    <h2>تسجيل دخول الجهات الخدمية</h2>

    <form id="authorityLoginForm">
      <label>اختر الجهة</label>
      <select id="authorityRole" required></select>

      <label>كلمة المرور</label>
      <input type="password" id="authorityPassword" placeholder="أدخل كلمة المرور" required>

      <button type="submit">دخول الجهة</button>
    </form>

    <div class="hint" id="passwordHint"></div>
  </section>

  <section class="card hidden" id="adminLoginSection">
    <h2>دخول الجهة المسؤولة</h2>

    <form id="adminLoginForm">
      <label>اسم الجهة المسؤولة</label>
      <input type="text" id="adminName" placeholder="مثال: بلدية طرابلس" required>

      <label>كلمة المرور</label>
      <input type="password" id="adminPassword" placeholder="كلمة المرور" required>

      <button type="submit">دخول</button>
    </form>

    <div class="hint">كلمة مرور الجهة المسؤولة: <b>admin123</b></div>
  </section>

  <section class="card hidden" id="adminDashboardSection">
    <h2>لوحة تحكم الجهة المسؤولة</h2>

    <div class="stats">
      <div class="stat-box"><strong id="dashReports">0</strong>عدد البلاغات</div>
      <div class="stat-box"><strong id="dashInstitutions">0</strong>عدد الجهات</div>
      <div class="stat-box"><strong id="dashCitizens">0</strong>عدد المواطنين</div>
      <div class="stat-box"><strong id="dashRejected">0</strong>بلاغات مرفوضة</div>
    </div>

    <h3>آخر البلاغات</h3>
    <div id="latestReports"></div>
  </section>

  <section class="card hidden" id="manageInstitutionsSection">
    <h2>إدارة الجهات الخدمية</h2>
    <div class="hint">هذه الصفحة تظهر للجهة المسؤولة فقط.</div>

    <form id="institutionForm">
      <label>اسم الجهة الخدمية</label>
      <input type="text" id="institutionName" placeholder="مثال: وزارة الصحة" required>

      <label>التصنيف</label>
      <input type="text" id="institutionCategory" placeholder="مثال: صحة" required>

      <label>اسم داخلي بالإنجليزي</label>
      <input type="text" id="institutionRole" placeholder="example: health" required>

      <label>مسار الشعار</label>
      <input type="text" id="institutionLogo" placeholder="assetsimages/health.jpg">

      <label>كلمة المرور المولدة</label>
      <input type="text" id="institutionPassword" readonly>

      <button type="button" onclick="generateInstitutionPassword()">توليد كلمة مرور</button>
      <button type="submit">إضافة الجهة</button>
    </form>

    <div id="institutionsList" style="margin-top:20px;"></div>
  </section>

  <section class="card hidden" id="userSection">
    <h2>إضافة بلاغ جديد</h2>

    <form id="reportForm">
      <label>عنوان البلاغ</label>
      <input type="text" id="reportTitle" placeholder="مثال: حفرة في الطريق" required>

      <label>التصنيف</label>
      <select id="reportCategory" required></select>

      <label>الأولوية</label>
      <select id="reportPriority" required>
        <option value="عادي">عادي</option>
        <option value="مهم">مهم</option>
        <option value="عاجل">عاجل</option>
      </select>

      <label>الوصف</label>
      <textarea id="reportDesc" placeholder="اكتب تفاصيل البلاغ" required></textarea>

      <label>الموقع GPS</label>
      <input type="text" id="reportGps" placeholder="مثال: 32.8872, 13.1913">

      <button type="button" class="gray" onclick="getCurrentLocation()">تحديد موقعي تلقائيًا</button>
      <button type="button" class="gray" onclick="openMapOnly()">فتح الخريطة</button>

      <label>صورة البلاغ</label>
      <input type="file" id="reportImage" accept="image/*">

      <button type="submit">إرسال البلاغ</button>
    </form>
  </section>

  <section class="card hidden" id="trackSection">
    <h2>تتبع البلاغ</h2>
    <input type="number" id="trackId" placeholder="اكتب رقم البلاغ">
    <button onclick="trackReport()">بحث</button>
    <div id="trackResult"></div>
  </section>

  <section class="card hidden" id="contributorsSection">
    <h2>أبرز المساهمين</h2>
    <div id="contributorsList"></div>
  </section>

  <section class="card hidden" id="reportsSection">
    <h2>قائمة البلاغات</h2>

    <div class="stats">
      <div class="stat-box"><strong id="statAll">0</strong>كل البلاغات</div>
      <div class="stat-box"><strong id="statNew">0</strong>جديد</div>
      <div class="stat-box"><strong id="statProgress">0</strong>قيد المعالجة</div>
      <div class="stat-box"><strong id="statDone">0</strong>تم الحل</div>
    </div>

    <div class="filters">
      <input type="number" id="searchId" placeholder="بحث برقم البلاغ" oninput="renderReports()">

      <select id="filterStatus" onchange="renderReports()">
        <option value="">كل الحالات</option>
        <option value="جديد">جديد</option>
        <option value="قيد المعالجة">قيد المعالجة</option>
        <option value="تم الحل">تم الحل</option>
        <option value="مرفوض">مرفوض</option>
      </select>

      <select id="filterCategory" onchange="renderReports()"></select>

      <select id="filterPriority" onchange="renderReports()">
        <option value="">كل الأولويات</option>
        <option value="عادي">عادي</option>
        <option value="مهم">مهم</option>
        <option value="عاجل">عاجل</option>
      </select>
    </div>

    <table>
      <thead>
        <tr>
          <th>رقم البلاغ</th>
          <th>اسم المواطن</th>
          <th>الصورة</th>
          <th>رقم المواطن</th>
          <th>العنوان</th>
          <th>التصنيف</th>
          <th>الأولوية</th>
          <th>الجهة</th>
          <th>الحالة</th>
          <th>تاريخ الإنشاء</th>
          <th>آخر تحديث</th>
          <th>إجراء</th>
        </tr>
      </thead>
      <tbody id="reportsTable"></tbody>
    </table>
  </section>

  <section class="card hidden" id="authoritySection">
    <div id="authorityHeader"></div>

    <div class="stats">
      <div class="stat-box"><strong id="authAll">0</strong>كل البلاغات</div>
      <div class="stat-box"><strong id="authNew">0</strong>جديد</div>
      <div class="stat-box"><strong id="authProgress">0</strong>قيد المعالجة</div>
      <div class="stat-box"><strong id="authDone">0</strong>تم الحل</div>
    </div>

    <div id="authorityReports"></div>
  </section>

</main>

<footer>
  شوارعنا - معًا نحو مدينة أفضل
</footer>

<script src="script.js?v=4000"></script>
</body>
</html>