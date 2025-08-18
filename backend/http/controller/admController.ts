import { FastifyInstance } from "fastify";
import Adm from "../../db/models/Adm";

export async function getAllAdm(app: FastifyInstance) {
    app.get("/adms", async (request, reply) => {
        const users = await Adm.find().catch((err: any) => console.log(err));
        reply.status(201).send(users);
    });
}

export async function getAdmbyId(app: FastifyInstance) {
    app.get("/adms/:admId", async (request, reply) => {
        //@ts-ignore
        const user = await Adm.findById(request.params.admId);

        reply.send(user);
    });
}

export async function createAdm(app: FastifyInstance) {
    app.post("/adms",  async (request, reply) => {
        const user = new Adm(request.body);
        const result = user.save();
        reply.status(201).send(result);
    });
}

export async function deleteAdm(app: FastifyInstance) {
    app.delete("/adms/:admId",  async (request, reply) => {
        try {
            //@ts-ignore
            await Adm.findByIdAndDelete(request.params.admId);
            reply.status(203).send("user deleted");
        } catch(error) {
            reply.status(500).send(error);
        }
    });
}
