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

        // Fetch unique book numbers along with their titles
        const books = await prisma.page.groupBy({
            by: ['book_number'],
            where: {
                profile_id: parseInt(profileId, 10),
            },
            _min: {
                title: true, // Fetch the first available title for each book_number
                image_url: true,
            },
        });

        // Transform the response to match expected format
        const formattedBooks = books.map(book => ({
            book_number: book.book_number,
            title: book._min.title,
            image_url: book._min.image_url,
        }));

        res.status(200).json(formattedBooks);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ message: 'Error fetching books' });
    }
};

export default fetchBooks;
