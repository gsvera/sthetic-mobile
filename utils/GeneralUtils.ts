import * as FileSystem from 'expo-file-system';

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