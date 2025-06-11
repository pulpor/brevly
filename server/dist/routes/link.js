"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerLink = registerLink;
const linkService_1 = require("../services/linkService");
async function registerLink(fastify) {
    fastify.get('/', async (_request, reply) => {
        try {
            const links = await (0, linkService_1.getAllLinks)();
            return reply.status(200).send(links);
        }
        catch (error) {
            return reply.status(500).send({ error: error.message });
        }
    });
    fastify.get('/:code', async (request, reply) => {
        try {
            const { code } = request.params;
            const link = await (0, linkService_1.getLinkByCode)(code);
            if (!link) {
                return reply.status(404).send({ error: 'Link não encontrado' });
            }
            return reply.status(200).send({ link: link.original_url });
        }
        catch (error) {
            return reply.status(400).send({ error: error.message });
        }
    });
    fastify.post('/', async (request, reply) => {
        try {
            const { link, code } = request.body;
            const newLink = await (0, linkService_1.createLink)(link, code);
            return reply.status(201).send(newLink);
        }
        catch (error) {
            return reply.status(400).send({ error: error.message });
        }
    });
    fastify.delete('/', async (request, reply) => {
        try {
            const { code } = request.body;
            const success = await (0, linkService_1.deleteLink)(code);
            return reply.status(200).send(success);
        }
        catch (error) {
            return reply.status(400).send({ error: error.message });
        }
    });
    fastify.get('/export', async (_request, reply) => {
        try {
            const url = await (0, linkService_1.exportLinksToCsv)();
            return reply.status(200).send({ url });
        }
        catch (error) {
            return reply.status(500).send({ error: error.message });
        }
    });
}
