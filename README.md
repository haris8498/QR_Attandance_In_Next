# QR Attendance System - Next.js

A revolutionary QR code-based attendance system with role-based access for Admins, Teachers, and Students.

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI**: React 18, Tailwind CSS
- **Animations**: Framer Motion
- **QR**: qrcode.react, jsQR
- **Real-time**: Socket.io Client
- **3D Graphics**: Three.js

---

## How to Run this repo's code

### Step 1: Download the code

a. Click on "Code" button menu
b. Click on "Download ZIP"

### Step 2: Extracting the code files

a. Click on downloaded file. It will be a compressed file
b. Right click on the file and click on "Extract here"
c. Now, a folder will be created with the same name as the downloaded file

### Step 3: Open with VS Code

a. Double click on the folder created in the previous step
b. Open this directory in VS Code

### Step 4: Installing required NPM packages

a. Open terminal window in VS Code
b. Type the following command in the terminal and press "Enter"

```bash
npm install
```

### Step 5: Run the code

Type the following command in the terminal and press "Enter"

```bash
npm run dev
```

The app will be available at **http://localhost:3000**

### Step 6: View the output

Follow any of the methods below to view the output:

**Method 1:** Copy the complete URL (http://localhost:3000), paste in any browser's address bar and hit enter

**Method 2:** Ctrl+Click on the URL in the terminal

---

## 📁 Project Structure

```
Frontend/
├── app/                      # Next.js App Router
│   ├── layout.js            # Root layout with metadata
│   ├── page.js              # Home page
│   ├── features/            # Features page
│   ├── how-it-works/        # How It Works page
│   ├── about/               # About page
│   ├── contact/             # Contact page
│   ├── login/               # Login/Signup page
│   ├── admin/               # Admin dashboard
│   ├── teacher/             # Teacher dashboard
│   └── student/             # Student dashboard
├── src/
│   ├── components/          # Reusable components
│   │   ├── ui/             # UI components (button, toast)
│   │   └── ...             # Other components
│   ├── lib/                # Utility libraries
│   ├── pages/              # Page components
│   └── index.css           # Global styles
├── public/                 # Static assets
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── jsconfig.json           # Path aliases configuration
```

## 🎯 Features

- **Admin Portal**: Manage students, teachers, courses, and attendance reports
- **Teacher Portal**: Generate QR codes, manage sessions, download reports
- **Student Portal**: Scan QR codes, view attendance history
- **Offline Support**: Bluetooth and local storage for offline attendance
- **Real-time Updates**: Socket.io for live attendance tracking
- **Responsive Design**: Works on all devices

## 🔐 User Roles

1. **Admin**
   - Create/manage student and teacher accounts
   - Assign courses to teachers
   - View comprehensive attendance reports

2. **Teacher**
   - Generate time-limited QR codes for classes
   - Mark manual attendance
   - View and download attendance reports

3. **Student**
   - Scan QR codes to mark attendance
   - View personal attendance history
   - Check attendance statistics

---

## 🚀 Migration Notice

✅ **Successfully migrated from Vite to Next.js 14!**

- Same UI/UX - Zero visual changes
- All components working
- Routing converted to Next.js App Router
- Client-side features preserved
- Better performance with Next.js optimizations

---

Built by **Mahnoor** & **Muhammad Haris Khan**
