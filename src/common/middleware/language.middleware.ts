import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LanguageMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const lang = req.headers['accept-language'];
    // Default to English, support 'ar' for Arabic
    (req as any).lang = lang?.startsWith('ar') ? 'ar' : 'en';
    next();
  }
}