// src/components/ExportButton.tsx
import { useEffect, useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { useExportImage } from '../hooks/useExportImage';

type Props = {
  landscapeRef: React.RefObject<HTMLElement | null>;
  portraitRef: React.RefObject<HTMLElement | null>;
  isDark: boolean;
};

// abaixo de 640px = mesmo ponto de corte do 'sm:' do Tailwind
const MOBILE_MEDIA_QUERY = '(max-width: 639px)';

export function ExportButton({ landscapeRef, portraitRef, isDark }: Props) {
  const { exportarFluxograma, isExporting } = useExportImage();
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(MOBILE_MEDIA_QUERY).matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
    function handleChange(event: MediaQueryListEvent) {
      setIsMobile(event.matches);
    }
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  function handleClick() {
    const ref = isMobile ? portraitRef : landscapeRef;
    exportarFluxograma(ref, isDark);
  }

  const hoverClass = isDark ? 'hover:bg-white/10' : 'hover:bg-black/5';

  return (
    <button
      type="button"
      aria-label="Exportar fluxograma como imagem"
      onClick={handleClick}
      disabled={isExporting}
      className={`flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-current disabled:opacity-50 ${hoverClass}`}
    >
      {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
      {isExporting ? 'Gerando...' : 'Print do Flowchart'}
    </button>
  );
}
