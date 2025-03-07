import { PrismaClient } from '@prisma/client';
import { verificationCodeTransporter } from '../../helpers/verificationCodeTransporter.js';

const db = new PrismaClient();

const sendVerificationCode = async (req, res) => {
  const { email } = req.body;

  // Validate input
  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, error: 'Invalid email format' });
  }

  // Normalize email
  const normalizedEmail = email.trim().toLowerCase();

  try {
    // Check if the email is already registered
    const existingUser = await db.user.findUnique({ where: { email: normalizedEmail } });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Email already exists' });
    }

    // Send verification code
    await verificationCodeTransporter(normalizedEmail);

    // Respond with success
    const res_body = { 
      success: true, 
      message: 'Verification code sent to email' 
    }
    console.log("RESPONSE_BODY:", res_body);
    return res.status(200).json(res_body);
  } catch (error) {
    console.error(
      process.env.NODE_ENV === 'development'
        ? `Error in sendVerificationCode: ${error.message}`
        : 'Error in sendVerificationCode'
    );
    return res.status(500).json({
      success: false,
      error: 'Failed to send verification code. Please try again later.',
    });
  }
};

export default sendVerificationCode;
