import React, { useState, useEffect } from 'react';
import UrlForm from '../components/UrlForm';
import UrlList from '../components/UrlList';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { http } from '../api/http';
import type { Link } from '../types/link';

const Home: React.FC = () => {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await http.shortLink.fetch();
        setLinks(response);
      } catch (error) {
        console.error('Erro ao buscar links:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLinks();
  }, []);

  const handleCsvDownload = async () => {
    try {
      const { url } = await http.shortLink.export();
      const a = document.createElement('a');
      a.href = url;
      a.download = 'links_report.csv';
      a.click();
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
    }
  };

  return (
    <div className="container">
      <h1>Brev.ly</h1>
      <UrlForm setLinks={setLinks} />
      {(() => {
        if (loading) {
          return <Loading />;
        } else if (links.length === 0) {
          return <EmptyState message="Nenhum link cadastrado ainda." />;
        } else {
          return (
            <>
              <button className="csv-button" onClick={handleCsvDownload}>
                Baixar Relatório CSV
              </button>
              <UrlList links={links} setLinks={setLinks} />
            </>
          );
        }
      })()}
    </div>
  );
};

export default Home;