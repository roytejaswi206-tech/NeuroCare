/**
 * NeuroCare Storage Utilities
 * Handles all localStorage operations for multi-user support
 */

const STORAGE_KEYS = {
  USERS: 'neurocare_users',
  CURRENT_USER: 'neurocare_current_user',
  DOCTORS: 'neurocare_doctors',
  HOSPITALS: 'neurocare_hospitals'
};

// Generate unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// User Management
export const getUsers = () => {
  try {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
  } catch (e) {
    console.error('Error reading users:', e);
    return [];
  }
};

export const saveUsers = (users) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (e) {
    console.error('Error saving users:', e);
  }
};

export const findUserByEmail = (email) => {
  const users = getUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
};

export const findUserByPhone = (phone) => {
  const users = getUsers();
  return users.find(u => u.phone === phone);
};

export const findUserById = (id) => {
  const users = getUsers();
  return users.find(u => u.id === id);
};

export const registerUser = (userData) => {
  const users = getUsers();
  
  // Check for duplicate email
  if (userData.email && findUserByEmail(userData.email)) {
    return { success: false, error: 'Email already registered' };
  }
  
  // Check for duplicate phone
  if (userData.phone && findUserByPhone(userData.phone)) {
    return { success: false, error: 'Phone number already registered' };
  }
  
  const newUser = {
    id: generateId(),
    fullName: userData.fullName,
    email: userData.email,
    phone: userData.phone,
    password: userData.password,
    role: userData.role || 'patient',
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  saveUsers(users);
  
  return { success: true, user: newUser };
};

export const loginUser = (identifier, password) => {
  const users = getUsers();
  
  // Try to find by email or phone
  const user = users.find(u => 
    (u.email.toLowerCase() === identifier.toLowerCase() || u.phone === identifier) &&
    u.password === password
  );
  
  if (!user) {
    return { success: false, error: 'Invalid credentials' };
  }
  
  // Set current user
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  
  return { success: true, user };
};

export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  } catch (e) {
    return null;
  }
};

export const logoutUser = () => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

export const isLoggedIn = () => {
  return getCurrentUser() !== null;
};

// Update user profile
export const updateUser = (userId, updates) => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  
  if (index === -1) {
    return { success: false, error: 'User not found' };
  }
  
  users[index] = { ...users[index], ...updates };
  saveUsers(users);
  
  // Update current user if it's the same user
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(users[index]));
  }
  
  return { success: true, user: users[index] };
};

// Doctor Management
export const getDoctors = () => {
  try {
    const doctors = localStorage.getItem(STORAGE_KEYS.DOCTORS);
    return doctors ? JSON.parse(doctors) : [];
  } catch (e) {
    return [];
  }
};

export const saveDoctors = (doctors) => {
  try {
    localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(doctors));
  } catch (e) {
    console.error('Error saving doctors:', e);
  }
};

export const addDoctor = (doctorData) => {
  const doctors = getDoctors();
  const newDoctor = {
    id: generateId(),
    ...doctorData,
    createdAt: new Date().toISOString()
  };
  doctors.push(newDoctor);
  saveDoctors(doctors);
  return newDoctor;
};

// Hospital Management
export const getHospitals = () => {
  try {
    const hospitals = localStorage.getItem(STORAGE_KEYS.HOSPITALS);
    return hospitals ? JSON.parse(hospitals) : [];
  } catch (e) {
    return [];
  }
};

export const saveHospitals = (hospitals) => {
  try {
    localStorage.setItem(STORAGE_KEYS.HOSPITALS, JSON.stringify(hospitals));
  } catch (e) {
    console.error('Error saving hospitals:', e);
  }
};

// Initialize with sample data if empty
export const initializeSampleData = () => {
  // Initialize doctors if empty
  if (getDoctors().length === 0) {
    const sampleDoctors = [
      {
        id: generateId(),
        name: 'Dr. Sarah Johnson',
        specialization: 'Psychiatrist',
        hospital: 'City Mental Health Center',
        experience: 12,
        rating: 4.8,
        availability: 'Mon-Fri, 9AM-5PM',
        about: 'Specialist in anxiety and depression treatment with 12 years of experience.',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop',
        createdAt: new Date().toISOString()
      },
      {
        id: generateId(),
        name: 'Dr. Michael Chen',
        specialization: 'Clinical Psychologist',
        hospital: 'Wellness Medical Center',
        experience: 8,
        rating: 4.6,
        availability: 'Tue-Sat, 10AM-6PM',
        about: 'Expert in cognitive behavioral therapy and stress management.',
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop',
        createdAt: new Date().toISOString()
      },
      {
        id: generateId(),
        name: 'Dr. Emily Williams',
        specialization: 'Neurologist',
        hospital: 'NeuroCare Specialty Clinic',
        experience: 15,
        rating: 4.9,
        availability: 'Mon-Thu, 8AM-4PM',
        about: 'Focused on neurological disorders and brain health optimization.',
        image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop',
        createdAt: new Date().toISOString()
      }
    ];
    saveDoctors(sampleDoctors);
  }

  // Initialize hospitals if empty
  if (getHospitals().length === 0) {
    const sampleHospitals = [
      {
        id: generateId(),
        name: 'City Mental Health Center',
        location: 'Downtown, 123 Health St',
        rating: 4.7,
        distance: '2.5 km',
        emergency: true,
        open: true,
        specializations: ['Psychiatry', 'Psychology', 'Counseling'],
        phone: '(555) 123-4567'
      },
      {
        id: generateId(),
        name: 'Wellness Medical Center',
        location: 'Midtown, 456 Care Ave',
        rating: 4.5,
        distance: '4.2 km',
        emergency: true,
        open: true,
        specializations: ['General Medicine', 'Neurology', 'Therapy'],
        phone: '(555) 234-5678'
      },
      {
        id: generateId(),
        name: 'NeuroCare Specialty Clinic',
        location: 'Uptown, 789 Mind Blvd',
        rating: 4.9,
        distance: '1.8 km',
        emergency: false,
        open: false,
        specializations: ['Neurology', 'Psychiatry', 'Sleep Disorders'],
        phone: '(555) 345-6789'
      }
    ];
    saveHospitals(sampleHospitals);
  }
};