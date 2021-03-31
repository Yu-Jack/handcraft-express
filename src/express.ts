import http from "http";

interface ObjectKey {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

interface MiddlewareFunction {
    (request: http.IncomingMessage & ObjectKey, response: http.OutgoingMessage, next ? : () => void): void;
}

type HttpMethod = "GET" | "*";

interface Router {
    method: HttpMethod;
    url: string;
    callbacks: Array < MiddlewareFunction > ;
}

interface ExpressApp {
    (request: http.IncomingMessage, response: http.OutgoingMessage): void;
    routers: Array < Router > ;
    use: (...args: Array < string | MiddlewareFunction > ) => void;
    get: (url: string, ...args: Array < MiddlewareFunction > ) => void;
    registerRouter: (method: HttpMethod, parameters: Array < string | MiddlewareFunction > ) => void;
    listen: (port: number, callback: () => void) => void;
    handleMainLogic: (request: http.IncomingMessage, response: http.OutgoingMessage) => void;
}

function startExpress(): ExpressApp {
    const app: ExpressApp = function (request, response) {
        app.handleMainLogic(request, response);
    };

    app.routers = [];
    app.use = function (...args) {
        if (typeof args[0] === "string") {
            app.registerRouter("*", [args[0], ...args.slice(1)]);
        } else {
            app.registerRouter("*", args);
        }
    };
    app.get = function (url, ...args) {
        app.registerRouter("GET", [url, ...args]);
    };
    app.registerRouter = function (method, parameters) {
        let url = "";
        const callbacks: Array < MiddlewareFunction > = [];

        for (const parameter of parameters) {
            if (typeof parameter === "string") {
                url = parameter;
            }
            if (typeof parameter === "function") {
                callbacks.push(parameter);
            }
        }

        app.routers.push({
            method: method,
            url,
            callbacks
        });
    };
    app.listen = function (port, callback) {
        http.createServer(app.handleMainLogic).listen(port, callback);
    };
    app.handleMainLogic = function (request, response): void {
        for (const router of app.routers) {
            let runAble = false;
            if (router.method === "*") {
                if (!router.url || (request.url === router.url)) {
                    runAble = true;
                }
            }
            if (request.url === router.url && router.method === request.method) {
                runAble = true;
            }

            if (!runAble) {
                continue;
            }

            const callbacks = router.callbacks;
            for (let i = 0; i < callbacks.length;) {
                const callback = callbacks[i];

                callback(request, response, function () {
                    if (!response.writableEnded) {
                        i++;
                    }
                });

                if (response.writableEnded) {
                    break;
                }
            }
            if (response.writableEnded) {
                break;
            }
        }
    };
    return app;
}

// References: https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require
export = startExpress;