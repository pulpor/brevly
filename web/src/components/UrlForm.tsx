import React, { useState } from 'react';
import { http } from '../api/http';
import type { Link } from '../types/link';

interface UrlFormProps {
  setLinks: React.Dispatch<React.SetStateAction<Link[]>>;
}

const UrlForm: React.FC<UrlFormProps> = ({ setLinks }) => {
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [shortUrl, setShortUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const link = await http.shortLink.create({
        link: originalUrl,
        code: shortUrl || `brev${Math.random().toString(36).substring(2, 8)}`,
      });
      setLinks((prev) => [...prev, link]);
      setOriginalUrl('');
      setShortUrl('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro ao criar o link');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="url-form">
      <input
        type="url"
        value={originalUrl}
        onChange={(e) => setOriginalUrl(e.target.value)}
        placeholder="Digite a URL original"
        required
        disabled={loading}
      />
      <input
        type="text"
        value={shortUrl}
        onChange={(e) => setShortUrl(e.target.value)}
        placeholder="Encurtamento personalizado (opcional)"
        disabled={loading}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Encurtando...' : 'Encurtar'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
};

export default UrlForm;