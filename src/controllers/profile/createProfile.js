import { AgeRange, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const createProfile = async (req, res) => {
  const { name, ageRange, avatarUrl, grades } = req.body;
  const userId = req.user.userId;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is missing' });
  }

  try {
    console.log("Received age range:", ageRange);
    console.log("Received age range:", grades);
    // Check the number of profiles for the user
    if (!Object.values(AgeRange).includes(ageRange)) {
      return res.status(400).json({ message: "Invalid age range value" });
    }
    const profileCount = await prisma.profile.count({
      where: { user_id: parseInt(userId, 10) },
    });

    if (profileCount >= 3) {
      return res.status(400).json({ message: 'Maximum of 3 profiles allowed per user.' });
    }

    // Handle avatar URL or uploaded image
    let finalAvatarUrl = avatarUrl;

    // If avatarUrl is a base64-encoded image (uploaded from gallery), upload it to a file storage service
    if (avatarUrl && avatarUrl.startsWith('data:image')) {
      // Example: Upload to Cloudinary or any other file storage service
      // const cloudinaryResponse = await uploadToCloudinary(avatarUrl);
      // finalAvatarUrl = cloudinaryResponse.secure_url;

      // For now, we'll just save the base64 string (not recommended for production)
      finalAvatarUrl = avatarUrl;
    }

    // Create a new profile
    const newProfile = await prisma.profile.create({
      data: {
        user_id: parseInt(userId, 10),
        name,
        age_range: ageRange,
        avatar_url: finalAvatarUrl, // Use the processed avatar URL
        grades, // New field
        // education_level: educationLevel, // New field
      },
    });

    res.status(201).json(newProfile);
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({ message: 'Error creating profile', error });
  }
};

export default createProfile;