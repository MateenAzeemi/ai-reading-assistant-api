import { PrismaClient } from '@prisma/client'; // Import PrismaClient
const prisma = new PrismaClient(); // Initialize PrismaClient

// Function to fetch page data filtered by book number
const fetchPages = async (req, res) => {
    const { profileId } = req.params; // Extract profileId from the URL
    const { book_number } = req.query; // Extract book_number from query params
    const userId = req.user.userId; // Extracted from the JWT

    console.log('Fetching pages for profileId:', profileId, 'and book_number:', book_number);
    console.log('Requested by userId:', userId);

    try {
        // Check if the profile belongs to the user
        const profile = await prisma.profile.findFirst({
            where: {
                profile_id: parseInt(profileId, 10),
                user_id: parseInt(userId, 10),
            },
        });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found or does not belong to the user' });
        }

        // Fetch pages filtered by profileId and book_number
        const pages = await prisma.page.findMany({
            where: {
                profile_id: parseInt(profileId, 10),
                book_number: parseInt(book_number, 10), // Filter by book number
            },
            orderBy: { page_id: 'asc' }, // Order by page_id for sequence
        });

        res.status(200).json(pages); // Send the fetched pages as a response
    } catch (error) {
        console.error('Error fetching pages:', error);
        res.status(500).json({
            message: 'Error fetching pages',
            error: {
                name: error.name,
                message: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
            },
        });
    }
};

export default fetchPages;
