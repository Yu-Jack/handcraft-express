import { HttpMethod, ObjectKey } from "./@types/common";
import { ExpressRequest, ExpressResponse, MiddlewareFunction, Middlewares } from "./@types/express";
export default class Core {
    router: Map<string, Array < ObjectKey >>;
    middlewares: Array < Middlewares > ;
    routerOrder = 0;

    constructor () {
        this.middlewares = [];
        this.router = new Map();
    }

    triggerCallback(callbacks: Array<MiddlewareFunction>, request: ExpressRequest, response: ExpressResponse): void {
        for (let i = 0; i < callbacks.length;) {
            const callback = callbacks[i];
            
            callback(request, response, function () {
                if (!response.writableEnded) {
                    i++;
                }
            });
            
            if (response.writableEnded) {
                return;
            }
        }
    }

    handleMainLogic(request: ExpressRequest, response: ExpressResponse): void {
        let maxLimitOrder = null;
        let foundUrl = false;

        if (this.router.has(request.url)) {
            foundUrl = true;
            maxLimitOrder = this.router.get(request.url)[0].order;
        }

        for (const middleware of this.middlewares) {
            let runAble = false;
            if (!maxLimitOrder) {
                runAble = true;
            }
            if (maxLimitOrder && middleware.order < maxLimitOrder) {
                runAble = true;
            }
            if (runAble) {
                const callbacks = middleware.callbacks;
                this.triggerCallback(callbacks, request, response);
            }
        }

        if (foundUrl) {
            this.router.get(request.url).filter((callback) => {
                return callback.method === request.method || callback.method === "*";
            }).map((callback) => {
                this.triggerCallback(callback.callbacks, request, response);
            });
        }

        const targetUrl = request.url;
        const method = request.method;
        response.writeHead(404,  { "Content-Type": "text/plain" });
        response.end(`${method} ${targetUrl} not found`);
    }

    registerRouter(method: HttpMethod, parameters: Array < string | MiddlewareFunction > ): void {
        this.routerOrder += 1;
        let url = null;
        const callbacks: Array < MiddlewareFunction > = [];

        for (const parameter of parameters) {
            if (typeof parameter === "string") {
                url = parameter;
            }
            if (typeof parameter === "function") {
                callbacks.push(parameter);
            }
        }

        if (!url) {
            this.middlewares.push({
                order: this.routerOrder,
                callbacks
            });
            return;
        }
        
        if (!this.router.has(url)) {
            this.router.set(url, []);
        }

        const arr = this.router.get(url);
        arr.push({
            order: this.routerOrder,
            method,
            callbacks,
        });
        this.router.set(url, arr);
    }
}