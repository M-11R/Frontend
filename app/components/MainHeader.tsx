"use client";

import Image from 'next/image';
import ico from '../img/logo.png';
import mb from '@/app/json/msBox.json';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const jinchek = (progress: number) => {
  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          color: "#4a4a4a",
          marginBottom: "15px",
          textAlign: "center",
        }}
      >
        {mb.header.jinchuk.value} {progress}%
      </div>
      <div
        style={{
          width: "100%",
          height: "25px",
          backgroundColor: "#f0f0f0",
          borderRadius: "15px",
          overflow: "hidden",
          boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: `linear-gradient(to right, ${
              progress >= 75 ? "#4caf50" : progress >= 50 ? "#ff9800" : "#f44336"
            }, #b3b3b3)`,
            transition: "width 0.4s ease",
            borderRadius: "15px",
          }}
        ></div>
      </div>
    </div>
  );
};


const MainHeader = ({ pid }: { pid: number }) => (
  <header
    style={{
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '91%',
      padding: '10px 0',
      borderBottom: '2px solid #ddd',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    }}
  >
    <Link href='/'>
      <Image
        src={ico}
        alt="Logo"
        style={{
          width: '100px',
          height: '80px',
          objectFit: 'contain',
          cursor: 'pointer',
          marginLeft: '20px',
        }}
      />
    </Link>
    <div style={{ width: '600px' }}>{jinchek(30)}</div>
  </header>
);

export default MainHeader;
