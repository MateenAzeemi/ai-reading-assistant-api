import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const savePageData = async (req, res) => {
    const { profileId } = req.params;
    const { title, content, imageUrl, bookNumber } = req.body;
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

        // Create a new page associated with the profile
        const page = await prisma.page.create({
            data: {
                profile_id: parseInt(profileId, 10),
                title,
                content,
                image_url: imageUrl || null,
                book_number: parseInt(bookNumber, 10),
            },
        });

        res.status(200).json({ message: 'Page saved successfully!', page });
    } catch (error) {
        console.error('Error saving page data:', error);
        res.status(500).json({
            message: 'Error saving page data',
            error: {
                name: error.name,
                message: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
            },
        });
    }
};


export default savePageData;
