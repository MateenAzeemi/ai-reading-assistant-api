import { PrismaClient } from '@prisma/client'; // Import PrismaClient
const prisma = new PrismaClient(); // Initialize PrismaClient

const updateReadingLevel = async (req, res) => {
    const { profileId } = req.params; // Extract profileId from the URL
    const { readingLevel } = req.body; // Extract readingLevel from the request body
    const userId = req.user.userId; // Extracted from the JWT

    console.log('Extracted userId:', userId); // Log the userId
    console.log('Extracted profileId:', profileId); // Log the profileId
    console.log('Extracted readingLevel:', readingLevel); // Log the readingLevel

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

        // Update the profile's reading level
        const updatedProfile = await prisma.profile.update({
            where: {
                profile_id: parseInt(profileId, 10),
            },
            data: {
                readingLevel: readingLevel,
            },
        });

        res.status(200).json(updatedProfile);
    } catch (error) {
        console.error('Error updating reading level:', error); // Log the full error
        res.status(500).json({
            message: 'Error updating reading level',
            error: {
                name: error.name, // Error name (e.g., "ReferenceError")
                message: error.message, // Error message
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined, // Stack trace in development
            },
        });
    }
};

export default updateReadingLevel;