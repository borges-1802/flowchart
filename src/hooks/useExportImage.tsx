import { useState } from 'react';
import { capturarComoPng, baixarImagem } from '../utils/exportImage';

export function useExportImage() {
  const [isExporting, setIsExporting] = useState(false);

  async function exportarFluxograma(containerRef: React.RefObject<HTMLElement | null>, isDark: boolean) {
    if (!containerRef.current) return;
    setIsExporting(true);
    try {
      const backgroundColor = isDark ? '#0a0a0a' : '#fafafa';
      const png = await capturarComoPng(containerRef.current, backgroundColor);
      baixarImagem(png, 'fluxograma-bcc.png');
    } finally {
      setIsExporting(false);
    }
  }

  return { exportarFluxograma, isExporting };
}