import superagent from "superagent";
import superagentJsonapify from "superagent-jsonapify";
import { BASE_PATH } from "./constants";

superagentJsonapify(superagent);

export default {
    get: (path, token) =>
        new Promise((resolve, reject) => {
            let request = superagent.get(BASE_PATH + path);
            if (token) request = request.set("Authorization", token);
            request.end((err, res) => {
                if (err) reject(res.body);
                resolve(res.body);
            });
        }),
    post: (path, data, token) =>
        new Promise((resolve, reject) => {
            let request = superagent.post(BASE_PATH + path).send(data);
            if (token) request = request.set("Authorization", token);
            request.end((err, res) => {
                if (err) return reject((err, res));
                return resolve(res.body);
            });
        }),
    delete: (path, token) =>
        new Promise((resolve, reject) => {
            let request = superagent.delete(BASE_PATH + path);
            if (token) request = request.set("Authorization", token);
            request.end((err, res) => {
                if (err) reject(res.body);
                resolve(res.body);
            });
        }),
    superagent: superagent
};
