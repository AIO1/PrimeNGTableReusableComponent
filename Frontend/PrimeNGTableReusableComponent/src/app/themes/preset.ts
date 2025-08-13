import { definePreset } from '@primeng/themes';
import Lara from '@primeng/themes/lara';

export const Preset = definePreset(Lara, {
  semantic: {
    primary: {
      50:  '#e3f2fd',
      100: '#bbdefb',
      200: '#90caf9',
      300: '#64b5f6',
      400: '#42a5f5',
      500: '#1976d2', // main color
      600: '#1565c0',
      700: '#0d47a1',
      800: '#0b3d91',
      900: '#082b73'
    }
  }
});