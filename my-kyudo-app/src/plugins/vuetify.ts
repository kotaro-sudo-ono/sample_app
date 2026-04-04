import { createVuetify } from 'vuetify';
import 'vuetify/styles';

// Labs カレンダー
import { VCalendar } from 'vuetify/labs/VCalendar';
import * as directives from 'vuetify/directives';
import * as components from 'vuetify/components';

const kyudoTheme = {
  dark: false,
  colors: {
    primary: '#3B2A1A',
    'primary-darken-1': '#261A10',
    secondary: '#8B7355',
    'secondary-darken-1': '#6B5440',
    accent: '#9B2335',
    background: '#F7F0E6',
    surface: '#FDF9F3',
    'on-primary': '#F7F0E6',
    'on-secondary': '#F7F0E6',
    'on-background': '#1A0F00',
    'on-surface': '#1A0F00',
    error: '#9B2335',
    success: '#4A7C59',
    warning: '#B8860B',
    info: '#5C6BC0',
  },
};

const vuetify = createVuetify({
  components: {
    ...components,
    VCalendar,
  },
  directives,
  theme: {
    defaultTheme: 'kyudo',
    themes: {
      kyudo: kyudoTheme,
    },
  },
  defaults: {
    global: {
      style: { fontFamily: "'Noto Serif JP', serif" },
    },
  },
});

export default vuetify;
