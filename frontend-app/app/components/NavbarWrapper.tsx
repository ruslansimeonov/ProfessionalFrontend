"use client";

import dynamic from 'next/dynamic';
import React from 'react';

const NavbarPlaceholder = () => (
  <header
    style={{
      height: "64px",
      width: "100%",
      backgroundColor: "#1976d2",
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 2,
    }}
  />
);

const DynamicNavbar = dynamic(
  () => import('./Navbar'),
  {
    ssr: false,
    loading: () => <NavbarPlaceholder />
  }
);

export default DynamicNavbar;