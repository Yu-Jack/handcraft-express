import http from "http";
import { HttpMethod, ObjectKey } from "./common";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ExpressRequest extends http.IncomingMessage {

}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ExpressResponse extends http.ServerResponse {

}

export interface MiddlewareFunction {
    (request: ExpressRequest & ObjectKey, response: ExpressResponse, next ? : () => void): void;
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
    (request: ExpressRequest, response: ExpressResponse): void;
    use: (...args: Array < string | MiddlewareFunction > ) => void;
    get: (url: string, ...args: Array < MiddlewareFunction > ) => void;
    listen: (port: number, callback: () => void) => void;
}