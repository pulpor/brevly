import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { createLink, getLinkByCode, getAllLinks, deleteLink, exportLinksToCsv } from '../services/linkService';

interface LinkData {
  Body: { link: string; code: string };
}

interface DeleteParams {
  Body: { code: string };
}

interface CodeParams {
  Params: { code: string };
}

export async function registerLink(fastify: FastifyInstance) {
  fastify.get('/', async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      const links = await getAllLinks();
      return reply.status(200).send(links);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  fastify.get('/:code', async (request: FastifyRequest<CodeParams>, reply: FastifyReply) => {
    try {
      const { code } = request.params;
      const link = await getLinkByCode(code);
      if (!link) {
        return reply.status(404).send({ error: 'Link não encontrado' });
      }
      return reply.status(200).send({ link: link.original_url });
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  });

  fastify.post('/', async (request: FastifyRequest<LinkData>, reply: FastifyReply) => {
    try {
      const { link, code } = request.body;
      const newLink = await createLink(link, code);
      return reply.status(201).send(newLink);
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  });

  fastify.delete('/', async (request: FastifyRequest<DeleteParams>, reply: FastifyReply) => {
    try {
      const { code } = request.body;
      const success = await deleteLink(code);
      return reply.status(200).send(success);
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  });

  fastify.get('/export', async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      const url = await exportLinksToCsv();
      return reply.status(200).send({ url });
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });
}