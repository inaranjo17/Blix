import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans:    ['Satoshi', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        // ── Paleta BLIX nueva ──────────────────────────
        'blix-red':      '#EF233C',   // Primario — Rojo Carmín
        'blix-red-dark': '#C1121F',   // Rojo más oscuro para hover
        'blix-carbon':   '#2B2D42',   // Secundario — Gris Carbón
        'blix-bone':     '#F8F9FA',   // Fondo principal
        'blix-charcoal': '#1A1A2E',   // Fondos oscuros
        // ── Estados de mesas ───────────────────────────
        'state-free':      '#06D6A0', // Verde Esmeralda — Libre
        'state-reserved':  '#FFB703', // Ámbar Dorado — Reservada
        'state-occupied':  '#EF233C', // Rojo Carmín — En uso con timer
        'state-no-res':    '#F77F00', // Naranja — Ocupada sin reserva
        'state-conflict':  '#9B2226', // Vino/Granate — Conflicto (admin)
        'state-signal':    '#ADB5BD', // Gris Neutro — Sin señal
        // ── UI extras ──────────────────────────────────
        'ui-border':  '#E9ECEF',
        'ui-muted':   '#6C757D',
        'ui-success': '#198754',
      },
      keyframes: {
        'pulse-emerald': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(6, 214, 160, 0.5)' },
          '50%':       { boxShadow: '0 0 0 8px rgba(6, 214, 160, 0)' },
        },
        'fadeUp': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'pulse-emerald': 'pulse-emerald 2.5s ease-in-out infinite',
        'fade-up':       'fadeUp 0.5s ease forwards',
        'shimmer':       'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config