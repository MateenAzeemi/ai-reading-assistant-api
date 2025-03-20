import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const db = new PrismaClient();

// Generate a 4-digit verification code
const generateVerificationCode = () => crypto.randomInt(1000, 9999).toString();

// Save the verification code to the database
const saveVerificationCode = async (email, verificationCode, expiryMinutes) => {
  try {
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

    await db.emailVerification.upsert({
      where: { email },
      update: { verificationCode, expiresAt, verified: false },
      create: { email, verificationCode, expiresAt },
    });
  } catch (error) {
    console.error('Error saving verification code:', error);
    throw new Error('Failed to save verification code.');
  }
};

// Create a transporter for sending emails
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    throw new Error('Email credentials are not set in environment variables.');
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Send the verification email with improved formatting
const sendVerificationEmail = async (email, verificationCode) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"AI Reading Assistant" <${process.env.EMAIL_USER}>`, // More professional
    replyTo: 'support@yourdomain.com', // Improve trustworthiness
    to: email,
    subject: 'Confirm Your Account - AI Reading Assistant',
    text: `Your confirmation code is ${verificationCode}. This code expires in 15 minutes.`,
    html: `
      <div style="background-color:#f8f9fa; padding:20px; font-family:Arial,sans-serif;">
        <div style="max-width:500px; background:#fff; padding:20px; margin:auto; border-radius:10px;">
          <h2 style="color:#333; text-align:center;">Welcome to AI Reading Assistant!</h2>
          <p style="font-size:16px; color:#555; text-align:center;">
            Use the code below to confirm your account:
          </p>
          <div style="text-align:center; background:#007bff; color:#fff; font-size:24px; padding:10px; border-radius:5px;">
            <strong>${verificationCode}</strong>
          </div>
          <p style="color:#777; text-align:center;">This code expires in 15 minutes.</p>
          <hr>
          <p style="color:#999; font-size:12px; text-align:center;">
            If you didn't request this code, please ignore this email.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email.');
  }
};

// Main function to handle verification code transport
export const verificationCodeTransporter = async (email) => {
  try {
    const verificationCode = generateVerificationCode();
    const expiryMinutes = Number(process.env.CODE_EXPIRY_MINUTES) || 15; // Default to 15 minutes
    await saveVerificationCode(email, verificationCode, expiryMinutes);
    await sendVerificationEmail(email, verificationCode);
  } catch (error) {
    console.error('Error in verification code transporter:', error);
    throw new Error('Failed to process verification code.');
  }
};
