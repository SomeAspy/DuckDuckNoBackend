// Copyright (c) 2022 Aiden Baker
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
'use strict';

import dotenv from 'dotenv';
import Fastify from 'fastify';
const app = Fastify();

dotenv.config();

app.get('/:search', async (req) => {
    const results = [];
    let code;
    const query = req.params.search;
    if (!query) {
        return {
            code: 400,
            message: 'No search query provided',
        };
    }
    await fetch(
        `https://customsearch.googleapis.com/customsearch/v1?gl=us&hl=en&q=${query}&key=${process.env.GOOGLE_API_KEY}&cx=d96ce355f233aa872`,
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

app.listen(4444, '127.0.0.1')
    .then((address) => console.log(`Server listening on ${address}`))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
