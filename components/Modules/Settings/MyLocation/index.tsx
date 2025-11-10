import SubHeaderReturn from "@/components/Shared/SubHeaderReturn";
import { ThemedText } from "@/components/ThemedText";
import {
  ButtonGeneralStyle,
  GridStyle,
  InputStyle,
  TextStyle,
} from "@/constants/StyleComponents";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
{
  /* 
  SE COMENTA EL MAPA YA QUE REQUIERE AGREGAR API KEY DE GOOGLE PERO TIENE COSTO, PARA FUTURAS VERSIONES VALORAR SI SE REQUIERE HABILITAR
**/
}
// import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiUserConfig } from "@/api/UserConfig";
import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
import { useNotificationProvider } from "@/provider/NotificationProvider";
import { PLATFORM_TYPE, TYPE_STATUS } from "@/constants/Constants";
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
import { Entypo, Feather } from "@expo/vector-icons";
import { openMap } from "@/utils/GeneralUtils";

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
  reference?: string;
};

// SE DEBE PONER UNA LOCACION DEFAULT POR MUNICIPIO
const defaultCoordinate = {
  latitude: 21.161899926111694,
  longitude: -86.85164049267769,
};

export const MyLocation = ({ idUser, returnBack }: myLocationProps) => {
  const { handleNotification } = useNotificationProvider();
  {
    /* 
    SE COMENTA EL MAPA YA QUE REQUIERE AGREGAR API KEY DE GOOGLE PERO TIENE COSTO, PARA FUTURAS VERSIONES VALORAR SI SE REQUIERE HABILITAR
  **/
  }
  // const mapRef = useRef<MapView>(null);
  const { height } = Dimensions.get("window");
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
  const [currentLocation, setCurrentLocation] = useState<currentLocationType>();
  const [reference, setReference] = useState("");

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
      returnBack();
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
      if (dataLocation?.reference) setReference(dataLocation?.reference);
    }
  }, [dataLocation]);

  {
    /* 
    SE COMENTA EL MAPA YA QUE REQUIERE AGREGAR API KEY DE GOOGLE PERO TIENE COSTO, PARA FUTURAS VERSIONES VALORAR SI SE REQUIERE HABILITAR
  **/
  }
  // useEffect(() => {
  //   if (mapRef.current) {
  //     mapRef.current.animateToRegion(
  //       {
  //         latitude: currentLocation.latitude,
  //         longitude: currentLocation.longitude,
  //         latitudeDelta: 0.02, // Ajusta para zoom
  //         longitudeDelta: 0.02,
  //       },
  //       1000
  //     );
  //   }
  // }, [currentLocation]);

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

  {
    /* 
    SE COMENTA EL MAPA YA QUE REQUIERE AGREGAR API KEY DE GOOGLE PERO TIENE COSTO, PARA FUTURAS VERSIONES VALORAR SI SE REQUIERE HABILITAR
  **/
  }
  // const handlePickLotacion = (event: any) => {
  //   const { latitude, longitude } = event.nativeEvent.coordinate;
  //   setStateSelected(undefined);
  //   setMunicipalitySelected(undefined);
  //   geolocationInvert({ latitude, longitude });
  //   handleUpdateLocation({ latitude, longitude });
  // };

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
        reference,
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

  const handleClearLocation = () => {
    setCurrentLocation(undefined);
  };

  return (
    <View
      style={{
        flex: 1,
        marginBottom: Platform.OS === PLATFORM_TYPE.IOS ? height * 0.05 : 0,
      }}
    >
      <SubHeaderReturn subtitle="Mi Ubicación" handleReturn={returnBack} />
      <View style={{ flex: 1 }}>
        <ScrollView style={localStyle.contentBody}>
          <ThemedText style={localStyle.textDescription}>
            Seleccione el estado y municipio y/o utilice el boton para obtener
            la ubicación de su dispositivo
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
          <View>
            <ThemedText style={TextStyle.label}>* Referencia:</ThemedText>
            <TextInput
              style={localStyle.referenceInput}
              placeholder="Agrega una referencia descriptiva sobre como ubicar tu negocio"
              placeholderTextColor={ThemeColorsSthetic.muted}
              onChangeText={setReference}
              maxLength={100}
              value={reference}
              multiline
              numberOfLines={2}
            />
          </View>
          {/* 
            SE COMENTA EL MAPA YA QUE REQUIERE AGREGAR API KEY DE GOOGLE PERO TIENE COSTO, PARA FUTURAS VERSIONES VALORAR SI SE REQUIERE HABILITAR
          **/}
          {/* <MapView
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
          > */}
          {/* Agregar un marcador */}
          {/* {currentLocation && (
              <Marker
                coordinate={currentLocation}
                title="Ubicación marcada"
                // description="Esta es una descripción de la ubicación"
              />
            )} */}
          {/* </MapView> */}
          <View style={localStyle.contentBtnLocation}>
            <GeneralButton
              textBtn={
                <>
                  <ThemedText>Ubicación actual {"  "}</ThemedText>
                  <FontAwesome6
                    name="location-crosshairs"
                    style={localStyle.iconMap}
                  />
                </>
              }
              styleText={TextStyle.lightColor}
              styleBtn={localStyle.btnLocation}
              handleOnPress={handleDeviceLocation}
            />
            {currentLocation?.latitude && currentLocation.longitude && (
              <>
                <GeneralButton
                  textBtn={
                    <>
                      <ThemedText>Ver en mapa {"  "}</ThemedText>
                      <Entypo name="location" style={localStyle.iconMap} />
                    </>
                  }
                  styleText={TextStyle.lightColor}
                  styleBtn={localStyle.btnLocation}
                  handleOnPress={() =>
                    openMap(currentLocation.latitude, currentLocation.longitude)
                  }
                />
                <GeneralButton
                  textBtn={<Feather name="trash" style={localStyle.iconMap} />}
                  styleText={TextStyle.lightColor}
                  styleBtn={localStyle.btnDeleteLocation}
                  handleOnPress={handleClearLocation}
                />
              </>
            )}
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
          </View>

          {requiredLocation && (
            <ThemedText style={localStyle.textError}>
              Debe marcar su ubicación y/o agregar una referencia.
            </ThemedText>
          )}
          <View
            style={{
              padding: 5,
              width: "100%",
              marginHorizontal: "auto",
            }}
          >
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
        </ScrollView>
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
    height: "33%",
  },
  contentBody: { flex: 1, padding: 10 },
  textDescription: {
    textAlign: "center",
    marginBottom: 20,
    paddingBottom: 20,
    color: ThemeColorsSthetic.textLabels,
  },
  referenceInput: {
    ...InputStyle.withBorder,
    marginTop: 5,
    backgroundColor: "white",
  },
  contentBtnLocation: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  btnLocation: {
    ...ButtonGeneralStyle.btnActionSthetic,
    flexDirection: "row",
    zIndex: 9,
    padding: 5,
    marginTop: 10,
  },
  btnDeleteLocation: {
    ...ButtonGeneralStyle.btnDeleteSthetic,
    flexDirection: "row",
    zIndex: 9,
    padding: 5,
    marginTop: 10,
  },
  iconMap: {
    color: ThemeColorsSthetic.textLight,
    fontSize: 22,
  },
  textLoading: {
    ...TextStyle.center,
    color: ThemeColorsSthetic.muted,
    marginBottom: 10,
  },
  textError: {
    ...TextStyle.center,
    color: ThemeColorsSthetic.textError,
    // marginTop: 10,
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
