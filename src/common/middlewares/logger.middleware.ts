import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LOG_MESSAGES } from '../constants/log-messages';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const startTime = Date.now();

    this.logger.log(
      `${LOG_MESSAGES.HTTP.REQUEST} [${method}] ${originalUrl} - IP: ${ip} - UA: ${userAgent}`,
    );

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      const duration = Date.now() - startTime;

      const message = `${LOG_MESSAGES.HTTP.RESPONSE} [${method}] ${originalUrl} ${statusCode} - ${duration}ms - ${contentLength} bytes`;

      if (statusCode >= 400) {
        this.logger.error(message);
      } else {
        this.logger.log(message);
      }
    });

    next();
  }
}
