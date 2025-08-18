import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import fjwt from '@fastify/jwt';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import { userRoutes } from '../http/routes/userRoutes';
import mongoose, {mongo} from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = fastify({
    logger: true,
});

app.addHook('preHandler', (request, reply, next) => {
    request.jwt = app.jwt;
    return next();
});

app.register(cookie, {
    hook: 'preHandler',
    secret: "petOdonto",
});

app.register(fjwt, { secret: "pet2024" });

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
    origin: 'https://pet-gaming.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
});

app.register(userRoutes, { prefix: '/api/v1' });

// Healthcheck route
app.get('/health', async (req, res) => {
    res.status(200).send({ message: 'Healthcheck' });
});


// usa String() por conta do TS
let mongo_uri = String(process.env.MONGO_URI);

mongoose
    .connect(mongo_uri)
    .then(() => console.log("MongoDB connected"))
    .catch((error: any) => console.log(error));

export default async function handler(req: any, res: any) {
    await app.ready();
    app.server.emit('request', req, res);
}