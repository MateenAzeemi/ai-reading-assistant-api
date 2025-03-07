import { PrismaClient } from '@prisma/client'; 
const prisma = new PrismaClient(); 

const fetchBooks = async (req, res) => {
    const { profileId } = req.params;
    const userId = req.user.userId;

    try {
        // Validate profile ownership
        const profile = await prisma.profile.findFirst({
            where: {
                profile_id: parseInt(profileId, 10),
                user_id: parseInt(userId, 10),
            },
        });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found or does not belong to the user' });
        }

        // Fetch unique book numbers
        const books = await prisma.page.findMany({
            where: {
                profile_id: parseInt(profileId, 10),
            },
            distinct: ['book_number'], // Fetch distinct book numbers
            select: { book_number: true }, 
        });

        res.status(200).json(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ message: 'Error fetching books' });
    }
};

export default fetchBooks;
