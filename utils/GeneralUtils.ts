import * as FileSystem from 'expo-file-system';
import CryptoJS from "crypto-js";

const secretKeyPass = process.env.EXPO_PUBLIC_SECRET_KEY;

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

export const convertCurrency = (n:number) => {
    let currencyLocal = Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });
  
    return currencyLocal.format(n);
  };

export const getBase64FromVideo = async (uri:any) => {
    return await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
  };