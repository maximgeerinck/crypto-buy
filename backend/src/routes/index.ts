import * as Hapi from "hapi";
import * as path from "path";
import * as fs from "fs";

let routes: Hapi.RouteConfiguration[] = [];

fs.readdirSync(__dirname).forEach((file) => {
    // If its the current file ignore it
    if (file === "index.js" || file.endsWith(".ts")) {
        return;
    }

    // Prepare empty object to store module
    var mod = {};

    // Store module with its name (from filename) and validate
    let routeConfig: Hapi.RouteConfiguration[] = require(path.join(__dirname, file));
    let validatedRouteConfig: Hapi.RouteConfiguration[] = [];

    for (const key in routeConfig) {
        if (!routeConfig[key].method || !routeConfig[key].path || !routeConfig[key].handler) return;
        validatedRouteConfig.push(routeConfig[key]);
    }

    routes = routes.concat(validatedRouteConfig);
});

export default routes;
