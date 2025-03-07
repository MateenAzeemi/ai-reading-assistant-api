import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const updateProfile = async (req, res) => {
    const { profileId } = req.params; // Extract profileId from URL params
    const { name, ageRange, avatarUrl } = req.body; // Extract fields to update
    const userId = req.user.userId; // Extract userId from JWT

    console.log('Extracted profileId:', profileId);
    console.log('Extracted userId:', userId);
    console.log('Update data:', { name, ageRange, avatarUrl });

    // Input validation
    if (!name || !ageRange) {
        return res.status(400).json({ message: 'Name and age range are required.' });
    }

    try {
        // Check if the profile belongs to the user
        const profile = await prisma.profile.findFirst({
            where: {
                profile_id: {
                    equals: parseInt(profileId, 10), // Correctly structured profile_id
                },
                user_id: {
                    equals: parseInt(userId, 10), // Correctly structured user_id
                },
            },
        });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found or access denied' });
        }

        // Update the profile
        const updatedProfile = await prisma.profile.update({
            where: { profile_id: parseInt(profileId, 10) },
            data: {
                name,
                age_range: ageRange,
                avatar_url: avatarUrl,
            },
        });

        res.status(200).json(updatedProfile);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({
            message: 'Error updating profile',
            error: {
                name: error.name,
                message: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
            },
        });
    }
};

export default updateProfile;