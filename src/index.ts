import fastify from 'fastify';
import type { StdQuery } from './types/query.js';
import untypedKeys from '../keys.json' assert { type: 'json' };
import type { Keys } from './types/keys.js';
import type { DDNResult, Result } from './types/results.js';
const keys = untypedKeys as Keys;

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
        const searchResults: DDNResult = {
            code: 200,
            results: [],
        };

        if (!request.query) searchResults.code = 400;
        const query = request.query as StdQuery;
        if (query.q.length === 0) searchResults.code = 400;
        if (Number.isNaN(query.p)) query.p = 0;

        if (searchResults.code === 400) {
            reply.send({
                code: 400,
                message: 'Invalid query data.',
            });
            return;
        }

        const url = encodeURI(
            'https://www.googleapis.com/customsearch/v1?' +
                new URLSearchParams({
                    key: keys.key,
                    cx: keys.cx,
                    q: query.q,
                    start: (query.p * 10).toString(),
                    fields: 'items',
                }),
        );

        // This is why the TS config contains DOM. See: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/60924
        await fetch(url, {
            headers: {
                'User-Agent': 'DDN-Backend (gzip compatible)',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.error(data.error);
                    reply.send({
                        code: 500,
                        message: `Upstream Error: GoogleApis returned code "${data.error.code}" with message: "${data.error.message}" Please open an issue at https://github.com/SomeAspy/DuckDuckNoBackend/issues/new`,
                    });
                    return;
                }
                data.items.forEach((item: Result) => {
                    searchResults.results.push({
                        kind: item.kind,
                        title: item.title,
                        htmlTitle: item.htmlTitle,
                        link: item.link,
                        displayLink: item.displayLink,
                        snippet: item.snippet,
                        htmlSnippet: item.formattedUrl,
                        formattedUrl: item.formattedUrl,
                        htmlFormattedUrl: item.htmlFormattedUrl,
                    });
                });
                reply.send({
                    code: 200,
                    data: searchResults.results,
                });
            });
    },
});

api.listen({ port: 4444 });