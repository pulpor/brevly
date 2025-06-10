const links = [];

export const createLink = (originalUrl, shortUrl) => {
  if (links.some(link => link.shortUrl === shortUrl)) {
    throw new Error('Encurtamento já existe');
  }
  if (!/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(originalUrl)) {
    throw new Error('URL inválida');
  }
  const link = { originalUrl, shortUrl, clicks: 0, createdAt: new Date() };
  links.push(link);
  return link;
};

export const getLinkByShortUrl = (shortUrl) => {
  const link = links.find(link => link.shortUrl === shortUrl);
  if (link) {
    link.clicks += 1;
  }
  return link;
};

export const deleteLink = (shortUrl) => {
  const index = links.findIndex(link => link.shortUrl === shortUrl);
  if (index !== -1) {
    links.splice(index, 1);
  }
};

export const getAllLinks = () => links;

export const exportToCsv = () => {
  const headers = 'URL Original,URL Encurtada,Cliques,Data de Criação\n';
  const rows = links.map(link => 
    `${link.originalUrl},${link.shortUrl},${link.clicks},${link.createdAt.toISOString()}`
  ).join('\n');
  return headers + rows;
};