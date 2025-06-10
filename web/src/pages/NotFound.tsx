import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="container">
      <h1>404 - Página Não Encontrada</h1>
      <p>A URL encurtada não existe ou o endereço está incorreto.</p>
      <Link to="/" className="button">
        Voltar para a Home
      </Link>
    </div>
  );
};

export default NotFound;