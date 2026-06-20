import React from 'react';

interface MainContentProps {
  children: React.ReactNode;
}

export default function MainContent({ children }: MainContentProps) {
  return (
    <main className="flex-1 bg-transparent text-gray-900 min-h-full overflow-auto p-0 m-0 w-full">
      {children}
    </main>
  );
}