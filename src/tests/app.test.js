import request from 'supertest';
import app from '../app';
import { describe, it, expect } from '@jest/globals';

describe('API end points', () => {
  describe('GET route/health', () => {
    it('should return the health status', async () => {
      const response = await request(app).get('/health').expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('GET api', () => {
    it('should return api message', async () => {
      const response = await request(app).get('/api').expect(200);

      expect(response.body).toHaveProperty(
        'message',
        'aquisition api is running'
      );
    });
  });

  describe('GET /nonexistant', () => {
    it('should return nonexistent 404 for non-existent routes', async () => {
      const response = await request(app).get('/nonexistent').expect(404);

      expect(response.body).toHaveProperty('message', 'route not found');
    });
  });
});
