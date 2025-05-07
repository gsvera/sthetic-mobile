import SubHeaderReturn from "@/components/Shared/SubHeaderReturn";
import { ThemedText } from "@/components/ThemedText";
import {
  ButtonGeneralStyle,
  GridStyle,
  TextStyle,
} from "@/constants/StyleComponents";
import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiUserConfig } from "@/api/UserConfig";
import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
import { useNotificationProvider } from "@/provider/NotificationProvider";
import { TYPE_STATUS } from "@/constants/Constants";
import { ErrorAlertMessage } from "@/components/Shared/Notifications/AlertMessage";
import { ThemeColorsSthetic } from "@/constants/Colors";
import GeneralButton from "@/components/Shared/GeneralButton";
import { apiCatalogs } from "@/api/Catalogs";
import SelectStateModal from "./SelectStateModal";
import {
  CatalogGeoStateType,
  CatalogGeoMunicipalityType,
} from "@/constants/GeneralTypes";
import SelectMunicipalityModal from "./SelectMunicipalityModal";
import { ObjectResponse, ResponseApi } from "@/api/responseApi";
import { apiOtherServices } from "@/api/OtherServices";

type myLocationProps = {
  idUser: string;
  returnBack: () => void;
};

type currentLocationType = {
  latitude: number;
  longitude: number;
};

type LocationAuxType = {
  auxState: string | undefined;
  auxMunicipality: string | undefined;
};

type dataLocationType = currentLocationType & {
  idUser: string;
  idState?: number;
  idMunicipality?: number;
  auxState?: string;
  auxMunicipality?: string;
};

// SE DEBE PONER UNA LOCACION DEFAULT POR MUNICIPIO
const defaultCoordinate = {
  latitude: 21.161899926111694,
  longitude: -86.85164049267769,
};

export const MyLocation = ({ idUser, returnBack }: myLocationProps) => {
  const { handleNotification } = useNotificationProvider();
  const mapRef = useRef<MapView>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [enableBtn, setEnableBtn] = useState(false);
  const [requiredLocation, setRequiredLocation] = useState(false);
  const [openSelectStateModal, setOpenSelectStateModal] = useState(false);
  const [openSelectMunicipalityModal, setOpenSelectMunicipalityModal] =
    useState(false);
  const [stateSelected, setStateSelected] = useState<CatalogGeoStateType>();
  const [municiaplitySelected, setMunicipalitySelected] =
    useState<CatalogGeoMunicipalityType>();
  const [dataLocationAux, setDataLocationAux] =
    useState<LocationAuxType | null>({
      auxState: "",
      auxMunicipality: "",
    });
  const [currentLocation, setCurrentLocation] =
    useState<currentLocationType>(defaultCoordinate);

  const queryClient = useQueryClient();

  const { data: listState = [], isLoading: isPendingStates } = useQuery({
    queryKey: [REACT_QUERY_KEYS.catalogs.geo.getAllState("select-state-modal")],
    queryFn: () => apiCatalogs.getAllGeoState(),
    ...{
      select: (data: ResponseApi) =>
        data.data.items as Array<CatalogGeoStateType>,
    },
  });

  const { data: listMunicipality = [], isLoading: isPendingMunicipalities } =
    useQuery({
      queryKey: [
        REACT_QUERY_KEYS.catalogs.geo.getMunicipalityByState(stateSelected?.id),
      ],
      queryFn: () => apiCatalogs.getMunicipalityByState(stateSelected?.id),
      ...{
        select: (data: ResponseApi) =>
          data.data.items as Array<CatalogGeoMunicipalityType>,
        enabled: !!stateSelected?.id,
      },
    });

  const { data: dataLocation, isLoading: isPendingLocation } = useQuery({
    queryKey: [REACT_QUERY_KEYS.userConfig.getLocationByUser(idUser)],
    queryFn: () => apiUserConfig.getLocationByUser(idUser),
    ...{
      select: (data: ResponseApi) => data?.data.items as dataLocationType,
    },
  });

  const { mutate: saveLocation } = useMutation({
    mutationFn: (data: dataLocationType) => apiUserConfig.saveLocation(data),
    onSuccess: (data: ResponseApi) => handleSaveResponse(data.data),
    onError: (err) => ErrorAlertMessage,
  });

  const handleSaveResponse = (data: ObjectResponse) => {
    setRequiredLocation(false);
    setEnableBtn(false);
    if (!data.error) {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_KEYS.userConfig.getLocationByUser(idUser)],
      });
      handleNotification({
        type: TYPE_STATUS.SUCCESS,
        message: data.message,
      });
    } else {
      handleNotification({
        type: TYPE_STATUS.ERROR,
        message: data.message,
      });
    }
  };

  useEffect(() => {
    if (dataLocation) {
      setDataLocationAux({
        auxState: dataLocation.auxState,
        auxMunicipality: dataLocation.auxMunicipality,
      });
      handleUpdateLocation({
        latitude: dataLocation?.latitude,
        longitude: dataLocation?.longitude,
      });
    }
  }, [dataLocation]);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.02, // Ajusta para zoom
          longitudeDelta: 0.02,
        },
        1000
      );
    }
  }, [currentLocation]);

  const loadingData = useMemo(
    () => isPendingLocation || isPendingStates || isPendingMunicipalities,
    [isPendingLocation, isPendingStates, isPendingMunicipalities]
  );

  const handleDeviceLocation = async () => {
    setRequiredLocation(false);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return;
    }

    setLoadingLocation(true);

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    setStateSelected(undefined);
    setMunicipalitySelected(undefined);
    geolocationInvert({ latitude, longitude });
    handleUpdateLocation({ latitude, longitude });
    setLoadingLocation(false);
  };

  const handlePickLotacion = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setStateSelected(undefined);
    setMunicipalitySelected(undefined);
    geolocationInvert({ latitude, longitude });
    handleUpdateLocation({ latitude, longitude });
  };

  const geolocationInvert = async ({
    latitude,
    longitude,
  }: currentLocationType) => {
    const result = await apiOtherServices.getInverserGeo({
      latitude,
      longitude,
    });

    if (result.data) {
      setDataLocationAux({
        auxState: result.data.address.state,
        auxMunicipality:
          result.data.address.municipality ?? result.data.address.county,
      });
    }
  };

  const handleUpdateLocation = (location: currentLocationType) => {
    setCurrentLocation(location);
  };

  const handleSubmitUpdateLocation = () => {
    if (currentLocation) {
      setEnableBtn(true);
      saveLocation({
        ...currentLocation,
        idState: stateSelected?.id,
        idMunicipality: municiaplitySelected?.id,
        auxState: dataLocationAux?.auxState,
        auxMunicipality: dataLocationAux?.auxMunicipality,
        idUser,
      });
    } else {
      setRequiredLocation(true);
    }
  };

  const handleSelectGeoState = (data: CatalogGeoStateType) => {
    setStateSelected(data);
    setMunicipalitySelected(undefined);
    setOpenSelectStateModal(false);
    setDataLocationAux(null);
  };

  const handleSelectGeoMunicipality = (data: CatalogGeoMunicipalityType) => {
    setMunicipalitySelected(data);
    setCurrentLocation({
      latitude: data.latitude,
      longitude: data.longitude,
    });
    setOpenSelectMunicipalityModal(false);
  };

  return (
    <View>
      <SubHeaderReturn subtitle="Mi Ubicación" handleReturn={returnBack} />
      <View style={localStyle.contentBody}>
        <ThemedText style={localStyle.textDescription}>
          Seleccione el estado y municipio y/o toque en el mapa la ubicacion de
          su local o negocio para ser mas preciso
        </ThemedText>
        <View style={localStyle.rowInput}>
          <ThemedText style={TextStyle.label}>Estado: </ThemedText>
          <Pressable
            style={localStyle.boxData}
            onPress={() => setOpenSelectStateModal(true)}
          >
            <ThemedText style={TextStyle.value}>
              {stateSelected
                ? stateSelected.stateName
                : !dataLocationAux?.auxState
                ? "Seleccione una opción"
                : dataLocationAux?.auxState}
            </ThemedText>
          </Pressable>
        </View>
        <View style={localStyle.rowInput}>
          <ThemedText style={TextStyle.label}>Municipio: </ThemedText>
          <Pressable
            style={localStyle.boxData}
            onPress={() => setOpenSelectMunicipalityModal(true)}
          >
            <ThemedText style={TextStyle.value}>
              {municiaplitySelected
                ? municiaplitySelected?.municipalityName
                : !dataLocationAux?.auxMunicipality
                ? "Seleccione una opción"
                : dataLocationAux?.auxMunicipality}
            </ThemedText>
          </Pressable>
        </View>
        {/* <AndroidMaps /> */}
        <MapView
          style={localStyle.map}
          ref={mapRef}
          // UBICACIONES POR DEFAULT DE CANCUN
          initialRegion={{
            latitude: 21.1739744,
            longitude: -86.8745216,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
          onPress={handlePickLotacion}
        >
          {/* Agregar un marcador */}
          {currentLocation && (
            <Marker
              coordinate={currentLocation}
              title="Ubicación marcada"
              // description="Esta es una descripción de la ubicación"
            />
          )}
        </MapView>
        <View style={localStyle.contentBtnLocation}>
          <Pressable
            onPress={handleDeviceLocation}
            style={localStyle.btnLocation}
          >
            <FontAwesome6 name="location-crosshairs" size={24} color="black" />
          </Pressable>
        </View>
        <View>
          {loadingLocation && (
            <ThemedText style={localStyle.textLoading}>
              Obteniendo la ubicación del dispositivo...
            </ThemedText>
          )}
          {loadingData && (
            <ThemedText style={localStyle.textLoading}>
              Cargando ubicación...
            </ThemedText>
          )}
          {requiredLocation && (
            <ThemedText style={localStyle.textError}>
              Debe marcar su ubicación.
            </ThemedText>
          )}
        </View>
      </View>
      <View style={{ padding: 5, width: "90%", marginHorizontal: "auto" }}>
        <GeneralButton
          styleBtn={
            !enableBtn
              ? ButtonGeneralStyle.btnUpdateSthetic
              : ButtonGeneralStyle.btnDisabledSthetic
          }
          textBtn="Guardar mi ubicación"
          styleText={{
            color: !enableBtn
              ? ThemeColorsSthetic.textLight
              : ThemeColorsSthetic.muted,
          }}
          handleOnPress={handleSubmitUpdateLocation}
          disabledBtn={enableBtn}
        />
      </View>
      <SelectStateModal
        open={openSelectStateModal}
        handleSelect={handleSelectGeoState}
        handleCloseModal={() => setOpenSelectStateModal(false)}
        listState={listState}
      />
      <SelectMunicipalityModal
        open={openSelectMunicipalityModal}
        handleSelect={handleSelectGeoMunicipality}
        handleCloseModal={() => setOpenSelectMunicipalityModal(false)}
        listMunicipality={listMunicipality}
        // idState={stateSelected?.id}
        // entityId={dataLocation?.idMunicipality}
      />
    </View>
  );
};

const localStyle = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  map: {
    marginTop: 10,
    flex: 1,
  },
  contentBody: { width: "auto", height: "80%", padding: 10 },
  textDescription: {
    textAlign: "center",
    marginBottom: 10,
    color: ThemeColorsSthetic.textLabels,
  },
  contentBtnLocation: { flexDirection: "row", justifyContent: "flex-end" },
  btnLocation: {
    zIndex: 9,
    padding: 5,
    backgroundColor: "white",
    top: -40,
    right: 10,
  },
  textLoading: {
    ...TextStyle.center,
    color: ThemeColorsSthetic.muted,
  },
  textError: {
    ...TextStyle.center,
    color: ThemeColorsSthetic.textError,
  },
  rowInput: {
    ...GridStyle.rowSpaceBetween,
    ...GridStyle.rowItemsVerticalCenter,
    marginVertical: 5,
  },
  boxData: {
    ...GridStyle.rowItemsVerticalCenter,
    paddingLeft: 5,
    borderWidth: 0.5,
    borderRadius: 5,
    width: "49%",
    height: 30,
    backgroundColor: "white",
  },
});

export default MyLocation;
