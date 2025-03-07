import { PrismaClient } from '@prisma/client'; // Import PrismaClient
const prisma = new PrismaClient(); // Initialize PrismaClient

const getAllProfiles = async (req, res) => {
    const userId = req.user.userId; // Extracted from the JWT

    console.log('Extracted userId:', userId); // Log the userId

    try {
        const query = {
            where: { user_id: parseInt(userId, 10) },
        };
        console.log('Executing query:', JSON.stringify(query, null, 2)); // Log the query

        // Fetch profiles for the user
        const profiles = await prisma.profile.findMany(query);

        console.log('Fetched profiles:', JSON.stringify(profiles, null, 2));
        if (profiles.length === 0) {
            return res.status(200).json([]); // Return empty array if no profiles found
        }

        res.status(200).json(profiles);
    } catch (error) {
        console.error('Error retrieving profiles:', error); // Log the full error
        res.status(500).json({
            message: 'Error retrieving profiles',
            error: {
                name: error.name, // Error name (e.g., "ReferenceError")
                message: error.message, // Error message
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined, // Stack trace in development
            },
        });
    }
};

export default getAllProfiles;