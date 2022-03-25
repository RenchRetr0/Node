import AuthApi from '../api/user-api';

const UserSignUp = async ( Request, Response) => {
    try {
        // console.log(Request.body);
        // const ter = Request.body;
        const auth = new AuthApi();
        const response = await auth.signUp(Request.body);
        Response.status(200).send(response);
    } catch (e) {
        console.log(e);
        Response.status(e?.status || 500).send(e);
    }
    
}

const UserSignIn = async ( Request, Response) => {
    try {
        const auth = new AuthApi();
        const response = await auth.signIn(Request.body);
        Response.status(200).send(response);
    } catch (e) {
        console.log(e);
        Response.status(e?.status || 500).send(e);
    }
}

module.exports = { UserSignUp, UserSignIn };