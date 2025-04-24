/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { StyleSheet } from "react-native";

const tintColorLight = '#dc0088';
const tintColorDark = '#dc0088';

/**
 * @deprecated Antiguos colores ya no se deben utilizar mejor utilizar @constant ThemeColorsSthetic
 */
export enum GlobalColors {
  pinkColor = "#dc0088",
  blueColor = "#003a85",
  grayColor = "#5e5e5e",
  grayLigthColor = '#b8b8b8',
  cianColor = "#007BFF",
  blackColor = "black",
  whiteColor = 'white',
  greenColor = "#20c81b",
  greenDarkColor = '#23a500',
  dangerColor = "#ff4d4d",
  blueSuccessColor =  '#081229',
  successNotification = '#20c81b',
  updateNotification = '#3867fc',
  errorNotification = '#ff4d4d'
}

/**
 * @param primary - Color primario, botones, acentos
 * @param secondary - Fondo principal o secciones
 * @param accent - Íconos, detalles premium
 * @param accentReverse - Aporta contraste sin ser negro, ideal para íconos o textos destacados
 * @param background - Backgrounds, tarjetas
 * @param backgroundStrong - Background oscuro
 * @param text - Texto principal
 * @param textLight - Texto invertido
 * @param textOre - Texto color oro para fondos oscuros y claros
 * @param textLabels - Texto para labels con fondo claro
 * @param textError - Texto para marcar errores
 * @param muted -Texto secundario / descripciones
 * @param disabled - Para elementos deshabilitados
 * @param update - Para elementos | botones que realicen acciones de actualizar
 * @param save - Para elemento | botones que realicen accion de guardar
 * @param delete - para elemento | botones que realicen accion de borrar
 * @param action - para elementos | botones que realicen acciones pero no de tipo crud
 * @param cancel - para elementos | boton que realicen cancelacion de una accion
 * @param textTitle - Azul acero para titulos con fondos claros
 * @param successNotification - para notificaciones exitosas
 * @param updateNotification - para notificaciones de actualizacion
 * @param errorNotification - para notificaciones de error
 * @param dangerColor - colores de error o advertencia de peligro o de acciones que son de riesgo
 * @param shadowBackground - Shadow background para modales
 * 
 */
export enum ThemeColorsSthetic  {
  /**
   * Color primario, botones, acentos
   */
    primary = '#C2185B', 
    /**
     * Fondo principal o secciones
     */
    secondary = '#F3E8FF', 
    /**
     * Íconos, detalles premium
     */
    accent = '#D4AF37',
    /**
     * Aporta contraste sin ser negro, ideal para íconos o textos destacados
     */
    accentReverse = '#593D63',
    /**
     * Backgrounds, tarjetas
     */
    backgroundLigth = '#F5F5F5',
    /**
     * Background oscuro
     */
    backgroundStrong = '#2B2B2B',
    /**
     * 	Texto principal
     */
    text = '#2E2E2E',
    /**
     * Texto invertido
     */
    textLight = '#FFFFFF',
    /**
     * Texto color oro para fondos oscuros y claros
     */
    textOre = "#D4AF37",
    /**
     * Texto para labels con fondo claro
     */
    textLabels = "#964F4C",
    /**
     *  Texto para marcar errores
     */
    textError = "#A4161A",
    /**
     * Azul acero para titulos con fondos claros
     */
    textTitle = '#3E5C76',
    /**
     * 	Texto secundario / descripciones
     */
    muted = '#8D8D8D',
    /**
     * Para elementos deshabilitados
     */
    disabled = '#CFCFCF',
    /**
     * para elementos | botones que realicen acciones de actualizar
     */
    update = '#4A3F35',
    /**
     * Para elemento | botones que realicen accion de guardar
     */
    save = '#D4AF37',
    /**
     * para elemento | botones que realicen accion de borrar
     */
    delete = '#964F4C',
    /**
     * para elementos | botones que realicen acciones pero no de tipo crud
     */
    action= '#3C3C3C',
    /**
     * para elementos | boton que realicen cancelacion de una accion
     */
    cancel = "#5e5e5e",
    /**
     * para notificaciones exitosas
     */
    successNotification = '#3B7A57',
    /**
     * para notificaciones de actualizacion
     */
    updateNotification = '#2C3E50',
    /**
     * para notificaciones de error
     */
    errorNotification = '#B04A4A',
    /**
     * colores de error o advertencia de peligro o de acciones que son de riesgo
     */
    dangerColor = '#ff4d4d',
    /**
     * Shadow background para modales
     */
    shadowBackground = "rgba(0, 0, 0, 0.5)"
};

export const textColors = {
  errors: {
    color: 'red'
  },
  pink: {
    color: "#dc0088"
  }
}

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Container = {
  container: {
    flex: 1
  },
  containerLogin: {
    flex: 1,
  },
  logo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
}

export const loginStyle = StyleSheet.create({
  centerInput: {
    marginTop: 20,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  input: {
    textAlign: 'center',
    width: 250,
    height: 37,
    padding: 0,
    fontSize: 15,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#003a85',
    borderRadius: 3
  },
  buttonSubmit: {
    width: 250,
    margin: 'auto'
  },
  textInteraction: {
    textAlign: 'center',
    marginTop: 15,
    color: GlobalColors.pinkColor
  },
  errors: {
    color: 'red'
  }
})

