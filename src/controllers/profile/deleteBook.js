import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const deleteBook = async (req, res) => {
    const { profileId, bookNumber } = req.params;
    const userId = req.user.userId; // Assuming authentication middleware attaches `user`

    try {
        // ✅ Convert params to numbers safely
        const profileIdInt = parseInt(profileId, 10);
        const bookNumberInt = parseInt(bookNumber, 10);

        if (isNaN(profileIdInt) || isNaN(bookNumberInt)) {
            return res.status(400).json({ message: 'Invalid profile ID or book number' });
        }

        // ✅ Check if the profile belongs to the user
        const profile = await prisma.profile.findFirst({
            where: { profile_id: profileIdInt, user_id: userId },
        });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found or does not belong to the user' });
        }

        // ✅ Ensure the book exists
        const bookExists = await prisma.page.findFirst({
            where: { book_number: bookNumberInt, profile_id: profileIdInt },
        });

        if (!bookExists) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // ✅ Delete all pages related to this book (Cascade delete fix)
        await prisma.page.deleteMany({
            where: { book_number: bookNumberInt, profile_id: profileIdInt },
        });

        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ message: 'Error deleting book', error: error.message });
    }
};

export default deleteBook;
