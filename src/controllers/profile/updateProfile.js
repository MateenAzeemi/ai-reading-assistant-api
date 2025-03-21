import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const updateProfile = async (req, res) => {
    const { profileId } = req.params; // Extract profileId from URL params
    const { name, ageRange, avatarUrl, grades } = req.body; // Extract fields to update
    const userId = req.user.userId; // Extract userId from JWT

    console.log('Extracted profileId:', profileId);
    console.log('Extracted userId:', userId);
    console.log('Update data:', { name, ageRange, avatarUrl, grades });

    // Input validation
    if (!name || !ageRange) {
        return res.status(400).json({ message: 'Name and age range are required.' });
    }

    try {
        // Check if the profile belongs to the user
        const profile = await prisma.profile.findFirst({
            where: {
                profile_id: parseInt(profileId, 10), // Using profile_id field
                user_id: parseInt(userId, 10),
            },
        });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found or access denied' });
        }

        // Handle avatar URL processing
        let finalAvatarUrl = avatarUrl;
        if (avatarUrl && avatarUrl.startsWith('data:image')) {
            // For now, just use the base64 string
            // In production, you would upload to storage:
            // const cloudinaryResponse = await uploadToCloudinary(avatarUrl);
            // finalAvatarUrl = cloudinaryResponse.secure_url;
            finalAvatarUrl = avatarUrl;
        }

        // Update the profile
        const updatedProfile = await prisma.profile.update({
            where: { profile_id: parseInt(profileId, 10) },
            data: {
                name,
                age_range: ageRange,
                avatar_url: finalAvatarUrl,
                grades: grades !== undefined ? grades : undefined,
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