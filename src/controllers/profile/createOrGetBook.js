import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const createBook = async (req, res) => {
  const { profileId } = req.params;
  const { title } = req.body;
  const userId = req.user.userId; // Extracted from the JWT

  try {
    // Ensure the profile belongs to the authenticated user
    const profile = await prisma.profile.findFirst({
      where: {
        profile_id: parseInt(profileId, 10),
        user_id: parseInt(userId, 10),
      },
    });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found or does not belong to the user' });
    }

    // Check if a book already exists for this profile
    let book = await prisma.book.findFirst({
      where: {
        profile_id: parseInt(profileId, 10),
      },
    });

    // If no existing book is found, create a new one
    if (!book) {
      book = await prisma.book.create({
        data: {
          profile_id: parseInt(profileId, 10),
          title: title || `Book ${Date.now()}`, // Default title if not provided
        },
      });
    }

    res.status(200).json({ message: 'Book created successfully', book });
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({
      message: 'Error creating book',
      error: {
        name: error.name,
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
    });
  }
};

const getBook = async (req, res) => {
  const { profileId } = req.params;
  const userId = req.user.userId; // Extracted from the JWT

  try {
    // Ensure the profile belongs to the authenticated user
    const profile = await prisma.profile.findFirst({
      where: {
        profile_id: parseInt(profileId, 10),
        user_id: parseInt(userId, 10),
      },
    });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found or does not belong to the user' });
    }

    // Find the book associated with the profile
    const book = await prisma.book.findFirst({
      where: {
        profile_id: parseInt(profileId, 10),
      },
    });

    if (!book) {
      return res.status(404).json({ message: 'No book found for this profile' });
    }

    res.status(200).json({ book });
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({
      message: 'Error fetching book',
      error: {
        name: error.name,
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
    });
  }
};

export { createBook, getBook };
