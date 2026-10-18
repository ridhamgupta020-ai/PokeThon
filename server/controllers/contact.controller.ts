import { Request, Response, NextFunction } from 'express';
import { db } from '../db/supabase';

export const handleContactInquiry = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, category, message } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({
        success: false,
        error: 'Name, email, and inquiry message are required',
      });
      return;
    }

    const { data, error } = await db.inquiries.insert({
      name,
      email,
      category: category || 'general',
      message,
    });

    if (error) {
      res.status(500).json({ success: false, error: error.message });
      return;
    }

    res.status(201).json({
      success: true,
      data: { inquiryId: data.id },
      message: 'Inquiry registered. Our organizing desk will contact you soon.',
    });
  } catch (err) {
    next(err);
  }
};
