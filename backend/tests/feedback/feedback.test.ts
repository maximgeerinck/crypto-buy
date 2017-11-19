import { createServer } from "../../src/server";

const feedbackSendRequest = {
    method: "POST",
    url: "/feedback",
    payload: {}
};


test("It should fail", () => {
    createServer(5001).then((server) => {
        return server.inject(feedbackSendRequest)
            .then((response) => {
                expect(response.statusCode).toEqual(400);
            })
    });    
})
