import multer, { StorageEngine, FileFilterCallback } from "multer";
import { Request } from "express";
import path from "path";
import fs from "fs";

interface UploadConfig {
  destination?: string;
  maxFileSize?: number;
  allowedMimeTypes?: string[];
  allowedExtensions?: string[];
  maxFiles?: number;
}

export class MulterService {
  private upload: multer.Multer;
  private config: Required<UploadConfig>;

  constructor(config: UploadConfig = {}) {
    this.config = {
      destination: config.destination || "./uploads",
      maxFileSize: config.maxFileSize || 5 * 1024 * 1024, // 5MB default
      allowedMimeTypes: config.allowedMimeTypes || [
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/pdf",
        "text/plain",
      ],
      allowedExtensions: config.allowedExtensions || [
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".pdf",
        ".txt",
      ],
      maxFiles: config.maxFiles || 10,
    };

    this.ensureUploadDirectory();
    this.upload = multer({
      storage: this.createStorage(),
      fileFilter: this.fileFilter.bind(this),
      limits: {
        fileSize: this.config.maxFileSize,
        files: this.config.maxFiles,
      },
    });
  }

  private ensureUploadDirectory(): void {
    if (!fs.existsSync(this.config.destination)) {
      fs.mkdirSync(this.config.destination, { recursive: true });
    }
  }

  private createStorage(): StorageEngine {
    return multer.diskStorage({
      destination: (req: Request, file: Express.Multer.File, cb) => {
        cb(null, this.config.destination);
      },
      filename: (req: Request, file: Express.Multer.File, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, `${name}-${uniqueSuffix}${ext}`);
      },
    });
  }

  private fileFilter(
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ): void {
    const ext = path.extname(file.originalname).toLowerCase();

    // Check file extension
    if (!this.config.allowedExtensions.includes(ext)) {
      return cb(
        new Error(
          `File type ${ext} not allowed. Allowed types: ${this.config.allowedExtensions.join(
            ", "
          )}`
        )
      );
    }

    // Check MIME type
    if (!this.config.allowedMimeTypes.includes(file.mimetype)) {
      return cb(
        new Error(
          `MIME type ${
            file.mimetype
          } not allowed. Allowed types: ${this.config.allowedMimeTypes.join(
            ", "
          )}`
        )
      );
    }

    cb(null, true);
  }

  // Single file upload
  public single(fieldName: string) {
    return this.upload.single(fieldName);
  }

  // Multiple files upload (same field name)
  public array(fieldName: string, maxCount?: number) {
    return this.upload.array(fieldName, maxCount || this.config.maxFiles);
  }

  // Multiple files upload (different field names)
  public fields(fields: multer.Field[]) {
    return this.upload.fields(fields);
  }

  // Any files upload
  public any() {
    return this.upload.any();
  }

  // Get file info
  public static getFileInfo(file: Express.Multer.File) {
    return {
      originalName: file.originalname,
      filename: file.filename,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype,
      destination: file.destination,
    };
  }

  // Delete file
  public static deleteFile(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.unlink(filePath, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  // Update configuration
  public updateConfig(newConfig: Partial<UploadConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.ensureUploadDirectory();
    this.upload = multer({
      storage: this.createStorage(),
      fileFilter: this.fileFilter.bind(this),
      limits: {
        fileSize: this.config.maxFileSize,
        files: this.config.maxFiles,
      },
    });
  }

  public getConfig(): Required<UploadConfig> {
    return { ...this.config };
  }
}
