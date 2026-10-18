import { Request, Response, NextFunction } from 'express';
import { db } from '../db/supabase';

export const getAdminMetrics = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { data: registrations } = await db.registrations.getAll();
    const total = registrations.length;
    const shortlisted = registrations.filter((r) => r.status === 'shortlisted').length;
    const confirmed = registrations.filter((r) => r.status === 'confirmed').length;
    const pending = registrations.filter((r) => r.status === 'pending').length;

    res.json({
      success: true,
      data: {
        totalRegistrations: total,
        shortlistedCount: shortlisted,
        confirmedCount: confirmed,
        pendingReviewCount: pending,
        tracksBreakdown: {
          'AI & Autonomous Agents': registrations.filter((r) => r.track.includes('AI')).length,
          'Web3 & Decentralized Systems': registrations.filter((r) => r.track.includes('Web3')).length,
          'FinTech & Open Banking': registrations.filter((r) => r.track.includes('FinTech')).length,
          'HealthTech & BioInformatics': registrations.filter((r) => r.track.includes('HealthTech')).length,
          'Open Innovation': registrations.filter((r) => r.track.includes('Open')).length,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updateRegistrationStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'shortlisted', 'confirmed', 'waitlisted', 'rejected'].includes(status)) {
      res.status(400).json({ success: false, error: 'Invalid registration status specified' });
      return;
    }

    const { data, error } = await db.registrations.updateStatus(id, status);
    if (error) {
      res.status(404).json({ success: false, error: 'Registration not found' });
      return;
    }

    res.json({ success: true, data, message: `Status updated to ${status}` });
  } catch (err) {
    next(err);
  }
};
