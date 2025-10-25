import bcrypt from 'bcryptjs';

// Simple in-memory user storage for development
// In production, this should use a database
// Using a module-level variable for server-side storage
let usersStore: StoredUser[] = [];

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  password: string; // hashed
  image?: string;
  createdAt: number;
}

// Get all users
function getAllUsers(): StoredUser[] {
  return usersStore;
}

// Save all users
function saveAllUsers(users: StoredUser[]): void {
  usersStore = users;
}

// Find user by email
export function getUserByEmail(email: string): StoredUser | null {
  const users = getAllUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

// Create a new user
export async function createUser(
  name: string,
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: Omit<StoredUser, 'password'> }> {
  // Validate inputs
  if (!name || !email || !password) {
    return { success: false, error: 'All fields are required' };
  }

  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters' };
  }

  // Check if user already exists
  if (getUserByEmail(email)) {
    return { success: false, error: 'Email already registered' };
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user: StoredUser = {
    id: Date.now().toString(),
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    createdAt: Date.now(),
  };

  // Save user
  const users = getAllUsers();
  users.push(user);
  saveAllUsers(users);

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return { success: true, user: userWithoutPassword };
}

// Verify user credentials
export async function verifyCredentials(
  email: string,
  password: string
): Promise<Omit<StoredUser, 'password'> | null> {
  const user = getUserByEmail(email);

  if (!user) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return null;
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
