import React from 'react';

export default function Footer() {
  return (
    <footer className="p-4 text-white text-center" style={{ background: '#1E1E1E' }}>
      <div className="container mx-auto">
        <p>&copy; {new Date().getFullYear()} GEOBRAP. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}