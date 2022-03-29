import Fastify from 'fastify';
import AuthApi from '../api/user-api';
import CustomError from '../CustomError';

export default class UserRoutes {

    public async UserSignUp(Request, Response) {
        try {
            const auth = new AuthApi();
            const response = await auth.signUp(Request.body);
            Response.status(200).send(response);
        } catch (e) {
            console.log(e);
            Response.status(e?.status || 500).send(e);
        }

    }

    public async UserSignIn(Request, Response) {
        try {
            const auth = new AuthApi();
            const response = await auth.signIn(Request.body);
            Response.status(200).send(response);
        } catch (e) {
            console.log(e);
            Response.status(e?.status || 500).send(e);
        }
    }

    public async UserAuth(Request, Response) {
        try {
            const auth = new AuthApi();
            const token = Request?.headers?.authorization?.split(' ')[1];
            if (!token) {
                throw new CustomError({
                    status: 404,
                    message: 'Token not defined.'
                });
            }
            const response = await auth.validateJwt({
                token: token
            });
            Response.status(200).send(response);
        } catch (e) {
            console.log(e);
            Response.status(e?.status||500).send(e);
        }
    }
}