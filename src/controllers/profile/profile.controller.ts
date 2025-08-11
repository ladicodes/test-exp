import { Repository } from "typeorm";
import { ProfileService } from "../../services/profile.service";
import { Profile } from "../../entities/profile/profile.entity";
import { ResponseUtil } from "../../utils/response";
import { Request, Response } from "express";


export class ProfileController {
  private readonly profileService: ProfileService;

  constructor(profileRepository: Repository<Profile>) {
    this.profileService = new ProfileService(profileRepository);
  }

  // Create a new profile entry
  async createProfile(req: Request, res: Response): Promise<Response> {
    const profileData = req.body;
    try {
      const createdProfile = await this.profileService.createProfile(profileData);
      return ResponseUtil.success(res, createdProfile, "Profile created successfully");
    } catch (error: any) {
      return ResponseUtil.error(res, "Error creating profile", 500, error);
    }
  }

  // Retrieve a profile by its ID
  async getProfileById(req: Request, res: Response): Promise<Response> {
    const profileId = req.params.id;
    try {
      const profile = await this.profileService.getProfileById(profileId);
      if (!profile) {
        return ResponseUtil.error(res, "Profile not found", 404);
      }
      return ResponseUtil.success(res, profile, "Profile retrieved successfully");
    } catch (error) {
      return ResponseUtil.error(res, "Error retrieving profile", 500, error);
    }
  }

  // Update an existing profile by its ID
  async updateProfile(req: Request, res: Response): Promise<Response> {
    const profileId = req.params.id;
    const profileData = req.body;
    try {
      const updatedProfile = await this.profileService.updateProfile(profileId, profileData);
      if (!updatedProfile) {
        return ResponseUtil.error(res, "Profile not found", 404);
      }
      return ResponseUtil.success(res, updatedProfile, "Profile updated successfully");
    } catch (error) {
      return ResponseUtil.error(res, "Error updating profile", 500, error);
    }
  }
}
 