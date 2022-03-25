import { request } from "http";
import { send } from "process";

// module.exports = routes

const hello = (request, Response) => {
    const world = "hello world 1";
    Response.status(200).send({ hello: 'world' });
}

module.exports = { hello };