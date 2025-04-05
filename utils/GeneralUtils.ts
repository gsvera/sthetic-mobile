import * as FileSystem from 'expo-file-system';
import CryptoJS from "crypto-js";
import dayjs from "dayjs";

const secretKeyPass = process.env.EXPO_PUBLIC_SECRET_KEY;

/**
 * Funcion para encryptar el password para antes de enviarlo a cual quier peticion de servicios, el @param secretKeyPass debe ser el mismo que el de back
 * @param text 
 * @returns 
 */
export const parsePasswordEncrypt = (text:string) => {
  if(!secretKeyPass) {
    throw new Error("Secret key is not defined");
  }
  
  const key = CryptoJS.enc.Utf8.parse(secretKeyPass);

  // Cifrar el texto
  const encrypted = CryptoJS.AES.encrypt(text, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.toString();
};

/**
 * Convierte un valor numerico a formato de moneda, @param digits hace referencia al numero de digitos a utilizar por default es 2
 * @param n @type number | undefined
 * @param digits @type number
 * @returns 
 */
export const convertCurrency = (n:number | undefined, digits: number = 2) => {
  if(n) {
    let currencyLocal = Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: digits
    });
  
    return currencyLocal.format(n);
  }
};

/**
 * Convierte a base 64 los videos
 * @param uri 
 * @returns 
 */
export const getBase64FromVideo = async (uri:any) => {
    return await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
  };

  /**
   * Convierte un string de fecha a formato fecha dependiendo el "formatString" por default es "DD/MM/YYYY"
   * @param date 
   * @param formatString
   * @returns 
   */
export const convertDateToGeneralFormat = (date:string | undefined, formatString: string = "DD/MM/YYYY") => {
  if(date) return dayjs(date).format(formatString)
}