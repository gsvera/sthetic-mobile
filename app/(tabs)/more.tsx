import {
  View,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Platform,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { GlobalColors, ThemeColorsSthetic } from "@/constants/Colors";
import {
  AntDesign,
  Entypo,
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";
import {
  ErrorAlertMessage,
  PromtConfirm,
} from "@/components/Shared/Notifications/AlertMessage";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiUser } from "@/api/User";
import { KEY_STORE, setStoreSession } from "@/hooks/StoreDataSecure";
import { useNavigation } from "expo-router";
import { useApiProvider } from "@/provider/InterceptorProvider";
import { useState } from "react";
import {
  COMPONENTS_SETINGS,
  PLATFORM_TYPE,
  TYPE_STATUS,
} from "@/constants/Constants";
import PersonalInformation, {
  formPersonalInformation,
} from "@/components/Modules/Settings/PersonaleInformation";
import { Image } from "react-native";
import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
import ChangePassword from "@/components/Modules/Settings/ChangePassword";
import MyLocation from "@/components/Modules/Settings/MyLocation";
import CameraCustom from "@/components/Modules/Settings/CameraCustom";
import { PortfolioServices } from "@/components/Modules/Settings/PortfolioServices";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import TypeServices from "@/components/Modules/Settings/TypeServices";
import MySupscription from "@/components/Modules/Settings/MySupscription";
import ModalConfirm from "@/components/Shared/ModalConfirm";
import { TextStyle } from "@/constants/StyleComponents";
import MyCompany from "@/components/Modules/Settings/MyCompany";
import CatalogServices from "@/components/Modules/Settings/CatalogServices";
import { ObjectResponse, ResponseApi } from "@/api/responseApi";
import LoadingView from "@/components/Shared/LoadingView";
import { useNotificationProvider } from "@/provider/NotificationProvider";
import Training from "@/components/Modules/Settings/Training";

export default function More() {
  const navigation = useNavigation();
  const { handleNotification } = useNotificationProvider();
  const { setToken } = useApiProvider();
  const [viewComponent, setViewComponent] = useState<string>();
  const [openModalDeleteAccount, setOpenModalDeleteAccount] = useState(false);
  const [openModaloLogout, setOpenModalLogout] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  // const [openModal, setOpenModal] = useState(false);

  const { data: dataUser, isFetching: isFetchingData } = useQuery({
    queryKey: [REACT_QUERY_KEYS.user.getDataUser("personal-information")],
    queryFn: () => apiUser.getDataUser(),
    ...{
      select: (data: ResponseApi) => data.data.items,
    },
  });

  const { mutate: logoutSession } = useMutation({
    mutationFn: () => apiUser.logout(),
    onSuccess: (data: ResponseApi) => handleSuccessLogout(data),
    onError: (err) => handleErrorLogout(err),
  });

  const { mutate: deleteAccount } = useMutation({
    mutationFn: () => apiUser.deleteAccount(dataUser?.id),
    onSuccess: (data: ResponseApi) => handleSuccessDeleteAccount(data.data),
    onError: (err) => ErrorAlertMessage,
  });

  const handleSuccessDeleteAccount = (data: ObjectResponse) => {
    if (data.error) return ErrorAlertMessage({ message: data.message });
    setLoadingDelete(false);
    handleNotification({
      type: TYPE_STATUS.SUCCESS,
      message: "Su cuenta se ha eleminado con éxito",
    });
    deleteSession();
  };

  const handleSuccessLogout = async (data: ResponseApi) => {
    if (!data.data.error) {
      deleteSession();
    }
  };

  const handleErrorLogout = (err: any) => {
    ErrorAlertMessage({});
    deleteSession();
  };

  const deleteSession = async () => {
    setToken(null);
    await setStoreSession({ key: KEY_STORE.userToken, value: "" });
    navigation.navigate("login" as never);
  };

  const handleView = (view: string) => {
    setViewComponent(view);
  };

  const renderViewComponent = (element: string) => {
    switch (element) {
      case COMPONENTS_SETINGS.PERSONAL_INFORMATION:
        const dataUserForm = {
          firstName: dataUser?.firstName,
          lastName: dataUser?.lastName,
          lada: dataUser?.lada,
          phone: dataUser?.phone,
          email: dataUser?.email,
        };
        return (
          <PersonalInformation
            formDataInformation={dataUserForm as formPersonalInformation}
            returnBack={() => handleView("")}
          />
        );
      case COMPONENTS_SETINGS.CHANGE_PASSWORD:
        return <ChangePassword returnBack={() => handleView("")} />;
      case COMPONENTS_SETINGS.MY_LOCATION:
        return (
          <MyLocation idUser={dataUser?.id} returnBack={() => handleView("")} />
        );
      case COMPONENTS_SETINGS.PROFILE_PICTURE:
        return (
          <CameraCustom
            idUser={dataUser?.id}
            returnBack={() => handleView("")}
          />
        );
      case COMPONENTS_SETINGS.TYPE_SERVICES:
        return (
          <TypeServices
            idUser={dataUser?.id}
            returnBack={() => handleView("")}
          />
        );
      case COMPONENTS_SETINGS.SERVICES_CATALOG:
        return (
          <CatalogServices
            idUser={dataUser?.id}
            returnBack={() => handleView("")}
          />
        );
      case COMPONENTS_SETINGS.PORFTOLIO_SERVICES:
        return (
          <PortfolioServices
            idUser={dataUser?.id}
            returnBack={() => handleView("")}
          />
        );
      case COMPONENTS_SETINGS.MY_SUBSCRIPTION:
        return (
          <MySupscription
            idUser={dataUser?.id}
            returnBack={() => handleView("")}
            nameCustomer={`${dataUser?.firstName} ${dataUser?.lastName}`}
            emailCustomer={dataUser?.email}
          />
        );
      case COMPONENTS_SETINGS.MY_COMPANY:
        return (
          <MyCompany idUser={dataUser?.id} returnBack={() => handleView("")} />
        );
      case COMPONENTS_SETINGS.TRAINING:
        return (
          <Training idUser={dataUser?.id} returnBack={() => handleView("")} />
        );
      default:
        return <View></View>;
    }
  };

  const activeCamera = () => {
    handleView(COMPONENTS_SETINGS.PROFILE_PICTURE);
  };

  const handleDeleteAccount = () => {
    setLoadingDelete(true);
    deleteAccount();
  };

  return (
    <View>
      {viewComponent ? (
        renderViewComponent(viewComponent)
      ) : (
        <View>
          <View style={localStyle.contentHeader}>
            <TouchableOpacity onPress={activeCamera}>
              <Image
                source={
                  !dataUser?.profilePicture
                    ? require("@/assets/images/profile-default.png")
                    : { uri: dataUser?.profilePicture }
                }
                style={
                  !dataUser?.profilePicture
                    ? localStyle.avatarMeredith
                    : localStyle.avatar
                }
              />
            </TouchableOpacity>
            <View style={{ marginLeft: 10 }}>
              <ThemedText style={{ color: ThemeColorsSthetic.textOre }}>
                Bienvenido!
              </ThemedText>
              {isFetchingData ? (
                <LoadingView />
              ) : (
                <View
                  style={{
                    width: Platform.OS === PLATFORM_TYPE.IOS ? "92%" : "98%",
                  }}
                >
                  <ThemedText style={localStyle.name}>
                    {dataUser?.firstName} {dataUser?.lastName}
                  </ThemedText>
                </View>
              )}
            </View>
          </View>
          <View style={localStyle.contentDivisor}>
            <Pressable
              style={localStyle.itemMenu}
              onPress={() =>
                handleView(COMPONENTS_SETINGS.PERSONAL_INFORMATION)
              }
            >
              <View style={localStyle.itemMenuText}>
                <AntDesign name="user" style={localStyle.iconItem} />
                <ThemedText darkColor="black">
                  {"    "}
                  Mis datos
                </ThemedText>
              </View>
            </Pressable>
            <Pressable
              style={localStyle.itemMenu}
              onPress={() => handleView(COMPONENTS_SETINGS.CHANGE_PASSWORD)}
            >
              <View style={localStyle.itemMenuText}>
                <MaterialIcons name="password" style={localStyle.iconItem} />
                <ThemedText darkColor="black">
                  {"    "}
                  Cambio de contraseña
                </ThemedText>
              </View>
            </Pressable>
            <Pressable
              style={localStyle.itemMenu}
              onPress={() => handleView(COMPONENTS_SETINGS.MY_SUBSCRIPTION)}
            >
              <View style={localStyle.itemMenuText}>
                <AntDesign name="idcard" style={localStyle.iconItem} />
                <ThemedText darkColor="black">
                  {"    "}
                  Mi subscripción
                </ThemedText>
              </View>
            </Pressable>
            <Pressable
              style={localStyle.itemMenu}
              onPress={() => handleView(COMPONENTS_SETINGS.TRAINING)}
            >
              <View style={localStyle.itemMenuText}>
                <Entypo name="folder-video" style={localStyle.iconItem} />
                <ThemedText darkColor="black">
                  {"    "}
                  Tutoriales
                </ThemedText>
              </View>
            </Pressable>
            {/*  EL APARTADO DE NOTIFICACIONES SE DEJA PARA EL SIGUIENTE RELEASE */}
            {/* <Pressable style={localStyle.itemMenu} onPress={() => {}}>
              <View style={localStyle.itemMenuText}>
                <AntDesign name="bells" style={localStyle.iconItem} />
                <ThemedText darkColor="black">
                  {"    "}
                  Notificaciones xxxx
                </ThemedText>
              </View>
            </Pressable> */}
          </View>
          <View style={localStyle.contentDivisor}>
            <Pressable
              style={localStyle.itemMenu}
              onPress={() => handleView(COMPONENTS_SETINGS.MY_COMPANY)}
            >
              <View style={localStyle.itemMenuText}>
                <MaterialIcons
                  name="work-outline"
                  style={localStyle.iconItem}
                />
                <ThemedText darkColor="black">
                  {"    "}
                  Información de negocio
                </ThemedText>
              </View>
            </Pressable>
            <Pressable
              style={localStyle.itemMenu}
              onPress={() => handleView(COMPONENTS_SETINGS.MY_LOCATION)}
            >
              <View style={localStyle.itemMenuText}>
                <Entypo name="location" style={localStyle.iconItem} />
                <ThemedText darkColor="black">
                  {"    "}
                  Mi ubicación
                </ThemedText>
              </View>
            </Pressable>
            <Pressable
              style={localStyle.itemMenu}
              onPress={() => handleView(COMPONENTS_SETINGS.TYPE_SERVICES)}
            >
              <View style={localStyle.itemMenuText}>
                <MaterialIcons name="style" style={localStyle.iconItem} />
                <ThemedText darkColor="black">
                  {"    "}
                  Tipo de servicios
                </ThemedText>
              </View>
            </Pressable>
            <Pressable
              style={localStyle.itemMenu}
              onPress={() => handleView(COMPONENTS_SETINGS.SERVICES_CATALOG)}
            >
              <View style={localStyle.itemMenuText}>
                <FontAwesome5
                  name="clipboard-list"
                  style={localStyle.iconItem}
                />
                <ThemedText darkColor="black">
                  {"    "}
                  Catalogo de servicios
                </ThemedText>
              </View>
            </Pressable>
            <Pressable
              style={localStyle.itemMenu}
              onPress={() => handleView(COMPONENTS_SETINGS.PORFTOLIO_SERVICES)}
            >
              <View style={localStyle.itemMenuText}>
                <MaterialCommunityIcons
                  name="book-open-page-variant-outline"
                  style={localStyle.iconItem}
                />
                <ThemedText darkColor="black">
                  {"    "}
                  Portafolio de servicios
                </ThemedText>
              </View>
            </Pressable>
          </View>
          <View style={localStyle.contentDivisor}>
            <Pressable
              style={localStyle.itemMenu}
              onPress={() => setOpenModalLogout(true)}
            >
              <View style={localStyle.itemMenuText}>
                <MaterialIcons name="logout" style={localStyle.iconItem} />
                <ThemedText darkColor="black">
                  {"    "}
                  Cerrar sesion
                </ThemedText>
              </View>
            </Pressable>
          </View>
          <View style={localStyle.contentDivisor}>
            <Pressable
              style={localStyle.itemMenu}
              onPress={() => setOpenModalDeleteAccount((v) => !v)}
            >
              <View style={localStyle.itemMenuText}>
                <AntDesign
                  name="delete"
                  style={{
                    ...localStyle.iconItem,
                    color: ThemeColorsSthetic.dangerColor,
                  }}
                />
                <ThemedText darkColor="black">
                  {"    "}
                  Eliminar cuenta
                </ThemedText>
              </View>
            </Pressable>
          </View>
          {/* <UploadOptionPictureModal
            activeCamera={activeCamera}
            open={openModal}
            handleCloseModal={handleOpenModal}
          /> */}
          <ModalConfirm
            open={openModalDeleteAccount}
            title="¿Estás seguro de querer eliminar tu cuenta?"
            message="Si continúas, perderas toda la informacion asociada a esta cuenta y no podrás recuperarla, esta acción no podra revertirse."
            handleClose={() => setOpenModalDeleteAccount((v) => !v)}
            handleConfirm={handleDeleteAccount}
            textBtnConfirm="Eliminar cuenta"
            isLoading={loadingDelete}
            IconModal={
              <AntDesign
                name="warning"
                size={35}
                color={ThemeColorsSthetic.dangerColor}
              />
            }
          />
          <ModalConfirm
            open={openModaloLogout}
            title={"Cerrar sesión"}
            message={"¿Quieres cerrar la sesión de tu cuenta?"}
            handleClose={() => setOpenModalLogout((v) => !v)}
            handleConfirm={logoutSession}
            textBtnConfirm="Cerrar sesión"
            IconModal={
              <MaterialIcons
                name="logout"
                size={35}
                color={ThemeColorsSthetic.accentReverse}
              />
            }
          />
        </View>
      )}
    </View>
  );
}

const localStyle = StyleSheet.create({
  contentDivisor: {
    borderTopColor: GlobalColors.grayLigthColor,
    borderTopWidth: 1,
  },
  itemMenuText: { flexDirection: "row", alignItems: "center" },
  itemMenu: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
  },
  iconItem: {
    color: ThemeColorsSthetic.accentReverse,
    marginLeft: 15,
    fontSize: 22,
  },
  contentHeader: {
    height: 100,
    backgroundColor: ThemeColorsSthetic.backgroundStrong,
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50, // Hace que la imagen sea circular
  },
  avatarMeredith: {
    width: 80,
    height: 80,
    borderRadius: 50, // Hace que la imagen sea circular
  },
  name: {
    ...TextStyle.bold,
    fontSize: Platform.OS === PLATFORM_TYPE.IOS ? 17 : 20,
    color: ThemeColorsSthetic.textOre,
  },
});
