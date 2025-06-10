import express, { Request, Response } from 'express';
import { createLink, getLinkByCode, getAllLinks, deleteLink, exportLinksToCsv } from '../services/linkService';

const router = express.Router();

router.get('/link/:code', async (req: Request, res: Response) => {
  try {
    const link = getLinkByCode(req.params.code);
    if (!link) {
      return res.status(404).json({ error: 'Link não encontrado' });
    }
    res.json({ link: link.link });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/link', async (_req: Request, res: Response) => {
  try {
    const links = getAllLinks();
    res.json(links);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/link', async (req: Request, res: Response) => {
  try {
    const { link, code } = req.body as { link: string; code: string };
    const newLink = createLink(link, code);
    res.status(201).json(newLink);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/link', async (req: Request, res: Response) => {
  try {
    const { code } = req.body as { code: string };
    const success = deleteLink(code);
    res.json(success);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/link/export', async (_req: Request, res: Response) => {
  try {
    const url = exportLinksToCsv();
    res.json({ url });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;