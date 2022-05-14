// Copyright (c) 2022 Aiden Baker
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
'use strict';

import dotenv from 'dotenv';
import Fastify from 'fastify';
const app = Fastify();

dotenv.config();

app.get('/:search/:page', async (req) => {
    //jank way to do this, but I don't want to figure out how querystring works
    const results = [];
    let code;
    const query = req.params.search;
    if (!query) {
        return {
            code: 400,
            message: 'No search query provided',
        };
    }
    const page = parseInt(req.params.page) * 10;
    await fetch(
        `https://customsearch.googleapis.com/customsearch/v1?gl=us&hl=en&q=${query}&key=${process.env.GOOGLE_API_KEY}&cx=d96ce355f233aa872&start=${page}`,
    )
        .then((response) => response.json())
        .then((data) => {
            data.items.forEach((item) => {
                results.push({
                    title: item.title,
                    link: item.link,
                    snippet: item.snippet,
                });
            });
            code = data.code;
        });
    return {
        code: code,
        results,
    };
});

app.listen(3000, '127.0.0.1')
    .then((address) => console.log(`Server listening on ${address}`))
    .catch((err) => {
        console.error(err);
    });
