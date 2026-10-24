import { useEffect, useState } from 'react'

export function usePublicContentVersion() {
  const [version, setVersion] = useState(0)
  useEffect(() => {
    const changed = () => setVersion(value => value + 1)
    window.addEventListener('medelec-content-changed', changed)
    return () => window.removeEventListener('medelec-content-changed', changed)
  }, [])
  return version
}
