import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Layout from './layout';

import './App.scss';

const App: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    document.body.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [location]);

  return (
    <Layout>
      <div>Hello</div>
    </Layout>
  );
};

export default App;
