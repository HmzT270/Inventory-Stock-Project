// src/theme.js

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,      // Mobil
      sm: 768,    // Tablet başlar
      md: 1158,   // Bilgisayar başlar
      lg: 1400,   // (istersen artırılabilir)
      xl: 1800,   // (istersen artırılabilir)
    },
  },
  // Diğer özelleştirmeler buraya eklenebilir (renkler, tipografi vs.)
});

export default theme;
