import Header from './header';
import Footer from './footer';

import './Layout.scss';

const Layout: React.FC = props => {
  const { children } = props;

  return (
    <>
      <Header />
      <div className='layout'>
        <div className='layout-wrapper'>
          {children}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Layout;
