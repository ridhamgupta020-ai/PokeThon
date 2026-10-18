import { Request, Response, NextFunction } from 'express';
import { db } from '../db/supabase';

export const createRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      teamName,
      leadName,
      leadEmail,
      leadPhone,
      institution,
      teamSize,
      track,
      projectIdeaAbstract,
      githubUrl,
      portfolioUrl,
      acceptedTerms,
    } = req.body;

    // Basic server-side validation
    if (!teamName || !leadName || !leadEmail || !leadPhone || !institution || !track) {
      res.status(400).json({
        success: false,
        error: 'Missing required registration parameters',
      });
      return;
    }

    if (!acceptedTerms) {
      res.status(400).json({
        success: false,
        error: 'Acceptance of PokeThon sprint terms is required',
      });
      return;
    }

    const { data, error } = await db.registrations.insert({
      teamName,
      leadName,
      leadEmail,
      leadPhone,
      institution,
      teamSize: Number(teamSize) || 2,
      track,
      projectIdeaAbstract,
      githubUrl,
      portfolioUrl,
    });

    if (error) {
      res.status(500).json({ success: false, error: error.message });
      return;
    }

    res.status(201).json({
      success: true,
      data: {
        registrationId: data.id,
        teamName: data.teamName,
        status: data.status,
      },
      message: 'Registration successfully received for PokeThon 2026',
    });
  } catch (err) {
    next(err);
  }
};

export const getRegistrations = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { data, error } = await db.registrations.getAll();
    if (error) {
      res.status(500).json({ success: false, error: error.message });
      return;
    }
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
