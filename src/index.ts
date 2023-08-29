import fastify from 'fastify';
import type { StdQuery } from './types/query.js';

const api = fastify();

api.route({
    method: 'GET',
    url: '/search',
    schema: {
        querystring: {
            q: { type: 'string' },
            p: { type: 'integer' },
        },
    },
    handler: async (request, reply) => {
        if (
            request.query &&
            Object.keys(request.query).length === 2 &&
            Object.keys(request.query).includes('f') &&
            Object.keys(request.query).includes('q')
            // TODO: Make this not shit, this is genuinely awful see: https://fastify.dev/docs/latest/Reference/TypeScript/#json-schema
        ) {
            const query = request.query as StdQuery;
            console.log(query);
            console.log(Object.keys(query));
        } else {
            reply.send({
                code: 400,
                message: 'Invalid query data.',
            });
        }
    },
});

api.listen({ port: 4444 });
