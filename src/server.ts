import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import fjwt, { JWT } from "fastify-jwt";

const test = require('./router/test');
const user = require('./router/RegLoginRoutes');

declare module "fastify" {
  interface FastifyRequest {
    jwt: JWT;
  }
  export interface FastifyInstance {
    authenticate: any;
  }
}

declare module "fastify-jwt" {
  interface FastifyJWT {
    user: {
      id: number;
      email: string;
      name: string;
    };
  }
}

const server = Fastify({  
  logger: true,
  ignoreTrailingSlash: true
})

const PORT = process.env.PORT || 3040;

server.get('/', test.hello);
server.post('/auth/sign-up', user.UserSignUp)
server.post('/auth/sign-in', user.UserSignIn)

const start = async () => {
  try {
    await server.listen(PORT, '127.0.0.1');
    // server.log.info(`App listening on the ${server.server.address()}`);
    console.log(`App listening on the https://localhost:3040`);
  }
  catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

// server.get('/hello', async (request, reply) => {
//   return { hello: 'world' }
// })

start();