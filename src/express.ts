import http from "http";
import { ExpressRequest, ExpressResponse, MiddlewareFunction } from "./@types/express";
import Core from "./core";

interface ExpressApp  {
    (request: ExpressRequest, response: ExpressResponse): void;
    use: (...args: Array < string | MiddlewareFunction > ) => void;
    get: (url: string, ...args: Array < MiddlewareFunction > ) => void;
    listen: (port: number, callback: () => void) => void;
}

function startExpress(): ExpressApp {
    const core = new Core();
    const app: ExpressApp = function (request, response) {
        core.handleMainLogic(request, response);
    };

    app.use = function (...args) {
        if (typeof args[0] === "string") {
            core.registerRouter("*", [args[0], ...args.slice(1)]);
        } else {
            core.registerRouter("*", args);
        }
    };

    app.get = function (url, ...args) {
        core.registerRouter("GET", [url, ...args]);
    };

    app.listen = function (port, callback) {
        http.createServer(core.handleMainLogic).listen(port, callback);
    };

    return app;
}

// References: https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require
export = startExpress;