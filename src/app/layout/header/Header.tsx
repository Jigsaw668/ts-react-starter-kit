import useWindowWidthResize from '../../hooks/useWindowWidthResize';

import './Header.scss';

const Header: React.FC = () => {
  const { windowWidth } = useWindowWidthResize();

  return (
    <>
      {windowWidth > 1024 && (
        <header className='header' id='header' />
      )}
      {windowWidth <= 1024 && (
        <header className='header-mobile' />
      )}
    </>
  );
};

export default Header;
