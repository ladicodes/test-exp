import { User } from "../entities/user/user.entity";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
