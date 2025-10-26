import bcrypt from 'bcryptjs';
import { sql } from '@vercel/postgres';

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  password: string; // hashed
  image?: string;
  created_at?: Date;
}

// Find user by email
export async function getUserByEmail(email: string): Promise<StoredUser | null> {
  try {
    const { rows } = await sql`
      SELECT id, name, email, password, image, created_at
      FROM users
      WHERE LOWER(email) = LOWER(${email})
    `;
    return rows[0] as StoredUser || null;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return null;
  }
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

  try {
    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return { success: false, error: 'Email already registered' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user ID
    const userId = `user-${Date.now()}`;

    // Insert user into database
    await sql`
      INSERT INTO users (id, name, email, password, created_at)
      VALUES (${userId}, ${name}, ${email.toLowerCase()}, ${hashedPassword}, CURRENT_TIMESTAMP)
    `;

    // Fetch the created user (without password)
    const { rows } = await sql`
      SELECT id, name, email, image, created_at
      FROM users
      WHERE id = ${userId}
    `;

    const user = rows[0] as Omit<StoredUser, 'password'>;
    return { success: true, user };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, error: 'Failed to create user' };
  }
}

// Verify user credentials
export async function verifyCredentials(
  email: string,
  password: string
): Promise<Omit<StoredUser, 'password'> | null> {
  try {
    const user = await getUserByEmail(email);

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
  } catch (error) {
    console.error('Error verifying credentials:', error);
    return null;
  }
}
