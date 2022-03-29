import Fastify from 'fastify';

export default class App {
    // app: Fastify;
    port: number;

    app = Fastify({  
        logger: true,
        ignoreTrailingSlash: true
    })

    constructor(config: {port: number, middlewares: any, routes: any}) {
        // this.app = Fastify();
        this.port = config.port;
        this.middlewares(config.middlewares);
        this.routes(config.routes);
    }

    private middlewares(middlewares: { forEach: (arg: (middleware: any) => void) => void }): void {
        middlewares.forEach(middleware => {
            this.app.route(middleware);
        });
    }

    private routes(routes: { forEach: (arg: (controller: any) => void) => void }): void {
        routes.forEach(controller => {
            this.app.use('/', controller.router);
        });
    }

    public listen(): void {
        this.app.listen(this.port, () => {
            console.log(`App listening on the http://localhost:${this.port}`);
        });
    }
}