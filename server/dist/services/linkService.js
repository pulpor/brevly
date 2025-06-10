"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportLinksToCsv = exports.deleteLink = exports.getAllLinks = exports.getLinkByCode = exports.createLink = void 0;
const fs_1 = require("fs");
const sync_1 = require("csv-stringify/sync");
const links = [];
const createLink = (link, code) => {
    if (!/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(link)) {
        throw new Error('URL inválida');
    }
    if (links.some((l) => l.code === code)) {
        throw new Error('Encurtamento já existe');
    }
    const newLink = { link, code, clicks: 0, createdAt: new Date().toISOString() };
    links.push(newLink);
    return newLink;
};
exports.createLink = createLink;
const getLinkByCode = (code) => {
    const link = links.find((l) => l.code === code);
    if (link) {
        link.clicks += 1;
    }
    return link;
};
exports.getLinkByCode = getLinkByCode;
const getAllLinks = () => {
    return links;
};
exports.getAllLinks = getAllLinks;
const deleteLink = (code) => {
    const index = links.findIndex((l) => l.code === code);
    if (index === -1) {
        return false;
    }
    links.splice(index, 1);
    return true;
};
exports.deleteLink = deleteLink;
const exportLinksToCsv = () => {
    const records = links.map((link) => ({
        'URL Original': link.link,
        'URL Encurtada': link.code,
        Cliques: link.clicks,
        'Data de Criação': link.createdAt,
    }));
    const csv = (0, sync_1.stringify)(records, { header: true });
    (0, fs_1.writeFileSync)('links_report.csv', csv);
    return `file://${process.cwd()}/links_report.csv`;
};
exports.exportLinksToCsv = exportLinksToCsv;
