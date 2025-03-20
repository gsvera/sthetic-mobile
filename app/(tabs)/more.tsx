import { View, StyleSheet, Pressable, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { GlobalColors } from "@/constants/Colors";
import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";
import {
  ErrorAlertMessage,
  PromtConfirm,
} from "@/components/Shared/Notifications/AlertMessage";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiUser } from "@/api/User";
import {
  getStoreSession,
  KEY_STORE,
  setStoreSession,
} from "@/hooks/StoreDataSecure";
import { useNavigation } from "expo-router";
import { useApiProvider } from "@/provider/InterceptorProvider";
import { useMemo, useState } from "react";
import { COMPONENTS_SETINGS } from "@/constants/Constants";
import PersonalInformation, {
  formPersonalInformation,
} from "@/components/Modules/Settings/PersonaleInformation";
import { Image } from "react-native";
import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
import ChangePassword from "@/components/Modules/Settings/ChangePassword";
import MyLocation from "@/components/Modules/Settings/MyLocation";
import { Camera } from "expo-camera";
import CameraCustom from "@/components/Modules/Settings/CameraCustom";
import UploadOptionPictureModal from "@/components/Shared/UploadOptionPictureModal";
import { UserType } from "@/utils/types";
import ServicesCatalog from "@/components/Modules/Settings/ServicesCatalog";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import TypeServices from "@/components/Modules/Settings/TypeServices";

export default function More() {
  const navigation = useNavigation();
  const { setToken } = useApiProvider();
  const [viewComponent, setViewComponent] = useState<string>();
  // const [openModal, setOpenModal] = useState(false);

  const { data: dataUser, isFetching: loadingData } = useQuery({
    queryKey: [REACT_QUERY_KEYS.user.getDataUser("personal-information")],
    queryFn: () => apiUser.getDataUser(),
    ...{
      select: (data: ResponseAPi) => data.data.items,
    },
  });

  const { mutate: logoutSession } = useMutation({
    mutationFn: () => apiUser.logout(),
    onSuccess: (data: ResponseAPi) => handleSuccessLogout(data),
    onError: (err) => handleErrorLogout(err),
  });

  const handleSuccessLogout = async (data: ResponseAPi) => {
    if (!data.data.error) {
      setToken(null);
      await setStoreSession({ key: KEY_STORE.userToken, value: "" });
      navigation.navigate("login" as never);
    }
  };

  const handleErrorLogout = (err: any) => {
    ErrorAlertMessage();
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
          <MyLocation returnBack={() => handleView("")} idUser={dataUser?.id} />
        );
      case COMPONENTS_SETINGS.PROFILE_PICTURE:
        return (
          <CameraCustom
            returnBack={() => handleView("")}
            idUser={dataUser?.id}
          />
        );
      case COMPONENTS_SETINGS.TYPE_SERVICES:
        return <TypeServices returnBack={() => handleView("")} />;
      case COMPONENTS_SETINGS.SERVICES_CATALOG:
        return <ServicesCatalog returnBack={() => handleView("")} />;
      default:
        return <View></View>;
    }
  };

  // const handleOpenModal = () => {
  //   setOpenModal((v) => !v);
  // };

  const activeCamera = () => {
    handleView(COMPONENTS_SETINGS.PROFILE_PICTURE);
  };

  const handleLogout = () => {
    PromtConfirm({
      title: "Cerrar sesión",
      message: "¿Quieres salir de tu cuenta?",
      textBtnCancel: "Cancelar",
      textBtnConfirm: "Ok",
      handleConfirmAction: logoutSession,
    });
  };

  return (
    <View>
      {viewComponent ? (
        renderViewComponent(viewComponent)
      ) : (
        <View>
          <View style={localStyle.contentHeader}>
            <TouchableOpacity
              // onPress={() => handleView(COMPONENTS_SETINGS.PROFILE_PICTURE)}
              onPress={activeCamera}
            >
              <Image
                source={
                  !dataUser?.profilePictureB64
                    ? require("@/assets/images/react-logo.png")
                    : { uri: dataUser?.profilePictureB64 }
                }
                style={localStyle.avatar}
              />
            </TouchableOpacity>
            <View style={{ marginLeft: 10 }}>
              <ThemedText>Bienvenido!</ThemedText>
              <ThemedText style={{ fontWeight: "bold" }}>
                {dataUser?.firstName} {dataUser?.lastName}
              </ThemedText>
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
            <Pressable style={localStyle.itemMenu} onPress={() => {}}>
              <View style={localStyle.itemMenuText}>
                <AntDesign name="idcard" style={localStyle.iconItem} />
                <ThemedText darkColor="black">
                  {"    "}
                  Mi subscripción xxxx
                </ThemedText>
              </View>
            </Pressable>
          </View>
          <View style={localStyle.contentDivisor}>
            <Pressable style={localStyle.itemMenu} onPress={() => {}}>
              <View style={localStyle.itemMenuText}>
                <AntDesign name="bells" style={localStyle.iconItem} />
                <ThemedText darkColor="black">
                  {"    "}
                  Notificaciones xxxx
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
                <MaterialCommunityIcons
                  name="book-open-page-variant-outline"
                  style={localStyle.iconItem}
                />
                <ThemedText darkColor="black">
                  {"    "}
                  Catálogo de servicios
                </ThemedText>
              </View>
            </Pressable>
          </View>
          <View style={localStyle.contentDivisor}>
            <Pressable style={localStyle.itemMenu} onPress={handleLogout}>
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
            <Pressable style={localStyle.itemMenu} onPress={() => {}}>
              <View style={localStyle.itemMenuText}>
                <AntDesign
                  name="delete"
                  style={{
                    ...localStyle.iconItem,
                    color: GlobalColors.dangerColor,
                  }}
                />
                <ThemedText darkColor="black">
                  {"    "}
                  Eliminar cuenta xxxx
                </ThemedText>
              </View>
            </Pressable>
          </View>
          {/* <UploadOptionPictureModal
            activeCamera={activeCamera}
            open={openModal}
            handleCloseModal={handleOpenModal}
          /> */}
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
    color: GlobalColors.blackColor,
    marginLeft: 15,
    fontSize: 22,
  },
  contentHeader: {
    height: 100,
    backgroundColor: GlobalColors.pinkColor,
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50, // Hace que la imagen sea circular
  },
});
