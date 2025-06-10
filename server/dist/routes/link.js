"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const linkService_1 = require("../services/linkService");
const router = express_1.default.Router();
router.get('/link/:code', async (req, res) => {
    try {
        const link = (0, linkService_1.getLinkByCode)(req.params.code);
        if (!link) {
            return res.status(404).json({ error: 'Link não encontrado' });
        }
        res.json({ link: link.link });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/link', async (_req, res) => {
    try {
        const links = (0, linkService_1.getAllLinks)();
        res.json(links);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.post('/link', async (req, res) => {
    try {
        const { link, code } = req.body;
        const newLink = (0, linkService_1.createLink)(link, code);
        res.status(201).json(newLink);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.delete('/link', async (req, res) => {
    try {
        const { code } = req.body;
        const success = (0, linkService_1.deleteLink)(code);
        res.json(success);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.get('/link/export', async (_req, res) => {
    try {
        const url = (0, linkService_1.exportLinksToCsv)();
        res.json({ url });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
