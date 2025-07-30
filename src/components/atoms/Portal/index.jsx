// components/Portal.jsx
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function Portal({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const portalRoot = document.getElementById('action-button');
  return portalRoot ? createPortal(children, portalRoot) : null;
}
