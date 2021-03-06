import superagent from "superagent";
import superagentJsonapify from "superagent-jsonapify";
import { BASE_PATH } from "./constants";

superagentJsonapify(superagent);

export const buildPostRequest = path => {
    return new PostRequest(path);
};

export const buildGetRequest = path => {
    return new GetRequest(path);
};

class Request {
    constructor(path, token) {
        this.path = BASE_PATH + path;
        this.token = token;
        this.settings = {
            response: 10000,
            deadline: 60000,
        };
        this.retries = 0;
    }

    auth(token) {
        this.request.set("Authorization", token);
        return this;
    }

    onTimeout(func, timeout = 1000) {
        this._onTimeout = func;
        this.settings.response = timeout;
        return this;
    }

    retry() {
        this.retries++;
        if (this.retries < 5) {
            this.send();
        } else {
            this._onTimeout();
        }
    }
}

class GetRequest extends Request {
    constructor(path) {
        super(path);
        this.request = superagent.get(this.path).timeout(this.settings);
    }

    createRequest() {
        this.request = superagent.get(this.path).timeout(this.settings);
        if (this.token) this.request = this.request.set("Authorization", this.token);
        return this.request;
    }

    send() {
        return new Promise((resolve, reject) => {
            this.request.end((err, res) => {
                if (err) {
                    if (err.timeout) {
                        return this.retry();
                    }
                    return reject(err);
                }
                if (!res.body) return reject(res);
                return resolve(res.body);
            });
        });
    }
}

class PostRequest extends Request {
    constructor(path) {
        super(path);
        this.request = superagent.post(this.path).timeout(this.settings);
    }

    createRequest() {
        if (this.request) {
            return this.request;
        }
        this.request = superagent.post(this.path).timeout(this.settings);
        if (this.token) this.request = this.request.set("Authorization", this.token);
        return this.request;
    }

    send(data) {
        return new Promise((resolve, reject) => {
            this.request.send(data).end((err, res) => {
                // check if validation error
                if (
                    res.body &&
                    res.body.error &&
                    (res.body.error === "E_VALIDATION" || res.body.validation !== undefined)
                ) {
                    return reject(res.body.validation);
                }

                // check general error
                if (err) {
                    return reject(err);
                }

                if (!res.body) return reject(res);
                return resolve(res.body);
            });
        });
    }
}

export default {
    get: (path, token) =>
        new Promise((resolve, reject) => {
            let request = superagent.get(BASE_PATH + path).timeout({
                response: 5000,
                deadline: 60000,
            });
            if (token) request = request.set("Authorization", token);
            request.end((err, res) => {
                if (err) return reject(err);
                if (!res.body) return reject(res);
                resolve(res.body);
            });
        }),
    post: (path, data, token) =>
        new Promise((resolve, reject) => {
            let request = superagent
                .post(BASE_PATH + path)
                .send(data)
                .timeout({
                    response: 5000,
                    deadline: 60000,
                });
            if (token) request = request.set("Authorization", token);
            request.end((err, res) => {
                if (err && res && res.body) return reject(res.body);
                if (err) return reject(err);
                if (!res.body) return reject(res);
                return resolve(res.body);
            });
        }),
    delete: (path, token) =>
        new Promise((resolve, reject) => {
            let request = superagent.delete(BASE_PATH + path).timeout({
                response: 1000,
                deadline: 60000,
            });
            if (token) request = request.set("Authorization", token);
            request.end((err, res) => {
                if (err) return reject(err);
                if (!res.body) return reject(res);
                resolve(res.body);
            });
        }),
    superagent: superagent,
};
