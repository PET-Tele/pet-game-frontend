import { JWT } from '@fastify/jwt';

declare module 'fastify' {
    interface FastifyRequest {
        jwt: JWT
    }
    export interface FastifyInstance {
        authenticate: any
    }
}

type UserPayload = {
    id: string,
    nickname: string
}

declare module '@fastify/jwt' {
    interface FastifyJWT {
      user: UserPayload
    }
}

declare module '@fastify/cookie' {
    interface FastifyJWT {
      user: UserPayload
    }
}