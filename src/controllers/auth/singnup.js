import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { generateTokens } from '../../helpers/token.js';

const db = new PrismaClient();

const signup = async (req, res) => {
  console.log("REQUEST_BODY:", req.body);
  const { email, password, deviceToken = null } = req.body; // Default deviceToken to null

  try {
    // Step 1: Check if the email is already registered
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'Email already registered. Please log in.',
      });
    }

    // Step 2: Check if the email exists in the EmailVerification table
    const verificationRecord = await db.emailVerification.findUnique({
      where: { email },
    });

    if (!verificationRecord) {
      return res.status(400).json({
        error: 'Email not found. Please verify your email first.',
      });
    }

    // Step 3: Check if the email has been verified
    if (!verificationRecord.verified) {
      return res.status(400).json({
        error: 'Email not verified. Please complete the verification process.',
      });
    }

    // Step 4: Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Step 5: Create the user in the User table
    const newUser = await db.user.create({
      data: {
        email,
        password_hash: passwordHash,
        mfa_enabled: true,
        subscription_status: 'TRIAL',
      },
    });

    // Step 6: Generate and Store the Tokens in the database
    const token = await generateTokens(newUser.user_id, deviceToken);
    console.log("SignUp Toke", token);
    
    // Step 7: Optionally delete the EmailVerification record
    // await db.emailVerification.delete({
    //   where: { email },
    // });

    // Step 8: Respond with success and tokens
    const { password_hash, created_at, updated_at, ...filteredUser } = newUser;
    const res_body = {
      message: 'User signed up successfully',
      user: filteredUser,
      token: token,
    }

    console.log("RESPONSE_BODY:", res_body);
    res.status(201).json(res_body);
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default signup;