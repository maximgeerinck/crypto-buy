import * as compression from "compression";
import * as express from "express";
import * as fs from "fs";
import * as path from "path";

// initialize the server and configure support for ejs templates
const app = express();
app.disable("x-powered-by");

app.get("*.js", (req, res, next) => {
    if (req.get("Accept-Encoding").indexOf("gzip") > -1 && process.env.NODE_ENV !== "development") {
        res.set("Content-Encoding", "gzip");
        res.set("Content-Type", "text/javascript");
        req.url = req.url.replace(".js", ".js.gz");
    }
    next();
});

// universal routing and rendering
// app.get("*.js", expressStaticGzip(__dirname + "/../static/static/js"));
// app.get("*.js", (req, res, next) => {
//     if (process.env.NODE_ENV !== "production") {
//         return next();
//     }

//     req.url = `${req.url.replace(".js", ".js.gz")}`;
//     // console.log(req.url);

//     res.set("Content-Encoding", "gzip");
//     res.set("Content-Type", "text/javascript");
//     next();

//     // const regex = /([^?]+).*/gi;
//     // const match = regex.exec(req.url);

//     // if (!match || match.length < 1) {
//     //     next();
//     // }

//     // only if file exists
//     // const file = match[1];
//     // if (!fs.existsSync(`${__dirname}/../public${file}.gz`)) {
//     //     return next();
//     // }
// });

app.use("/assets", express.static(__dirname + "/../static/static/media"));
app.use("/static", express.static(__dirname + "/../static/static"));

// // back cache fix...
// app.get("/static/js/main.*.js", (req, res) => {
//     console.log("old js file... redirecting...");
//     res.sendFile(path.join(__dirname, "../static/static/js/bundle.js"));
// });
// app.get("/static/css/main.*.css", (req, res) => {
//     console.log("old css file... redirecting...");
//     res.sendFile(path.join(__dirname, "../static/static/css/main.js"));
// });

// // define the folder that will be used for static assets
// // app.use(compression());
// app.use(express.static(path.join(__dirname, "../static")));

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
