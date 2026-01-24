import { Request, Response } from 'express';

export class UploadController {
  async store(req: Request, res: Response) {
    // Multer adds 'file' to the request object.
    // Typescript might complain if types are not fully extended, so we cast/check.
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    // Construct full URL (assuming localhost:3333 for dev, customizable via env)
    // For now, returning absolute path relative to server
    const fileUrl = `${process.env.APP_URL || 'http://localhost:3333'}/files/${file.filename}`;

    return res.json({ url: fileUrl, filename: file.filename });
  }
}
