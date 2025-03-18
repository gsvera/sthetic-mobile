import SubHeaderReturn from "@/components/Shared/SubHeaderReturn";
import { ThemedText } from "@/components/ThemedText";
import { ButtonStyle } from "@/constants/StyleComponents";
import { useEffect, useState } from "react";
import { Button, Pressable, StyleSheet, View } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiUserConfig } from "@/api/UserConfig";
import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
import { useNotificationProvider } from "@/provider/NotificationProvider";
import { TYPE_STATUS } from "@/constants/Constants";
import { ErrorAlertMessage } from "@/components/Shared/Notifications/AlertMessage";

type myLocationProps = {
  idUser: string;
  returnBack: () => void;
};

type currentLocationType = {
  latitude: number;
  longitude: number;
};

type dataLocationType = currentLocationType & {
  idUser: string;
};

// SE DEBE PONER UNA LOCACION DEFAULT POR MUNICIPIO
const defaultCoordinate = {
  latitude: 21.161899926111694,
  longitude: -86.85164049267769,
};

export const MyLocation = ({ idUser, returnBack }: myLocationProps) => {
  const { handleNotification } = useNotificationProvider();
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [enableBtn, setEnableBtn] = useState(false);
  const [requiredLocation, setRequiredLocation] = useState(false);
  const [currentLocation, setCurrentLocation] =
    useState<currentLocationType>(defaultCoordinate);

  const queryClient = useQueryClient();

  const { data: dataLocation, isFetching } = useQuery({
    queryKey: [REACT_QUERY_KEYS.userConfig.getLocationByUser(idUser)],
    queryFn: () => apiUserConfig.getLocationByUser(idUser),
    ...{
      select: (data: ResponseAPi) => data?.data,
    },
  });

  const { mutate: saveLocation } = useMutation({
    mutationFn: (data: dataLocationType) => apiUserConfig.saveLocation(data),
    onSuccess: (response: ResponseAPi) => handleSaveResponse(response),
    onError: (err) => handleSaveError(err),
  });

  const handleSaveResponse = (data: ResponseAPi) => {
    setRequiredLocation(false);
    setEnableBtn(false);
    if (!data.data.error) {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.userConfig.getLocationByUser(idUser)],
      });
      handleNotification({
        type: TYPE_STATUS.SUCCESS,
        message: data.data.message,
      });
    }
  };

  const handleSaveError = (err: any) => {
    // console.log("🚀 ~ handleSaveError ~ err:", err);
    ErrorAlertMessage();
  };

  useEffect(() => {
    console.log("🚀 ~ useEffect ~ dataLocation:", dataLocation);
    if (dataLocation?.items) {
      console.log(dataLocation);
      setCurrentLocation({
        latitude: dataLocation?.items?.latitude,
        longitude: dataLocation?.items?.longitude,
      });
    }
  }, [dataLocation]);

  const handleDeviceLocation = async () => {
    setRequiredLocation(false);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return;
    }

    setLoadingLocation(true);

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    setCurrentLocation({ latitude, longitude });
    setLoadingLocation(false);
  };

  const handlePickLotacion = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setCurrentLocation({ latitude, longitude });
  };

  const handleSubmitUpdateLocation = () => {
    if (currentLocation) {
      setEnableBtn(true);
      saveLocation({
        ...currentLocation,
        idUser,
      });
    } else {
      setRequiredLocation(true);
    }
  };

  return (
    <View>
      <SubHeaderReturn subtitle="Mi Ubicación" handleReturn={returnBack} />
      <View style={{ width: "auto", height: "80%", padding: 10 }}>
        <ThemedText
          darkColor="black"
          style={{ textAlign: "center", marginBottom: 10 }}
        >
          Toque en el mapa la ubicacion de su local o negocio
        </ThemedText>
        <MapView
          style={localStyle.map}
          // UBICACIONES POR DEFAULT DE CANCUN
          initialRegion={{
            latitude: 21.1739744,
            longitude: -86.8745216,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onPress={handlePickLotacion}
        >
          {/* Agregar un marcador */}
          {currentLocation && (
            <Marker
              coordinate={currentLocation}
              title="Ubicación"
              description="Esta es una descripción de la ubicación"
            />
          )}
        </MapView>
        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
          <Pressable
            onPress={handleDeviceLocation}
            style={{
              // position: "absolute",
              zIndex: 9,
              //   marginTop: -30,
              padding: 5,
              // borderColor: "black",
              backgroundColor: "white",
              //   width: 30,
              top: -40,
              right: 10,
              //   borderBottomColor: "black",
            }}
          >
            <FontAwesome6 name="location-crosshairs" size={24} color="black" />
          </Pressable>
        </View>
        <View>
          {loadingLocation && (
            <ThemedText style={{ textAlign: "center" }} darkColor="black">
              Obteniendo la ubicación del dispositivo...
            </ThemedText>
          )}
          {isFetching && (
            <ThemedText style={{ textAlign: "center" }} darkColor="black">
              Cargando ubicación...
            </ThemedText>
          )}
          {requiredLocation && (
            <ThemedText style={{ textAlign: "center" }} darkColor="red">
              Debe marcar su ubicación.
            </ThemedText>
          )}
        </View>
      </View>
      <View style={{ padding: 5, width: "90%", marginHorizontal: "auto" }}>
        <Button
          title="Guardar mi ubicación"
          color={
            !enableBtn
              ? ButtonStyle.btnSuccess.color
              : ButtonStyle.btnDisabled.color
          }
          onPress={handleSubmitUpdateLocation}
          disabled={enableBtn}
        />
      </View>
    </View>
  );
};

const localStyle = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  map: {
    flex: 1,
  },
});

export default MyLocation;
