import Fastify from 'fastify';
import UserRoutes from "./router/UserRoutes";

const server = Fastify({  
  logger: true,
  ignoreTrailingSlash: true
})

const PORT = process.env.PORT || 3040;

const app = new UserRoutes();

server.post('/register', app.UserSignUp)
server.post('/login', app.UserSignIn)
server.get('/auth', app.UserAuth)

const start = async () => {
  try {
    await server.listen(PORT, '127.0.0.1');
    console.log(`App listening on the https://localhost:${PORT}`);
  }
  catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();