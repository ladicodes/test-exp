import { Repository } from "typeorm";
import { Profile } from '../entities/profile/profile.entity';

/* const profileRepo = profileservice.getRepository(Profile);

 export const createProfile = async (data: Partial<Profile>) => {
  const profile = profileRepo.create(data);
  return await profileRepo.save(profile);
};

export const getAllProfiles = async () => {
  return await profileRepo.find();
};

export const getProfileById = async (id: string) => {
  return await profileRepo.findOneBy({ id });
};

export const updateProfile = async (id: string, data: Partial<Profile>) => {
  await profileRepo.update(id, data);
  return await profileRepo.findOneBy({ id });
};

export const deleteProfile = async (id: string) => {
  return await profileRepo.delete(id);
};
 */

export class ProfileService {
  private readonly profileRepository: Repository<Profile>;

  constructor(profileRepository: Repository<Profile>) {
    this.profileRepository = profileRepository;
  }

  async createProfile(data: Partial<Profile>) {
    const profile = this.profileRepository.create(data);
    return this.profileRepository.save(profile);
  }

  async getAllProfiles() {
    return this.profileRepository.find();
  }

  async getProfileById(id: string) {
    return this.profileRepository.findOneBy({ id });
  }

  async updateProfile(id: string, data: Partial<Profile>) {
    await this.profileRepository.update(id, data);
    return this.profileRepository.findOneBy({ id });
  }

  async deleteProfile(id: string) {
    const profile = await this.profileRepository.findOneBy({ id });
    if (!profile) throw new Error("Profile not found");

    await this.profileRepository.delete(id);
    return { message: "Profile deleted successfully" };
  }
} 