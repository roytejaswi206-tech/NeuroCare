# NeuroCare - Testing Guide

## Application Status ✅

Both backend and frontend servers are running successfully:

- **Backend API**: http://127.0.0.1:5000 (Flask)
- **Frontend UI**: http://localhost:5174 (React + Vite)

## What Has Been Rebuilt

### 1. Authentication System (Multi-User Support)

#### localStorage Structure
```javascript
// All users stored in array
neurocare_users: [
  {
    id: "unique_id",
    username: "john_doe",
    fullName: "John Doe",
    email: "john@example.com",
    phone: "1234567890",
    password: "hashed_password",
    role: "patient", // or "doctor"
    profileImage: null,
    specialization: null,
    hospital: null,
    createdAt: "2026-05-17T10:00:00.000Z",
    lastLogin: null
  },
  // ... more users
]

// Current session
neurocare_current_user: { /* logged in user object */ }
```

#### Key Features
- ✅ Multi-user registration (no single-user limitation)
- ✅ Login with email, phone, or username
- ✅ Password validation (min 6 characters)
- ✅ Email format validation
- ✅ Phone number validation
- ✅ Unique username, email, and phone enforcement
- ✅ Role selection (Patient/Doctor)
- ✅ Session persistence
- ✅ Automatic redirect based on auth status

### 2. Professional UI Components

#### Login Page (`/login`)
- Clean, modern design with Tailwind CSS
- Input validation with error messages
- Show/hide password toggle
- Loading states with spinner
- Redirect if already logged in
- Link to registration

#### Register Page (`/register`)
- Two-step registration process
- Step 1: Account info (username, full name, email, password)
- Step 2: Additional details (phone, role selection)
- Visual progress indicators
- Role selection with icons (Patient/Doctor)
- Form validation at each step
- Back navigation between steps

#### Dashboard (`/dashboard`)
- **Dynamic User Greeting**: Shows "Good morning/afternoon/evening, [FirstName]"
- **User Profile Menu**: Dropdown with profile, appointments, favorites, logout
- **Mood Tracking**: 6 mood options with visual feedback
- **Quick Actions**: AI Chat, Panic Help, Hospitals, Doctors
- **Services Grid**: Therapy, Medication, Meditation, Health Tracking, Assessments
- **Mood History**: Recent mood entries with timestamps
- **AI Suggestions**: Personalized wellness recommendations
- **Emergency Panic Button**: Fixed floating button
- **Search Bar**: Global search functionality
- **Notification Bell**: With unread indicator

### 3. Storage Utility Layer (`src/utils/storage.js`)

Complete localStorage API with functions:
- `getUsers()` - Retrieve all users
- `saveUsers(users)` - Save users array
- `registerUser(userData)` - Register new user with validation
- `loginUser(identifier, password)` - Login with email/phone/username
- `getCurrentUser()` - Get logged-in user
- `logoutUser()` - Clear session
- `isLoggedIn()` - Check authentication status
- `updateUser(userId, updates)` - Update user profile
- `findUserByEmail()`, `findUserByPhone()`, `findUserById()`
- Sample data initialization for doctors and hospitals

### 4. Protected Routes

Updated `ProtectedRoute` component:
- Uses new storage utility
- Role-based access control
- Redirects to login if not authenticated
- Preserves return URL

## How to Test

### Test 1: Register Multiple Users

1. Open http://localhost:5174
2. Click "Create Account" or go to `/register`
3. Fill in Step 1:
   - Username: `alice_patient`
   - Full Name: `Alice Johnson`
   - Email: `alice@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
4. Click "Continue"
5. Fill in Step 2:
   - Phone: `9876543210` (optional)
   - Select "Patient" role
6. Click "Create Account"
7. You should be automatically logged in and redirected to dashboard
8. You should see: "Good [morning/afternoon/evening], Alice"

### Test 2: Register Second User

1. Logout by clicking profile menu → Logout
2. Register another user:
   - Username: `bob_doctor`
   - Full Name: `Dr. Bob Smith`
   - Email: `bob@example.com`
   - Password: `password123`
   - Role: "Doctor"
3. Dashboard should show: "Good [morning/afternoon/evening], Bob"

### Test 3: Login with Different Identifiers

1. Logout
2. On login page, try logging in with:
   - Email: `alice@example.com` + password
   - Then try username: `alice_patient` + password
3. Both should work and log in as Alice

### Test 4: Session Persistence

1. Log in as any user
2. Refresh the page (Ctrl+R)
3. You should remain logged in
4. Navigate to different pages and back to dashboard
5. User greeting should persist

### Test 5: Multi-User Data Isolation

1. Log in as Alice
2. Log some moods in the mood tracker
3. Logout
4. Log in as Bob
5. Check mood history - should be empty (or show Bob's moods only)
6. Each user's data is separate

### Test 6: Protected Routes

1. Logout
2. Try to access `/dashboard` directly
3. Should redirect to `/login`
4. Log in
5. Try to access `/admin` (if you're not a super_admin)
6. Should redirect to `/dashboard`

### Test 7: Form Validation

#### Registration Validation
- Try registering with short password (< 6 chars) → Error
- Try registering with invalid email → Error
- Try registering with existing email → Error
- Try registering without required fields → Error

#### Login Validation
- Try logging in with wrong password → "Invalid credentials"
- Try logging in with non-existent email → "Invalid credentials"
- Try logging in with empty fields → Error messages

### Test 8: UI/UX Features

- **Responsive Design**: Resize browser window, check mobile view
- **Loading States**: Click buttons rapidly, see loading spinners
- **Toast Notifications**: Perform actions, see success/error toasts
- **User Menu**: Click profile avatar, see dropdown options
- **Search Bar**: Type in search, see it update
- **Emergency Button**: Click red button, should navigate to panic page

## Color Palette Used

- Background: `#F4F7FB` (light gray-blue)
- Cards: `#FFFFFF` (white)
- Primary: `#00BFA6` (teal)
- Accent: `#6C63FF` (purple)
- Text: `#1E293B` (dark slate)
- Muted: `#64748B` (gray)
- Error: `#EF4444` (red)
- Success: `#10B981` (green)

## Browser Compatibility

Tested on:
- Chrome/Edge (Chromium)
- Firefox
- Safari (should work)

## Known Limitations

1. **Backend API**: The Flask backend has some JSON parsing issues with the registration endpoint. The frontend uses localStorage for authentication, so it works independently.

2. **Data Persistence**: All user data is stored in browser localStorage. Clearing browser data will delete all users and sessions.

3. **Security**: Passwords are stored in plain text in localStorage (for demo purposes). In production, use proper hashing and backend authentication.

4. **Doctor Features**: Doctor-specific features (profile management, availability) are not fully implemented in this iteration.

## Next Steps for Production

1. Connect frontend to backend API for authentication
2. Implement proper password hashing (bcrypt)
3. Add JWT token-based sessions
4. Implement email verification
5. Add password reset functionality
6. Add profile editing
7. Implement doctor-specific dashboard
8. Add appointment booking system
9. Integrate with real AI chat service
10. Add real-time notifications

## Files Modified

- `NeuroCare/frontend-ui/src/pages/Login.jsx` - Complete rewrite
- `NeuroCare/frontend-ui/src/pages/Register.jsx` - Complete rewrite
- `NeuroCare/frontend-ui/src/pages/Dashboard.jsx` - Complete rewrite
- `NeuroCare/frontend-ui/src/components/ProtectedRoute.jsx` - Updated
- `NeuroCare/frontend-ui/src/utils/storage.js` - Copied to correct location

## Running the Application

### Backend
```bash
cd NeuroCare/backend
python run.py
```
Server runs on: http://127.0.0.1:5000

### Frontend
```bash
cd NeuroCare/frontend-ui
npm run dev
```
Server runs on: http://localhost:5174 (or next available port)

## Support

For issues or questions about the implementation, refer to:
- Code comments in each file
- This testing guide
- README.md for setup instructions