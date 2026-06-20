import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function useMinimizeMaximize() {
  const [isMinimized, setIsMinimized] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/') {
      setIsMinimized(false);
      localStorage.setItem('sidebarMinimized', 'false');
    } else {
      setIsMinimized(true);
      localStorage.setItem('sidebarMinimized', 'true');
    }
  }, [pathname]);

  const toggleSidebar = () => {
    const newState = !isMinimized;
    setIsMinimized(newState);
    localStorage.setItem('sidebarMinimized', newState.toString());
  };

  const minimizeSidebar = () => {
    setIsMinimized(true);
    localStorage.setItem('sidebarMinimized', 'true');
  };

  const expandSidebar = () => {
    setIsMinimized(false);
    localStorage.setItem('sidebarMinimized', 'false');
  };

  return {
    isMinimized,
    toggleSidebar,
    minimizeSidebar,
    expandSidebar
  };
}
