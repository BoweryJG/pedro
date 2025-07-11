import { visualizer } from 'rollup-plugin-visualizer';
import type { Plugin } from 'vite';

export function bundleAnalyzer(): Plugin | undefined {
  if (process.env.ANALYZE === 'true') {
    return visualizer({
      filename: './dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
      template: 'treemap', // or 'sunburst', 'network'
    }) as Plugin;
  }
  return undefined;
}