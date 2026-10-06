# Guia para crear este proyecto React Native con Expo + pnpm

Esta guia explica como crear un proyecto identico a **mi-app** desde cero, usando **pnpm** como gestor de paquetes y **Expo Router** para la navegacion.

---

## 1. Requisitos previos

| Herramienta | Version recomendada | Como instalar |
|---|---|---|
| Node.js | 20.x o superior | https://nodejs.org |
| pnpm | 9.x o superior | `npm i -g pnpm` |
| Git | reciente | https://git-scm.com |
| Expo Go (opcional) | ultima del store | iOS / Android |

Verifica las versiones:

```bash
node -v
pnpm -v
```

---

## 2. Crear el proyecto con la plantilla oficial de tabs

Expo incluye una plantilla oficial llamada **tabs** que genera exactamente la estructura de este proyecto.

```bash
pnpm create expo-app@latest mi-app --template tabs
cd mi-app
```

Esto crea una carpeta `mi-app/` con:

- Expo SDK 57
- Expo Router con pestañas
- TypeScript preconfigurado
- Alias `@/*` para imports

### Si no quieres la plantilla de tabs (proyecto en blanco)

```bash
pnpm create expo-app@latest mi-app
```

Y luego agregar Expo Router manualmente (ver seccion 5).

---

## 3. Instalar dependencias del template

El template ya trae casi todo, pero las dependencias clave son:

```bash
pnpm install
```

Dependencias principales (ya en `package.json`):

| Paquete | Para que sirve |
|---|---|
| `expo` (~57.0) | SDK base de Expo |
| `expo-router` (~57.0) | Navegacion basada en archivos |
| `react` (19.2) | Biblioteca de UI |
| `react-native` (0.86) | Runtime nativo |
| `react-native-reanimated` | Animaciones de alto rendimiento |
| `react-native-safe-area-context` | Manejo de areas seguras (notch, etc.) |
| `react-native-screens` | Pantallas nativas de navegacion |
| `expo-symbols` | Iconos SF Symbols (iOS) / Material (Android) |
| `expo-font` | Carga de fuentes personalizadas |
| `expo-linking` | Deep links |
| `expo-constants` | Constantes del sistema |
| `expo-splash-screen` | Pantalla de carga inicial |
| `expo-status-bar` | Control de la barra de estado |
| `expo-web-browser` | Navegador in-app |
| `react-native-web` | Compatibilidad web |
| `react-native-worklets` | Soporte para worklets en reanimated |

> **Importante**: Para agregar nuevas dependencias nativas usa siempre `pnpm dlx expo install <paquete>`. Esto resuelve versiones compatibles con el SDK.

---

## 4. Estructura de carpetas del proyecto

```
mi-app/
├── app/                          # Pantallas (rutas)
│   ├── _layout.tsx               # Layout raiz (Stack)
│   ├── (tabs)/                   # Grupo de tabs
│   │   ├── _layout.tsx           # Layout de las tabs (Tabs)
│   │   ├── index.tsx             # Tab 1 (Home)
│   │   └── lista.tsx             # Tab 2 (Lista)
│   ├── +html.tsx                 # HTML base para web
│   └── +not-found.tsx            # Pantalla 404
├── components/                   # Componentes reutilizables
│   ├── Themed.tsx                # Text y View con tema claro/oscuro
│   ├── EditScreenInfo.tsx        # Componente auxiliar de edicion
│   ├── ExternalLink.tsx          # Wrapper para links externos
│   ├── StyledText.tsx            # Textos estilizados predefinidos
│   ├── useColorScheme.ts         # Hook de tema del sistema
│   ├── useColorScheme.web.ts     # Variante para web
│   ├── useClientOnlyValue.ts     # Valor solo en cliente (web/SSR)
│   └── useClientOnlyValue.web.ts # Variante web
├── constants/                    # Constantes globales
│   └── Colors.ts               # Paleta de colores por tema
├── assets/                       # Imagenes, fuentes, splash
│   ├── fonts/                    # Fuentes personalizadas
│   └── images/                   # Iconos, splash, favicon
├── app.json                      # Configuracion de Expo
├── tsconfig.json                 # Configuracion de TypeScript
├── expo-env.d.ts                 # Tipos del entorno Expo
├── package.json                  # Dependencias y scripts
└── pnpm-lock.yaml                # Lockfile de pnpm
```

---

## 5. Que hace cada archivo importante

### `app/_layout.tsx` (layout raiz)

Define el navegador raiz de toda la app. En este proyecto es un **Stack**:

```tsx
<Stack>
  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
</Stack>
```

Las pantallas definidas aqui son accesibles desde cualquier punto con `router.push('/ruta')`.

### `app/(tabs)/_layout.tsx` (layout de pestañas)

Configura el navegador de pestañas. Cada `<Tabs.Screen>` es una pestaña:

```tsx
<Tabs>
  <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ... }} />
  <Tabs.Screen name="lista" options={{ title: 'Lista', tabBarIcon: ... }} />
</Tabs>
```

- El `name` debe coincidir con el nombre del archivo en `app/(tabs)/`.
- El `(tabs)` entre parentesis indica que es un **grupo de rutas** y no aparece en la URL.

### `app/(tabs)/index.tsx` y `app/(tabs)/lista.tsx`

Cada archivo `.tsx` dentro de `app/` es una pantalla. La pantalla se exporta por **default**:

```tsx
export default function HomeScreen() {
  return <View>...</View>;
}
```

### `components/Themed.tsx`

`Text` y `View` que cambian automaticamente segun el tema (claro/oscuro). Ejemplo:

```tsx
<Text style={styles.title}>Hola</Text>
```

### `constants/Colors.ts`

Define los colores para tema claro y oscuro:

```ts
export default {
  light: { text: '#000', background: '#fff', tint: '#2f7be6', ... },
  dark:  { text: '#fff', background: '#000', tint: '#4dabff', ... },
};
```

### `tsconfig.json`

Configura TypeScript. Lo importante:

```json
"paths": { "@/*": ["./*"] }
```

Esto permite hacer `import { Text } from '@/components/Themed'` en lugar de rutas relativas largas.

### `app.json`

Configuracion de Expo: nombre, slug, icono, splash, plugins, etc.

```json
{
  "expo": {
    "name": "mi-app",
    "slug": "mi-app",
    "scheme": "miapp",
    "plugins": ["expo-router", ["expo-splash-screen", { ... }]]
  }
}
```

- **`scheme`**: protocolo deep link de la app (`miapp://...`).
- **`plugins`**: config plugins que modifican el build nativo.

---

## 6. Como correr el proyecto

```bash
# Instalar dependencias (solo la primera vez o despues de cambiar package.json)
pnpm install

# Iniciar el servidor de desarrollo
pnpm start
```

Esto abre **Expo Dev Tools** en el navegador. Desde ahi puedes:

| Accion | Comando |
|---|---|
| Abrir en iOS simulator (macOS) | `pnpm ios` |
| Abrir en Android emulator | `pnpm android` |
| Abrir en navegador web | `pnpm web` |
| Escanear QR con Expo Go | `pnpm start` y escanear QR |

Para abrir en tu telefono fisico:

1. Instala **Expo Go** desde la App Store o Play Store.
2. Asegurate de que tu PC y telefono esten en la misma red Wi-Fi.
3. Escanea el QR que aparece al correr `pnpm start`.

---

## 7. Como agregar una pantalla nueva

Supongamos que quieres una pantalla **Perfil** como tercer tab.

### Paso 1: Crear el archivo

Crea `app/(tabs)/perfil.tsx`:

```tsx
import { View } from 'react-native';
import { Text } from '@/components/Themed';

export default function PerfilScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Mi Perfil</Text>
    </View>
  );
}
```

### Paso 2: Registrar la tab

Edita `app/(tabs)/_layout.tsx` y agrega:

```tsx
<Tabs.Screen
  name="perfil"
  options={{
    title: 'Perfil',
    tabBarIcon: ({ color }) => (
      <SymbolView
        name={{ ios: 'person.fill', android: 'person', web: 'person' }}
        tintColor={color}
        size={28}
      />
    ),
  }}
/>
```

### Paso 3: Reiniciar Metro

Si la nueva ruta no aparece, presiona `r` en la terminal de Metro para recargar, o reinicia con `pnpm start --clear`.

---

## 8. Navegacion con expo-router

`expo-router` usa el sistema de archivos como rutas. Algunas APIs utiles:

### Navegar a otra pantalla

```tsx
import { router } from 'expo-router';

router.push('/lista');   // Navega y permite volver atras
router.replace('/lista'); // Reemplaza la pantalla actual
router.back();           // Vuelve a la anterior
```

### Crear un link estatico

```tsx
import { Link } from 'expo-router';

<Link href="/lista">Ir a lista</Link>
```

### Leer parametros de la URL

```tsx
import { useLocalSearchParams } from 'expo-router';

const { id } = useLocalSearchParams<{ id: string }>();
```

### Estructura de rutas con grupos

- `app/index.tsx` → ruta `/`
- `app/ajustes.tsx` → ruta `/ajustes`
- `app/(tabs)/index.tsx` → ruta `/` (el grupo `(tabs)` no aparece)
- `app/(tabs)/perfil.tsx` → ruta `/perfil`

Los grupos (entre parentesis) organizan el codigo sin afectar la URL.

---

## 9. Estilos con StyleSheet.create

Crea estilos separados del JSX para mejor rendimiento:

```tsx
import { StyleSheet, View, Text } from 'react-native';

export default function MiPantalla() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Hola mundo</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
});
```

### Tema claro / oscuro

Usa los componentes tematizados:

```tsx
import { Text, View } from '@/components/Themed';

<View>
  <Text>Se adapta al tema del sistema</Text>
</View>
```

---

## 10. Verificacion de codigo

```bash
# Typecheck (TypeScript)
pnpm exec tsc --noEmit

# Lint
pnpm exec expo lint

# Diagnosticar problemas de dependencias
pnpm dlx expo-doctor

# Arreglar versiones incompatibles automaticamente
pnpm dlx expo install --fix
```

Corre ambos (`tsc` y `lint`) antes de hacer commit.

---

## 11. Troubleshooting comun

### "No bundle URL present"

- Asegurate de que Metro este corriendo (`pnpm start`).
- Verifica que telefono y PC esten en la misma red.
- Si usas Android emulator, presiona `a` en la terminal de Metro.

### Cambios en archivos no se reflejan

- Presiona `r` en Metro (recargar).
- Si persiste, limpia cache: `pnpm start --clear`.

### Error "Unable to resolve module"

- Deten Metro.
- Borra `node_modules/` y `pnpm-lock.yaml`.
- Corre `pnpm install` de nuevo.
- Reinicia Metro.

### Warnings de "experimental" o "deprecated"

- Confirma que la version de Expo Router coincida con el SDK.
- Consulta la documentacion oficial: https://docs.expo.dev/versions/latest/

### Error de TypeScript con alias `@/`

- Verifica que `tsconfig.json` tenga:
  ```json
  "paths": { "@/*": ["./*"] }
  ```

---

## 12. Siguientes pasos

Una vez que el proyecto funciona, puedes:

- Agregar **datos remotos** con `fetch` o React Query.
- Persistir datos con `AsyncStorage` (`pnpm dlx expo install @react-native-async-storage/async-storage`).
- Agregar **autenticacion** con Expo Auth Session.
- Empaquetar para produccion con **EAS Build** (`pnpm dlx eas-cli build`).
- Publicar OTA updates con `pnpm dlx eas-cli update`.

Documentacion oficial: https://docs.expo.dev