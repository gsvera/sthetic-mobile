import * as SecureStore from 'expo-secure-store';

export const KEY_STORE = {
    userToken: 'userToken',
    userData: 'userData',
    profilePicture: 'profilePicture'
}

type keyGetProps={
    key:string
}

export const getStoreSession = async ({key}:keyGetProps) => {
  const storeValue = await SecureStore.getItemAsync(key);

  if(storeValue === null || storeValue === '') return null;
    else return storeValue
}

type keySetProps = {
    key: string;
    value: string
}

export const setStoreSession = async ({key, value}: keySetProps) => {
    await SecureStore.setItemAsync(key, value);
}