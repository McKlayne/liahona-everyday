import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { ApiKey } from './types';

/**
 * Generate a secure API key
 * Format: liahona_<32 random characters>
 */
export function generateApiKey(): string {
  const randomPart = randomBytes(24).toString('base64url'); // URL-safe base64
  return `liahona_${randomPart}`;
}

/**
 * Create a new API key for a user
 */
export async function createApiKey(
  userId: string,
  keyName: string
): Promise<{ apiKey: ApiKey; fullKey: string }> {
  const fullKey = generateApiKey();
  const keyHash = await bcrypt.hash(fullKey, 10);
  const keyPrefix = fullKey.substring(0, 16); // "liahona_abcd1234"
  const id = `apikey-${Date.now()}-${randomBytes(4).toString('hex')}`;

  await sql`
    INSERT INTO api_keys (id, user_id, key_name, key_hash, key_prefix, created_at)
    VALUES (${id}, ${userId}, ${keyName}, ${keyHash}, ${keyPrefix}, CURRENT_TIMESTAMP)
  `;

  const apiKey: ApiKey = {
    id,
    userId,
    keyName,
    keyPrefix,
    createdAt: new Date().toISOString(),
    revoked: false,
  };

  return { apiKey, fullKey };
}

/**
 * Get all API keys for a user
 */
export async function getUserApiKeys(userId: string): Promise<ApiKey[]> {
  const { rows } = await sql`
    SELECT
      id,
      user_id as "userId",
      key_name as "keyName",
      key_prefix as "keyPrefix",
      created_at as "createdAt",
      last_used_at as "lastUsedAt",
      revoked
    FROM api_keys
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `;

  return rows as ApiKey[];
}

/**
 * Revoke an API key
 */
export async function revokeApiKey(userId: string, keyId: string): Promise<boolean> {
  const result = await sql`
    UPDATE api_keys
    SET revoked = TRUE
    WHERE id = ${keyId} AND user_id = ${userId}
  `;

  return result.rowCount !== null && result.rowCount > 0;
}

/**
 * Verify an API key and return the user ID if valid
 */
export async function verifyApiKey(fullKey: string): Promise<string | null> {
  if (!fullKey.startsWith('liahona_')) {
    return null;
  }

  // Get all non-revoked keys to check against
  const { rows } = await sql`
    SELECT id, user_id, key_hash
    FROM api_keys
    WHERE revoked = FALSE
  `;

  // Check each key hash
  for (const row of rows) {
    const isValid = await bcrypt.compare(fullKey, row.key_hash);
    if (isValid) {
      // Update last used timestamp
      await sql`
        UPDATE api_keys
        SET last_used_at = CURRENT_TIMESTAMP
        WHERE id = ${row.id}
      `;

      return row.user_id;
    }
  }

  return null;
}
