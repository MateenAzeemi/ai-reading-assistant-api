import { PrismaClient } from '@prisma/client';
import { generateTokens } from '../../helpers/token.js';

const db = new PrismaClient();

const verifyVerificationCode = async (req, res) => {
  console.log("REQUEST_BODY:", req.body);
  const { email, verificationCode, type, deviceToken } = req.body;

  const record = await db.emailVerification.findUnique({ where: { email } });
  if (!record || record.verificationCode !== verificationCode || record.expiresAt < new Date()) {
    return res.status(400).json({ error: 'Invalid or expired verification code' });
  }

  // Mark email as verified
  await db.emailVerification.update({
    where: { email },
    data: { verified: true },
  });

  let res_body;
  console.log("Type", type);

  if (type === "Login") {
    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    const user = await db.user.findUnique({ where: { email: normalizedEmail } });

    const token = await generateTokens(user.user_id, deviceToken);
    console.log("Login Token", token);

    res_body = { message: 'Email verified successfully', token, user };
  }
  else {
    res_body = { message: 'Email verified successfully' };
  }

  console.log("RESPONSE_BODY:", res_body);
  res.status(200).json(res_body);
};

export default verifyVerificationCode;