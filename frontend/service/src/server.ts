import * as express from "express";
import * as path from "path";

// initialize the server and configure support for ejs templates
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// define the folder that will be used for static assets
app.use(express.static(path.join(__dirname, "../static")));

// universal routing and rendering
// app.get("*.js", (req, res, next) => {
//     console.log("got request, sending gz");
//     req.url = `${req.url}.gz`;
//     res.set("Content-Encoding", "gzip");
//     res.set("Content-Type", "text/javascript");
//     next();
// });

// back cache fix...
app.get("/static/js/main.*.js", (req, res) => {
    console.log("old js file... redirecting...");
    res.sendFile(path.join(__dirname, "../static/static/js/bundle.js"));
});
app.get("/static/css/main.*.css", (req, res) => {
    console.log("old css file... redirecting...");
    res.sendFile(path.join(__dirname, "../static/static/css/main.js"));
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../static/index.html"));
});

// start the server
class Server {
    public static start(port: number = 3000, env: string = "production") {
        app.listen(port, (err: any) => {
            if (err) {
                return console.error(err);
            }
            console.info(`Server running on http://localhost:${port} [${env}]`);
        });
    }
}

export default Server;
