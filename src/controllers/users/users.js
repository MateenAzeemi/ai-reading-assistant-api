import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

const getUsers = async (req, res) => {
  try {
    const users = await db.user.findMany({ select: { user_id: true, email: true } });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
};

export default getUsers;