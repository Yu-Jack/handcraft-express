import http from "http";
import Core from "./core";
import {
    ExpressApp,
} from "@type/express";

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