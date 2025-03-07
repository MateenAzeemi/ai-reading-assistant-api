import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const db = new PrismaClient();

// Generate a 4-digit verification code
const generateVerificationCode = () => {
  return crypto.randomInt(1000, 9999).toString();
};

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

// Send the verification email
const sendVerificationEmail = async (email, verificationCode) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Verification Code',
    text: `Your verification code for AI Reading Assistant is ${verificationCode}. It will expire in 15 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email.');
  }
};

// Main function to handle verification code transport
export const verificationCodeTransporter = async (email)=> {
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
