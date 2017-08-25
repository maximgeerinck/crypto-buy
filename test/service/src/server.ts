import * as express from "express";
import * as path from "path";

// initialize the server and configure support for ejs templates
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// define the folder that will be used for static assets
app.use(express.static(path.join(__dirname, "../static")));

// universal routing and rendering
app.get("*.js", (req, res, next) => {
    req.url = `${req.url}.gz`;
    res.set("Content-Encoding", "gzip");
    next();
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../static/index.html"));
});

// start the server
const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || "production";

app.listen(port, (err: any) => {
    if (err) {
        return console.error(err);
    }
    console.info(`Server running on http://localhost:${port} [${env}]`);
});
