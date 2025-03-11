import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

const resetPassword = async (req, res) => {
  console.log('REQUEST_BODY:', req.body);
  
  const { email, newPassword } = req.body;

  // Validate input
  if (!email || !newPassword) {
    return res.status(400).json({
      success: false,
      error: 'Email and new password are required.',
    });
  }

  try {
    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Check if user exists
    const user = await db.user.findUnique({ where: { email: normalizedEmail } });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'No account found with this email address.' 
      });
    }

    // Check if email has been verified
    const verification = await db.emailVerification.findUnique({ 
      where: { email: normalizedEmail } 
    });

    if (!verification || !verification.verified) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email not verified. Please verify your email first.' 
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password
    await db.user.update({
      where: { email: normalizedEmail },
      data: { password_hash: hashedPassword }
    });

    // Respond with success message
    const res_body = {
      success: true,
      message: 'Password has been reset successfully.',
    };
    
    console.log('RESPONSE_BODY:', res_body);
    return res.status(200).json(res_body);
  } catch (error) {
    console.error(
      process.env.NODE_ENV === 'development'
        ? `Error in resetPassword: ${error.message}`
        : 'Error in resetPassword'
    );
    
    return res.status(500).json({
      success: false,
      error: 'Something went wrong. Please try again later.',
    });
  }
};

export default resetPassword;