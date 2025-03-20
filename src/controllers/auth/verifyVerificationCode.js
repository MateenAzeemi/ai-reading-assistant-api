import { PrismaClient } from '@prisma/client';
import { generateTokens } from '../../helpers/token.js';

const db = new PrismaClient();

const verifyVerificationCode = async (req, res) => {
  console.log("REQUEST_BODY:", req.body);
  const { email, verificationCode, type, deviceToken } = req.body;

  try {
    const record = await db.emailVerification.findUnique({ where: { email } });
    if (!record || record.verificationCode !== verificationCode || record.expiresAt < new Date()) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid or expired verification code' 
      });
    }

    // Mark email as verified
    await db.emailVerification.update({
      where: { email },
      data: { verified: true },
    });

    let res_body;
    console.log("Type", type);

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    if (type === "Login") {
      const user = await db.user.findUnique({ where: { email: normalizedEmail } });
      
      if (!user) {
        return res.status(404).json({ 
          success: false,
          error: 'User not found' 
        });
      }

      // Generate new tokens using the existing helper function
      const token = await generateTokens(user.user_id, deviceToken);
      console.log("Login Token", token);

      res_body = { 
        success: true,
        message: 'Email verified successfully', 
        token, 
        user: {
          user_id: user.user_id,
          email: user.email,
          name: user.name,
          // Add other user fields you want to return
        } 
      };
    }
    else {
      // For signup or password reset
      res_body = { 
        success: true,
        message: 'Email verified successfully' 
      };
    }

    console.log("RESPONSE_BODY:", res_body);
    res.status(200).json(res_body);
  } catch (error) {
    console.error('Error during verification:', error);
    return res.status(500).json({
      success: false,
      error: 'Something went wrong. Please try again later.',
    });
  }
};

export default verifyVerificationCode;