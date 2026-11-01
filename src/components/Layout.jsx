import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Toast } from './Toast';

export const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">{children}</main>
      <Toast />
      <Footer />
    </div>
  );
};
