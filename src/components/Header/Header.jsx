import '@/components/Header/Header.scss';

import Logo from '@/components/Logo';

const Header = () => {
  return (
    <div className="header">
      <div className="header__logo-wrapper">
        <Logo />
      </div>
    </div>
  );
};

export default Header;
