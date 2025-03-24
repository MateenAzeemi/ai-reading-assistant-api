import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const updateBookTitle = async (req, res) => {
    const { profileId, bookNumber } = req.params;
    const { title } = req.body;
    const userId = req.user.userId;

    if (!title || title.trim() === '') {
        return res.status(400).json({ message: 'Title cannot be empty' });
    }

    try {
        const profileIdInt = parseInt(profileId, 10);
        const bookNumberInt = parseInt(bookNumber, 10);

        if (isNaN(profileIdInt) || isNaN(bookNumberInt)) {
            return res.status(400).json({ message: 'Invalid profile ID or book number' });
        }

        const profile = await prisma.profile.findFirst({
            where: { profile_id: profileIdInt, user_id: userId },
        });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found or does not belong to the user' });
        }

        const bookExists = await prisma.page.findFirst({
            where: { book_number: bookNumberInt, profile_id: profileIdInt },
        });

        if (!bookExists) {
            return res.status(404).json({ message: 'Book not found' });
        }

        await prisma.page.updateMany({
            where: { book_number: bookNumberInt, profile_id: profileIdInt },
            data: { title },
        });

        res.status(200).json({ message: 'Book title updated successfully' });
    } catch (error) {
        console.error('Error updating book title:', error);
        res.status(500).json({ message: 'Error updating book title', error: error.message });
    }
};

export default updateBookTitle