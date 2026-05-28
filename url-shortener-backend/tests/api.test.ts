import request from 'supertest';
import app from '../src/app';
import { connectDB } from '../src/config/database';
import { redis } from '../src/config/redis';

// Note: These are integration tests — they need PostgreSQL + Redis running.
// Run `docker compose up -d` before running tests.

describe('POST /api/shorten', () => {
  it('should return 400 if url is missing', async () => {
    const res = await request(app).post('/api/shorten').send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 400 if url is invalid', async () => {
    const res = await request(app)
      .post('/api/shorten')
      .send({ url: 'not-a-valid-url' });
    expect(res.status).toBe(400);
  });

  it('should create a short URL for a valid URL', async () => {
    const res = await request(app)
      .post('/api/shorten')
      .send({ url: 'https://www.example.com' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('short_url');
    expect(res.body).toHaveProperty('short_code');
    expect(res.body.original_url).toBe('https://www.example.com');
  });

  it('should return the same short URL for the same original URL', async () => {
    const url = 'https://www.github.com';
    const res1 = await request(app).post('/api/shorten').send({ url });
    const res2 = await request(app).post('/api/shorten').send({ url });
    expect(res1.body.short_code).toBe(res2.body.short_code);
  });
});

describe('GET /:code', () => {
  it('should 404 for a non-existent code', async () => {
    const res = await request(app).get('/doesnotexist999');
    expect(res.status).toBe(404);
  });

  it('should redirect to the original URL for a valid code', async () => {
    // First, create a short URL
    const createRes = await request(app)
      .post('/api/shorten')
      .send({ url: 'https://www.wikipedia.org' });
    const { short_code } = createRes.body;

    // Then follow the redirect
    const redirectRes = await request(app).get(`/${short_code}`);
    expect(redirectRes.status).toBe(301);
    expect(redirectRes.headers.location).toBe('https://www.wikipedia.org');
  });
});

describe('GET /api/stats/:code', () => {
  it('should return stats for a valid short code', async () => {
    const createRes = await request(app)
      .post('/api/shorten')
      .send({ url: 'https://www.nodejs.org' });
    const { short_code } = createRes.body;

    const statsRes = await request(app).get(`/api/stats/${short_code}`);
    expect(statsRes.status).toBe(200);
    expect(statsRes.body).toHaveProperty('clicks');
    expect(statsRes.body.original_url).toBe('https://www.nodejs.org');
  });
});

describe('GET /health', () => {
  it('should return 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

afterAll(async () => {
  try {
    // Gracefully shut down the Redis client connection
    if (redis) {
      await redis.quit();
    }

    // Gracefully drain and close the PostgreSQL connection pool
    if (connectDB) {
      await connectDB().then((client) => client.end());
    }
  } catch (error) {
    console.error('Error during test teardown:', error);
  }
});