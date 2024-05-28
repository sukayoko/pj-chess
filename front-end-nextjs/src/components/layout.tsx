import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer'
import { HeaderMenu } from './HeaderMenu/HeaderMenu';

type Props = { children: ReactNode };

const Layout = ({ children }: Props) => {
    
    return (
        <div>
          <HeaderMenu />
          <main>{children}</main>
          <Footer />
        </div>
      );
};

export default Layout;