import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { http } from '../api/http';
import Loading from '../components/Loading';

const Redirect: React.FC = () => {
  const { shortUrl } = useParams<{ shortUrl: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const redirectToOriginal = async () => {
      if (!shortUrl) {
        navigate('/not-found');
        return;
      }
      try {
        const originalUrl = await http.originalLink.get(shortUrl);
        window.location.href = originalUrl;
      } catch (error) {
        console.error(error);
        navigate('/not-found');
      } finally {
        setLoading(false);
      }
    };
    redirectToOriginal();
  }, [shortUrl, navigate]);

  return loading ? <Loading /> : null;
};

export default Redirect;