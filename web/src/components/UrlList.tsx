import React from 'react';
import { http } from '../api/http';
import type { Link } from '../types/link';

interface UrlListProps {
  links: Link[];
  setLinks: React.Dispatch<React.SetStateAction<Link[]>>;
}

const UrlList: React.FC<UrlListProps> = ({ links, setLinks }) => {
  const handleDelete = async (code: string) => {
    try {
      const success = await http.shortLink.delete(code);
      if (success) {
        setLinks(links.filter((link) => link.code !== code));
      }
    } catch (error) {
      console.error('Erro ao deletar link:', error);
    }
  };

  return (
    <div className="url-list">
      {links.map((link) => (
        <div key={link.code} className="url-item">
          <a href={link.link} target="_blank" rel="noopener noreferrer">
            {link.link}
          </a>
          <p>
            Encurtada: <a href={`/${link.code}`}>{link.code}</a>
          </p>
          <p>Cliques: {link.clicks ?? 0}</p>
          <p>Criada em: {new Date(link.createdAt ?? '').toLocaleString()}</p>
          <button onClick={() => handleDelete(link.code)}>Deletar</button>
        </div>
      ))}
    </div>
  );
};

export default UrlList;