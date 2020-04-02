const request = require('supertest');
const app = require('../app');

describe('Server', () => {
	beforeAll(async () => {
		
	});

	test('Correct Url', async () => {
		await request(app)
			.get('/api/https://sindresorhus.com')
			.expect(200)
			.expect('Content-Type', /json/);
	});

	test('Wrong Url', async () => {
		await request(app)
			.get('/api/https://sindresorhus.comm')
			.expect(500);
	});
});
