import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { functionServicesType } from "../types";
import SubHeaderReturn from "@/components/Shared/SubHeaderReturn";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
import { apiTypeService } from "@/api/TypeService";
import Checkbox from "expo-checkbox";
import { ThemedText } from "@/components/ThemedText";
import { selectOptionType } from "@/constants/GeneralTypes";
import {
  ButtonGeneralStyle,
  InputStyle,
  TextStyle,
} from "@/constants/StyleComponents";
import { ErrorAlertMessage } from "@/components/Shared/Notifications/AlertMessage";
import { useNotificationProvider } from "@/provider/NotificationProvider";
import { TYPE_STATUS } from "@/constants/Constants";
import LoadingView from "@/components/Shared/LoadingView";
import { ThemeColorsSthetic } from "@/constants/Colors";
import GeneralButton from "@/components/Shared/GeneralButton";

export const TypeServices = ({ returnBack, idUser }: functionServicesType) => {
  const { handleNotification } = useNotificationProvider();
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);
  const [generalDescription, setGeneralDescription] = useState("");

  const { data: listCatalogType = [], isPending: isPendingCatalogType } =
    useQuery({
      queryKey: [
        REACT_QUERY_KEYS.catalogs.typeServices.getAll("config-type-service"),
      ],
      queryFn: () => apiTypeService.getAll(),
      ...{
        select: (data: ResponseAPi) => data.data.items,
      },
    });

  const { data: descriptionService = [], isPending: isPendingByUser } =
    useQuery({
      queryKey: [
        REACT_QUERY_KEYS.catalogs.typeServices.getByUser(idUser as string),
      ],
      queryFn: () => apiTypeService.getByUser(idUser),
      ...{
        select: (data: ResponseAPi) => data.data.items,
      },
    });

  const { mutate: saveTypeServices } = useMutation({
    mutationFn: (data: any) => apiTypeService.saveTypeServiceByUser(data),
    onSuccess: (data: ResponseAPi) => handleSuccessSaveTypeServices(data.data),
    onError: (error) => ErrorAlertMessage,
  });

  const handleSuccessSaveTypeServices = (data: ObjectResponse) => {
    if (data.error)
      return handleNotification({
        type: TYPE_STATUS.ERROR,
        message: data.message,
      });

    handleNotification({
      type: TYPE_STATUS.SUCCESS,
      message: "Se guarda los registros con éxito",
    });
    returnBack();
  };

  useEffect(() => {
    if (descriptionService) {
      setGeneralDescription(
        descriptionService?.descriptionService?.generalDescription
      );
      if (descriptionService?.listType?.length > 0) {
        const keysByUser = [];
        const arrItems = descriptionService.listType;
        for (let i = 0; i < arrItems.length; i++) {
          keysByUser.push(arrItems[i]?.idTypeService);
        }
        setSelectedKeys(keysByUser);
      }
    }
  }, [descriptionService]);

  const isPendingLoad = useMemo(
    () => isPendingByUser || isPendingCatalogType,
    [isPendingByUser, isPendingCatalogType]
  );

  const disabledBtn = useMemo(
    () => selectedKeys.length === 0 || !generalDescription,
    [selectedKeys, generalDescription]
  );

  const listOption = useMemo(
    () =>
      listCatalogType.length > 0
        ? listCatalogType
            .map((item: any) => {
              let checked = false;

              for (let i = 0; i < selectedKeys.length; i++) {
                if (selectedKeys[i] === item?.id) checked = true;
              }

              return {
                key: item?.id,
                value: item?.typeServiceNameEs,
                checked,
                descriptionEs: item?.descriptionEs,
              };
            })
            .sort(function (a: selectOptionType, b: selectOptionType) {
              if (a.checked !== b.checked) {
                return a.checked ? -1 : 1;
              }
              if (a.value) return a.value.localeCompare(b.value);
              return a;
            })
        : [],
    [listCatalogType, selectedKeys]
  );

  const handleSelectItem = (id: number) => {
    const keysList = selectedKeys;
    if (keysList.includes(id)) {
      const newKeyList = keysList.filter((item) => item !== id);
      setSelectedKeys(newKeyList);
    } else {
      setSelectedKeys((keys) => [...keys, id]);
    }
  };

  const handleSaveTypeServices = () => {
    saveTypeServices({
      idUser,
      idsType: selectedKeys.toString(),
      generalDescription,
    });
  };

  return (
    <View>
      <SubHeaderReturn subtitle="Tipo de servicios" handleReturn={returnBack} />
      <View style={{ width: "90%", marginHorizontal: "auto", paddingTop: 10 }}>
        <ThemedText style={localStyle.label}>
          Agrega una breve descripción del servicio que realizas
        </ThemedText>
        <TextInput
          style={{ ...InputStyle.withBorder, ...InputStyle.bigBox }}
          onChangeText={setGeneralDescription}
          value={generalDescription}
          multiline
          numberOfLines={6}
        />
      </View>
      {isPendingLoad ? (
        <LoadingView />
      ) : (
        <View style={{ width: "90%", marginHorizontal: "auto" }}>
          <View>
            <View style={localStyle.textDescription}>
              <ThemedText style={localStyle.label}>
                Debe seleccionar al menos un tipo de servicio que ofrece
              </ThemedText>
            </View>
            <ScrollView style={{ height: "52%" }}>
              {listOption.map((item: selectOptionType) => {
                return (
                  <TouchableOpacity
                    onPress={() => handleSelectItem(item.key as number)}
                    key={item.key}
                    style={localStyle.contentElement}
                  >
                    <Checkbox value={item.checked} />
                    <View>
                      <ThemedText style={TextStyle.fontBoldDark}>
                        {"   "}
                        {item.value}
                      </ThemedText>
                      <ThemedText style={localStyle.descriptionType}>
                        {item.descriptionEs}
                      </ThemedText>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
          <View style={localStyle.contentBtn}>
            <GeneralButton
              styleBtn={
                !disabledBtn
                  ? ButtonGeneralStyle.btnUpdateSthetic
                  : ButtonGeneralStyle.btnDisabledSthetic
              }
              textBtn="Guardar"
              styleText={{
                color: !disabledBtn
                  ? ThemeColorsSthetic.textLight
                  : ThemeColorsSthetic.muted,
              }}
              handleOnPress={handleSaveTypeServices}
              disabledBtn={disabledBtn}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const localStyle = StyleSheet.create({
  textDescription: {
    paddingLeft: 10,
    marginVertical: 20,
  },
  contentElement: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
  },
  label: {
    ...TextStyle.bold,
    color: ThemeColorsSthetic.textLabels,
    marginBottom: 10,
  },
  listValue: {
    color: ThemeColorsSthetic.text,
  },
  descriptionType: {
    color: ThemeColorsSthetic.muted,
    fontSize: 15,
  },
  contentBtn: { marginTop: 20, paddingHorizontal: 20 },
});

export default TypeServices;
