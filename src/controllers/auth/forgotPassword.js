import { PrismaClient } from '@prisma/client';
import { verificationCodeTransporter } from '../../helpers/verificationCodeTransporter.js';

const db = new PrismaClient();

const forgotPassword = async (req, res) => {
  console.log('REQUEST_BODY:', req.body);
  
  const { email } = req.body;

  // Validate input
  if (!email) {
    return res.status(400).json({
      success: false,
      error: 'Email is required.',
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

    // Send verification code
    await verificationCodeTransporter(normalizedEmail);

    // Respond with success message
    const res_body = {
      success: true,
      message: 'Verification code sent to email. Please verify to continue.',
    };
    
    console.log('RESPONSE_BODY:', res_body);
    return res.status(200).json(res_body);
  } catch (error) {
    console.error(
      process.env.NODE_ENV === 'development'
        ? `Error in forgotPassword: ${error.message}`
        : 'Error in forgotPassword'
    );
    
    return res.status(500).json({
      success: false,
      error: 'Something went wrong. Please try again later.',
    });
  }
};

export default forgotPassword;