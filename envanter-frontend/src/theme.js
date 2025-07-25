// src/theme.js

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,      // Mobil
      sm: 768,    // Tablet
      md: 1158,   // Bilgisayar başlar
      lg: 1400,
      xl: 1800,
    },
  },
});

export default theme;
