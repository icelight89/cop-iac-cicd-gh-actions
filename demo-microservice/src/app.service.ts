import { Injectable } from '@nestjs/common';

import { Client } from 'pg';

@Injectable()
export class AppService {
  async getHealthStatus() {
    const connectionString = process.env['PGCONNECTIONSTRING'];
    const client = new Client({
      connectionString,
    });
    let dbConnectionStatus = undefined;
    try {
      await client.connect();
      dbConnectionStatus = 'healthy';
      await client.end();
    } catch (error) {
      dbConnectionStatus = 'unhealthy';
      console.error(error);
    }
    return {
      service_health: 'healthy',
      db_health: dbConnectionStatus,
    };
  }
}
