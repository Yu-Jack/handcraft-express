import http from "http";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Request extends http.IncomingMessage {

}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Response extends http.ServerResponse {

}

export interface MiddlewareFunction {
    (request: Request & ObjectKey, response: Response, next ? : () => void): void;
}


export interface Routers {
    order: number;
    method: HttpMethod;
    callbacks: Array < MiddlewareFunction > ;
}
export interface Middlewares {
    order: number;
    callbacks: Array < MiddlewareFunction > ;
}

export interface ExpressApp  {
    (request: Request, response: Response): void;
    use: (...args: Array < string | MiddlewareFunction > ) => void;
    get: (url: string, ...args: Array < MiddlewareFunction > ) => void;
    listen: (port: number, callback: () => void) => void;
}