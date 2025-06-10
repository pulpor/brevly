import { Link } from '../types/link';
import { writeFileSync } from 'fs';
import { stringify } from 'csv-stringify/sync';

const links: Link[] = [];

export const createLink = (link: string, code: string): Link => {
  if (!/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(link)) {
    throw new Error('URL inválida');
  }
  if (links.some((l) => l.code === code)) {
    throw new Error('Encurtamento já existe');
  }
  const newLink: Link = { link, code, clicks: 0, createdAt: new Date().toISOString() };
  links.push(newLink);
  return newLink;
};

export const getLinkByCode = (code: string): Link | undefined => {
  const link = links.find((l) => l.code === code);
  if (link) {
    link.clicks += 1;
  }
  return link;
};

export const getAllLinks = (): Link[] => {
  return links;
};

export const deleteLink = (code: string): boolean => {
  const index = links.findIndex((l) => l.code === code);
  if (index === -1) {
    return false;
  }
  links.splice(index, 1);
  return true;
};

export const exportLinksToCsv = (): string => {
  const records = links.map((link) => ({
    'URL Original': link.link,
    'URL Encurtada': link.code,
    Cliques: link.clicks,
    'Data de Criação': link.createdAt,
  }));
  const csv = stringify(records, { header: true });
  writeFileSync('links_report.csv', csv);
  return `file://${process.cwd()}/links_report.csv`;
};