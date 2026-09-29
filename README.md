# 🎓 Apex IELTS & Study Abroad Academy - Dynamic Web Platform

A complete, production-ready, fully dynamic website with a built-in Admin CMS & Leads CRM for an IELTS / PTE / Spoken English Coaching Institute.

---

## 🌟 Key Features

### 1. Public Institute Website (`/`)
- **Top Notice Ticker**: Dynamic announcement bar with Call Now & Claim Demo button.
- **Hero Section**: High-converting headline, certified examiner badges, quick phone callback form, and live Band 8.5 badge card.
- **Counter Statistics**: Real-time stats (Success rate, students trained, 8+ band achievers, years of excellence).
- **Courses & Band Programs**: Filterable by IELTS Academic, General Training, Crash Course, PTE Academic, and Spoken English. Each with fees, duration, modes, syllabus bullet points, and demo booking button.
- **Hall of Fame & Results**: Student scorecards with individual module breakdown (Listening, Reading, Writing, Speaking), destination countries, flags, and admission proofs.
- **Why Choose Us**: 6 detailed pillars (1-on-1 Speaking cabins, daily writing line corrections, official CD-IELTS lab, Cambridge 1-19 kits, Saturday full-hall mocks).
- **Photo & Campus Gallery**: Filterable categories (Classroom & Labs, Celebrations & Visas, Awards, Seminars, Mock Tests) with interactive Lightbox preview.
- **Upcoming Batches**: Real-time batch schedules, timings, seat availability badges, and instant reservation.
- **Student Reviews**: 5-star verified testimonial cards.
- **FAQ Accordion**: Comprehensive answers to student and immigration queries.
- **Interactive Lead Booking Modal**: Captures Name, Phone, Email, Preferred Course, Target Band, City, and Message.
- **Floating WhatsApp Button**: Direct 1-click WhatsApp chat link with prefilled inquiry message.

---

### 2. Full Admin Control Panel (`/admin`)
Access URL: `http://localhost:3000/admin`
- **Default Username**: `admin`
- **Default Password**: `password123` *(Can be updated directly from the Settings page)*

#### Admin Dashboard Capabilities:
1. **📊 Overview Metrics**: Real-time counts of total student inquiries, active courses, gallery pictures, and top scorers.
2. **⚙️ Site Settings & Hero**:
   - Update Institute name, tagline, primary phone, WhatsApp number, email, address, working hours.
   - Edit Top Announcement Bar text & toggle visibility.
   - Update Hero Headline, Sub-headline, Badge, and Banner image (direct file upload or image URL).
   - Change Admin password.
3. **📚 Course Manager**: Add, edit, or delete courses with custom fees, duration, mode, image, and bullet points.
4. **🖼️ Gallery Manager**:
   - **Direct Computer File Upload**: Upload photos directly from your computer (auto-saved to `/public/uploads/`).
   - Categorize photos (Classrooms, Visas, Celebrations, Seminars).
   - Delete/update photos anytime.
5. **🏆 High Achievers / Results**: Add student results with overall band (8.5, 8.0, 7.5), individual module bands (L/R/W/S), destination university & flag, student quote, and photo.
6. **💬 Testimonials**: Add, update, or remove student reviews and 5-star ratings.
7. **⏰ Upcoming Batches**: Manage batch start dates, timings, mode (online/offline), and seat status.
8. **👥 Student Leads & Inquiries CRM**:
   - View all students who booked a demo or requested a callback.
   - Filter by status: `New`, `Contacted`, `Demo Scheduled`, `Enrolled`, `Closed`.
   - Update counseling remarks/notes for each lead.
   - Export all inquiries to CSV spreadsheet with 1-click!

---

## 🚀 How to Run

1. **Install dependencies** (already installed):
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Or Run Production Build**:
   ```bash
   npm run build
   npm start
   ```

---

## 🔒 Default Admin Credentials
- **URL**: `http://localhost:3000/admin/login`
- **Username**: `admin`
- **Password**: `password123`
