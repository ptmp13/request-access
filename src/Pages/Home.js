import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [items, setSpaces] = useState([]);

  useEffect(() => {
    fetchSpaces();
  }, []);

  function fetchSpaces() {
    setSpaces('ololol')
    return (
      items
    )
  }
}
