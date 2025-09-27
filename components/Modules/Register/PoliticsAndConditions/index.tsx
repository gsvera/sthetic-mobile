import { ThemedText } from "@/components/ThemedText";
import { ScrollView, StyleSheet, View } from "react-native";
import Checkbox from "expo-checkbox";
import { ThemeColorsSthetic } from "@/constants/Colors";
import { TextStyle } from "@/constants/StyleComponents";

type PoliticstAndConditionsProps = {
  stateCheck: boolean;
  handleAgreeTerms: (isChecked: boolean) => void;
};

export default function PoliticsAndConditions({
  stateCheck,
  handleAgreeTerms,
}: PoliticstAndConditionsProps) {
  return (
    <View style={localStyles.contentPolitics}>
      <ScrollView style={localStyles.contentText}>
        <View style={localStyles.contentSubtitle}>
          <ThemedText type="title" style={localStyles.title}>
            POLÍTICA DE PRIVACIDAD
          </ThemedText>
        </View>
        <ThemedText style={localStyles.textDate}>
          Fecha de última actualización: 27 de Septiembre de 2025
        </ThemedText>
        <ThemedText style={localStyles.text}>
          En Meredith Aesthetic, la privacidad de nuestros usuarios es una
          prioridad. Esta Política de Privacidad describe cómo recolectamos,
          usamos, almacenamos y protegemos tus datos personales, conforme a lo
          establecido en la Ley Federal de Protección de Datos Personales en
          Posesión de los Particulares (LFPDPPP).
        </ThemedText>
        <View>
          <ThemedText style={localStyles.subtitle}>
            1. Responsable del tratamiento de datos
          </ThemedText>
          <ThemedText style={localStyles.text}>
            Meredith Aesthetic es responsable del uso y protección de tus datos
            personales. Puedes contactarnos en: meredith.abasotech@gmail.com
          </ThemedText>
        </View>
        <View>
          <ThemedText style={localStyles.subtitle}>
            2. Datos personales que recolectamos
          </ThemedText>
          <ThemedText style={localStyles.text}>
            Recolectamos los siguientes datos:
          </ThemedText>
          <ThemedText style={localStyles.textList}>
            * Nombre completo
          </ThemedText>
          <ThemedText style={localStyles.textList}>
            * Correo electrónico
          </ThemedText>
          <ThemedText style={localStyles.textList}>
            * Número telefónico
          </ThemedText>
          <ThemedText style={localStyles.textList}>* Foto de perfil</ThemedText>
          <ThemedText style={localStyles.textList}>
            * Ubicación aproximada (si el usuario da consentimiento)
          </ThemedText>
          <ThemedText style={{ ...localStyles.textList, marginBottom: 15 }}>
            * Información de uso de la app (navegación, tiempo de uso, etc.)
          </ThemedText>
        </View>
        <View>
          <ThemedText style={localStyles.subtitle}>
            3. Finalidades del tratamiento
          </ThemedText>
          <ThemedText style={localStyles.text}>
            Usamos tus datos personales para:
          </ThemedText>
          <ThemedText style={localStyles.textList}>
            * Crear y mostrar tu perfil a otros usuarios dentro de la app,
            incluyendo tu nombre, foto de perfil y servicios ofrecidos (en caso
            de ser proveedor). Al subir tu foto, aceptas que esta imagen sea
            visible para otros usuarios dentro de la app como parte de tu perfil
            público. Puedes modificarla o eliminarla en cualquier momento desde
            tu configuración. La imagen será utilizada únicamente con fines de
            identificación y visibilidad dentro de la plataforma, conforme a
            nuestra [Política de Privacidad].
          </ThemedText>
          <ThemedText style={localStyles.textList}>
            * Facilitar la contratación de servicios entre usuarios
          </ThemedText>
          <ThemedText style={localStyles.textList}>
            * Procesar pagos (a través de terceros)
          </ThemedText>
          <ThemedText style={localStyles.textList}>
            * Enviar notificaciones relevantes (como recordatorios de citas o
            cambios en el servicio)
          </ThemedText>
          <ThemedText style={localStyles.textList}>
            * Realizar análisis estadístico, de marketing y publicidad interna
          </ThemedText>
          <ThemedText style={{ ...localStyles.textList, marginBottom: 15 }}>
            * Mejorar la experiencia del usuario.
          </ThemedText>
        </View>
        <View>
          <ThemedText style={localStyles.subtitle}>
            4. Transferencia de datos
          </ThemedText>
          <ThemedText style={localStyles.text}>
            No compartimos tus datos personales con terceros sin tu
            consentimiento, excepto cuando:
          </ThemedText>
          <ThemedText style={localStyles.textList}>
            * Sea requerido por ley o autoridades
          </ThemedText>
          <ThemedText style={{ ...localStyles.textList, marginBottom: 15 }}>
            * Sea necesario para prestar nuestros servicios a través de
            proveedores de confianza (como servicios de pago, alojamiento en la
            nube, etc.)
          </ThemedText>
        </View>
        <View>
          <ThemedText style={localStyles.subtitle}>5. Derechos ARCO</ThemedText>
          <ThemedText style={localStyles.text}>
            Tienes derecho a acceder, rectificar, cancelar u oponerte al uso de
            tus datos personales (derechos ARCO). Para ejercerlos, envía una
            solicitud a: meredith.abasotech@gmail.com
          </ThemedText>
        </View>
        <View>
          <ThemedText style={localStyles.subtitle}>
            6. Uso de tecnologías de rastreo
          </ThemedText>
          <ThemedText style={localStyles.text}>
            Podemos utilizar herramientas como cookies o identificadores de
            dispositivo para:
          </ThemedText>
          <ThemedText style={localStyles.textList}>
            * Analizar el uso de la aplicación.
          </ThemedText>
          <ThemedText style={{ ...localStyles.textList, marginBottom: 15 }}>
            * Personalizar tu experiencia. Puedes desactivarlas en la
            configuración de tu dispositivo, pero esto podría limitar algunas
            funcionalidades.
          </ThemedText>
        </View>
        <View>
          <ThemedText style={localStyles.subtitle}>
            7. Información de menores de edad
          </ThemedText>
          <ThemedText style={localStyles.text}>
            Meredith no está dirigida a menores de 18 años. No recolectamos
            intencionalmente datos de menores. Si detectamos un registro de un
            menor, eliminaremos su información inmediatamente.
          </ThemedText>
        </View>
        <View>
          <ThemedText style={localStyles.subtitle}>
            8. Seguridad de los datos
          </ThemedText>
          <ThemedText style={localStyles.text}>
            Implementamos medidas técnicas y administrativas para proteger tu
            información personal, incluyendo cifrado y acceso restringido.
          </ThemedText>
          <ThemedText style={localStyles.text}>
            Sin embargo, ningún sistema es 100% seguro, por lo que recomendamos
            mantener tu información de acceso de forma confidencial.
          </ThemedText>
        </View>
        <View>
          <ThemedText style={localStyles.subtitle}>
            9. Información de pago
          </ThemedText>
          <ThemedText style={localStyles.text}>
            Los pagos son procesados mediante plataformas externas como{" "}
            <ThemedText style={TextStyle.fontBoldDark}>Stripe</ThemedText>.{" "}
            <ThemedText style={TextStyle.fontBoldDark}>
              Meredith Aesthetic
            </ThemedText>{" "}
            no almacena información de tarjetas de crédito, cuentas bancarias ni
            otros datos financieros sensibles.
          </ThemedText>
          <ThemedText style={localStyles.text}>
            Te sugerimos revisar las políticas de privacidad de dichos servicios
            para más información.
          </ThemedText>
        </View>
        <View>
          <ThemedText style={localStyles.subtitle}>
            10. Cambios en esta política
          </ThemedText>
          <ThemedText style={localStyles.text}>
            Nos reservamos el derecho de modificar esta política. Las
            actualizaciones estarán disponibles dentro de la app o en nuestro
            sitio web. Si los cambios son importantes, te los notificaremos de
            forma destacada.
          </ThemedText>
        </View>
        <View style={{ ...localStyles.contentSubtitle, marginTop: 20 }}>
          <ThemedText type="title" style={localStyles.title}>
            AVISO LEGAL / TÉRMINOS Y CONDICIONES
          </ThemedText>
        </View>
        <View>
          <ThemedText style={localStyles.textDate}>
            Fecha de última actualización: 27 de Septiembre de 2025
          </ThemedText>
        </View>
        <View>
          <ThemedText style={localStyles.subtitle}>1. Aceptación</ThemedText>
          <ThemedText style={localStyles.text}>
            Al utilizar Meredith Aesthetic, aceptas estos términos y
            condiciones. Si no estás de acuerdo, no uses la aplicación.
          </ThemedText>
        </View>
        <View>
          <ThemedText style={localStyles.subtitle}>2. Uso de la app</ThemedText>
          <ThemedText style={localStyles.text}>
            La app sirve como plataforma de contacto entre profesionales y
            clientes. Meredith Aesthetic{" "}
            <ThemedText style={TextStyle.fontBoldDark}>
              no garantiza:
            </ThemedText>
          </ThemedText>
          <ThemedText style={localStyles.textList}>
            * La calidad de los servicios contratados
          </ThemedText>
          <ThemedText style={localStyles.textList}>
            * Que se llegue a acuerdos entre usuarios
          </ThemedText>
          <ThemedText style={{ ...localStyles.textList, marginBottom: 15 }}>
            * Resultados específicos de uso
          </ThemedText>
        </View>
        <View>
          <ThemedText style={localStyles.subtitle}>
            3. Obligaciones del usuario
          </ThemedText>
          <ThemedText style={localStyles.text}>
            El usuario se compromete a:
          </ThemedText>
          <ThemedText style={localStyles.textList}>
            * Proporcionar información veraz y actualizada
          </ThemedText>
          <ThemedText style={localStyles.textList}>
            * Usar la app de forma lícita y respetuosa
          </ThemedText>
          <ThemedText style={{ ...localStyles.textList, marginBottom: 15 }}>
            * No suplantar identidad ni subir contenido ofensivo o ilegal
          </ThemedText>
        </View>
        <View>
          <ThemedText style={localStyles.subtitle}>
            4. Propiedad intelectual
          </ThemedText>
          <ThemedText style={localStyles.text}>
            Todos los contenidos, marcas, logos y software de MeCare son
            propiedad de sus respectivos dueños. Está prohibido copiar,
            distribuir o modificar sin autorización expresa.
          </ThemedText>
        </View>
        <View>
          <ThemedText style={localStyles.subtitle}>
            5. Limitación de responsabilidad
          </ThemedText>
          <ThemedText style={localStyles.text}>
            Meredith Aesthetic no se hace responsable por:
          </ThemedText>
          <ThemedText style={localStyles.textList}>
            * Acuerdos o conflictos entre usuarios
          </ThemedText>
          <ThemedText style={localStyles.textList}>
            * Daños derivados del uso de la app
          </ThemedText>
          <ThemedText style={{ ...localStyles.textList, marginBottom: 15 }}>
            * Fallos técnicos fuera de su control
          </ThemedText>
        </View>
        <View>
          <ThemedText style={localStyles.subtitle}>6. Pagos</ThemedText>
          <ThemedText style={localStyles.text}>
            Los usuarios tipo proveedor deberán pagar una suscripción
            mensualpara acceder a funciones avanzadas. Los pagos se realizan
            mediante servicios de terceros como{" "}
            <ThemedText style={TextStyle.fontBoldDark}>Stripe</ThemedText>.
          </ThemedText>
          <ThemedText style={localStyles.text}>
            Meredith Aesthetic{" "}
            <ThemedText style={TextStyle.fontBoldDark}>
              no almacena ni procesa directamente información bancaria o de
              tarjetas.
            </ThemedText>{" "}
            Cualquier inconveniente con el proceso de pago debe ser tratado
            directamente con el proveedor del servicio de cobro.
          </ThemedText>
        </View>
        <View>
          <ThemedText style={localStyles.subtitle}>
            7. Cancelaciones y reembolsos
          </ThemedText>
          <ThemedText style={localStyles.text}>
            Las suscripciones no son reembolsables, salvo en casos excepcionales
            evaluados individualmente. Para solicitar revisión, escríbenos a:
            meredith.abasotech@gmail.com
          </ThemedText>
        </View>
        <View>
          <ThemedText style={localStyles.subtitle}>
            6. Modificaciones
          </ThemedText>
          <ThemedText style={localStyles.text}>
            Podemos actualizar estos términos en cualquier momento. Te
            informaremos dentro de la app cuando haya cambios significativos.
          </ThemedText>
        </View>
        <View>
          <ThemedText style={localStyles.subtitle}>
            9. Legislación aplicable
          </ThemedText>
          <ThemedText style={localStyles.text}>
            Este acuerdo se rige por las leyes aplicables en los Estados Unidos
            Mexicanos. Cualquier disputa será resuelta en los tribunales
            competentes de Cancún, Quintana Roo.
          </ThemedText>
        </View>
      </ScrollView>
      <View style={localStyles.contentCheck}>
        <Checkbox
          value={stateCheck}
          onValueChange={(even) => handleAgreeTerms(even)}
        />
        <ThemedText style={localStyles.textAgree}>
          Aceptar terminos y condiciones
        </ThemedText>
      </View>
    </View>
  );
}

export const localStyles = StyleSheet.create({
  contentPolitics: {
    paddingTop: 15,
  },
  contentSubtitle: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    color: ThemeColorsSthetic.textTitle,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: ThemeColorsSthetic.text,
    fontWeight: "bold",
  },
  text: {
    color: ThemeColorsSthetic.text,
    marginBottom: 10,
    textAlign: "justify",
  },
  textList: {
    color: ThemeColorsSthetic.text,
    textAlign: "justify",
    marginLeft: 15,
    marginBottom: 4,
    fontSize: 15,
  },
  textDate: {
    fontSize: 15,
    color: ThemeColorsSthetic.text,
    marginBottom: 15,
    textDecorationLine: "underline",
  },
  textAgree: {
    color: ThemeColorsSthetic.textLabels,
    fontWeight: "bold",
    marginLeft: 10,
  },
  contentText: {
    width: "85%",
    height: "75%",
    marginHorizontal: "auto",
    marginBottom: 15,
  },
  contentCheck: {
    flexDirection: "row",
    alignItems: "center",
    width: "85%",
    marginHorizontal: "auto",
  },
});
