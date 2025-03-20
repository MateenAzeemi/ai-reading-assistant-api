import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { generateTokens } from '../../helpers/token.js';
import { verificationCodeTransporter } from '../../helpers/verificationCodeTransporter.js';

const db = new PrismaClient();

const login = async (req, res) => {
  console.log('REQUEST_BODY:', req.body);

  const { email, password, deviceToken } = req.body;

  // Validate input
  if (!email || !password || !deviceToken) {
    return res.status(400).json({
      success: false,
      error: 'Email, password, and device token are required.',
    });
  }

  try {
    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Find the user by email
    const user = await db.user.findUnique({ where: { email: normalizedEmail } });

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Email not registered. Please sign up first.' 
      });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        error: 'Incorrect password. Please try again.' 
      });
    }

    // Check if device token already exists for this user
    const existingToken = await db.token.findFirst({
      where: {
        user_id: user.user_id,
        device_token: deviceToken,
        expires_at: {
          gt: new Date() // Only consider valid tokens
        }
      }
    });

    let token;
    let skipVerification = false;

    if (existingToken) {
      // Device is already authenticated - skip verification
      skipVerification = true;
      token = {
        accessToken: existingToken.access_token,
        expiresAt: existingToken.expires_at
      };
      console.log("Using existing token", token);
    } else {
      // Send MFA verification code for new device login
      await verificationCodeTransporter(normalizedEmail);
    }

    // Respond based on whether verification is needed
    const res_body = {
      success: true,
      skipVerification,
      message: skipVerification 
        ? 'Device recognized. Login successful.' 
        : 'Verification code sent to email. Please verify to continue.',
      token: skipVerification ? token : null,
      user: skipVerification ? {
        user_id: user.user_id,
        email: user.email,
        name: user.name,
        // Add other user fields you want to return
      } : null
    };
    
    console.log('RESPONSE_BODY:', res_body);
    return res.status(200).json(res_body);
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({
      success: false,
      error: 'Something went wrong. Please try again later.',
    });
  }
};

export default login;