let defaultEnv = 'dev';
var allowed = ['dev', 'stag', 'prod', 'test'];
var processArg = process.argv[2];
var nodeEnv = process.env.NODE_ENV;

if (allowed.indexOf(processArg) === -1) {
  processArg = undefined;
}

if (allowed.indexOf(nodeEnv) === -1) {
  nodeEnv = undefined;
}

export interface IDatabaseConnectionConfiguration {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}
export interface IDatabaseConfiguration {
  connection: IDatabaseConnectionConfiguration;
  client: string;
}

export interface IRedisConfiguration {
  password: string;
}

export interface IServerConfiguration {
  ip: string;
  port: number;
  cors_client_origins: Array<string>;
  cors_headers: Array<string>;
  cors_credentials: boolean;
}

export interface ILanguageConfiguration {
  fallback: string;
}

export interface IAssetsConfiguration {
  public_dir: string;
}

export interface IJwtConfiguration {
  secret: string;
}
export interface IAuthenticationConfiguration {
  jwt: IJwtConfiguration;
}
export interface IMailConfiguration {
  host: string;
  port: number;
  username: string;
  password: string;
}

export interface IConfig {
  database: IDatabaseConfiguration;
  authentication: IAuthenticationConfiguration;
  redis: IRedisConfiguration;
  server: IServerConfiguration;
  languages: ILanguageConfiguration;
  assets: IAssetsConfiguration;
  mail: IMailConfiguration;
}

// Set environment
let config: IConfig = <IConfig>require('../../config/app_' + (processArg || nodeEnv || defaultEnv));
export default config;
