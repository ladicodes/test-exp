import { Repository } from "typeorm";
import { ProfileService } from "../../services/profile.service";
import { Profile } from "../../entities/profile/profile.entity";
import { ResponseUtil } from "../../utils/response";
import { Request, Response } from "express";


/* export const create = async (req: Request, res: Response) => {
  const data = req.body;
  const profile = await profileService.createProfile(data);
  res.status(201).json(profile);
};

export const getAll = async (_: Request, res: Response) => {
  const profiles = await profileService.getAllProfiles();
  res.json(profiles);
};

export const getOne = async (req: Request, res: Response) => {
  const profile = await profileService.getProfileById(req.params.id);
  if (!profile) return res.status(404).json({ message: 'Not found' });
  res.json(profile);
};

export const update = async (req: Request, res: Response) => {
  const updated = await profileService.updateProfile(req.params.id, req.body);
  if (!updated) return res.status(404).json({ message: 'Not found' });
  res.json(updated);
};

export const remove = async (req: Request, res: Response) => {
  await profileService.deleteProfile(req.params.id);
  res.status(204).send();
}; */