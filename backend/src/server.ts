import routes from './routes';
import config from './config';

import * as Hapi from 'hapi';
import * as Path from 'path';
import * as Boom from 'boom';
import { IUser, User } from './models/user';
import UserService from './services/UserService';
import JoiValidationErrorAdapter from './utils/JoiValidation';

const JWT_SECRET = config.authentication.jwt.secret;

const server = new Hapi.Server({
  connections: {
    routes: {
      files: {
        relativeTo: Path.join(__dirname, '../../public')
      },
      cors: {
        origin: config.server.cors_client_origins,
        headers: config.server.cors_headers,
        credentials: config.server.cors_credentials,
        additionalHeaders: ['Origin']
      },
      state: {
        parse: false,
        failAction: 'log'
      },
      validate: {
        failAction: function(request: any, reply: any, source: any, error: any) {
          let adapter = new JoiValidationErrorAdapter(error.data.details);

          // var formattedErrors = FormatErrors(error);
          var error: any = Boom.badRequest();
          error.reformat();
          error.output.payload.error = 'E_VALIDATION';
          error.output.payload.validation = adapter.convert();

          return reply(error);
        },
        options: {
          abortEarly: false // lets JOI go over all errors
        }
      }
    }
  }
});

interface decodedUser {
  iat: Number;
  user: IUser;
}
const validate = (decoded: decodedUser, request: any, callback: any) => {
  // here we can check if its a valid token
  // decoded.user = User.parseDomain(decoded.user);
  UserService.findOneById(decoded.user._id).then(user => {
    return callback(null, true, user);
  });
};

export let createServer = (port: number, host: string = '0.0.0.0'): Promise<Hapi.Server> => {
  return new Promise(resolve => {
    const connectionConfig: Hapi.ServerConnectionOptions = {
      port: port,
      host: host,
      routes: {
        state: {
          parse: true,
          failAction: 'log'
        },
        validate: {
          failAction: function(request: any, reply: any, source: any, error: any) {
            let adapter = new JoiValidationErrorAdapter(error.data.details);

            // var formattedErrors = FormatErrors(error);
            var error: any = Boom.badRequest();
            error.reformat();
            error.output.payload.error = 'E_VALIDATION';
            error.output.payload.validation = adapter.convert();

            return reply(error);
          },
          options: {
            abortEarly: false // lets JOI go over all errors
          }
        }
      }
    };
    server.connection(connectionConfig);

    // inert is file server
    server.register([require('hapi-auth-jwt2')], err => {
      // load routes
      console.log('registered routes');
      routes.map(route => console.log(`${route.method}: ${route.path}`));
      server.route(routes);

      // load auth strategy (true => auth on all routes!)
      // ex. header: Authorization eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....
      server.auth.strategy('jwt', 'jwt', true, {
        key: JWT_SECRET,
        validateFunc: validate,
        verifyOptions: { algorithms: ['HS256'] }
      });

      return resolve(server);
    });
  });
};
