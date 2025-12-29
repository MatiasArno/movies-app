import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';

@ApiTags('Health Check')
@Controller('status')
export class AppController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private configService: ConfigService,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Verificar estado del servidor y conexión a DB' })
  check() {
    return this.health.check([
      () => this.db.pingCheck('database', { timeout: 5500 }),

      async () => ({
        server: {
          status: 'up',
          name: process.env.npm_package_name,
          version: process.env.npm_package_version,
          port: this.configService.get('PORT'),
          documentation: '/api/docs',
          environment: this.configService.get('NODE_ENV'),
          uptime: process.uptime(),
        },
      }),
    ]);
  }
}
