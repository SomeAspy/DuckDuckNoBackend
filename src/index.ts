import fastify from "fastify";
import type { StdQuery } from "./types/query.js";
import type { Keys } from "./types/keys.js";
import untypedKeys from "../config/keys.json" assert { "type": "json" };
const keys = untypedKeys as Keys;
import type { ApiResponse, DDNResult, Result } from "./types/results.js";

const api = fastify();

api.route({
    method: "GET",
    url: "/search",
    schema: {
        querystring: {
            q: { type: "string" },
            p: { type: "integer" },
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
            await reply.send({
                code: 400,
                message: "Invalid query data.",
            });
            return;
        }
        console.log(query.q);
        const url = encodeURI(
            "https://www.googleapis.com/customsearch/v1?" +
                new URLSearchParams({
                    key: keys.key,
                    cx: keys.cx,
                    q: query.q.toString(),
                    start: (query.p * 10).toString(),
                    fields: "items",
                }).toString(),
        );

        await fetch(url, {
            headers: {
                "User-Agent": "DDN-Backend (gzip compatible)",
            },
        })
            .then((response) => response.json() as unknown as ApiResponse)
            .then(async (data) => {
                if (data.error) {
                    console.error(data.error);
                    await reply.send({
                        code: 500,
                        message: `Upstream Error: GoogleApis returned code "${data.error.code.toString()}" with message: "${data.error.message}" Please open an issue at https://github.com/SomeAspy/DuckDuckNoBackend/issues/new`,
                    });
                    return;
                }
                data.items.forEach((item: Result): void => {
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
                await reply.send({
                    code: 200,
                    results: searchResults.results,
                });
            });
    },
});

await api.listen({ port: 4444 });
