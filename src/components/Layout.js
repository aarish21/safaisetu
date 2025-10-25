// src/components/Layout.js
import Footer from './Footer';
import Navbar from './Navbar';

function Layout({ children }) {
  return (
    <div className="layout-container">
      <Navbar />
      <main className="layout-content">{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;
