// import { Request, Response, NextFunction } from "express";
// import { UserRole } from "../entities/user/user.entity";
//
// export interface AuthenticatedRequest extends Request {
//   user?: {
//     id: string;
//     role: UserRole;
//     email: string;
//   };
// }
//
// export const adminOnly = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
//   try {
//     if (!req.user) {
//       return res.status(401).json({
//         success: false,
//         message: "Authentication required",
//       });
//     }
//
//     if (req.user.role !== UserRole.ADMIN) {
//       return res.status(403).json({
//         success: false,
//         message: "Admin access required",
//       });
//     }
//
//     next();
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };