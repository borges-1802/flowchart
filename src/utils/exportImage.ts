// src/utils/exportImage.ts
import { toPng } from 'html-to-image';

function expandOverflowDescendants(root: HTMLElement): () => void {
  const restores: Array<() => void> = [];
  const elements = [root, ...Array.from(root.querySelectorAll<HTMLElement>('*'))];

  elements.forEach((element) => {
    const computed = window.getComputedStyle(element);
    if (computed.overflowX === 'auto' || computed.overflowX === 'scroll') {
      const prevOverflow = element.style.overflow;
      const prevWidth = element.style.width;
      const fullWidth = element.scrollWidth;

      element.style.overflow = 'visible';
      element.style.width = `${fullWidth}px`;

      restores.push(() => {
        element.style.overflow = prevOverflow;
        element.style.width = prevWidth;
      });
    }
  });

  return () => restores.forEach((restore) => restore());
}

export async function capturarComoPng(el: HTMLElement, backgroundColor: string): Promise<string> {
  const restore = expandOverflowDescendants(el);

  try {
    const width = el.scrollWidth;
    const height = el.scrollHeight;

    return await toPng(el, {
      backgroundColor,
      pixelRatio: 2,
      width,
      height,
      style: { width: `${width}px`, height: `${height}px`, overflow: 'visible' },
    });
  } finally {
    restore();
  }
}

export function baixarImagem(dataUrl: string, nomeArquivo: string) {
  const link = document.createElement('a');
  link.download = nomeArquivo;
  link.href = dataUrl;
  link.click();
}
