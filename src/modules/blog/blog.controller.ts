import { Request, Response } from 'express';
import * as BlogService from './blog.service';
import { asyncHandler } from '../../utils/asyncHandler.util';
import { successResponse } from '../../utils/response.util';
import { uploadToCloudinary } from '../../utils/cloudinary.util';
import { AppError } from '../../utils/errors';
import { sendEmail } from '../../utils/email.util';
import { BlogStatus } from './blog.interface';

export const createBlog = asyncHandler(async (req: Request, res: Response) => {
  let imageUrl = '';

  // Upload image to Cloudinary if provided
  if (req.file) {
    const { secure_url } = await uploadToCloudinary(req.file, 'sust-cse/blogs');
    imageUrl = secure_url;
  }

  // Parse tags if they come as a string from FormData
  let tags = req.body.tags || [];
  if (typeof tags === 'string') {
    tags = tags.split(',').map((tag: string) => tag.trim()).filter(Boolean);
  }

  // Check if user is authenticated
  const user = (req as any).user;
  
  const blogData = {
    ...req.body,
    tags,
    image: imageUrl || undefined,
    author: user._id,
  };

  const blog = await BlogService.createBlog(blogData);
  successResponse(res, blog, 'Blog post submitted for verification', 201);
});

export const getPublishedBlogs = asyncHandler(async (req: Request, res: Response) => {
  const blogs = await BlogService.getPublishedBlogs();
  successResponse(res, blogs, 'Published blogs fetched successfully');
});

export const getPendingBlogs = asyncHandler(async (req: Request, res: Response) => {
  const blogs = await BlogService.getPendingBlogs();
  successResponse(res, blogs, 'Pending blogs fetched successfully');
});

export const getMyBlogs = asyncHandler(async (req: Request, res: Response) => {
  const blogs = await BlogService.getMyBlogs((req as any).user._id);
  successResponse(res, blogs, 'Your blogs fetched successfully');
});

export const getBlogById = asyncHandler(async (req: Request, res: Response) => {
  const blog = await BlogService.getBlogById(req.params.id as string);
  successResponse(res, blog, 'Blog post fetched successfully');
});

export const verifyBlog = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { status } = req.body;

  const blog = await BlogService.verifyBlog(id, status);
  if (!blog) {
    throw new AppError('Blog post not found', 404);
  }

  // Send notification if blog is published
  if (status === BlogStatus.PUBLISHED) {
    try {
      // Re-fetch with author populated if it exists
      const populatedBlog = await blog.populate('author', 'name email');
      const authorEmail = populatedBlog.author ? (populatedBlog.author as any).email : populatedBlog.guestEmail;
      const authorName = populatedBlog.author ? (populatedBlog.author as any).name : populatedBlog.guestName || 'Contributor';

      if (authorEmail) {
        await sendEmail({
          to: authorEmail,
          subject: 'Your Blog Post has been Published! - SUST CSE Dashboard',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; padding: 20px;">
              <h2 style="color: #16a34a;">Congratulations!</h2>
              <p>Hello ${authorName},</p>
              <p>We are pleased to inform you that your blog post <strong>"${blog.title}"</strong> has been approved and published on the SUST CSE Dashboard.</p>
              <p>You can view it here:</p>
              <div style="margin: 30px 0;">
                <a href="${process.env.CLIENT_URL}/blogs/${blog._id}" style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">View Your Post</a>
              </div>
              <p>Thank you for contributing to our community!</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="color: #666; font-size: 12px;">SUST CSE Department</p>
            </div>
          `
        });
      }
    } catch (emailError) {
      console.error('Failed to send blog approval email:', emailError);
    }
  }

  successResponse(res, blog, `Blog post ${status.toLowerCase()} successfully`);
});

export const deleteBlog = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  await BlogService.deleteBlog(req.params.id as string, user._id, user.role);
  successResponse(res, null, 'Blog post deleted successfully');
});
