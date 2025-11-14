const design = require('./design/design.json');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ...design.colors
      },
      fontFamily: {
        heading: [design.fonts.heading.family, ...(design.fonts.heading.fallbacks || [])],
        body: [design.fonts.body.family, ...(design.fonts.body.fallbacks || [])],
        mono: [design.fonts.mono.family, ...(design.fonts.mono.fallbacks || [])]
      },
      boxShadow: {
        card: design.shadows.card,
        led: design.shadows.glow_led
      },
      borderRadius: {
        card: design.radii.card,
        button: design.radii.button,
        chip: design.radii.chip
      },
      backgroundImage: {
        'hero-bg': design.gradients.hero_bg,
        'btn-gradient': design.gradients.button,
        'card-hover': design.gradients.card_hover
      },
      transitionTimingFunction: {
        'in-out': design.motion.easing.in_out,
        out: design.motion.easing.out
      },
      transitionDuration: {
        fast: design.motion.durations.fast,
        base: design.motion.durations.base,
        slow: design.motion.durations.slow
      },
      // Micro-interaction animations for InteractiveSkillTag
      keyframes: {
        ping: {
          '75%, 100%': {
            transform: 'scale(1.2)',
            opacity: '0',
          },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-in-from-bottom-1': {
          from: { transform: 'translateY(4px)' },
          to: { transform: 'translateY(0)' },
        },
      },
      animation: {
        ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        in: 'fade-in 0.2s ease-out',
        'slide-in-from-bottom-1': 'slide-in-from-bottom-1 0.2s ease-out',
      }
    }
  },
  plugins: []
};