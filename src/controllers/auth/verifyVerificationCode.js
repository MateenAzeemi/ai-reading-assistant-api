import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

const verifyVerificationCode = async (req, res) => {
  console.log("REQUEST_BODY:", req.body);
  const { email, verificationCode } = req.body;

  const record = await db.emailVerification.findUnique({ where: { email } });
  if (!record || record.verificationCode !== verificationCode || record.expiresAt < new Date()) {
    return res.status(400).json({ error: 'Invalid or expired verification code' });
  }

  // Mark email as verified
  await db.emailVerification.update({
    where: { email },
    data: { verified: true },
  });

  const res_body = { message: 'Email verified successfully' }
  console.log("RESPONSE_BODY:", res_body);
  res.status(200).json(res_body);
};

export default verifyVerificationCode;