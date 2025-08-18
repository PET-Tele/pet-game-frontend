import fastify, { FastifyInstance } from 'fastify'; 
import { z } from 'zod';
import { 
    getAllUsers, getUserById, getMe, registerUser, deleteUser, 
    updateUserNick, loginUser, logoutUser
} from '../controller/userController';

/**
 * @route   GET/POST api/v1/users
 * @desc    Get/Post/Put/Delete users com Fastify
 * @access  Private
 */

export async function userRoutes(fastify: FastifyInstance, options: any){
    fastify.get("/cookies", { preHandler: [fastify.authenticate] }, async (request, reply) => {
        const access_token = request.cookies.access_token;
    
        if (!access_token) {
            console.log(request.cookies);  // This will print cookies, or an empty object if none exist
            return reply.status(401).send({ message: 'Não autenticado' });
        }
    
        try {
            const decoded = request.jwt.verify(access_token);
            console.log("Decoded token:", decoded);
            return reply.status(200).send({ user: decoded });
        } catch (error) {
            console.error("Token verification failed:", error);
            return reply.status(401).send({ message: 'Token inválido ou expirado' });
        }
    });

    fastify.get("/", { preHandler: [fastify.authenticate] }, getAllUsers);
    fastify.get("/:userId", { preHandler: [fastify.authenticate] }, getUserById);
    // fastify.get("/myInfo", { preHandler: [fastify.authenticate] }, getMe);
    fastify.post("/register", registerUser);
    fastify.post("/login", loginUser);
    fastify.get("/logout", { preHandler: [fastify.authenticate] }, logoutUser);
    fastify.put("/:userId", updateUserNick);
    fastify.delete("/:userId", deleteUser);
}
