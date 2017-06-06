import routes from './routes';
import config from './config';

import * as Hapi from 'hapi';
import * as Path from 'path';
import * as Boom from 'boom';

const server = new Hapi.Server({
    connections:  {
        routes: {
            files: {
                relativeTo: Path.join(__dirname, '../../public')
            },
            cors: {
                origin: config.server.cors_client_origins,
                headers: config.server.cors_headers,
                credentials: config.server.cors_credentials,
                additionalHeaders: [
                    "Origin"
                ]
            },
            state: {
                parse: false,
                failAction: 'log'
            }
        }
    }
});


export let createServer = (port: number, host: string = '0.0.0.0'):Promise<Hapi.Server> => {

    return new Promise(resolve => {

        const connectionConfig:Hapi.ServerConnectionOptions = {
            port: port, 
            host: host
        }
        server.connection(connectionConfig);

       

        // inert is file server
        server.register([], (err) => {

            // load routes
            console.log("registered routes");    
            routes.map(route => console.log(`${route.method}: ${route.path}`))    
            server.route(routes);

            return resolve(server);  
        });
    })
};