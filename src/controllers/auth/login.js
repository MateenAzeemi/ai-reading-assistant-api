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

    // Generate tokens (implement this function to generate access/refresh tokens)
    const token = await generateTokens(user.user_id, deviceToken);
    console.log("Login Token", token);
    // Send MFA verification code
    await verificationCodeTransporter(normalizedEmail);

    // Respond with MFA status
    const res_body = {
      success: true,
      message: 'Verification code sent to email. Please verify to continue.',
      token: token,
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