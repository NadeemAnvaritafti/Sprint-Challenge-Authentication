const Users = require('./auth-model');
const db = require('../database/dbConfig');
const request = require('supertest');
const server = require('../api/server');


// ------------------- REGISTER ENDPOINT ---------------------- //
describe('Auth Router', function() {
    beforeEach(async () => {
        await db('users').truncate();
    });

    describe('/register', function() {
        it ('should register a user', async function() {
            await request(server)
                .post('/api/auth/register')
                .send({ username: 'User1', password: 'pass' })
                .expect(201);
        });

        it ('should NOT register a user', async function() {
            await request(server)
                .post('/api/auth/register')
                .send({ username: 'User2' })
                .expect(400);
        });
    });
});


// ------------------- LOGIN ENDPOINT ---------------------- //
describe('Auth Router', function() {
    describe('/login', function() {
        it ('should login a user', async function() {
            await request(server)
                .post('/api/auth/register')
                .send({ username: 'User2', password: 'pass' })
            await request(server)
                .post('/api/auth/login')
                .send({ username: 'User2', password: 'pass' })
                .expect(200);
        });

        it ('should NOT login a user', async function() {
            await request(server)
                .post('/api/auth/login')
                .send({ username: 'User5', password: 'pass' })
                .expect(401);
        });
    });
});