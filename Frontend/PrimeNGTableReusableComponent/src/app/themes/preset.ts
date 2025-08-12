// src/app/themes/my-preset.ts
import { definePreset } from '@primeng/themes';
import Lara from '@primeng/themes/lara';

export const Preset = definePreset(Lara, {
  semantic: {
    primary: {
      50: '#f3e5f5',
      100: '#e1bee7',
      200: '#ce93d8',
      300: '#ba68c8',
      400: '#ab47bc',
      500: '#6a1b9a', // color principal morado
      600: '#8e24aa',
      700: '#7b1fa2',
      800: '#6a1b9a',
      900: '#4a148c'
    }
  }
});