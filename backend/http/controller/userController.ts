import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import bcrypt from 'bcryptjs'
import { zodUserSchema } from "../../db/models/zodSchemas"
import User from "../../db/models/User";

export async function getAllUsers(request: FastifyRequest, reply: FastifyReply) {
    const users = await User.find().catch((err: any) => console.log(err));
    reply.status(200).send(users);
}

export async function getUserById(request: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply) {
    const getUserParams = z.object({
        userId: z.string(),
    })
    try{
        const { userId } = getUserParams.parse(request.params);
        const user = await User.findById(userId);
        reply.send(user);
    } catch(e){
        return reply.status(400).send({ message : "ID de usuário inválido"}); 
    }
}

export async function registerUser(request: FastifyRequest, reply: FastifyReply) {
    try{
        const parsedUser = zodUserSchema.parse(request.body);
        const { nickname } = parsedUser;
        const userExists = await User.findOne({ nickname });
        if(userExists) return reply.status(400).send({ message : "Usuário já existe"});

        const salt = await bcrypt.genSalt(10);
        const hashPsswd = await bcrypt.hash(parsedUser.password, salt);
        parsedUser.password = hashPsswd;

        const user = new User(parsedUser);
        user.save();
        reply.status(200).send({
            _id: user.id,
            nickname: user.nickname,
        });
    } catch(e){
        reply.status(400).send({ message: "Dados de usuário inválidos" });
    }
}

export async function loginUser(request: FastifyRequest, reply: FastifyReply) {
    const zEntries = z.object({
        nickname: z.string(),
        password: z.string(),
        remember: z.boolean()
    });
    try {
        const { nickname, password, remember } = zEntries.parse(request.body);
        const isEmail = nickname.includes("@");
        const user = await User.findOne(isEmail ? { email: nickname } : { nickname });
        if (user && (await bcrypt.compare(password, user.password))) {
            console.log("User logged", user);
            // Generate Token
            const payload = {
                id: user.id,
                isAdmin: user.isAdm,
                nickname: user.nickname,
                gender: user.gender,
            };
            const token = request.jwt.sign(payload);

            if (remember) {
                reply.setCookie('access_token', token, {
                    path: '/',
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                });
            } else {
                reply.setCookie('access_token', token, {
                    path: '/',
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                });
            }

            reply.status(200).send({
                _id: user.id,
                nickname: user.nickname,
                token: token,
                isAdmin: user.isAdmin,
                payload: payload // Include the payload object in the response
            });
        } else {
            reply.status(400).send({ message: "Credenciais inválidas" });
        }
    } catch (e) {
        reply.status(400).send({ message: "Credenciais inválidas" });
    }
}

export async function getMe(request: FastifyRequest, reply: FastifyReply){
    try{
        reply.status(200).send(await User.findById(request.user.id));
    } catch (e){
        reply.status(500).send({ error: "Falha interna do servidor"})
    }
}

export async function logoutUser(request: FastifyRequest, reply: FastifyReply) {
    console.log("Logging out user...");
    reply.clearCookie('access_token', {
        path: '/',
        httpOnly: true,
        secure: true, // Must match the setting used when creating the cookie
        sameSite: 'none', // Must match the setting used when creating the cookie
    });
    reply.status(200).send({ message: 'Logout bem-sucedido' });
}

export async function deleteUser(request: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply) {
    const getUserParams = z.object({
        userId: z.string(),
    })

    try {
        const { userId } = getUserParams.parse(request.params);
        const user = await User.findByIdAndDelete(userId);
        if(!user){
            return reply.status(404).send({ error: "Usuário não encontrado"});
        }
        reply.status(200).send({ message: "Usuário deletado" });
    } catch(error) {
        reply.status(500).send(error);
    }
}

export async function updateUserNick(request: FastifyRequest<{ Params: { userId: string}}>, reply: FastifyReply){
    const getUserParams = z.object({
        userId: z.string({
            required_error: "Id is required",
            invalid_type_error: "Id must be a string"
        })
    })
    try {
        const getNewNick = z.object({
            nickname: z.string(),
        })

        const { userId } = getUserParams.parse(request.params);
        const { nickname } = getNewNick.parse(request.body);
        const user = await User.findByIdAndUpdate(userId, { nickname: nickname });
        if(!user) {
            return reply.status(404).send({ error: "Usuário não encontrado"});
        }
        reply.status(200).send({ message: "Apelido de usuário alterado com sucesso" });
    } catch(error){
        reply.status(500).send(error);
    }
}