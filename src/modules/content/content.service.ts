import { HomePage, Notice, Achievement } from './content.schema';
import { uploadToCloudinary } from '@/utils/cloudinary.util';
import { Types } from 'mongoose';
import { NotFoundError } from '@/utils/errors';
import { notifyInterestedUsers } from '@/utils/notification.util';

// HomePage
export const getHomePage = async () => {
  const homepage = await HomePage.findOne().populate('updatedBy', 'name email');
  return homepage || { heroSlides: [] };
};

export const updateHomePage = async (data: any, files: Express.Multer.File[] | undefined, userId: string) => {
  console.log('--- Homepage Update Start ---');
  console.log('Received data:', JSON.stringify(data, null, 2));
  console.log('Received files:', files?.map(f => ({ name: f.originalname, size: f.size })));

  let homepage = await HomePage.findOne();
  if (!homepage) {
    console.log('No homepage found, creating new one...');
    homepage = await HomePage.create({ heroSlides: [], updatedBy: userId });
  }

  let finalSlides = Array.isArray(homepage.heroSlides) ? [...homepage.heroSlides] : [];
  
  // Clean up if we somehow have non-objects in the array (migration safety)
  finalSlides = finalSlides.filter(s => s && typeof s === 'object');
  
  const parseIndex = (val: any) => {
    if (val === undefined || val === 'undefined' || val === 'null' || val === null || val === '') return undefined;
    const parsed = parseInt(val);
    return isNaN(parsed) ? undefined : parsed;
  };

  const deleteIndex = parseIndex(data.deleteSlideIndex);
  const editIndex = parseIndex(data.editSlideIndex);

  console.log('Parsed Indices:', { deleteIndex, editIndex });

  // 1. Handle Deletion if requested
  if (deleteIndex !== undefined) {
    console.log(`Deleting slide at index ${deleteIndex}`);
    if (deleteIndex >= 0 && deleteIndex < finalSlides.length) {
      finalSlides.splice(deleteIndex, 1);
    }
  }

  // Helper for cleaner property handling
  const cleanStr = (val: any) => (val === undefined || val === 'undefined' || val === 'null' || val === null) ? '' : String(val);

  // 2. Handle New Slide or Update
  if (files && files.length > 0) {
    console.log('Processing new image upload to Cloudinary...');
    const { secure_url } = await uploadToCloudinary(files[0], 'sust-cse/homepage');
    console.log('Cloudinary response:', secure_url);
    
    const slideData = {
      title: cleanStr(data.title) || 'New Slide',
      subtitle: cleanStr(data.subtitle),
      description: cleanStr(data.description),
      ctaText: cleanStr(data.ctaText),
      ctaLink: cleanStr(data.ctaLink),
      image: secure_url
    };

    if (editIndex !== undefined) {
      console.log(`Updating existing slide at index ${editIndex} with new image`);
      if (editIndex >= 0 && editIndex < finalSlides.length) {
        finalSlides[editIndex] = slideData;
      }
    } else {
      console.log('Adding new slide to banner');
      finalSlides.push(slideData);
    }
  } else if (data.title) {
    // Basic content update without new image
    if (editIndex !== undefined) {
      console.log(`Updating content only for slide at index ${editIndex}`);
      if (editIndex >= 0 && editIndex < finalSlides.length) {
        finalSlides[editIndex] = {
          ...finalSlides[editIndex],
          title: cleanStr(data.title),
          subtitle: cleanStr(data.subtitle) || finalSlides[editIndex].subtitle,
          description: cleanStr(data.description) || finalSlides[editIndex].description,
          ctaText: cleanStr(data.ctaText),
          ctaLink: cleanStr(data.ctaLink),
          image: finalSlides[editIndex].image
        };
      }
    } else {
       console.error('New slide requested but no image provided');
       throw new Error("Image is required for a new hero slide");
    }
  }

  console.log(`Total slides after operation: ${finalSlides.length}`);
  
  try {
    const updated = await HomePage.findByIdAndUpdate(
      homepage._id, 
      { 
        $set: { heroSlides: finalSlides, updatedBy: userId },
        $unset: { 
          heroImage: "", 
          heroImages: "", 
          // title, subtitle etc are technically fine to keep but let's focus on the array
        }
      }, 
      { new: true, runValidators: true }
    );
    console.log('Database updated successfully');
    return updated;
  } catch (error: any) {
    console.error('❌ Database update failed:', error.message);
    if (error.errors) {
      console.error('Validation Errors:', JSON.stringify(error.errors, null, 2));
    }
    throw error;
  }
};

// Notices
export const createNotice = async (data: any, files: Express.Multer.File[], userId: string) => {
  const attachments = [];
  if (files && files.length > 0) {
    for (const file of files) {
      const { secure_url } = await uploadToCloudinary(file, 'sust-cse/notices');
      attachments.push(secure_url);
    }
  }

  const notice = await Notice.create({
    ...data,
    attachments,
    createdBy: userId,
  });

  // Notify interested users
  const notificationResult = await notifyInterestedUsers('notice', notice.category, {
    title: notice.title,
    id: (notice._id as any).toString()
  });

  return {
    ...notice.toObject(),
    notificationResult
  };
};

export const getAllNotices = async (filters: any) => {
  const query: any = { isDeleted: false };
  if (filters.category) query.category = filters.category;
  
  return await Notice.find(query)
    .sort({ isPinned: -1, publishDate: -1 })
    .populate('createdBy', 'name email');
};

export const deleteNotice = async (id: string) => {
  const notice = await Notice.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  if (!notice) throw new NotFoundError('Notice not found');
  return notice;
};

export const getNoticeById = async (id: string) => {
  const notice = await Notice.findById(id).populate('createdBy', 'name email');
  if (!notice) throw new NotFoundError('Notice not found');
  return notice;
};

// Achievements
export const createAchievement = async (data: any, files: Express.Multer.File[], userId: string) => {
  let image = '';
  if (files && files.length > 0) {
    const { secure_url } = await uploadToCloudinary(files[0], 'sust-cse/achievements');
    image = secure_url;
  }

  return await Achievement.create({
    ...data,
    image,
    createdBy: userId,
  });
};

export const getAllAchievements = async (filters: any) => {
  const query: any = { isDeleted: false };
  if (filters.category) query.category = filters.category;
  if (filters.achievedBy) query.achievedBy = filters.achievedBy;

  return await Achievement.find(query)
    .sort({ date: -1 })
    .populate('achievedBy', 'name email profileImage')
    .populate('createdBy', 'name email');
};

export const deleteAchievement = async (id: string) => {
  const achievement = await Achievement.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  if (!achievement) throw new NotFoundError('Achievement not found');
  return achievement;
};
