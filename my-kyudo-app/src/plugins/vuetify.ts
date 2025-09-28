import { createVuetify } from 'vuetify';
import 'vuetify/styles';

// Labs カレンダー
import { VCalendar } from 'vuetify/labs/VCalendar';
import * as directives from 'vuetify/directives';
import * as components from 'vuetify/components';

const vuetify = createVuetify({
  components: {
    ...components,
    VCalendar,
  },
  directives,
});

export default vuetify;
