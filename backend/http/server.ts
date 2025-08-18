import fastify, {FastifyReply, FastifyRequest} from 'fastify';
import fjwt from '@fastify/jwt';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import {userRoutes} from './routes/userRoutes';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { gameRoutes } from './routes/gameRoutes';
import { inventoryRoutes } from './routes/inventoryRoutes';
import { itemRoutes } from './routes/itemRoutes';

dotenv.config();

const app = fastify({
    logger: true,
});

const port = Number(process.env.PORT) || 4000;

app.addHook('preHandler', (request, reply, next) => {
    request.jwt = app.jwt;
    return next();
});

app.register(cookie, {
    hook: 'preHandler',
    secret: "petOdonto",
});

const secret = process.env.jwt_secret;
if (!secret) {
    throw new Error("JWT secret is not defined in environment variables");
}
app.register(fjwt, { secret });

app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const token = request.cookies.access_token;
        if (!token) {
            reply.status(401).send({ message: 'Unauthorized: No token provided' });
            return;
        }
        request.user = await request.jwt.verify(token);
    } catch (err) {
        reply.status(401).send({ message: 'Unauthorized: Invalid token' });
    }
});

app.register(cors, {
    // origin: 'https://pet-gaming.vercel.app',
    origin: ['https://pet-gaming.vercel.app', 'http://localhost:5173', 'https://pet-gaming-git-dev-morgixins-projects.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
});

app.register(userRoutes, { prefix: '/api/v1/users' });
app.register(gameRoutes, { prefix: '/api/v1/games' });
app.register(inventoryRoutes, { prefix: '/api/v1/inv' });
app.register(itemRoutes, { prefix: '/api/v1/items' });

// Send healthcheck message as root route
app.register(async (fastify) => {
    fastify.get('/health', async (req, res) => {
        res.send({ message: 'Healthcheck' });
    });
});

// usa String() por conta do TS
let mongo_uri = String(process.env.MONGO_URI);

mongoose
    .connect(mongo_uri)
    .then(() => console.log("MongoDB connected"))
    .catch((error: any) => console.log(error));

app.listen({ port, host: "0.0.0.0" }, (err, address) => {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
    app.log.info(`Server listening at ${address}`);
});


export default async function handler(req: any, res: any) {
    await app.ready();
    app.server.emit('request', req, res);
}