import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await db.user.findUnique({
      where: { user_id: parseInt(id) },
      select: { user_id: true, email: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
};

export default getUserById;
