import serverRoutes from './routes';
import nesSubscriptions from './websocket';

const api = (server, next) => {
  server.on('request-error', (request, err) => {
    console.error(`Error response (500) sent for request: ${request.id} because: ${err.message}`);
    console.error(err);
  });

  server.ext('onPreResponse', (request, reply) => {
    const response = request.response;
    if (!response.isBoom) {
      return reply.continue();
    }

    if (response.data) {
      response.output.payload.data = response.data;
    }
    return reply(response);
  });

  server.on('response', (request) => {
    if (request.response) {
      console.log(`${request.method.toUpperCase()} ${request.url.path} --> ${request.response.statusCode}`);
    } else {
      console.error('request without response', request);
    }
  });

  serverRoutes(server);
  nesSubscriptions(server);

  server.connections.map(conn => console.log('API running at:', conn.info.uri));

  next();
};

exports.register = (plugin, options, next) => {
  plugin.dependency(['hapi-auth-jwt2', 'bell', 'nes'], api);
  next();
};

exports.register.attributes = {
  pkg: require('./package.json')
};
