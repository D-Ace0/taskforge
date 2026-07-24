import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      status: 'ok',
      service: 'taskforge-api',
      timestamp: new Date().toISOString(),
    };
  }
}
