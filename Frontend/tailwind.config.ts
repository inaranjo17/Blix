import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'state-free':             '#22c55e',
        'state-reserved':         '#facc15',
        'state-occupied':         '#ef4444',
        'state-no-reservation':   '#3b82f6',
        'state-conflict':         '#f97316',
        'state-no-signal':        '#9ca3af',
        'blix-dark':              '#0f172a',
        'blix-blue':              '#1e40af',
        'blix-blue-light':        '#3b82f6',
      },
    },
  },
  plugins: [],
}

export default config