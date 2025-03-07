import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

// Environment variables
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY; // e.g., '15m'
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY; // e.g., '7d'

// Validate environment variables
if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error('ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must be defined in the environment variables');
}

if (!ACCESS_TOKEN_EXPIRY || !REFRESH_TOKEN_EXPIRY) {
  throw new Error('ACCESS_TOKEN_EXPIRY and REFRESH_TOKEN_EXPIRY must be defined in the environment variables');
}

// Generate access token
const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
};

// Generate refresh token
const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
};

// Parse "15m", "7d", etc., into seconds
const parseExpiryToSeconds = (expiry) => {
  const timeUnit = expiry.slice(-1); // Get the last character (m/d/h)
  const timeValue = parseInt(expiry.slice(0, -1), 10); // Get the numeric part

  if (isNaN(timeValue)) {
    console.error(`Invalid expiry format: ${expiry}`);
    throw new Error(`Invalid expiry format: ${expiry}`);
  }

  switch (timeUnit) {
    case 'm': // Minutes
      return timeValue * 60;
    case 'h': // Hours
      return timeValue * 60 * 60;
    case 'd': // Days
      return timeValue * 24 * 60 * 60;
    default:
      console.error(`Unsupported time unit in expiry format: ${expiry}`);
      throw new Error(`Unsupported time unit in expiry format: ${expiry}`);
  }
};

// Delete existing token
const deleteToken = async (userId, deviceToken) => {
  try {
    return await db.token.deleteMany({
      where: {
        user_id: userId,
        device_token: deviceToken,
      },
    });
  } catch (error) {
    console.error('Error deleting token:', error.message);
    throw new Error(`Failed to delete token for user ${userId}`);
  }
};

// Save tokens in the database
const saveTokens = async (userId, accessToken, refreshToken, deviceToken) => {
  try {
    const expirySeconds = parseExpiryToSeconds(ACCESS_TOKEN_EXPIRY);

    const token = await db.token.create({
      data: {
        user_id: userId,
        access_token: accessToken,
        refresh_token: refreshToken,
        device_token: deviceToken,
        expires_at: new Date(Date.now() + expirySeconds * 1000), // Convert seconds to milliseconds
      },
    });

    return {
      accessToken: token.access_token,
      // refreshToken: token.refresh_token,
      expiresAt: token.expires_at,
    };
  } catch (error) {
    console.error('Error saving tokens:', error.message);
    throw new Error(`Failed to save tokens for user ${userId}`);
  }
};

// Generate tokens
export const generateTokens = async (userId, deviceToken) => {
  try {
    const existingRecord = await db.token.findFirst({
      where: {
        user_id: userId,
        device_token: deviceToken,
      },
    });
    if (existingRecord) await deleteToken(userId, deviceToken);

    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);
    return await saveTokens(userId, accessToken, refreshToken, deviceToken);
  } catch (error) {
    console.error('Error generating tokens:', error.message);
    throw new Error('Failed to generate tokens');
  }
};

// Update tokens
// export const updateTokens = async (userId, accessToken) => {
//   try {
//     const existingRecord = await db.token.findFirst({
//       where: {
//         user_id: userId,
//         access_token: accessToken,
//       },
//     });

//     if (existingRecord) return await generateTokens(userId, existingRecord.device_token);
//     return null;
//   } catch (error) {
//     console.error('Error updating tokens:', error.message);
//     throw new Error(`Failed to update tokens for user ${userId}`);
//   }
// };

// Cleanup database connections on app exit
process.on('SIGINT', async () => {
  console.log('Closing database connection...');
  await db.$disconnect();
  process.exit(0);
});