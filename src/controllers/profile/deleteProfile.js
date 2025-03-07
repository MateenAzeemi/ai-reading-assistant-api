import { PrismaClient } from '@prisma/client'; // Import PrismaClient
const prisma = new PrismaClient(); // Initialize PrismaClient

const deleteProfile = async (req, res) => {
    const { profileId } = req.params;
    const userId = req.user.userId;

    try {
        const profile = await prisma.profile.findFirst({
            where: { profile_id: parseInt(profileId, 10), user_id: parseInt(userId, 10) },
        });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found or access denied' });
        }

        await prisma.profile.delete({
            where: { profile_id: parseInt(profileId, 10) },
        });

        res.status(200).json({ message: 'Profile deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting profile', error });
    }
};
export default deleteProfile;