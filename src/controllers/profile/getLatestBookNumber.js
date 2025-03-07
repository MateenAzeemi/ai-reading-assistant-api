import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const getLatestBookNumber = async (req, res) => {
    const { profileId } = req.params;
    const userId = req.user.userId; // Extracted from JWT

    try {
        // Verify profile belongs to user
        const profile = await prisma.profile.findFirst({
            where: {
                profile_id: parseInt(profileId, 10),
                user_id: parseInt(userId, 10),
            },
        });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found or does not belong to the user' });
        }

        // Get the latest book_number for this profile
        const latestBook = await prisma.page.findFirst({
            where: {
                profile_id: parseInt(profileId, 10),
            },
            orderBy: {
                book_number: 'desc',
            },
            select: {
                book_number: true,
            },
        });

        // Return the latest book number or 0 if none exists
        const latestBookNumber = latestBook ? latestBook.book_number : 0;
        
        res.status(200).json({ latestBookNumber });
    } catch (error) {
        console.error('Error fetching latest book number:', error);
        res.status(500).json({
            message: 'Error fetching latest book number',
            error: {
                name: error.name,
                message: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
            },
        });
    }
};

export default getLatestBookNumber;