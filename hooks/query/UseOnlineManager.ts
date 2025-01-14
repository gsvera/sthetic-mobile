import { useEffect } from "react";
import {  Platform } from "react-native";
import {  onlineManager } from "@tanstack/react-query";
import NetInfo from '@react-native-community/netinfo';

export function useOnlineManager() {
    useEffect(() => {
        if(Platform.OS !== 'web') {
            return NetInfo.addEventListener((state) => {
                onlineManager.setOnline(
                    state.isConnected !== null && state.isConnected && Boolean(state.isInternetReachable)
                )
            })
        }
        // if(Platform.OS !== 'web') {
        //     focusManager.setFocused(status === 'active');
        // }
        // const subscription = AppState.addEventListener('change', onAppStateChange);
        // return () => subscription.remove();
    },[]);
}
