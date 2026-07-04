// 87 reactnative topics for Study Hub.
export default [
  {
    id: "reactnative-core-components",
    category: "reactnative",
    topic: "Core",
    title: "Core components",
    difficulty: "Basic",
    summary: "View, Text, TextInput, ScrollView, FlatList, Image, Pressable",
    explanation:
      "ScrollView renders all children at once — terrible for long lists. FlatList virtualizes — only renders visible items. Use FlatList for >20 items.",
    code: "<FlatList\n  data={items}\n  keyExtractor={item => item.id}\n  renderItem={({ item }) => <Row item={item} />}\n  initialNumToRender={10}\n  maxToRenderPerBatch={5}\n  windowSize={5}\n/>",
    interviewQuestion: "When to use ScrollView vs FlatList?",
  },
  {
    id: "reactnative-stylesheet",
    category: "reactnative",
    topic: "Core",
    title: "StyleSheet",
    difficulty: "Basic",
    summary: "JS object styling — camelCase, no units",
    explanation:
      "Validates in dev, serializes style IDs across the JS-Native bridge instead of full objects — less data transfer. Styles are registered once and cached.",
    code: "const s = StyleSheet.create({\n  container: { flex: 1, padding: 16, backgroundColor: '#fff' },\n  title:     { fontSize: 20, fontWeight: '700', color: '#0f172a' },\n  // No 'px' — values are dp (density-independent pixels)\n});",
    interviewQuestion: "Why StyleSheet.create over plain objects?",
  },
  {
    id: "reactnative-flexbox-in-rn",
    category: "reactnative",
    topic: "Core",
    title: "Flexbox in RN",
    difficulty: "Intermediate",
    summary: "Same as web Flexbox but different defaults",
    explanation:
      "flexDirection defaults to 'column'. flex:1 fills available space. No display:grid — Flexbox is the only layout system. No shorthand like 1rem — numeric dp values only.",
    code: "<View style={{ flex:1, flexDirection:'row', gap:8, flexWrap:'wrap' }}>\n  <View style={{ flex:1, minWidth:120 }} />\n  <View style={{ flex:2, minWidth:200 }} />\n</View>",
    interviewQuestion: "Key differences from web Flexbox?",
  },
  {
    id: "reactnative-pressable",
    category: "reactnative",
    topic: "Core",
    title: "Pressable",
    difficulty: "Intermediate",
    summary: "Flexible touch handler replacing TouchableOpacity",
    explanation:
      "Pressable is more flexible: render prop for pressed state, hitSlop, unstable_pressDelay. TouchableOpacity is simpler but Pressable is preferred in new code.",
    code: "<Pressable\n  onPress={handlePress}\n  onLongPress={handleLong}\n  hitSlop={8}\n  style={({ pressed }) => ([\n    s.btn,\n    pressed && { opacity: 0.7 }\n  ])}\n>\n  {({ pressed }) => <Text>{pressed ? 'Holding...' : 'Press me'}</Text>}\n</Pressable>",
    interviewQuestion: "Pressable vs TouchableOpacity?",
  },
  {
    id: "reactnative-safeareaview",
    category: "reactnative",
    topic: "Core",
    title: "SafeAreaView",
    difficulty: "Basic",
    summary: "Avoids notch, status bar, home indicator",
    explanation:
      "Device dimensions and inset sizes vary significantly across models and platforms. SafeAreaView and the useSafeAreaInsets hook from react-native-safe-area-context handle all cases.",
    code: "import { SafeAreaView } from 'react-native-safe-area-context';\n// or for fine-grained:\nimport { useSafeAreaInsets } from 'react-native-safe-area-context';\nfunction Screen() {\n  const insets = useSafeAreaInsets();\n  return <View style={{ paddingTop: insets.top }}>...</View>;\n}",
    interviewQuestion: "Why not just add padding manually?",
  },
  {
    id: "reactnative-modal",
    category: "reactnative",
    topic: "Core",
    title: "Modal",
    difficulty: "Basic",
    summary: "Overlay modal dialog",
    explanation:
      "transparent:true makes background transparent — you see the content behind. Use a semi-opaque View inside for overlay effect. Without it, Modal has an opaque background.",
    code: "<Modal visible={show} transparent animationType='fade' onRequestClose={onClose}>\n  <Pressable style={s.overlay} onPress={onClose}>\n    <View style={s.sheet}>\n      <Text>Modal content</Text>\n      <Button title='Close' onPress={onClose} />\n    </View>\n  </Pressable>\n</Modal>",
    interviewQuestion: "What is the transparent prop on Modal?",
  },
  {
    id: "reactnative-react-navigation",
    category: "reactnative",
    topic: "Navigation",
    title: "React Navigation",
    difficulty: "Intermediate",
    summary: "Stack, Tab, Drawer navigators",
    explanation:
      "navigate: go to screen (no duplicate if already in stack). push: always adds new instance. replace: swap current screen. goBack: go to previous.",
    code: "// Setup\nconst Stack = createNativeStackNavigator();\n// Usage in screen\nnavigation.navigate('Profile', { userId: 42 });\nnavigation.push('Profile', { userId: 43 }); // new instance\nnavigation.replace('Home'); // replace current\nnavigation.goBack();\nnavigation.popTo('Dashboard'); // pop to specific screen",
    interviewQuestion: "navigate vs push vs replace?",
  },
  {
    id: "reactnative-passing-params",
    category: "reactnative",
    topic: "Navigation",
    title: "Passing params",
    difficulty: "Intermediate",
    summary: "Pass data between screens",
    explanation:
      "Define RootStackParamList type and use it with useNavigation<NavigationProp<...>> and useRoute<RouteProp<...>>.",
    code: "type RootStack = {\n  Home: undefined;\n  Profile: { userId: number; readOnly?: boolean };\n};\n// In screen:\nconst route = useRoute<RouteProp<RootStack, 'Profile'>>();\nconst { userId } = route.params;\nconst nav = useNavigation<NativeStackNavigationProp<RootStack>>();",
    interviewQuestion: "How do you type navigation params?",
  },
  {
    id: "reactnative-deep-linking",
    category: "reactnative",
    topic: "Navigation",
    title: "Deep linking",
    difficulty: "Advanced",
    summary: "URL schemes and universal links",
    explanation:
      "URL scheme (myapp://): any app can claim it. Universal link (https://): verified via AASA file on server — can't be spoofed, works as web URL too.",
    code: '// app.json\n{ "expo": { "scheme": "devquiz",\n  "intentFilters": [{\n    "action": "VIEW",\n    "data": [{ "scheme": "https", "host": "devquiz.app" }],\n    "category": ["BROWSABLE", "DEFAULT"]\n  }] } }\n// Linking.getInitialURL() for cold start\n// Linking.addEventListener for warm start',
    interviewQuestion: "URL scheme vs universal link?",
  },
  {
    id: "reactnative-flatlist-optimization",
    category: "reactnative",
    topic: "Performance",
    title: "FlatList optimization",
    difficulty: "Advanced",
    summary: "Virtualized list tuning",
    explanation:
      "Pre-computes item positions — enables scrollToIndex without rendering all intermediary items. Required for scrollToIndex and scrollToOffset to work reliably on large lists.",
    code: "<FlatList\n  data={data}\n  getItemLayout={(_, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}\n  removeClippedSubviews\n  maxToRenderPerBatch={10}\n  updateCellsBatchingPeriod={50}\n  windowSize={5}\n  keyExtractor={item => item.id}\n/>",
    interviewQuestion: "What is getItemLayout and when is it required?",
  },
  {
    id: "reactnative-animations-animated-api",
    category: "reactnative",
    topic: "Performance",
    title: "Animations — Animated API",
    difficulty: "Intermediate",
    summary: "Declarative animations on JS thread",
    explanation:
      "useNativeDriver:true runs animation on native UI thread — never drops frames. Only works for transform and opacity. For other properties (width, backgroundColor) must use JS thread.",
    code: "const anim = useRef(new Animated.Value(0)).current;\nAnimated.spring(anim, {\n  toValue: 1,\n  useNativeDriver: true, // ALWAYS use if possible\n  bounciness: 8,\n}).start();\n<Animated.View style={{ opacity: anim, transform: [{ scale: anim }] }} />",
    interviewQuestion: "When to use useNativeDriver?",
  },
  {
    id: "reactnative-reanimated-3",
    category: "reactnative",
    topic: "Performance",
    title: "Reanimated 3",
    difficulty: "Advanced",
    summary: "UI-thread animations with worklets",
    explanation:
      "A JS function marked with 'worklet' that runs on the UI thread. Shared values bridge JS↔UI without going through the bridge.",
    code: "import { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';\n\nconst offset = useSharedValue(0);\nconst animStyle = useAnimatedStyle(() => ({\n  transform: [{ translateX: offset.value }]\n}));\n// Trigger from JS thread\noffset.value = withSpring(100);\n<Animated.View style={animStyle} />",
    interviewQuestion: "What is a worklet?",
  },
  {
    id: "reactnative-hermes-engine",
    category: "reactnative",
    topic: "Performance",
    title: "Hermes engine",
    difficulty: "Intermediate",
    summary: "Optimised JS engine for React Native",
    explanation:
      "Precompiled bytecode (faster cold start), lower memory, built-in debugging. Default since RN 0.70. Disadvantage: slightly behind V8 on some language features (mostly caught up).",
    code: "// android/app/build.gradle\nproject.ext.react = [\n  enableHermes: true // default since 0.70\n]\n// iOS: Podfile\nuse_hermes!",
    interviewQuestion: "Hermes advantages?",
  },
  {
    id: "reactnative-platform-specific",
    category: "reactnative",
    topic: "Platform",
    title: "Platform-specific",
    difficulty: "Intermediate",
    summary: "Platform.OS and file extensions",
    explanation:
      "Platform.select: runtime conditional — both platforms bundled. File extensions (.ios.tsx/.android.tsx): build-time resolution — smaller bundle, true separation.",
    code: "// Runtime: both platforms in bundle\nconst shadow = Platform.select({\n  ios:     { shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4 },\n  android: { elevation: 4 }\n});\n// Build-time: separate files\n// Button.ios.tsx\n// Button.android.tsx\nimport Button from './Button'; // Metro picks correct file",
    interviewQuestion: "Platform.select vs file extensions?",
  },
  {
    id: "reactnative-permissions",
    category: "reactnative",
    topic: "Platform",
    title: "Permissions",
    difficulty: "Intermediate",
    summary: "Request device permissions at runtime",
    explanation:
      "iOS: must declare in Info.plist AND request at runtime. Android: declare in AndroidManifest.xml AND request at runtime for dangerous permissions (camera, location, contacts).",
    code: "import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';\n\nasync function requestCamera() {\n  const result = await request(\n    Platform.OS === 'ios'\n      ? PERMISSIONS.IOS.CAMERA\n      : PERMISSIONS.ANDROID.CAMERA\n  );\n  return result === RESULTS.GRANTED;\n}",
    interviewQuestion: "Why do permissions differ between iOS and Android?",
  },
  {
    id: "reactnative-linking-app-state",
    category: "reactnative",
    topic: "Platform",
    title: "Linking & App State",
    difficulty: "Intermediate",
    summary: "Open URLs and track app lifecycle",
    explanation:
      "active: foreground. background: minimized/home screen. inactive: iOS only — transitioning between states (call comes in).",
    code: "import { AppState, Linking } from 'react-native';\nuseEffect(() => {\n  const sub = AppState.addEventListener('change', state => {\n    if (state === 'active') refreshData();\n  });\n  return () => sub.remove();\n}, []);\n// Open URL\nawait Linking.openURL('https://devquiz.app');\nawait Linking.openSettings(); // device settings",
    interviewQuestion: "AppState values?",
  },
  {
    id: "reactnative-asyncstorage",
    category: "reactnative",
    topic: "Storage",
    title: "AsyncStorage",
    difficulty: "Intermediate",
    summary: "Async key-value storage",
    explanation:
      "Not encrypted, ~6MB Android default, async only, no querying. For encryption: expo-secure-store. For large data: expo-sqlite or WatermelonDB.",
    code: "import AsyncStorage from '@react-native-async-storage/async-storage';\ntry {\n  await AsyncStorage.setItem('user', JSON.stringify(user));\n  const raw = await AsyncStorage.getItem('user');\n  const data = raw ? JSON.parse(raw) : null;\n  await AsyncStorage.multiRemove(['user', 'token']);\n} catch (e) { console.error('Storage error:', e); }",
    interviewQuestion: "AsyncStorage limitations?",
  },
  {
    id: "reactnative-keyboardavoidingview",
    category: "reactnative",
    topic: "Tricky",
    title: "KeyboardAvoidingView",
    difficulty: "Tricky",
    summary: "Layout adjustment when keyboard appears",
    explanation:
      "Android resizes window via windowSoftInputMode=adjustResize — KAV often not needed. iOS overlays keyboard without resize — KAV required with behavior='padding'.",
    code: "<KeyboardAvoidingView\n  style={{ flex: 1 }}\n  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}\n  keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}\n>\n  <ScrollView keyboardShouldPersistTaps='handled'>\n    <TextInput ... />\n  </ScrollView>\n</KeyboardAvoidingView>",
    interviewQuestion: "Why does KAV behave differently on iOS vs Android?",
  },
  {
    id: "reactnative-bridge-new-architecture",
    category: "reactnative",
    topic: "Tricky",
    title: "Bridge & New Architecture",
    difficulty: "Advanced",
    summary: "JS↔Native communication",
    explanation:
      "Fabric: synchronous layout, concurrent features. TurboModules: JSI-based direct C++ calls (no serialization). Codegen: type-safe native bridge. Default in RN 0.76+.",
    code: "// Check new arch\nimport { TurboModuleRegistry } from 'react-native';\nconst native = TurboModuleRegistry.getEnforcing<Spec>('MyModule');\n// JSI: synchronous call\nnative.syncMethod(); // no bridge roundtrip",
    interviewQuestion: "New Architecture: what changed?",
  },
  {
    id: "reactnative-metro-bundler-quirks",
    category: "reactnative",
    topic: "Tricky",
    title: "Metro bundler quirks",
    difficulty: "Intermediate",
    summary: "RN bundler — not Webpack",
    explanation:
      "No tree shaking (bundles everything imported). Different module resolution. Limited plugin ecosystem. But: very fast incremental builds, built-in HMR, supports iOS/Android simultaneously.",
    code: "// metro.config.js\nconst { getDefaultConfig } = require('@react-native/metro-config');\nmodule.exports = (() => {\n  const config = getDefaultConfig(__dirname);\n  config.resolver.sourceExts.push('cjs');\n  config.transformer.babelTransformerPath =\n    require.resolve('react-native-svg-transformer');\n  return config;\n})();",
    interviewQuestion: "Metro limitations vs Webpack?",
  },
  {
    id: "reactnative-image-caching",
    category: "reactnative",
    topic: "Tricky",
    title: "Image caching",
    difficulty: "Tricky",
    summary: "Image loading and caching in React Native",
    explanation:
      "No built-in memory cache for <Image> from remote URLs. Use FastImage (react-native-fast-image) which uses SDWebImage (iOS) and Glide (Android) with proper disk+memory caching.",
    code: "import FastImage from 'react-native-fast-image';\n<FastImage\n  source={{\n    uri: user.avatar,\n    priority: FastImage.priority.high,\n    cache: FastImage.cacheControl.immutable\n  }}\n  style={{ width: 48, height: 48, borderRadius: 24 }}\n  resizeMode={FastImage.resizeMode.cover}\n/>",
    interviewQuestion: "Why do images flicker on re-render?",
  },
  {
    id: "reactnative-js-thread",
    category: "reactnative",
    topic: "Threads",
    title: "JS Thread",
    difficulty: "Advanced",
    summary:
      "Single JavaScript thread — runs React render, business logic, animations",
    explanation:
      "Heavy synchronous computations, large JSON.parse, synchronous native module calls, unoptimised re-renders. Offload with InteractionManager, requestAnimationFrame, or a background worker (JSI Worklet / react-native-workers).",
    code: "// Defer work until animations settle\nimport { InteractionManager } from 'react-native';\nuseEffect(() => {\n  const task = InteractionManager.runAfterInteractions(() => {\n    heavyDataProcessing(); // runs after animation completes\n  });\n  return () => task.cancel();\n}, []);",
    interviewQuestion: "What blocks the JS thread and causes jank?",
  },
  {
    id: "reactnative-ui-thread-main-thread",
    category: "reactnative",
    topic: "Threads",
    title: "UI Thread (Main Thread)",
    difficulty: "Advanced",
    summary:
      "Native UI rendering thread — handles layout, drawing, touch events",
    explanation:
      "UI thread is native (ObjC/Java). JS state lives on the JS thread. Communication happens via the bridge (old arch) or JSI shared values (new arch). Reanimated worklets run ON the UI thread — that's why they're jank-free.",
    code: "// Reanimated: runs directly on UI thread\nfunction worklet() {\n  'worklet';\n  return Math.sqrt(sharedValue.value * 2); // no bridge roundtrip\n}\n// useAnimatedStyle callbacks are worklets automatically",
    interviewQuestion:
      "Why must you never call setState from the UI thread directly?",
  },
  {
    id: "reactnative-native-shadow-thread",
    category: "reactnative",
    topic: "Threads",
    title: "Native/Shadow Thread",
    difficulty: "Advanced",
    summary: "Background thread for layout calculation (Yoga engine)",
    explanation:
      "Separate C++ thread running Yoga (Flexbox) layout engine. Computes layout before committing to UI thread. In Fabric (new arch), layout can happen synchronously on the UI thread — eliminates a thread hop.",
    code: "// No code needed -- happens automatically\n// Old Arch: JS → Bridge → Shadow Thread (Yoga) → UI Thread\n// New Arch: JS → JSI → Fabric (sync layout on UI thread)",
    interviewQuestion: "What is the Shadow Thread (Yoga)?",
  },
  {
    id: "reactnative-interactionmanager",
    category: "reactnative",
    topic: "Threads",
    title: "InteractionManager",
    difficulty: "Intermediate",
    summary: "Schedule work after animations complete",
    explanation:
      "setTimeout(0) may interrupt an ongoing animation — runs at next event loop tick regardless. InteractionManager waits until ALL registered interactions (animations, transitions) have completed.",
    code: "InteractionManager.runAfterInteractions(() => {\n  // Safe to run expensive work -- all animations done\n  setData(processLargeDataset(raw));\n});\n// Register custom interaction\nconst handle = InteractionManager.createInteractionHandle();\nInteractionManager.clearInteractionHandle(handle);",
    interviewQuestion:
      "What is the difference between InteractionManager and setTimeout(fn, 0)?",
  },
  {
    id: "reactnative-fcm-setup-android",
    category: "reactnative",
    topic: "Push Notifications",
    title: "FCM Setup (Android)",
    difficulty: "Intermediate",
    summary: "Firebase Cloud Messaging for Android push",
    explanation:
      "google-services.json in android/app/, @react-native-firebase/app + /messaging packages, classpath 'com.google.gms:google-services' in android/build.gradle, apply plugin in android/app/build.gradle.",
    code: "// Install\nnpx expo install @react-native-firebase/app @react-native-firebase/messaging\n// Request permission\nasync function requestPermission() {\n  const authStatus = await messaging().requestPermission();\n  return authStatus === messaging.AuthorizationStatus.AUTHORIZED\n      || authStatus === messaging.AuthorizationStatus.PROVISIONAL;\n}\n// Get token\nconst token = await messaging().getToken();",
    interviewQuestion: "What files are needed for FCM on Android?",
  },
  {
    id: "reactnative-apns-setup-ios",
    category: "reactnative",
    topic: "Push Notifications",
    title: "APNs Setup (iOS)",
    difficulty: "Advanced",
    summary: "Apple Push Notification service for iOS",
    explanation:
      "Push Notifications entitlement + Background Modes → Remote notifications in Xcode. Also need APNs key (.p8) or certificate in Firebase/backend.",
    code: "// AppDelegate.m -- register for remote notifications\n[application registerForRemoteNotifications];\n// React Native Firebase handles this automatically\n// Foreground handler\nmessaging().onMessage(async remoteMessage => {\n  // Show local notification while app is in foreground\n  PushNotification.localNotification({\n    title: remoteMessage.notification.title,\n    message: remoteMessage.notification.body,\n  });\n});",
    interviewQuestion: "What iOS capabilities must be enabled for push?",
  },
  {
    id: "reactnative-background-quit-state",
    category: "reactnative",
    topic: "Push Notifications",
    title: "Background & Quit state",
    difficulty: "Advanced",
    summary: "Handling notifications when app is backgrounded or killed",
    explanation:
      "onMessage: foreground only. onNotificationOpenedApp: app in background, user taps notification (app comes to foreground). getInitialNotification: app was QUIT, user taps — call in useEffect on mount to handle cold start.",
    code: "useEffect(() => {\n  // App opened from QUIT state by notification\n  messaging().getInitialNotification().then(msg => {\n    if (msg) navigate(msg.data.screen);\n  });\n  // App in BACKGROUND, user taps\n  const unsub = messaging().onNotificationOpenedApp(msg => {\n    navigate(msg.data.screen);\n  });\n  return unsub;\n}, []);",
    interviewQuestion:
      "What is the difference between onMessage, onNotificationOpenedApp, and getInitialNotification?",
  },
  {
    id: "reactnative-local-notifications",
    category: "reactnative",
    topic: "Push Notifications",
    title: "Local Notifications",
    difficulty: "Intermediate",
    summary: "Show notifications triggered by app logic (not server)",
    explanation:
      "Reminders, alarms, download complete, offline events — anything the app triggers itself without a server. Use expo-notifications or notifee library.",
    code: "import notifee, { AndroidImportance } from '@notifee/react-native';\nasync function showNotification(title: string, body: string) {\n  const channelId = await notifee.createChannel({\n    id: 'default', name: 'Default', importance: AndroidImportance.HIGH,\n  });\n  await notifee.displayNotification({\n    title, body, android: { channelId, pressAction: { id: 'default' } },\n  });\n}",
    interviewQuestion: "When do you need local notifications?",
  },
  {
    id: "reactnative-notification-channels-android",
    category: "reactnative",
    topic: "Push Notifications",
    title: "Notification channels (Android)",
    difficulty: "Intermediate",
    summary: "Android 8+ requires notification channels",
    explanation:
      "On Android 8+, notifications without a valid channel are silently dropped. Each channel has its own sound, vibration, importance, and can be customised by the user in Settings.",
    code: "// Create channel once on app start\nawait notifee.createChannel({\n  id: 'orders',\n  name: 'Order Updates',\n  importance: AndroidImportance.HIGH,\n  sound: 'default',\n  vibration: true,\n});\n// User can override channel settings in Android Settings",
    interviewQuestion:
      "What happens if you don't create a notification channel?",
  },
  {
    id: "reactnative-expo-notifications",
    category: "reactnative",
    topic: "Push Notifications",
    title: "Expo Notifications",
    difficulty: "Intermediate",
    summary: "Managed workflow push notifications",
    explanation:
      "Expo push token (ExponentPushToken[...]) routes through Expo's push service which forwards to FCM/APNs. Useful for managed workflow. For bare workflow, use FCM/APNs tokens directly for full control.",
    code: "import * as Notifications from 'expo-notifications';\nasync function registerForPush() {\n  const { status } = await Notifications.requestPermissionsAsync();\n  if (status !== 'granted') return null;\n  const token = (await Notifications.getExpoPushTokenAsync({\n    projectId: Constants.expoConfig.extra.eas.projectId,\n  })).data;\n  return token; // send to your backend\n}",
    interviewQuestion: "Expo push token vs FCM/APNs token?",
  },
  {
    id: "reactnative-react-native-gesture-handler",
    category: "reactnative",
    topic: "Gestures",
    title: "react-native-gesture-handler",
    difficulty: "Intermediate",
    summary: "Native-thread gesture recognition replacing JS touch system",
    explanation:
      "Built-in touches go JS thread → recognizer → UI thread (laggy). Gesture Handler runs entirely on UI thread — responds at 60/120fps even when JS thread is busy.",
    code: "import { GestureDetector, Gesture } from 'react-native-gesture-handler';\nconst tap = Gesture.Tap()\n  .numberOfTaps(2)\n  .onEnd(() => { runOnJS(handleDoubleTap)(); });\nconst pinch = Gesture.Pinch()\n  .onUpdate(e => { scale.value = savedScale.value * e.scale; });\nconst composed = Gesture.Simultaneous(tap, pinch);\n<GestureDetector gesture={composed}><Animated.View style={animStyle} /></GestureDetector>",
    interviewQuestion: "Why use Gesture Handler instead of built-in Touchable?",
  },
  {
    id: "reactnative-swipe-to-dismiss",
    category: "reactnative",
    topic: "Gestures",
    title: "Swipe to dismiss",
    difficulty: "Advanced",
    summary: "Pan gesture + Reanimated for sheet/card dismissal",
    explanation:
      "Use activeOffsetX or activeOffsetY on the pan gesture to define threshold before activation, so vertical scroll still works until horizontal swipe is clearly intended.",
    code: "const pan = Gesture.Pan()\n  .activeOffsetX([-10, 10]) // activate only on horizontal\n  .onUpdate(e => { translateX.value = e.translationX; })\n  .onEnd(e => {\n    if (Math.abs(e.translationX) > 100) {\n      translateX.value = withTiming(500, {}, () => runOnJS(onDismiss)());\n    } else {\n      translateX.value = withSpring(0);\n    }\n  });",
    interviewQuestion:
      "How do you prevent child ScrollView from consuming the swipe gesture?",
  },
  {
    id: "reactnative-jest-react-native-testing-library",
    category: "reactnative",
    topic: "Testing",
    title: "Jest + React Native Testing Library",
    difficulty: "Intermediate",
    summary: "Unit/integration testing for RN components",
    explanation:
      "getBy: throws if not found. queryBy: returns null if not found (use for asserting absence). findBy: async version with retry — waits for element to appear.",
    code: "import { render, fireEvent, waitFor } from '@testing-library/react-native';\ntest('shows user name after load', async () => {\n  const { getByText, queryByTestId } = render(<UserCard userId='1' />);\n  expect(queryByTestId('skeleton')).toBeTruthy();\n  await waitFor(() => getByText('Alice'));\n  expect(queryByTestId('skeleton')).toBeNull();\n  fireEvent.press(getByText('Follow'));\n});",
    interviewQuestion: "What is the difference between getBy and queryBy?",
  },
  {
    id: "reactnative-mocking-native-modules",
    category: "reactnative",
    topic: "Testing",
    title: "Mocking native modules",
    difficulty: "Advanced",
    summary: "Mock modules that rely on native code",
    explanation:
      "Jest runs in Node — no native runtime. Mock the module to return predictable values. Use jest.mock() at top of test file or in __mocks__ folder.",
    code: "// __mocks__/@react-native-async-storage/async-storage.js\nconst store = {};\nexport default {\n  setItem: jest.fn((k, v) => Promise.resolve((store[k] = v))),\n  getItem: jest.fn(k => Promise.resolve(store[k] ?? null)),\n  removeItem: jest.fn(k => Promise.resolve(delete store[k])),\n  clear: jest.fn(() => Promise.resolve(Object.keys(store).forEach(k => delete store[k]))),\n};",
    interviewQuestion: "Why do native modules fail in Jest?",
  },
  {
    id: "reactnative-detox-e2e-testing",
    category: "reactnative",
    topic: "Testing",
    title: "Detox E2E testing",
    difficulty: "Advanced",
    summary: "End-to-end testing on real device/simulator",
    explanation:
      "Grey box: Detox synchronizes with app's internal state (knows when animations, network, async ops are idle) before running assertions. Unlike Appium (black box), no arbitrary sleeps needed.",
    code: "// detox.config.js\nmodule.exports = { testRunner: 'jest', apps: { 'ios.debug': {\n  type: 'ios.app', binaryPath: 'ios/build/app.app',\n  build: 'xcodebuild ...',\n}}};\n// test.e2e.js\ndescribe('Login', () => {\n  it('should log in successfully', async () => {\n    await element(by.id('email')).typeText('user@test.com');\n    await element(by.id('password')).typeText('password');\n    await element(by.id('login-btn')).tap();\n    await expect(element(by.id('dashboard'))).toBeVisible();\n  });\n});",
    interviewQuestion: "What is Detox's grey box testing approach?",
  },
  {
    id: "reactnative-writing-a-native-module",
    category: "reactnative",
    topic: "Native Modules",
    title: "Writing a Native Module",
    difficulty: "Advanced",
    summary: "Bridge JS to platform native code (ObjC/Swift/Java/Kotlin)",
    explanation:
      "When no JS library exists: hardware sensors, DRM, Bluetooth, biometrics, custom camera pipelines, calling existing native SDK.",
    code: "// iOS: RCTCalendarModule.m\n@implementation RCTCalendarModule\nRCT_EXPORT_MODULE();\nRCT_EXPORT_METHOD(createEvent:(NSString *)title\n  resolver:(RCTPromiseResolveBlock)resolve\n  rejecter:(RCTPromiseRejectBlock)reject) {\n  NSNumber *eventId = [self createEventWithTitle:title];\n  if (eventId) resolve(eventId);\n  else reject(@\"E_CREATE\", @\"Failed\", nil);\n}\n@end\n// JS\nimport { NativeModules } from 'react-native';\nawait NativeModules.CalendarModule.createEvent('Meeting');",
    interviewQuestion: "When do you need a custom native module?",
  },
  {
    id: "reactnative-turbomodules-new-arch",
    category: "reactnative",
    topic: "Native Modules",
    title: "TurboModules (New Arch)",
    difficulty: "Advanced",
    summary: "JSI-based native modules — type-safe, synchronous",
    explanation:
      "Legacy: async bridge, JSON serialization, no type safety at boundary. TurboModules: JSI direct C++ call, Codegen generates type-safe spec from TypeScript, can be synchronous.",
    code: "// NativeCalendarModule.ts (Codegen spec)\nimport type { TurboModule } from 'react-native';\nimport { TurboModuleRegistry } from 'react-native';\nexport interface Spec extends TurboModule {\n  createEvent(title: string): Promise<number>;\n}\nexport default TurboModuleRegistry.getEnforcing<Spec>('CalendarModule');",
    interviewQuestion:
      "How does TurboModules differ from legacy Native Modules?",
  },
  {
    id: "reactnative-redux-toolkit",
    category: "reactnative",
    topic: "State Management",
    title: "Redux Toolkit",
    difficulty: "Intermediate",
    summary: "Opinionated Redux: createSlice, createAsyncThunk, RTK Query",
    explanation:
      "Action creators and reducer combined. Immer is built-in — you can write mutating code (obj.count++) and it produces immutable state.",
    code: "import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';\nconst fetchUser = createAsyncThunk('user/fetch', async (id: string) =>\n  (await fetch(`/api/users/${id}`)).json()\n);\nconst userSlice = createSlice({\n  name: 'user',\n  initialState: { data: null, status: 'idle' },\n  reducers: { logout: state => { state.data = null; } },\n  extraReducers: b => {\n    b.addCase(fetchUser.pending,   s => { s.status = 'loading'; })\n     .addCase(fetchUser.fulfilled, (s, a) => { s.data = a.payload; s.status = 'done'; });\n  },\n});",
    interviewQuestion: "What does createSlice generate?",
  },
  {
    id: "reactnative-zustand",
    category: "reactnative",
    topic: "State Management",
    title: "Zustand",
    difficulty: "Intermediate",
    summary: "Minimal state management — no boilerplate",
    explanation:
      "Zustand for simpler apps/teams — no actions, reducers, dispatching. Redux Toolkit for large teams — explicit patterns, DevTools, RTK Query for caching.",
    code: "import { create } from 'zustand';\nimport { persist } from 'zustand/middleware';\ninterface AuthStore {\n  user: User | null;\n  login: (user: User) => void;\n  logout: () => void;\n}\nconst useAuth = create<AuthStore>()(persist(\n  set => ({\n    user: null,\n    login: (user) => set({ user }),\n    logout: () => set({ user: null }),\n  }),\n  { name: 'auth-storage', storage: AsyncStorage }\n));",
    interviewQuestion: "Zustand vs Redux — when to choose Zustand?",
  },
  {
    id: "reactnative-context-vs-state-manager",
    category: "reactnative",
    topic: "State Management",
    title: "Context vs State Manager",
    difficulty: "Tricky",
    summary: "When to use React Context vs external state library",
    explanation:
      "All consumers re-render on any context value change. For frequently-updated state (counters, form values), use Zustand/Redux — they support selectors (only re-render when selected slice changes).",
    code: "// Context: fine for theme, locale, auth (infrequent updates)\n// Zustand: use selector to prevent unnecessary re-renders\nconst userName = useAuthStore(state => state.user?.name);\n// Only re-renders when user.name changes -- not on unrelated store updates",
    interviewQuestion: "What is the main perf problem with Context?",
  },
  {
    id: "reactnative-codepush-eas-update",
    category: "reactnative",
    topic: "Deployment",
    title: "CodePush / EAS Update",
    difficulty: "Advanced",
    summary: "Over-the-air JS bundle updates without app store",
    explanation:
      "Can update: JS/TS code, images, assets bundled with app. Cannot update: native code (Swift/Kotlin/Java), new native modules, Gradle/Podfile changes — these require a new app store release.",
    code: "// @microsoft/react-native-code-push\nimport CodePush from 'react-native-code-push';\nconst App = () => <RootNavigator />;\nexport default CodePush({\n  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,\n  installMode: CodePush.InstallMode.ON_NEXT_RESUME,\n})(App);\n// EAS Update (Expo)\nnpx eas update --branch production --message 'Fix login crash'",
    interviewQuestion: "What can CodePush update and what can't it?",
  },
  {
    id: "reactnative-app-signing-release",
    category: "reactnative",
    topic: "Deployment",
    title: "App signing & release",
    difficulty: "Advanced",
    summary: "Android keystore, iOS provisioning profiles & certificates",
    explanation:
      "Losing the keystore file. Google Play requires the SAME keystore for all updates — if lost, you must publish as a new app. Back it up in multiple secure locations.",
    code: "# Android: generate keystore\nkeytool -genkey -v -keystore my-release-key.jks\n  -alias my-key-alias -keyalg RSA -keysize 2048\n# gradle.properties (keep out of git)\nKEYSTORE_FILE=my-release-key.jks\nKEY_ALIAS=my-key-alias\nKEY_PASSWORD=...\n# iOS: managed by Xcode / EAS credentials",
    interviewQuestion: "What is the most common release mistake for Android?",
  },
  {
    id: "reactnative-eas-build",
    category: "reactnative",
    topic: "Deployment",
    title: "EAS Build",
    difficulty: "Intermediate",
    summary: "Expo Application Services cloud builds",
    explanation:
      "EAS Build: reproducible environment, no Xcode/Android Studio needed on dev machine, easy CI. Local: faster iteration, easier debugging native issues, required for custom build configs EAS doesn't support.",
    code: '# eas.json\n{\n  "build": {\n    "development": { "developmentClient": true, "distribution": "internal" },\n    "production": { "android": { "buildType": "apk" }, "ios": { "simulator": false } }\n  }\n}\n# Build\neas build --platform android --profile production',
    interviewQuestion: "EAS Build vs local build?",
  },
  {
    id: "reactnative-flipper-debugging",
    category: "reactnative",
    topic: "Performance",
    title: "Flipper debugging",
    difficulty: "Intermediate",
    summary: "Meta's debugging tool for React Native apps",
    explanation:
      "Network requests, React DevTools, Redux state, database (SQLite, AsyncStorage), layout inspector, crash logs, custom plugins. Essential for RN debugging.",
    code: "// Enable in debug builds (default in RN 0.62+)\n// Packages: flipper-plugin-network, flipper-plugin-react-query\n// Custom plugin:\nconst flipperClient = require('react-native-flipper');\nflipperClient.addPlugin({\n  getId: () => 'MyPlugin',\n  onConnect: conn => conn.send('data', { key: 'value' }),\n  onDisconnect: () => {},\n});",
    interviewQuestion: "What can you inspect with Flipper?",
  },
  {
    id: "reactnative-js-bundle-optimization",
    category: "reactnative",
    topic: "Performance",
    title: "JS bundle optimization",
    difficulty: "Advanced",
    summary: "Reduce bundle size for faster startup",
    explanation:
      "Use --bundle-output and source-map-explorer to visualize. Lazy require() large libraries. Avoid barrel imports (import * from). Use dynamic imports with React.lazy (Fabric only).",
    code: "# Analyze bundle\nnpx react-native bundle --platform android --dev false\n  --entry-file index.js --bundle-output output.js\nnpx source-map-explorer output.js output.js.map\n\n// Lazy require inside function\nfunction openPDF(path) {\n  const PDFLib = require('@react-native-pdf/pdflib'); // loaded on demand\n  PDFLib.open(path);\n}",
    interviewQuestion: "How do you measure and reduce RN bundle size?",
  },
  {
    id: "reactnative-memory-profiling",
    category: "reactnative",
    topic: "Performance",
    title: "Memory profiling",
    difficulty: "Advanced",
    summary: "Detect memory leaks in React Native apps",
    explanation:
      "Event listeners not removed, subscriptions not unsubscribed, timers not cleared, closures holding large data, JS references to unmounted components.",
    code: "// Always clean up in useEffect\nuseEffect(() => {\n  const subscription = DeviceEventEmitter.addListener('event', handler);\n  const interval = setInterval(poll, 5000);\n  const ws = new WebSocket(url);\n  return () => {\n    subscription.remove();\n    clearInterval(interval);\n    ws.close();\n  };\n}, []);",
    interviewQuestion: "Common memory leak causes in RN?",
  },
  {
    id: "reactnative-netinfo",
    category: "reactnative",
    topic: "Offline",
    title: "NetInfo",
    difficulty: "Basic",
    summary: "Detect network connectivity state",
    explanation:
      "No — NetInfo detects local connectivity (WiFi/cellular connected), not actual internet access. A user connected to a captive portal shows as connected but can't reach your API.",
    code: "import NetInfo from '@react-native-community/netinfo';\n// One-time check\nconst state = await NetInfo.fetch();\nconsole.log(state.isConnected, state.type); // 'wifi'|'cellular'|'none'\n// Subscribe to changes\nconst unsub = NetInfo.addEventListener(state => {\n  dispatch(setOnline(state.isConnected));\n});\nreturn () => unsub();",
    interviewQuestion: "Does NetInfo guarantee the user can reach YOUR server?",
  },
  {
    id: "reactnative-offline-first-strategy",
    category: "reactnative",
    topic: "Offline",
    title: "Offline-first strategy",
    difficulty: "Advanced",
    summary: "Queue mutations and sync when online",
    explanation:
      "Update UI immediately before server confirms — better UX on slow connections. Roll back on failure. React Query / Redux Toolkit Query support optimistic updates.",
    code: "// Optimistic update with React Query\nconst mutation = useMutation({\n  mutationFn: (newPost) => api.createPost(newPost),\n  onMutate: async (newPost) => {\n    await queryClient.cancelQueries(['posts']);\n    const previous = queryClient.getQueryData(['posts']);\n    queryClient.setQueryData(['posts'], old => [newPost, ...old]);\n    return { previous }; // rollback context\n  },\n  onError: (err, _, context) => {\n    queryClient.setQueryData(['posts'], context.previous); // rollback\n  },\n});",
    interviewQuestion: "What is optimistic UI in a mobile context?",
  },
  {
    id: "reactnative-rn-accessibility",
    category: "reactnative",
    topic: "Accessibility",
    title: "RN Accessibility",
    difficulty: "Intermediate",
    summary:
      "accessible, accessibilityLabel, accessibilityRole, accessibilityHint",
    explanation:
      "Tells screen reader (VoiceOver/TalkBack) what kind of element this is — button, link, header, image, etc. Changes how the reader announces and interacts with it.",
    code: "<TouchableOpacity\n  accessible\n  accessibilityRole='button'\n  accessibilityLabel='Send message'\n  accessibilityHint='Double tap to send your message'\n  onPress={send}\n>\n  <Image source={sendIcon} />\n</TouchableOpacity>\n// Check VoiceOver: Settings > Accessibility > VoiceOver\n// Check TalkBack: Settings > Accessibility > TalkBack",
    interviewQuestion: "What is accessibilityRole?",
  },
  {
    id: "reactnative-expo-vs-bare-workflow",
    category: "reactnative",
    topic: "Expo",
    title: "Expo vs Bare workflow",
    difficulty: "Basic",
    summary: "Managed vs ejected React Native",
    explanation:
      "When you need: custom native modules not available in Expo SDK, specific native config, advanced build customisation, or the Expo SDK doesn't support a required native feature yet.",
    code: "# Check if expo module exists before ejecting\nnpx expo install expo-camera expo-location expo-notifications\n# If not available:\nnpx expo prebuild  # generates native ios/ android/ folders\n# Then use bare workflow -- still uses Expo packages",
    interviewQuestion: "When should you eject from Expo managed workflow?",
  },
  {
    id: "reactnative-expo-router",
    category: "reactnative",
    topic: "Expo",
    title: "Expo Router",
    difficulty: "Intermediate",
    summary: "File-based routing for React Native (like Next.js)",
    explanation:
      "Automatic — file structure defines URL scheme. /app/profile/[id].tsx maps to myapp://profile/123 automatically with expo-router's Link handling.",
    code: "// app/(tabs)/index.tsx  -> /\n// app/(tabs)/profile/[id].tsx -> /profile/123\nimport { Link, useLocalSearchParams } from 'expo-router';\nconst { id } = useLocalSearchParams();\n<Link href={{ pathname: '/profile/[id]', params: { id: user.id } }}>\n  View Profile\n</Link>",
    interviewQuestion: "How does Expo Router handle deep links?",
  },
  {
    id: "reactnative-sectionlist-vs-flatlist",
    category: "reactnative",
    difficulty: "Basic",
    topic: "Lists",
    title: "When should you use SectionList instead of FlatList?",
    summary:
      "SectionList renders grouped data with sticky section headers, while FlatList renders a single flat list of items.",
    explanation:
      "SectionList is built on top of VirtualizedList just like FlatList, but it accepts a `sections` prop where each section has its own `data` array and optional header. It's the natural choice for UIs like contact lists grouped by letter, or settings screens grouped by category. FlatList would require you to manually flatten grouped data and inject fake header items, losing the built-in `renderSectionHeader` and `stickySectionHeadersEnabled` behavior. Both share the same virtualization and performance props (windowSize, initialNumToRender, etc.) since they share the same underlying implementation. Choosing SectionList over manually flattening data also keeps your key extraction and header sticky logic simpler and less error-prone.",
    code: "import { SectionList, Text, View } from 'react-native';\n\nconst sections = [\n  { title: 'A', data: ['Alice', 'Adam'] },\n  { title: 'B', data: ['Bob', 'Bella'] },\n];\n\nexport default function ContactList() {\n  return (\n    <SectionList\n      sections={sections}\n      keyExtractor={(item, index) => item + index}\n      renderItem={({ item }) => <Text>{item}</Text>}\n      renderSectionHeader={({ section: { title } }) => (\n        <View><Text style={{ fontWeight: 'bold' }}>{title}</Text></View>\n      )}\n      stickySectionHeadersEnabled\n    />\n  );\n}",
    interviewQuestion:
      "Why would you choose SectionList over FlatList for a contacts screen grouped alphabetically, and what do they share under the hood?",
  },
  {
    id: "reactnative-splash-screen-app-icon-setup",
    category: "reactnative",
    difficulty: "Basic",
    topic: "Native Configuration",
    title: "How is a splash screen configured natively in React Native?",
    summary:
      "Splash screens are native launch assets (LaunchScreen.storyboard on iOS, a themed drawable/activity on Android) shown before the JS bundle finishes loading, and are often managed with react-native-bootsplash or Expo's splash config.",
    explanation:
      "Because the JS engine needs time to initialize and execute your app's entry code, the OS shows a native splash screen immediately at process launch — this can't be a React component since React hasn't rendered anything yet. On iOS this is typically a storyboard or static image set in Xcode; on Android it's a windowBackground drawable applied to the launch theme. Libraries like `react-native-bootsplash` generate these native assets from a single source image and expose a JS API to programmatically hide the splash once your app's initial data/auth check completes, avoiding a flash of blank content between splash and first real screen. A common interview point is distinguishing the *static* native splash (unavoidable, shows instantly) from an *in-JS* loading screen you might render afterward while fetching auth state.",
    code: "import { useEffect, useState } from 'react';\nimport BootSplash from 'react-native-bootsplash';\nimport { View } from 'react-native';\n\nexport default function App() {\n  const [isReady, setIsReady] = useState(false);\n\n  useEffect(() => {\n    async function init() {\n      await loadAuthToken();\n      setIsReady(true);\n      await BootSplash.hide({ fade: true });\n    }\n    init();\n  }, []);\n\n  if (!isReady) return null;\n  return <View>{/* main app */}</View>;\n}",
    interviewQuestion:
      "Why can't the splash screen itself be a React component, and how would you avoid a flicker between the native splash and your first rendered screen?",
  },
  {
    id: "reactnative-svg-basics",
    category: "reactnative",
    difficulty: "Basic",
    topic: "UI Components",
    title: "How do you render SVGs in React Native?",
    summary:
      "react-native-svg exposes SVG primitives (Svg, Path, Circle, etc.) as native components, since React Native can't render raw SVG/HTML markup like the web.",
    explanation:
      "Unlike a browser, React Native has no built-in SVG or HTML rendering engine, so `react-native-svg` provides native-backed components that map to SVG elements and are drawn directly by the platform's rendering layer (CoreGraphics on iOS, a custom canvas view on Android), not by parsing an actual `<svg>` string at runtime. This makes vector icons resolution-independent and themeable via props (fill, stroke) unlike raster PNG icons. For complex static SVG assets exported from design tools, a common workflow is using `react-native-svg-transformer` with Metro so you can `import Logo from './logo.svg'` and use it as a component directly, rather than manually converting markup to JSX.",
    code: 'import Svg, { Circle, Path } from \'react-native-svg\';\n\nexport default function CheckIcon({ color = \'#22c55e\', size = 24 }) {\n  return (\n    <Svg width={size} height={size} viewBox="0 0 24 24">\n      <Circle cx="12" cy="12" r="10" fill={color} opacity={0.15} />\n      <Path\n        d="M8 12l3 3 5-6"\n        stroke={color}\n        strokeWidth={2}\n        fill="none"\n        strokeLinecap="round"\n        strokeLinejoin="round"\n      />\n    </Svg>\n  );\n}',
    interviewQuestion:
      "Why can't you just drop a raw <svg> markup string into a React Native component the way you would in a web app, and what does react-native-svg do differently?",
  },
  {
    id: "reactnative-env-config-react-native-config",
    category: "reactnative",
    difficulty: "Intermediate",
    topic: "Configuration",
    title:
      "How do you manage environment-specific config (.env) in React Native?",
    summary:
      "Libraries like react-native-config or babel-plugin-dotenv let you inject build-time environment variables such as API URLs or keys per environment (dev/staging/prod).",
    explanation:
      "Unlike Node.js, React Native has no native `process.env` support at runtime since the JS bundle is compiled ahead of time, so tools like `react-native-config` read a `.env` file at native build time and expose values through both native build configs (Info.plist, BuildConfig) and a JS module. This allows different API base URLs, feature flags, or keys per scheme/flavor (dev, staging, prod) without hardcoding them in source. A common gotcha is that changing `.env` values requires a full native rebuild (not just a JS reload) because the values get baked into native build artifacts, and secrets in `.env` still ship inside the app bundle, so anything truly sensitive needs server-side handling instead. Interviewers like to check whether candidates understand this is a build-time mechanism, not a secure runtime secret store.",
    code: "// .env.staging\n// API_URL=https://staging.api.example.com\n\n// .env.production\n// API_URL=https://api.example.com\n\nimport Config from 'react-native-config';\nimport { useEffect } from 'react';\n\nexport default function useApiBase() {\n  useEffect(() => {\n    console.log('Using API base:', Config.API_URL);\n  }, []);\n\n  return Config.API_URL;\n}",
    interviewQuestion:
      "Why does changing a value in .env require a full native rebuild in React Native, and why shouldn't you store real secrets there?",
  },
  {
    id: "reactnative-orientation-handling",
    category: "reactnative",
    difficulty: "Intermediate",
    topic: "Device APIs",
    title: "How do you handle screen orientation changes in React Native?",
    summary:
      "Orientation can be locked natively per-platform (Info.plist/AndroidManifest) or read/reacted to at runtime via Dimensions or libraries like react-native-orientation-locker.",
    explanation:
      "By default RN apps support both orientations unless restricted in native config (`UISupportedInterfaceOrientations` on iOS, `android:screenOrientation` or runtime locking on Android). At the JS layer, `Dimensions.get('window')` gives current width/height, but the reliable way to react to orientation changes is subscribing to `Dimensions.addEventListener('change', ...)`, which fires when the layout dimensions actually change after rotation. For per-screen orientation locking (e.g., a video player screen forcing landscape), you typically need a native module like `react-native-orientation-locker` since pure JS can't force the device orientation. A tricky point interviewers probe: comparing width vs height to detect orientation is fragile on tablets/foldables, so checking `orientation` events or using `useWindowDimensions` (which re-renders automatically) is preferred over manual Dimensions polling.",
    code: "import { useWindowDimensions, View, Text } from 'react-native';\n\nexport default function OrientationAwareScreen() {\n  const { width, height } = useWindowDimensions();\n  const isLandscape = width > height;\n\n  return (\n    <View>\n      <Text>{isLandscape ? 'Landscape mode' : 'Portrait mode'}</Text>\n    </View>\n  );\n}",
    interviewQuestion:
      "Why is comparing Dimensions width and height an unreliable way to detect orientation on tablets, and what hook would you use instead to auto re-render on rotation?",
  },
  {
    id: "reactnative-biometric-auth",
    category: "reactnative",
    difficulty: "Intermediate",
    topic: "Security",
    title:
      "How do you implement Face ID / Touch ID biometric auth in React Native?",
    summary:
      "Libraries like react-native-biometrics or expo-local-authentication wrap native biometric APIs (LocalAuthentication on iOS, BiometricPrompt on Android) to authenticate users without a password.",
    explanation:
      "Biometric auth in RN always delegates to native OS frameworks — Apple's LocalAuthentication/Keychain and Android's BiometricPrompt/Keystore — because raw biometric data never leaves secure hardware enclaves; JS only receives a success/failure result. A robust flow checks `isSensorAvailable` first (device may lack biometrics or have none enrolled), then calls a prompt method, and pairs it with secure storage (Keychain/Keystore-backed, not AsyncStorage) to gate access to a stored token rather than 'authenticating' anything remotely by itself. A key interview nuance: biometric prompt success only proves local device possession/identity, not server-side authentication, so apps typically use it to unlock a securely stored refresh token rather than as a standalone login mechanism.",
    code: "import ReactNativeBiometrics from 'react-native-biometrics';\n\nconst rnBiometrics = new ReactNativeBiometrics();\n\nasync function unlockWithBiometrics() {\n  const { available, biometryType } = await rnBiometrics.isSensorAvailable();\n  if (!available) {\n    throw new Error('Biometrics not available on this device');\n  }\n\n  const { success } = await rnBiometrics.simplePrompt({\n    promptMessage: `Unlock with ${biometryType}`,\n  });\n\n  if (success) {\n    return getTokenFromSecureStorage();\n  }\n  throw new Error('Biometric authentication failed');\n}",
    interviewQuestion:
      "Does a successful Face ID prompt authenticate a user against your backend? Explain what biometric auth actually proves and how it's typically combined with token storage.",
  },
  {
    id: "reactnative-webview-postmessage-bridge",
    category: "reactnative",
    difficulty: "Intermediate",
    topic: "Native Modules",
    title: "How does the WebView postMessage bridge work in React Native?",
    summary:
      "react-native-webview lets JS running inside the embedded web page communicate with the RN app via a restricted postMessage-based bridge, not a shared JS context.",
    explanation:
      "A WebView runs an entirely separate JS engine (the platform's native web renderer) from your RN app's JS thread, so there's no direct function-call access between them — communication only happens through serialized string messages. From the web page side, calling `window.ReactNativeWebView.postMessage(string)` triggers the `onMessage` prop in RN; going the other direction, RN calls `webViewRef.current.postMessage(string)` or injects JavaScript via `injectJavaScript`, which the page can listen for via a `message` event. Because messages are strings, both sides typically JSON.stringify/parse structured payloads, and a common gotcha is that `injectJavaScript` runs once per call rather than persisting a listener, so apps often inject a script at load time that sets up a persistent `document.addEventListener('message', ...)` handler.",
    code: "import { WebView } from 'react-native-webview';\nimport { useRef } from 'react';\n\nexport default function EmbeddedCheckout() {\n  const webViewRef = useRef(null);\n\n  const handleMessage = (event) => {\n    const data = JSON.parse(event.nativeEvent.data);\n    if (data.type === 'CHECKOUT_COMPLETE') {\n      console.log('Order id:', data.orderId);\n    }\n  };\n\n  const sendToWebPage = () => {\n    webViewRef.current?.postMessage(JSON.stringify({ type: 'THEME', value: 'dark' }));\n  };\n\n  return (\n    <WebView\n      ref={webViewRef}\n      source={{ uri: 'https://checkout.example.com' }}\n      onMessage={handleMessage}\n    />\n  );\n}",
    interviewQuestion:
      "Why can't a WebView directly call a JS function defined in your React Native app, and how does data actually flow between the two contexts?",
  },
  {
    id: "reactnative-dark-mode-appearance-api",
    category: "reactnative",
    difficulty: "Intermediate",
    topic: "UI Components",
    title: "How does React Native detect and respond to system dark mode?",
    summary:
      "The Appearance API and useColorScheme hook let apps read the OS-level light/dark preference and subscribe to changes, enabling theme-aware styling.",
    explanation:
      "`Appearance.getColorScheme()` returns the current system preference ('light', 'dark', or null on older OS versions), and `useColorScheme()` is the hook form that automatically re-renders your component when the user toggles system theme, whether from Settings or Control Center on supported OS versions. Building a theme system typically wraps this in a Context provider so the color scheme choice — system, or a manual override the user picks in-app — is available app-wide without prop drilling, and persisted (e.g., via AsyncStorage) if you support manual override. A subtlety for interviews: on iOS, `Appearance` change events only fire while the app is in the foreground for apps not opted into background appearance updates, so a color scheme read at cold start can be stale if the OS theme changed while the app was backgrounded, until the next render/focus.",
    code: "import { useColorScheme, View, Text } from 'react-native';\n\nconst themes = {\n  light: { background: '#fff', text: '#111' },\n  dark: { background: '#111', text: '#fff' },\n};\n\nexport default function ThemedScreen() {\n  const scheme = useColorScheme(); // 'light' | 'dark' | null\n  const theme = themes[scheme ?? 'light'];\n\n  return (\n    <View style={{ flex: 1, backgroundColor: theme.background }}>\n      <Text style={{ color: theme.text }}>Follows system theme</Text>\n    </View>\n  );\n}",
    interviewQuestion:
      "How would you build an app-wide theme system that supports 'system', 'light', and 'dark' modes, with the user's manual choice persisted across launches?",
  },
  {
    id: "reactnative-virtualizedlist-internals",
    category: "reactnative",
    difficulty: "Advanced",
    topic: "Lists",
    title: "How does VirtualizedList decide what to render?",
    summary:
      "VirtualizedList maintains a sliding 'window' of rendered items around the current viewport, mounting and unmounting rows as the user scrolls.",
    explanation:
      "VirtualizedList is the engine behind FlatList and SectionList. It tracks the visible area plus an overscan region controlled by `windowSize` (measured in multiples of the viewport height) and only keeps items within that window mounted. As the user scrolls, it batches updates to add newly-visible cells and prune far-off-screen ones, using `initialNumToRender` for the first paint and `maxToRenderPerBatch`/`updateCellsBatchingPeriod` to throttle how much work happens per frame. Without `getItemLayout`, it must measure each cell's layout asynchronously after render, which can cause jumpy scroll-to-index behavior; providing fixed-height layouts upfront lets it skip measurement entirely. Interviewers often probe whether candidates understand that virtualization trades memory for potential blank-cell flicker during rapid scrolls, and that tuning these props is a real performance lever, not just boilerplate.",
    code: "import { FlatList } from 'react-native';\n\nconst ITEM_HEIGHT = 60;\n\nexport default function TunedList({ data }) {\n  return (\n    <FlatList\n      data={data}\n      keyExtractor={(item) => item.id}\n      renderItem={({ item }) => <Row item={item} />}\n      getItemLayout={(_, index) => ({\n        length: ITEM_HEIGHT,\n        offset: ITEM_HEIGHT * index,\n        index,\n      })}\n      initialNumToRender={10}\n      windowSize={5}\n      maxToRenderPerBatch={10}\n      removeClippedSubviews\n    />\n  );\n}",
    interviewQuestion:
      "Explain what windowSize and getItemLayout do internally in VirtualizedList, and why omitting getItemLayout can hurt scrollToIndex reliability.",
  },
  {
    id: "reactnative-app-size-optimization",
    category: "reactnative",
    difficulty: "Advanced",
    topic: "Performance",
    title: "How do you reduce React Native app binary size?",
    summary:
      "App size is reduced via Hermes bytecode precompilation, Android ProGuard/R8 code shrinking, ABI splitting, and stripping unused resources/assets.",
    explanation:
      "Hermes precompiles JS to bytecode at build time rather than shipping raw JS + a JIT, which both speeds up startup and reduces the JS payload compared to JSC. On Android, enabling ProGuard/R8 (`enableProguardInReleaseBuilds`) strips unused Java/Kotlin code and obfuscates/shrinks the native portion, while enabling `universalApk: false` / ABI splits (armeabi-v7a, arm64-v8a, x86_64) avoids shipping every CPU architecture's native libraries in a single APK — the Play Store's App Bundle format does this automatically per-device. On iOS, App Thinning/App Slicing already serves device-specific asset variants, but bitcode and unused asset catalogs still bloat the initial download if not managed. Beyond build config, the biggest wins are usually application-level: auditing bundled image assets (using WebP, proper resolution buckets), removing unused dependencies that pull in large native SDKs, and lazy-loading rarely-used screens/features instead of bundling everything into app startup.",
    code: "// android/app/build.gradle\n// def enableProguardInReleaseBuilds = true\n// android {\n//   splits {\n//     abi {\n//       enable true\n//       reset()\n//       include 'armeabi-v7a', 'arm64-v8a', 'x86', 'x86_64'\n//       universalApk false\n//     }\n//   }\n// }\n\n// Use WebP instead of large PNGs for illustrations\nimport { Image } from 'react-native';\n\nfunction Illustration() {\n  return <Image source={require('./assets/hero.webp')} style={{ width: 300, height: 200 }} />;\n}",
    interviewQuestion:
      "What concrete build-level and app-level changes would you make to shrink a bloated React Native release APK, and how does Hermes contribute to that?",
  },
  {
    id: "reactnative-fabric-renderer-overview",
    category: "reactnative",
    difficulty: "Advanced",
    topic: "New Architecture",
    title:
      "What is Fabric and how does it change React Native's rendering pipeline?",
    summary:
      "Fabric is React Native's new rendering system that replaces the old asynchronous bridge-based UIManager with a C++ core shared across platforms, enabling synchronous layout and more consistent threading.",
    explanation:
      "In the legacy architecture, the JS thread computes a shadow tree and sends serialized commands across the async bridge to the native UIManager, which then updates the real view hierarchy — this round-trip is a source of latency and race conditions for things like synchronous measurement. Fabric introduces a C++ implementation of the shadow tree that's shared by both iOS and Android, letting host platforms read layout results more directly and enabling features like synchronous, prioritized updates for high-priority interactions (e.g., text input, gestures) instead of always queuing through the async bridge. Fabric works together with the new JSI-based communication layer (rather than the JSON-serializing bridge) and TurboModules, so native calls avoid the batching/serialization overhead that historically made frequent bridge crossings expensive. For interview purposes, the key point is Fabric replaces *how views get created/updated*, whereas TurboModules replace *how native modules get invoked* — both ride on JSI but solve different parts of the old bridge bottleneck.",
    code: "// No app code changes are required to benefit from Fabric —\n// it's enabled at the native project level.\n// android/gradle.properties\n// newArchEnabled=true\n\n// ios/Podfile invocation\n// RCT_NEW_ARCH_ENABLED=1 bundle exec pod install\n\nimport { View, Text } from 'react-native';\n\n// Existing components render through Fabric transparently\n// once the new architecture is enabled at the native layer.\nexport default function Screen() {\n  return (\n    <View>\n      <Text>Rendered via Fabric's C++ shadow tree</Text>\n    </View>\n  );\n}",
    interviewQuestion:
      "What specifically does Fabric replace in the old React Native architecture, and how is its role different from TurboModules?",
  },
  {
    id: "reactnative-jsi-basics",
    category: "reactnative",
    difficulty: "Advanced",
    topic: "New Architecture",
    title:
      "What is JSI and why does it matter for React Native's new architecture?",
    summary:
      "JSI (JavaScript Interface) is a lightweight C++ API that lets JS code hold direct references to native C++ objects/functions, enabling synchronous calls without the old bridge's JSON serialization.",
    explanation:
      "The legacy bridge required every native call to be serialized to JSON, queued, and sent asynchronously across threads, which added latency and made synchronous native calls impossible — a real problem for things like measuring layout mid-render. JSI instead exposes native 'Host Objects' directly into the JS runtime (independent of whether that runtime is Hermes, JSC, or V8), so JS can invoke native C++ functions synchronously and pass rich object references instead of stringified payloads. This is the foundation both Fabric (rendering) and TurboModules (native modules) are built on: TurboModules use JSI to lazily create native module bindings on first access (instead of eagerly initializing every module at startup) and call them synchronously when needed. Libraries like Reanimated 2/3 also rely on JSI to run 'worklets' — small JS functions executed directly on the UI thread — which was impossible under the old bridge architecture since crossing the bridge per-frame was too slow for 60fps animations.",
    code: "// Conceptual illustration — JSI bindings are written in C++,\n// but this shows the effect from the JS side: synchronous,\n// no bridge serialization, callable during render/gesture handling.\n\nimport { runOnUI } from 'react-native-reanimated';\n\nfunction useDirectMeasure(animatedRef) {\n  const measure = () => {\n    'worklet';\n    // Executes synchronously on the UI thread via JSI,\n    // no async bridge round-trip required.\n    return measure(animatedRef);\n  };\n  return runOnUI(measure);\n}",
    interviewQuestion:
      "Why couldn't the old React Native bridge support synchronous native calls, and what does JSI change to make things like Reanimated worklets possible?",
  },
  {
    id: "reactnative-reanimated-worklets",
    category: "reactnative",
    difficulty: "Advanced",
    topic: "Animations",
    title: "What is a 'worklet' in react-native-reanimated?",
    summary:
      "A worklet is a small JS function marked with 'worklet' that Reanimated's Babel plugin compiles to run directly on the UI thread via JSI, bypassing the JS thread for animation frame updates.",
    explanation:
      "Normally all JS runs on the single JS thread, and driving animations from there means every frame update has to survive JS thread congestion (e.g., from network responses, list rendering) which causes jank. Reanimated's Babel plugin detects the `'worklet'` directive, serializes the function, and re-creates a runnable copy of it on a separate 'UI thread' JS context accessible via JSI, so gesture handlers and animation callbacks execute at native frame rates independent of what the main JS thread is doing. Worklets have restrictions: they close over variables by value (captured and copied at creation, not live references), can't freely call arbitrary JS-thread-only functions, and require `runOnJS` to safely hand control back to the JS thread (e.g., to call a React state setter or navigate). A classic interview trap: a candidate calls `setState` directly inside a worklet without `runOnJS`, which either errors or silently fails because React state updates must happen on the JS thread.",
    code: "import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';\nimport { Gesture, GestureDetector } from 'react-native-gesture-handler';\n\nexport default function DraggableBox({ onDropped }) {\n  const translateX = useSharedValue(0);\n\n  const notifyDropped = (x) => onDropped(x); // runs on JS thread\n\n  const pan = Gesture.Pan()\n    .onUpdate((e) => {\n      translateX.value = e.translationX; // runs on UI thread\n    })\n    .onEnd(() => {\n      translateX.value = withSpring(0);\n      runOnJS(notifyDropped)(translateX.value); // hop back to JS thread\n    });\n\n  const style = useAnimatedStyle(() => ({\n    transform: [{ translateX: translateX.value }],\n  }));\n\n  return (\n    <GestureDetector gesture={pan}>\n      <Animated.View style={[{ width: 80, height: 80, backgroundColor: 'tomato' }, style]} />\n    </GestureDetector>\n  );\n}",
    interviewQuestion:
      "Why would calling a React state setter directly inside a Reanimated worklet be a problem, and how does runOnJS solve it?",
  },
  {
    id: "reactnative-accessibility-screen-reader-specifics",
    category: "reactnative",
    difficulty: "Tricky",
    topic: "Accessibility",
    title:
      "What are the key differences when supporting VoiceOver vs TalkBack in React Native?",
    summary:
      "Both screen readers consume the same accessibility props (accessible, accessibilityLabel, accessibilityRole) but differ in gesture navigation, focus announcement timing, and how live regions behave — props alone don't guarantee equivalent behavior.",
    explanation:
      "React Native exposes a cross-platform accessibility API (`accessible`, `accessibilityLabel`, `accessibilityRole`, `accessibilityState`, `accessibilityHint`) that maps to native accessibility trees — UIAccessibility on iOS for VoiceOver, and the AccessibilityNodeInfo API on Android for TalkBack — but the two screen readers don't behave identically on top of that shared API. VoiceOver reads `accessibilityHint` after a pause and supports the rotor for jumping between headings/links, while TalkBack has no direct hint equivalent and instead relies more heavily on `accessibilityRole` and explicit `accessibilityLabel` ordering. For dynamic content updates (e.g., an error message appearing), you need `AccessibilityInfo.announceForAccessibility()` for live-region-style announcements, whereas iOS often auto-announces focus changes when you programmatically move focus via `accessibilityElementsHidden`/`setAccessibilityFocus`-style refs. The trap most candidates fall into: they add the props, glance at the screen, and declare it 'accessible' — but reading order, focus traps in modals, and announcement timing are behaviors that only reveal themselves when you actually turn on VoiceOver or TalkBack and navigate by swipe, not by visual inspection.",
    code: 'import { View, Text, AccessibilityInfo, Pressable } from \'react-native\';\nimport { useEffect } from \'react\';\n\nfunction ErrorBanner({ message }) {\n  useEffect(() => {\n    if (message) {\n      AccessibilityInfo.announceForAccessibility(message);\n    }\n  }, [message]);\n\n  return (\n    <View accessible accessibilityRole="alert" accessibilityLabel={message}>\n      <Text>{message}</Text>\n    </View>\n  );\n}\n\nfunction SubmitButton({ onPress, disabled }) {\n  return (\n    <Pressable\n      onPress={onPress}\n      disabled={disabled}\n      accessibilityRole="button"\n      accessibilityLabel="Submit form"\n      accessibilityState={{ disabled }}\n    >\n      <Text>Submit</Text>\n    </Pressable>\n  );\n}',
    interviewQuestion:
      "You added accessibilityLabel to every element and it 'looks right' visually — what screen-reader-specific behaviors could still be broken that visual QA wouldn't catch?",
  },
  {
    id: "reactnative-testing-physical-devices-vs-simulators",
    category: "reactnative",
    difficulty: "Tricky",
    topic: "Testing",
    title:
      "What behaviors should you always verify on a physical device rather than a simulator?",
    summary:
      "Simulators/emulators don't accurately represent real performance, camera/biometric hardware, push notification delivery, or memory constraints, so certain classes of bugs only surface on real devices — and it's easy to sign off on a build that 'works' only because it was never tested on real hardware.",
    explanation:
      "iOS Simulators run x86/ARM binaries directly on your Mac's CPU with effectively unlimited memory and desktop-class performance, so JS thread jank, dropped frames, and memory-pressure crashes that appear on a three-year-old low-end Android phone often don't reproduce at all in an emulator. Hardware-dependent features are also frequently unavailable or faked in simulators: the iOS Simulator has no real camera (uses a static/fake feed), Face ID must be manually 'enrolled' via a menu toggle rather than genuinely testing the flow, and push notifications require either a physical device or workaround tooling since APNs doesn't deliver to simulators without simulated payloads. Additionally, real device testing surfaces platform fragmentation issues — different Android OEM skins altering permission dialogs, notification behavior, or background task killing (e.g., aggressive battery optimization on some Android vendors) — that a single emulator image can't represent. The tricky part interviewers are probing for: a team can ship a build that passed every simulator test and still crash in production on real hardware, because the simulator silently masks exactly the constraints (memory, thermal throttling, real sensors) that expose the bug.",
    code: "// Example: a perf regression that only shows on real devices\nimport { InteractionManager } from 'react-native';\nimport { useEffect, useState } from 'react';\n\nfunction HeavyScreen() {\n  const [ready, setReady] = useState(false);\n\n  useEffect(() => {\n    // On a simulator this feels instant; on a low-end Android\n    // device without InteractionManager gating, this heavy work\n    // would visibly block the transition animation.\n    const task = InteractionManager.runAfterInteractions(() => {\n      setReady(true);\n    });\n    return () => task.cancel();\n  }, []);\n\n  return ready ? <ExpensiveChart /> : <LoadingSpinner />;\n}",
    interviewQuestion:
      "Give three categories of bugs that reliably reproduce on a real low-end Android phone but not in an emulator, and explain why each is masked in the simulator environment.",
  },
  {
    id: "reactnative-fast-image-vs-image",
    category: "reactnative",
    difficulty: "Intermediate",
    topic: "Performance",
    title:
      "How does react-native-fast-image improve on the built-in Image component?",
    summary:
      "react-native-fast-image wraps native image loading libraries (SDWebImage on iOS, Glide on Android) to give aggressive disk/memory caching, priority loading, and fewer flicker/re-download issues than the core Image component.",
    explanation:
      "The core RN Image component relies on platform default caching which is inconsistent between iOS and Android and often re-fetches images that should be cached, causing flicker on list scroll. FastImage delegates to native, battle-tested caching libraries (SDWebImage/Glide) that support disk cache TTL control, priority hints (low/normal/high), and preloading via FastImage.preload(). It also exposes explicit cache control values (immutable, web, cacheOnly) so you can decide whether a URL response should be treated as versioned content. The tradeoff is an extra native dependency that must be linked and kept compatible with new architecture; on Fabric, some teams now prefer expo-image which has native Fabric support built in.",
    code: "import FastImage from 'react-native-fast-image';\n\nfunction Avatar({ uri }) {\n  return (\n    <FastImage\n      style={{ width: 64, height: 64, borderRadius: 32 }}\n      source={{\n        uri,\n        priority: FastImage.priority.high,\n        cache: FastImage.cacheControl.immutable,\n      }}\n      resizeMode={FastImage.resizeMode.cover}\n    />\n  );\n}",
    interviewQuestion:
      "Why might a long FlatList of remote images flicker when scrolling with the core Image component, and how does FastImage address it?",
  },
  {
    id: "reactnative-mmkv-vs-asyncstorage",
    category: "reactnative",
    difficulty: "Advanced",
    topic: "Storage",
    title: "Why is react-native-mmkv significantly faster than AsyncStorage?",
    summary:
      "MMKV is a synchronous, JSI-backed key-value store using memory-mapped files, avoiding the async bridge round-trips that AsyncStorage requires, making reads/writes roughly 10-30x faster.",
    explanation:
      "AsyncStorage on the old architecture serializes every operation across the bridge as a JSON message, and even its new-architecture implementation is still promise-based and involves thread hops. MMKV, built on JSI, exposes synchronous host functions directly callable from JS, backed by memory-mapped files so the OS handles paging efficiently without manual serialization overhead for each call. Because reads are synchronous, MMKV works well for storing things like auth tokens or feature flags that must be read during app startup before the first render. It also supports encryption and multiple named instances, useful for per-user data isolation. The main caveat is it requires a native rebuild (not usable in Expo Go) since it is a native module with JSI bindings.",
    code: "import { MMKV } from 'react-native-mmkv';\n\nconst storage = new MMKV({ id: 'user-storage', encryptionKey: 'secret-key' });\n\nstorage.set('authToken', 'abc123');\nconst token = storage.getString('authToken'); // synchronous, no await needed\n\nstorage.set('isOnboarded', true);\nconsole.log(storage.getBoolean('isOnboarded'));",
    interviewQuestion:
      "A senior dev suggests replacing AsyncStorage with MMKV for a performance-critical settings screen. What tradeoffs would you raise before agreeing?",
  },
  {
    id: "reactnative-watermelondb-offline-patterns",
    category: "reactnative",
    difficulty: "Advanced",
    topic: "Offline Database",
    title:
      "When would you reach for WatermelonDB or SQLite instead of AsyncStorage/MMKV for offline data?",
    summary:
      "WatermelonDB (built on SQLite) is designed for apps with large, relational, frequently-queried datasets that need lazy loading and observable queries, unlike simple key-value stores.",
    explanation:
      "AsyncStorage and MMKV are fine for flat key-value data, but once an app needs relational queries, pagination over thousands of records, or reactive UI updates when underlying rows change, a real database is required. WatermelonDB uses SQLite under the hood but adds a lazy-loading layer so records are only materialized into JS objects when accessed, keeping large lists performant. It exposes an Observable-based query API that integrates with React via withObservables, so components re-render automatically when their underlying data changes without manual cache invalidation. Sync is handled via a pull/push protocol you implement against your backend, which is well suited to offline-first apps like note-taking or CRM tools. The cost is a steeper setup (native module, schema migrations, model classes) compared to just writing JSON blobs to MMKV.",
    code: "import { Model } from '@nozbe/watermelondb';\nimport { field, text } from '@nozbe/watermelondb/decorators';\n\nclass Task extends Model {\n  static table = 'tasks';\n  @text('title') title;\n  @field('is_done') isDone;\n}\n\n// Reactive query in a component\nconst tasksObservable = database.get('tasks').query().observe();",
    interviewQuestion:
      "Your app needs to store and query 50,000 offline records with filters and joins. Why would you choose WatermelonDB over AsyncStorage, and what does 'lazy loading' mean in this context?",
  },
  {
    id: "reactnative-screens-native-navigation-performance",
    category: "reactnative",
    difficulty: "Advanced",
    topic: "Navigation",
    title:
      "What performance problem does react-native-screens solve for React Navigation?",
    summary:
      "react-native-screens replaces plain RN Views representing each route with native UIViewController (iOS) / Fragment (Android) screens, enabling the OS to unmount offscreen views and freeing memory/CPU.",
    explanation:
      "Without react-native-screens, React Navigation keeps every visited screen mounted as a JS-driven View tree, meaning memory usage grows and background screens still consume rendering resources. react-native-screens wraps each route in a native screen container so the platform can properly manage lifecycle, detaching the native view hierarchy for inactive screens the same way native apps do, which reduces memory pressure and improves transition animation smoothness since transitions run on native UI components. It is required (not optional) as of recent React Navigation versions and enables features like native stack (createNativeStackNavigator) which uses fully native push/pop transitions instead of JS-animated ones. The `enableScreens()` call must run before any navigator renders, typically at the app's entry point.",
    code: "import { enableScreens } from 'react-native-screens';\nenableScreens();\n\nimport { createNativeStackNavigator } from '@react-navigation/native-stack';\nconst Stack = createNativeStackNavigator();\n\nfunction App() {\n  return (\n    <NavigationContainer>\n      <Stack.Navigator>\n        <Stack.Screen name=\"Home\" component={HomeScreen} />\n      </Stack.Navigator>\n    </NavigationContainer>\n  );\n}",
    interviewQuestion:
      "What's the practical difference between createStackNavigator (JS-based) and createNativeStackNavigator, and why does react-native-screens matter for that difference?",
  },
  {
    id: "reactnative-svg-transformer-setup",
    category: "reactnative",
    difficulty: "Intermediate",
    topic: "Assets",
    title:
      "How does react-native-svg-transformer let you import SVGs as React components?",
    summary:
      "It hooks into the Metro bundler transform pipeline to convert .svg files into React components at build time, so you can `import Logo from './logo.svg'` and render `<Logo />` directly.",
    explanation:
      "By default Metro treats .svg files as opaque assets resolved to a URI, requiring react-native-svg's SvgUri or SvgXml to render them at runtime with extra parsing cost. react-native-svg-transformer instead registers a custom Metro transformer that runs SVGR at bundle time, converting the SVG markup into a react-native-svg component tree ahead of time, which is faster at runtime and gives you type-safe props like fill and width directly on the component. Setup requires editing metro.config.js to move svg out of assetExts and into sourceExts, and adding the transformer path. A common pitfall is forgetting to also update a TypeScript declaration file (`declarations.d.ts`) so `import Logo from './logo.svg'` type-checks correctly.",
    code: "// metro.config.js\nconst { getDefaultConfig } = require('metro-config');\n\nmodule.exports = (async () => {\n  const { assetExts, sourceExts } = (await getDefaultConfig()).resolver;\n  return {\n    transformer: {\n      babelTransformerPath: require.resolve('react-native-svg-transformer'),\n    },\n    resolver: {\n      assetExts: assetExts.filter((ext) => ext !== 'svg'),\n      sourceExts: [...sourceExts, 'svg'],\n    },\n  };\n})();\n\n// Usage\nimport Logo from './assets/logo.svg';\n<Logo width={120} height={40} fill=\"#000\" />;",
    interviewQuestion:
      "Why can't you just `import Logo from './logo.svg'` and use it as a component in plain React Native without extra configuration?",
  },
  {
    id: "reactnative-fabric-custom-component",
    category: "reactnative",
    difficulty: "Advanced",
    topic: "New Architecture",
    title:
      "What are the steps to build a custom native UI component for Fabric?",
    summary:
      "Building a Fabric component requires defining a typed JS spec, generating native scaffolding via codegen, and implementing the native view (ComponentDescriptor, ShadowNode, and platform view classes) that Fabric composes into the shadow tree.",
    explanation:
      "Unlike the old architecture where you subclassed RCTViewManager and manually bridged props, Fabric components are defined declaratively with a TypeScript/Flow spec using codegenNativeComponent, which Codegen uses to generate C++ ComponentDescriptors, ShadowNodes, and Props structs at build time. You then implement the native side: on iOS a Fabric-compatible RCTViewComponentView subclass, and on Android a ViewManager plus a corresponding C++ shadow node registration. This gives synchronous layout via Yoga integrated directly into the shadow tree, removing the async view-manager command queue that caused old-arch native views to lag behind gesture-driven UI. The tradeoff is significantly more native boilerplate and a build step dependency on codegen running correctly, which can be fragile across RN version upgrades.",
    code: "// NativeMyComponent.ts - Fabric component spec\nimport codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';\nimport type { ViewProps } from 'react-native';\nimport type { Int32 } from 'react-native/Libraries/Types/CodegenTypes';\n\ninterface NativeProps extends ViewProps {\n  cornerRadius?: Int32;\n}\n\nexport default codegenNativeComponent<NativeProps>('MyFancyView');",
    interviewQuestion:
      "How does defining a UI component for Fabric differ from writing a RCTViewManager on the old architecture?",
  },
  {
    id: "reactnative-turbomodule-codegen-walkthrough",
    category: "reactnative",
    difficulty: "Advanced",
    topic: "New Architecture",
    title: "Walk through the codegen process for a TurboModule",
    summary:
      "You write a TypeScript spec extending TurboModule, Codegen parses it at build time to generate native interface code (Java/ObjC/C++), and your native implementation conforms to that generated interface instead of manually bridging types.",
    explanation:
      "A TurboModule starts as a `NativeModuleName.ts` spec file exporting an interface extending TurboModuleRegistry's TurboModule type, with method signatures using Codegen-supported types only (no arbitrary objects without explicit shape). During the build, the Codegen tool scans specs matching the codegenConfig in package.json and emits generated native scaffolding: Java interfaces on Android, Objective-C protocols on iOS, and shared C++ structures used by JSI to marshal calls without going through the JSON bridge. Your handwritten native class implements the generated interface (e.g., `NativeMyModuleSpec` on Android) and gets registered in a provider so JS can call `TurboModuleRegistry.getEnforcing()` and receive a JSI-backed object with real functions instead of a bridge proxy. This means calls can be synchronous and type-checked, unlike the old NativeModules bridge which always serialized to JSON and was inherently asynchronous.",
    code: "// NativeMyModule.ts\nimport type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';\nimport { TurboModuleRegistry } from 'react-native';\n\nexport interface Spec extends TurboModule {\n  multiply(a: number, b: number): number;\n}\n\nexport default TurboModuleRegistry.getEnforcing<Spec>('MyModule');\n\n// Usage\nimport MyModule from './NativeMyModule';\nconsole.log(MyModule.multiply(3, 4)); // synchronous JSI call",
    interviewQuestion:
      "Why must TurboModule spec files restrict themselves to Codegen-supported types instead of arbitrary JS objects?",
  },
  {
    id: "reactnative-config-multi-environment",
    category: "reactnative",
    difficulty: "Intermediate",
    topic: "Build Config",
    title:
      "How do you manage dev/staging/prod environments with react-native-config?",
    summary:
      "react-native-config reads key-value pairs from .env files at native build time and injects them as native BuildConfig/Info.plist values plus a JS Config object, letting you switch API URLs and secrets per build variant without code changes.",
    explanation:
      "The library reads a `.env` file (or environment-specific files like `.env.staging`) and exposes those values both to JS via `import Config from 'react-native-config'` and natively (Android BuildConfig fields, iOS Info.plist placeholders), which is important because some values like API keys for crash reporting need to be available before JS even loads. Multi-environment setup typically means creating `.env.development`, `.env.staging`, `.env.production` and configuring Android product flavors or iOS schemes/xcconfig files to pick the right file at build time via an ENVFILE environment variable. A common gotcha is that changing a `.env` value requires a full native rebuild, not just a JS reload, because Android/iOS bake the values into native build artifacts at compile time. Secrets checked into `.env` files also should never include production credentials if the repo is public; those should come from CI secret injection instead.",
    code: "// .env.staging\nAPI_URL=https://staging-api.example.com\nSENTRY_DSN=https://staging-dsn\n\n// Build command\n// ENVFILE=.env.staging react-native run-android\n\n// Usage in JS\nimport Config from 'react-native-config';\n\nfetch(`${Config.API_URL}/users`);",
    interviewQuestion:
      "Why does changing a value in your .env file require a native rebuild instead of just reloading the JS bundle?",
  },
  {
    id: "reactnative-codepush-rollback-strategies",
    category: "reactnative",
    difficulty: "Advanced",
    topic: "OTA Updates",
    title: "What rollback strategies exist for a bad CodePush release?",
    summary:
      "CodePush supports automatic rollback on crash detection via checkForUpdate/notifyAppReady, plus manual rollback by promoting a previous release or issuing a rollback deployment, and staged rollout percentages to limit blast radius.",
    explanation:
      "The critical safety mechanism is calling `codePush.notifyAppReady()` (or using the HOC's automatic behavior) after a new bundle boots successfully; if the app crashes before this call on the first few launches, the native CodePush runtime automatically reverts to the last known-good bundle, preventing a bricked app. For releases that are technically stable but functionally broken, you use the CLI's `appcenter codepush rollback` command (or App Center dashboard) to redeploy the previous label as a new release, since CodePush doesn't literally undo history — it always moves forward by pointing clients at an earlier package's contents. Staged rollout via the `rollout` percentage parameter lets you release to e.g. 20% of users first, monitor crash telemetry, and only promote to 100% once confidence is established, which limits exposure if a broken bundle slips through. It's also important to gate rollback detection with a reasonable retry threshold, since a single transient crash unrelated to the update shouldn't trigger a full rollback.",
    code: "import codePush from 'react-native-code-push';\n\nfunction App() {\n  useEffect(() => {\n    codePush.sync(\n      { installMode: codePush.InstallMode.ON_NEXT_RESTART },\n      (status) => console.log('CodePush status', status)\n    );\n  }, []);\n\n  useEffect(() => {\n    // Confirms this bundle is good; enables auto-rollback if omitted and app crashes\n    codePush.notifyAppReady();\n  }, []);\n\n  return <RootNavigator />;\n}",
    interviewQuestion:
      "You shipped a CodePush update that causes a crash loop for some users. Walk through how CodePush detects and recovers from this automatically, and what you'd do manually.",
  },
  {
    id: "reactnative-ota-version-gating",
    category: "reactnative",
    difficulty: "Tricky",
    topic: "OTA Updates",
    title:
      "Why do OTA updates (CodePush/EAS Update) need native binary version gating?",
    summary:
      "OTA updates can only ship JS/asset changes, so an update package must be scoped to a matching native binary version — otherwise a JS bundle expecting a native API or module that only exists in a newer app store build will crash.",
    explanation:
      "App stores review native binary changes (new native modules, permission entries, SDK bumps), but OTA channels bypass review by only swapping the JS bundle, so if you push JS code that calls a native module method added in binary v1.5 to users still running binary v1.4, it will throw at runtime. Both CodePush and EAS Update solve this with target version constraints — CodePush's `--target-binary-version` semver range, and EAS Update's channel-to-runtimeVersion mapping — so an update is only served to devices whose native runtime is compatible. `runtimeVersion` in Expo specifically should change whenever you add/modify native code, forcing a fresh binary build and preventing incompatible OTA delivery. Getting this wrong is a classic production incident: a policy of 'runtimeVersion: appVersion' that isn't bumped after a native dependency upgrade will silently serve broken JS to old binaries.",
    code: '// app.json (Expo/EAS Update)\n{\n  "expo": {\n    "runtimeVersion": { "policy": "appVersion" },\n    "updates": {\n      "url": "https://u.expo.dev/your-project-id"\n    }\n  }\n}\n\n// CodePush equivalent: restrict update to compatible binaries\n// appcenter codepush release-react -a Org/App \\\n//   --target-binary-version "~1.5.0"',
    interviewQuestion:
      "A user on an old app store build gets a crash right after opening the app following an OTA update push. What's the most likely root cause and how do version gating mechanisms prevent it?",
  },
  {
    id: "reactnative-device-info-common-uses",
    category: "reactnative",
    difficulty: "Basic",
    topic: "Native Modules",
    title: "What common problems does react-native-device-info solve?",
    summary:
      "react-native-device-info exposes native device metadata like model, OS version, unique/installation IDs, battery level, and whether the app is running on an emulator — data JS cannot access on its own.",
    explanation:
      "Common uses include feature-flagging behavior based on device tier (e.g., disabling heavy animations on low-end Android devices via `getTotalMemory()`), detecting emulators to skip certain flows during automated testing (`isEmulator()`), and reading app/build metadata like `getVersion()` and `getBuildNumber()` for support tickets or force-update checks. It also provides `getUniqueId()` for a (resettable) install-scoped identifier useful for analytics correlation without relying on advertising IDs, and battery/power state APIs for pausing background work when the device is low on battery. Most methods have both sync and async variants; the sync ones are cached at app start and are cheaper to call repeatedly but won't reflect state changes (like battery level) without calling the async version again.",
    code: "import DeviceInfo from 'react-native-device-info';\n\nasync function logDeviceContext() {\n  const isEmulator = await DeviceInfo.isEmulator();\n  const version = DeviceInfo.getVersion();\n  const battery = await DeviceInfo.getBatteryLevel();\n\n  console.log({ isEmulator, version, battery });\n}",
    interviewQuestion:
      "How would you disable expensive visual effects specifically on low-end Android devices, and what package would you reach for?",
  },
  {
    id: "reactnative-force-update-flow",
    category: "reactnative",
    difficulty: "Intermediate",
    topic: "App Lifecycle",
    title:
      "How do you implement a force-update flow when a minimum app version is required?",
    summary:
      "On app start, fetch a minimum-supported-version config from your backend (or a remote config service), compare it to the installed app version via react-native-device-info, and block the UI with an update prompt if the installed version is below the minimum.",
    explanation:
      "The pattern is: maintain a remote config endpoint or Firebase Remote Config value like `minSupportedVersion`, fetch it during app bootstrap (ideally with a timeout and cached fallback so a network failure doesn't block the whole app), and compare against `DeviceInfo.getVersion()` using a semver comparison library since string comparison (\"1.10.0\" < \"1.9.0\") is incorrect. If the installed version is below the minimum, render a full-screen blocking modal with a button linking to the App Store/Play Store listing instead of the normal navigator, and make sure this check can't be bypassed by backgrounding/foregrounding the app. A softer 'recommended update' tier (dismissible, shown periodically) is often paired with the hard block tier so you're not always forcing updates for minor issues. This pattern is separate from and complements OTA updates — force-update handles cases where a native rebuild is mandatory and OTA can't fix the issue.",
    code: "import semver from 'semver';\nimport DeviceInfo from 'react-native-device-info';\n\nasync function checkForceUpdate() {\n  const { minVersion } = await fetch('https://api.example.com/config').then((r) => r.json());\n  const current = DeviceInfo.getVersion();\n\n  if (semver.lt(current, minVersion)) {\n    return { mustUpdate: true };\n  }\n  return { mustUpdate: false };\n}",
    interviewQuestion:
      "Why can't you just do a plain string comparison to check if the installed app version is below a required minimum version?",
  },
  {
    id: "reactnative-deep-link-testing-uri-scheme",
    category: "reactnative",
    difficulty: "Basic",
    topic: "Deep Linking",
    title: "How do you test deep links locally with npx uri-scheme?",
    summary:
      "npx uri-scheme lets you simulate opening a custom URL scheme link on a running simulator/emulator, so you can verify your app's Linking/navigation handling without needing an actual external trigger like an SMS or email link.",
    explanation:
      "The command `npx uri-scheme open myapp://profile/42 --ios` (or `--android`) sends an intent/URL open event to the currently booted simulator or emulator exactly as if the OS had routed a real link, which triggers your app's `Linking` listener or React Navigation's linking config the same way a production deep link would. This is essential for iterating on deep link routes during development since you don't need to publish a webpage or send yourself a text message every time you want to test `myapp://checkout?orderId=123`. It only tests custom scheme links, not universal links/App Links (https:// based), which require separate testing via Safari/Chrome or `xcrun simctl openurl` with an https URL and proper AASA/assetlinks verification. A common gotcha is forgetting the app must already be built with the scheme registered in Info.plist/AndroidManifest for the OS to route it to your app at all.",
    code: '# Open a custom scheme deep link on iOS simulator\nnpx uri-scheme open "myapp://product/123" --ios\n\n# Same on Android emulator\nnpx uri-scheme open "myapp://product/123" --android\n\n# List all schemes registered by installed apps (iOS)\nnpx uri-scheme list --ios',
    interviewQuestion:
      "You want to verify your app correctly navigates to a product screen when opened via myapp://product/123, without building a test webpage. How do you do it?",
  },
  {
    id: "reactnative-universal-links-vs-app-links-setup",
    category: "reactnative",
    difficulty: "Advanced",
    topic: "Deep Linking",
    title:
      "What's different about setting up iOS Universal Links vs Android App Links?",
    summary:
      "Both let https:// URLs open your app directly instead of a browser, but iOS verifies ownership via an apple-app-site-association file plus Associated Domains entitlement, while Android verifies via assetlinks.json plus intent-filter autoVerify, and each has different fallback/debugging behavior.",
    explanation:
      'For iOS, you host a signed `apple-app-site-association` (AASA) JSON file at `https://yourdomain.com/.well-known/apple-app-site-association` (no file extension, served with correct content-type, no redirects) listing your app ID and allowed paths, and add the domain under Associated Domains capability with `applinks:yourdomain.com` in your entitlements. Apple fetches and caches this file at install/update time via Apple\'s CDN, so changes can take time to propagate and are hard to debug — Apple provides a validation tool but there\'s no simple "reverify now" button for a specific device. For Android, you host `assetlinks.json` at `/.well-known/assetlinks.json` with your package name and SHA-256 signing cert fingerprint, and add `<intent-filter android:autoVerify="true">` with your host in AndroidManifest.xml; verification happens at install time and can be checked immediately via `adb shell pm get-app-links`. A key behavioral difference: if verification fails, iOS Universal Links silently fall back to opening Safari, while Android historically showed a disambiguation dialog (or also fell back to browser) — both effectively degrade gracefully but debugging why verification failed differs significantly per platform.',
    code: '// iOS entitlements\n// com.apple.developer.associated-domains: ["applinks:example.com"]\n\n// Android AndroidManifest.xml\n// <intent-filter android:autoVerify="true">\n//   <action android:name="android.intent.action.VIEW" />\n//   <category android:name="android.intent.category.DEFAULT" />\n//   <category android:name="android.intent.category.BROWSABLE" />\n//   <data android:scheme="https" android:host="example.com" />\n// </intent-filter>\n\n// Verify Android App Links on device\n// adb shell pm get-app-links com.example.app',
    interviewQuestion:
      "A universal link works fine on Android but just opens Safari instead of your app on iOS. What are the likely causes and how would you debug it?",
  },
  {
    id: "reactnative-share-integration",
    category: "reactnative",
    difficulty: "Basic",
    topic: "Native APIs",
    title:
      "How do you use React Native's Share API (or react-native-share) to share content?",
    summary:
      "The core `Share` module opens the native OS share sheet for text/URLs with minimal setup, while react-native-share adds support for sharing images/files, targeting specific apps, and social-media-specific options.",
    explanation:
      "React Native ships a built-in `Share.share({ message, url, title })` API that opens the native activity sheet (iOS) or chooser intent (Android) for sharing plain text or a URL, and its promise resolves with the action taken (shared or dismissed) which is useful for analytics. When you need to share binary content like an image or PDF, or want to open a specific app (e.g., share directly to Instagram Stories or WhatsApp), the core API falls short and teams reach for `react-native-share`, which accepts base64 data URLs or file paths and exposes `Share.shareSingle()` for targeting one specific social app's package/scheme. A common pitfall on iOS is that sharing a local file requires it to already exist on disk with a `file://` URI (often after downloading a remote asset first), and on Android some file providers require a FileProvider configuration in the manifest to avoid a FileUriExposedException.",
    code: "import { Share } from 'react-native';\n\nasync function shareArticle() {\n  try {\n    const result = await Share.share({\n      message: 'Check out this article!',\n      url: 'https://example.com/article/42',\n      title: 'Great read',\n    });\n    if (result.action === Share.sharedAction) {\n      console.log('Shared successfully');\n    }\n  } catch (error) {\n    console.error(error);\n  }\n}",
    interviewQuestion:
      "The built-in Share API isn't letting you share a downloaded image directly to Instagram Stories. What would you use instead and why?",
  },
  {
    id: "reactnative-photo-library-permissions-cross-platform",
    category: "reactnative",
    difficulty: "Intermediate",
    topic: "Permissions",
    title:
      "How do camera roll / photo library permissions differ between iOS and Android?",
    summary:
      "iOS uses a single NSPhotoLibraryUsageDescription permission (with an optional limited-access tier since iOS 14), while Android splits access into READ_MEDIA_IMAGES/READ_MEDIA_VIDEO (API 33+) or READ_EXTERNAL_STORAGE on older versions, plus a Photo Picker that needs no permission at all.",
    explanation:
      'On iOS, requesting photo library access triggers a system prompt governed by the `NSPhotoLibraryUsageDescription` Info.plist key, and since iOS 14 users can grant "Limited Access" to only selected photos rather than the whole library, which your app must handle gracefully (e.g., PHPickerViewController respects this automatically). On Android 13+ (API 33), the old blanket `READ_EXTERNAL_STORAGE` permission was split into granular `READ_MEDIA_IMAGES` and `READ_MEDIA_VIDEO`, and Android also introduced a Photo Picker (`ACTION_PICK_IMAGES`) that lets users select photos without granting the app any storage permission at all, similar in spirit to iOS\'s limited access. Libraries like `react-native-permissions` or `expo-image-picker` abstract some of this, but you still need to branch logic by `Platform.Version` to request the correct permission string, since requesting `READ_MEDIA_IMAGES` on an API 32 device or `READ_EXTERNAL_STORAGE` on API 33+ can behave inconsistently or trigger Play Store policy warnings if declared unnecessarily. A frequent interview trap is assuming one permission request covers both platforms identically — it never does.',
    code: "import { PermissionsAndroid, Platform } from 'react-native';\n\nasync function requestPhotoPermission() {\n  if (Platform.OS === 'android') {\n    const permission =\n      Platform.Version >= 33\n        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES\n        : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;\n    const granted = await PermissionsAndroid.request(permission);\n    return granted === PermissionsAndroid.RESULTS.GRANTED;\n  }\n  // iOS: handled via Info.plist prompt + a picker library\n  return true;\n}",
    interviewQuestion:
      "Your photo picker feature works on an Android 12 device but the permission request silently does nothing useful on Android 13. What changed and how do you fix it?",
  },
  {
    id: "reactnative-websocket-reconnection-strategy",
    category: "reactnative",
    difficulty: "Advanced",
    topic: "Networking",
    title:
      "How should a React Native app handle WebSocket reconnection reliably?",
    summary:
      "Reliable reconnection needs exponential backoff with jitter, resubscription of channels/state after reconnect, and awareness of app foreground/background and AppState/NetInfo events since mobile connections drop far more often than on web.",
    explanation:
      "Mobile networks switch between WiFi/cellular, apps get backgrounded (which can suspend socket activity or have the OS kill the connection), and simply retrying immediately after every drop can hammer the server and drain battery, so production implementations use exponential backoff with jitter (e.g., base 1s, doubling up to a cap like 30s, plus random jitter to avoid thundering herd across many clients reconnecting simultaneously). On reconnect, the client must replay any subscription state (re-join rooms, resend auth) since a new WebSocket connection has no memory of prior subscriptions server-side unless the server itself persists session state keyed by a client ID. Listening to `AppState` to proactively close/reopen sockets on background/foreground transitions, and `NetInfo` to avoid attempting reconnects while offline (retry only once connectivity is confirmed restored), avoids wasted reconnect attempts. A subtle bug to watch for: not cleaning up the old socket's event listeners before creating a new one on reconnect, which causes duplicate message handling.",
    code: "function useReliableSocket(url) {\n  const wsRef = useRef(null);\n  const attemptRef = useRef(0);\n\n  const connect = useCallback(() => {\n    const ws = new WebSocket(url);\n    wsRef.current = ws;\n\n    ws.onopen = () => { attemptRef.current = 0; };\n    ws.onclose = () => {\n      const delay = Math.min(30000, 1000 * 2 ** attemptRef.current) + Math.random() * 500;\n      attemptRef.current += 1;\n      setTimeout(connect, delay);\n    };\n  }, [url]);\n\n  useEffect(() => { connect(); return () => wsRef.current?.close(); }, [connect]);\n}",
    interviewQuestion:
      "Your chat app's WebSocket disconnects every time the phone switches from WiFi to cellular. How would you design the reconnection logic to handle this gracefully?",
  },
  {
    id: "reactnative-backhandler-android-back-button",
    category: "reactnative",
    difficulty: "Intermediate",
    topic: "Platform APIs",
    title:
      "How do you correctly handle the Android hardware/gesture back button with BackHandler?",
    summary:
      'BackHandler.addEventListener("hardwareBackPress", handler) lets you intercept the Android back action; returning true consumes it (preventing default exit/pop), and returning false/undefined lets it propagate to the default behavior (usually navigation pop or app exit).',
    explanation:
      "The handler you register must return a boolean synchronously: `true` means you've handled the back press yourself (e.g., closing a modal, confirming exit with a dialog) and the system should do nothing further, while `false` lets the event bubble to the next handler or the default OS behavior. A common bug is registering a listener in a component that mounts on every screen without removing it on unmount, causing stale closures to run or multiple handlers to fire; the return value from `addEventListener` in newer RN versions is a subscription object with a `.remove()` method that must be called in a cleanup function. On modern Android (predictive back gesture, Android 13+), the same API still applies but Google is pushing apps toward the AndroidX back-press APIs for smoother gesture animations, which React Navigation integrates automatically — so most apps don't need manual BackHandler code except for custom cases like double-tap-to-exit or confirming unsaved changes.",
    code: "import { BackHandler } from 'react-native';\nimport { useFocusEffect } from '@react-navigation/native';\n\nuseFocusEffect(\n  useCallback(() => {\n    const onBackPress = () => {\n      if (hasUnsavedChanges) {\n        Alert.alert('Discard changes?', '', [\n          { text: 'Cancel', style: 'cancel' },\n          { text: 'Discard', onPress: () => navigation.goBack() },\n        ]);\n        return true; // consume the event\n      }\n      return false; // let default back behavior happen\n    };\n    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);\n    return () => sub.remove();\n  }, [hasUnsavedChanges])\n);",
    interviewQuestion:
      "You need to show a confirmation dialog when the user presses the Android back button on a form with unsaved changes. How do you implement this, and what does the handler's return value control?",
  },
  {
    id: "reactnative-proguard-r8-shrinking-android-release",
    category: "reactnative",
    difficulty: "Tricky",
    topic: "Build Config",
    title:
      "What do ProGuard/R8 shrinking rules do for a React Native Android release build, and why do they sometimes break things?",
    summary:
      "R8 (ProGuard's successor, default in modern Android Gradle Plugin) shrinks, obfuscates, and optimizes Android release bytecode to reduce APK size, but overly aggressive rules can strip classes accessed via reflection — including native modules registered dynamically — causing runtime crashes that only appear in release builds.",
    explanation:
      "R8 combines tree-shaking (removing unused classes/methods), obfuscation (renaming classes/fields to shorter names), and bytecode optimization into a single pass, replacing the older separate ProGuard tool, and is enabled by setting `minifyEnabled true` in the release buildType. React Native and many native modules rely on reflection to discover and register native modules/view managers at runtime, and R8's static analysis can't always see these reflective references, so without correct `-keep` rules in `proguard-rules.pro`, a class needed at runtime gets stripped or renamed and the app crashes with a `ClassNotFoundException` or `NoSuchMethodError` — critically, only in release builds, since debug builds skip minification entirely, making this a classic 'works on my machine, crashes in production' bug. Most third-party RN libraries ship their own recommended ProGuard rules in their documentation/README that must be manually added (or are auto-included via consumer ProGuard rules bundled in their AAR), and diagnosing a stripped-class crash typically involves reading the R8 mapping.txt file to un-obfuscate a release stack trace. Because R8 runs per-build-variant, a rule that works for one library but conflicts with another's `-keep` requirements can require careful ordering/scoping in the rules file.",
    code: "# android/app/proguard-rules.pro\n# Keep RN's own bridge classes and third-party native modules from being stripped\n-keep class com.facebook.react.** { *; }\n-keep class com.facebook.hermes.unicode.** { *; }\n-keep class com.yourlib.reactnativesomething.** { *; }\n\n# android/app/build.gradle\nbuildTypes {\n  release {\n    minifyEnabled true\n    shrinkResources true\n    proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'\n  }\n}",
    interviewQuestion:
      "A native module works perfectly in your debug build but throws NoSuchMethodError in the release APK. What's the likely cause and how do you fix it?",
  },
  {
    id: "reactnative-snapshot-testing-native-pitfalls",
    category: "reactnative",
    difficulty: "Tricky",
    topic: "Testing",
    title:
      "What pitfalls make snapshot testing risky for React Native components with native dependencies?",
    summary:
      "Snapshots of components wrapping native modules or platform-specific rendering often produce noisy, environment-dependent diffs (mocked native values, non-deterministic IDs, platform branches) that make failures meaningless and encourage blind snapshot updates rather than real bug detection.",
    explanation:
      "Jest's default RN preset mocks most native modules, so a snapshot of a component using, say, `react-native-device-info` or a native date formatter captures whatever the mock returns rather than real device behavior, meaning the snapshot doesn't actually validate anything meaningful about production output and can pass even when the real native integration is broken. Snapshots are also brittle across unrelated changes — updating a third-party UI library's internal DOM structure, or even a minor RN version bump changing default accessibility props, can produce a huge diff unrelated to the change you actually made, training developers to reflexively run `jest --ci=false -u` without reading the diff, which defeats the test's purpose entirely. Non-deterministic values (timestamps, generated IDs, `Math.random()`-based keys) will cause flaky snapshot failures unless explicitly mocked to fixed values before rendering. Because of these issues, many RN teams limit snapshot testing to small, purely presentational components with stable props and rely on RTL's interaction/assertion-based tests (checking specific text/roles are present) for anything involving native modules or complex conditional rendering, since those tests fail with an actionable message instead of an opaque diff.",
    code: "// Risky: snapshot depends on native-mocked/non-deterministic values\ntest('renders profile card', () => {\n  const tree = render(<ProfileCard lastSeen={Date.now()} deviceId={DeviceInfo.getUniqueId()} />);\n  expect(tree.toJSON()).toMatchSnapshot(); // flaky across runs/mocks\n});\n\n// Better: assert specific, stable, user-facing output\ntest('renders profile card', () => {\n  render(<ProfileCard name=\"Sam\" lastSeen={FIXED_TIMESTAMP} />);\n  expect(screen.getByText('Sam')).toBeVisible();\n});",
    interviewQuestion:
      "A snapshot test keeps failing on every CI run even though nobody touched the related component. What are the likely causes, and why might blindly running the snapshot update flag be dangerous?",
  },
{
    id: "reactnative-flashlist-deep-dive",
    category: "reactnative",
    difficulty: "Advanced",
    topic: "Lists & Performance",
    title: "FlashList (Shopify) deep dive",
    summary: "Drop-in FlatList replacement using recycling for much higher scroll performance.",
    explanation: "FlashList recycles item views instead of mounting/unmounting them like FlatList, drastically cutting JS thread work during fast scrolls. It requires an estimatedItemSize hint to precompute layout before measuring real sizes, and uses a MasonryFlashList variant for staggered grids. Because views are recycled, cell state must not rely on component identity — reset state via key or item id. It also ships built-in support for sticky headers and content container padding without extra wrapper views.",
    code: "import { FlashList } from '@shopify/flash-list';\n\nfunction Feed({ posts }) {\n  return (\n    <FlashList\n      data={posts}\n      renderItem={({ item }) => <PostCard post={item} />}\n      estimatedItemSize={120}\n      keyExtractor={(item) => item.id}\n      onEndReachedThreshold={0.5}\n    />\n  );\n}",
    interviewQuestion: "How does FlashList achieve better performance than FlatList, and why is estimatedItemSize required?",
  },
  {
    id: "reactnative-sqlite-expo-vs-rn-sqlite-storage",
    category: "reactnative",
    difficulty: "Intermediate",
    topic: "Local Databases",
    title: "SQLite in React Native (expo-sqlite vs react-native-sqlite-storage)",
    summary: "Two common ways to embed a relational SQLite database on-device for structured offline data.",
    explanation: "expo-sqlite provides a JSI-backed synchronous/async API that works well in managed Expo projects and has a newer next/statement-based API for prepared statements. react-native-sqlite-storage is an older bridge-based library that works in bare RN without Expo, using callback or Promise transaction APIs. Both require manual schema migrations — there is no ORM built in. For complex offline sync, most teams layer something like WatermelonDB or Drizzle ORM on top rather than writing raw SQL everywhere.",
    code: "import * as SQLite from 'expo-sqlite';\n\nconst db = await SQLite.openDatabaseAsync('app.db');\nawait db.execAsync(\n  'CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY, title TEXT, done INTEGER);'\n);\nawait db.runAsync('INSERT INTO todos (title, done) VALUES (?, ?)', 'Buy milk', 0);\nconst rows = await db.getAllAsync('SELECT * FROM todos WHERE done = ?', 0);",
    interviewQuestion: "When would you reach for expo-sqlite or react-native-sqlite-storage instead of AsyncStorage or MMKV?",
  },
  {
    id: "reactnative-realm-database",
    category: "reactnative",
    difficulty: "Advanced",
    topic: "Local Databases",
    title: "Realm Database",
    summary: "Object-oriented embedded database with live objects and reactive queries, optional cloud sync via Atlas Device Sync.",
    explanation: "Realm stores schema-defined objects directly and exposes 'live objects' that auto-update views when underlying data changes, without manual re-fetching. Queries use a results collection you can filter/sort lazily, and writes must happen inside a realm.write() transaction block. It historically ran on its own C++ core via JSI, giving fast on-device performance comparable to SQLite for typical CRUD-heavy apps. Realm also offers optional Device Sync for automatic conflict resolution across devices, which SQLite and WatermelonDB don't provide out of the box.",
    code: "const TaskSchema = {\n  name: 'Task',\n  primaryKey: 'id',\n  properties: { id: 'string', title: 'string', done: 'bool' },\n};\n\nconst realm = await Realm.open({ schema: [TaskSchema] });\nrealm.write(() => {\n  realm.create('Task', { id: '1', title: 'Ship feature', done: false });\n});\nconst openTasks = realm.objects('Task').filtered('done == false');",
    interviewQuestion: "What makes Realm's 'live objects' different from a typical SQLite query result, and what's the tradeoff?",
  },
  {
    id: "reactnative-secure-storage-keychain-keystore",
    category: "reactnative",
    difficulty: "Intermediate",
    topic: "Security",
    title: "Secure Storage (Keychain/Keystore via react-native-keychain)",
    summary: "Stores small sensitive values (tokens, passwords) in the OS-level encrypted credential store instead of plain AsyncStorage.",
    explanation: "react-native-keychain wraps iOS Keychain Services and Android Keystore/EncryptedSharedPreferences to persist secrets with hardware-backed encryption where available. Unlike AsyncStorage or MMKV, values are not readable by simply inspecting app sandbox files, and can be gated behind biometric prompts (Face ID/fingerprint) using accessControl options. It's meant for small credential-like payloads (auth tokens, refresh tokens) — not bulk data — since keychain reads/writes are slower and have platform size limits. On logout you should explicitly call resetGenericPassword to purge stored secrets.",
    code: "import * as Keychain from 'react-native-keychain';\n\nawait Keychain.setGenericPassword('user_123', refreshToken, {\n  accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,\n});\n\nconst creds = await Keychain.getGenericPassword();\nif (creds) {\n  console.log(creds.username, creds.password);\n}\n\nawait Keychain.resetGenericPassword();",
    interviewQuestion: "Why store auth tokens in react-native-keychain instead of AsyncStorage or MMKV?",
  },
  {
    id: "reactnative-background-fetch",
    category: "reactnative",
    difficulty: "Advanced",
    topic: "Background Tasks",
    title: "Background Fetch",
    summary: "OS-scheduled periodic wake-ups that let the app refresh data while backgrounded, subject to battery/OS heuristics.",
    explanation: "iOS uses BackgroundTasks/BGTaskScheduler under the hood (wrapped by libraries like react-native-background-fetch) to periodically wake the app for short data-refresh windows — timing is opportunistic, not guaranteed, and controlled by iOS based on usage patterns and battery state. Android equivalents rely on WorkManager-backed periodic tasks. Handlers must call a 'finish' callback promptly (usually within ~30s) or the OS penalizes the app's future scheduling priority. It's meant for lightweight sync (e.g., refreshing a small cache), not heavy or time-critical work — for that, use a real background upload/task API or push-triggered wakeups.",
    code: "import BackgroundFetch from 'react-native-background-fetch';\n\nBackgroundFetch.configure(\n  { minimumFetchInterval: 15 },\n  async (taskId) => {\n    await syncLatestMessages();\n    BackgroundFetch.finish(taskId);\n  },\n  (taskId) => {\n    BackgroundFetch.finish(taskId);\n  }\n);",
    interviewQuestion: "Why can't you rely on Background Fetch to run at an exact interval, and how should handlers be written to avoid being deprioritized?",
  },
  {
    id: "reactnative-headless-js",
    category: "reactnative",
    difficulty: "Advanced",
    topic: "Background Tasks",
    title: "Headless JS",
    summary: "Android mechanism to run a JS task in the background with no UI/Activity mounted, e.g. for FCM data messages.",
    explanation: "Headless JS lets Android start a JS-only task (registered via AppRegistry.registerHeadlessTask) triggered by native code — commonly used for handling FCM background data messages or responding to a BroadcastReceiver event. There is no window/UI context available, so any code touching native UI modules will fail; the task must be a pure async function that resolves so the OS can release the wake lock. iOS has no direct equivalent — background data handling there goes through silent push (content-available) delegate methods instead. Long-running or unreliable tasks risk Android killing the process via HeadlessJsTaskService timeout limits (default 30s, extendable).",
    code: "// index.js\nimport { AppRegistry } from 'react-native';\n\nconst SyncTask = async (data) => {\n  await uploadPendingLogs(data.logId);\n};\n\nAppRegistry.registerHeadlessTask('SyncTask', () => SyncTask);",
    interviewQuestion: "What is Headless JS used for on Android, and why does iOS not need an equivalent API?",
  },
  {
    id: "reactnative-background-geolocation",
    category: "reactnative",
    difficulty: "Advanced",
    topic: "Background Tasks",
    title: "Background Geolocation",
    summary: "Continuously tracks device location while the app is backgrounded or terminated, using platform-native geofencing/motion APIs to conserve battery.",
    explanation: "Libraries like react-native-background-geolocation use native iOS significant-location-change and Android FusedLocationProvider APIs combined with motion-activity detection to intelligently throttle GPS polling — only sampling aggressively when the device is actually moving. Both platforms require explicit 'Always' location permission plus, on iOS, the UIBackgroundModes location entitlement, and on Android a persistent foreground service notification for continuous tracking (per Android 10+ background location restrictions). Battery and OS kill-policy tradeoffs are central to interview discussions — aggressive polling drains battery fast and iOS will suspend apps that abuse location background modes. Geofencing (entering/exiting a region) is far cheaper than continuous GPS polling for many use cases.",
    code: "import BackgroundGeolocation from 'react-native-background-geolocation';\n\nBackgroundGeolocation.ready({\n  desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,\n  distanceFilter: 10,\n  stopOnTerminate: false,\n  startOnBoot: true,\n  foregroundService: true,\n}, (state) => {\n  if (!state.enabled) BackgroundGeolocation.start();\n});\n\nBackgroundGeolocation.onLocation((location) => {\n  sendLocationToServer(location.coords);\n});",
    interviewQuestion: "What permission and platform-specific requirements does continuous background location tracking need on iOS vs Android?",
  },
  {
    id: "reactnative-background-upload-tasks",
    category: "reactnative",
    difficulty: "Advanced",
    topic: "Background Tasks",
    title: "Background Upload Tasks",
    summary: "Uploads large files (photos/videos) reliably even if the app is backgrounded or killed, using native OS upload sessions.",
    explanation: "Libraries like react-native-background-upload delegate the actual HTTP transfer to native OS-level upload managers (NSURLSession background sessions on iOS, WorkManager/DownloadManager-style services on Android) so the transfer continues independent of the JS thread or even if the app is force-quit. This differs from a plain fetch()/axios upload, which is tied to the JS runtime and dies when the app is backgrounded long enough or killed. You subscribe to progress/error/completed events via a task ID rather than awaiting a promise directly. It's the standard approach for camera-roll video upload flows where uploads can take minutes on slow networks.",
    code: "import Upload from 'react-native-background-upload';\n\nconst uploadId = await Upload.startUpload({\n  url: 'https://api.example.com/upload',\n  path: fileUri,\n  method: 'POST',\n  type: 'multipart',\n  field: 'file',\n});\n\nUpload.addListener('progress', uploadId, (data) => {\n  console.log(`Progress: ${data.progress}%`);\n});\nUpload.addListener('completed', uploadId, () => markUploadDone(uploadId));",
    interviewQuestion: "Why does a background upload library outlast a regular fetch() call when the app is backgrounded or killed?",
  },
  {
    id: "reactnative-native-event-emitters",
    category: "reactnative",
    difficulty: "Advanced",
    topic: "Native Modules",
    title: "Native Event Emitters",
    summary: "Mechanism for native modules to push async events (not just resolve promises) to JS, e.g. sensor updates or socket data.",
    explanation: "On iOS, native modules extend RCTEventEmitter and call sendEventWithName to push data; the RN side wraps this with NativeEventEmitter around the native module. On Android, native modules use a DeviceEventManagerModule.RCTDeviceEventEmitter emitter reference obtained from the ReactContext. Unlike a callback/promise passed into a single method call, event emitters support many-to-many, ongoing streams of events (e.g. accelerometer data, BLE characteristic notifications). JS-side subscriptions must always be cleaned up (`.remove()`) in a useEffect cleanup to avoid leaking listeners across component remounts.",
    code: "// JS side\nimport { NativeEventEmitter, NativeModules } from 'react-native';\nconst { CompassModule } = NativeModules;\nconst emitter = new NativeEventEmitter(CompassModule);\n\nuseEffect(() => {\n  const sub = emitter.addListener('headingChanged', (heading) => {\n    setHeading(heading.degrees);\n  });\n  return () => sub.remove();\n}, []);",
    interviewQuestion: "How do native modules push ongoing async events to JS, and why is that different from a resolved Promise?",
  },
  {
    id: "reactnative-deviceeventemitter-usage",
    category: "reactnative",
    difficulty: "Intermediate",
    topic: "Native Modules",
    title: "DeviceEventEmitter usage",
    summary: "Built-in RN global emitter for Android-originated native events and in-app pub/sub without a custom native module.",
    explanation: "DeviceEventEmitter (from 'react-native') is the RN-core emitter primarily used to receive Android native events emitted via RCTDeviceEventEmitter, but it can also be used purely in JS as a lightweight pub/sub bus between unrelated components. Unlike NativeEventEmitter, it doesn't need to be constructed with a native module reference — it's a singleton. It's less type-safe and less scoped than a dedicated NativeEventEmitter per module, so overusing it as a general app-wide event bus can make event flows hard to trace; most teams prefer context/state managers for pure-JS pub/sub and reserve DeviceEventEmitter for genuine native-origin events.",
    code: "import { DeviceEventEmitter } from 'react-native';\n\n// Anywhere in JS\nconst sub = DeviceEventEmitter.addListener('cartUpdated', (payload) => {\n  console.log('Cart changed:', payload.itemCount);\n});\n\nDeviceEventEmitter.emit('cartUpdated', { itemCount: 3 });\n\n// cleanup\nsub.remove();",
    interviewQuestion: "What's the difference between DeviceEventEmitter and a NativeEventEmitter instance tied to a specific native module?",
  },
  {
    id: "reactnative-crashlytics-integration",
    category: "reactnative",
    difficulty: "Intermediate",
    topic: "Observability",
    title: "Crashlytics Integration",
    summary: "Firebase's crash reporting SDK for RN — captures native and JS fatal crashes with stack traces, breadcrumbs, and custom keys.",
    explanation: "@react-native-firebase/crashlytics hooks into both the native crash handlers (NSException on iOS, uncaught Java/Kotlin exceptions on Android) and RN's global JS error handler to report fatals and non-fatals to the Firebase console. Symbolication requires uploading dSYM files (iOS) and mapping files/native symbols (Android) during CI so stack traces are human-readable rather than raw addresses. You typically also wire ErrorUtils.setGlobalHandler to funnel unhandled JS exceptions and console.error/warn into Crashlytics as non-fatal logs. Custom keys and user identifiers help correlate crashes to specific app states or user segments.",
    code: "import crashlytics from '@react-native-firebase/crashlytics';\n\ncrashlytics().setUserId(userId);\ncrashlytics().setAttribute('subscriptionTier', 'pro');\n\ntry {\n  riskyNativeBridgeCall();\n} catch (e) {\n  crashlytics().recordError(e);\n}\n\n// Force a test crash\ncrashlytics().crash();",
    interviewQuestion: "Why do you need to upload dSYM/mapping files for Crashlytics to be useful, and what happens if you skip that step?",
  },
  {
    id: "reactnative-sentry-integration-rn",
    category: "reactnative",
    difficulty: "Intermediate",
    topic: "Observability",
    title: "Sentry Integration for RN",
    summary: "Error and performance monitoring SDK that captures JS exceptions, native crashes, and traces with source-mapped stack traces.",
    explanation: "@sentry/react-native wraps the app root in an ErrorBoundary-aware wrapper and patches the global error handler and promise rejection tracking to capture unhandled exceptions, alongside native crash reporting via bundled sentry-cocoa/sentry-android SDKs. Source maps must be uploaded per release (tied to a release/dist identifier matching the deployed bundle) so minified Hermes bytecode stack traces resolve back to original file/line. Sentry also supports performance tracing (spans around navigation transitions, network calls) and session replay-style breadcrumbs leading up to a crash. A common gotcha is forgetting to set the release/dist to match exactly what was uploaded, which silently breaks symbolication.",
    code: "import * as Sentry from '@sentry/react-native';\n\nSentry.init({\n  dsn: 'https://examplePublicKey@o0.ingest.sentry.io/0',\n  tracesSampleRate: 0.2,\n  enableAutoSessionTracking: true,\n});\n\ntry {\n  parseUserPayload(raw);\n} catch (err) {\n  Sentry.captureException(err);\n}",
    interviewQuestion: "Why can a Sentry crash report show unreadable minified stack traces even though the SDK is integrated correctly?",
  },
  {
    id: "reactnative-firebase-analytics-in-rn",
    category: "reactnative",
    difficulty: "Basic",
    topic: "Observability",
    title: "Firebase Analytics in RN",
    summary: "Tracks user behavior events (screen views, custom events, conversions) via @react-native-firebase/analytics, feeding the Firebase/GA4 console.",
    explanation: "logEvent sends named events with parameter payloads to Firebase, which are batched and periodically flushed rather than sent instantly, so events may not appear in DebugView immediately unless debug mode is enabled. Screen tracking isn't automatic with React Navigation — you typically hook into navigationRef state change listeners and call logScreenView manually. Event and parameter names have length/character restrictions (e.g., must start with a letter, no spaces) and reserved prefixes like 'firebase_' are disallowed for custom events. setUserProperties and setUserId let you segment analytics by cohort without sending PII directly as event params.",
    code: "import analytics from '@react-native-firebase/analytics';\n\nawait analytics().logEvent('add_to_cart', {\n  item_id: product.id,\n  price: product.price,\n  currency: 'USD',\n});\n\nawait analytics().setUserProperty('plan_tier', 'premium');\nawait analytics().logScreenView({ screen_name: 'ProductDetail' });",
    interviewQuestion: "How do you track screen views with Firebase Analytics when using React Navigation, since it isn't automatic?",
  },
  {
    id: "reactnative-performance-monitoring-tools",
    category: "reactnative",
    difficulty: "Intermediate",
    topic: "Observability",
    title: "Performance Monitoring Tools (Firebase Perf / Flashlight)",
    summary: "Tools for measuring real-world app performance — cold start time, network latency, frame drops — in production and during development.",
    explanation: "Firebase Performance Monitoring auto-instruments app start time and HTTP requests, and supports custom traces around arbitrary code blocks to measure duration in production across real user devices. Flashlight (by Bam Tech) is a CLI-based tool that measures FPS, CPU, RAM, and bundle-size-related metrics on physical Android/iOS devices during automated test scenarios, useful for CI performance regression gates. Unlike Flipper (a dev-time debugger), both of these are meant to catch performance regressions either in production telemetry (Firebase) or in a repeatable CI benchmark (Flashlight). Custom traces are the key primitive for both — wrapping a suspect code path (e.g. image processing) to get p50/p90 duration numbers.",
    code: "import perf from '@react-native-firebase/perf';\n\nconst trace = await perf().startTrace('checkout_flow');\ntrace.putAttribute('cartSize', String(cart.length));\n\nawait submitOrder(cart);\n\nawait trace.stop();\n\n// Flashlight (CLI, in CI)\n// flashlight test --bundleId com.myapp --testCommand \"detox test\"",
    interviewQuestion: "What's the difference between using Firebase Performance Monitoring vs a tool like Flashlight for catching performance regressions?",
  },
  {
    id: "reactnative-cicd-for-rn-overview",
    category: "reactnative",
    difficulty: "Intermediate",
    topic: "CI/CD",
    title: "CI/CD for React Native overview",
    summary: "The pipeline stages unique to mobile CI/CD — native builds, code signing, store submission — beyond typical web CI.",
    explanation: "A mobile CI/CD pipeline generally covers: install deps and run lint/tests, run native builds (Xcode archive / Gradle assembleRelease-bundleRelease), manage code signing (provisioning profiles/certificates for iOS, keystores for Android), then either upload to TestFlight/Play Console internal tracks or trigger an OTA update (CodePush/EAS Update) for JS-only changes. Native builds are slow and require macOS runners for iOS, which is the main reason RN CI is more expensive/complex than pure web CI. Fastlane is the common glue layer scripting signing and store uploads, while CI platforms (GitHub Actions, Bitrise, App Center, CircleCI) orchestrate when those scripts run. A key architectural decision is what triggers a full native build vs a lightweight OTA JS update.",
    code: "# .github/workflows/release.yml (conceptual)\njobs:\n  build-ios:\n    runs-on: macos-14\n    steps:\n      - uses: actions/checkout@v4\n      - run: bundle exec fastlane ios beta\n  build-android:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: bundle exec fastlane android beta",
    interviewQuestion: "Why does React Native CI/CD typically need a macOS runner, and how does that affect pipeline cost and design?",
  },
  {
    id: "reactnative-fastlane-for-rn",
    category: "reactnative",
    difficulty: "Intermediate",
    topic: "CI/CD",
    title: "Fastlane for RN",
    summary: "Ruby-based automation tool for building, signing, and submitting iOS/Android builds via reusable 'lanes'.",
    explanation: "Fastlane defines 'lanes' in a Fastfile — reusable automation recipes combining actions like gym (build+sign iOS), match (sync certificates/provisioning profiles across a team via a git repo), gradle (Android build), and deliver/supply (TestFlight/Play Store upload). match is particularly important in interviews: instead of every developer generating their own signing certs, match stores encrypted certs/profiles in a shared repo so CI and all devs use identical signing identities, preventing 'works on my machine' signing mismatches. Fastlane abstracts over both platforms with a consistent DSL, so the same mental model (lanes, actions, Fastfile/Appfile) applies whether you're shipping iOS or Android.",
    code: "# fastlane/Fastfile\nplatform :ios do\n  lane :beta do\n    match(type: 'appstore')\n    increment_build_number(xcodeproj: 'MyApp.xcodeproj')\n    build_app(scheme: 'MyApp')\n    upload_to_testflight\n  end\nend\n\nplatform :android do\n  lane :beta do\n    gradle(task: 'bundleRelease')\n    upload_to_play_store(track: 'internal')\n  end\nend",
    interviewQuestion: "What problem does Fastlane match solve for iOS code signing across a team and CI?",
  },
  {
    id: "reactnative-github-actions-for-rn-builds",
    category: "reactnative",
    difficulty: "Intermediate",
    topic: "CI/CD",
    title: "GitHub Actions for RN builds",
    summary: "Using GitHub-hosted or self-hosted runners with caching and secrets to build and test RN apps on PRs and releases.",
    explanation: "iOS jobs require macos runners (more expensive per-minute than ubuntu) since Xcode/xcodebuild only runs on macOS; Android jobs can run on cheaper ubuntu runners. Caching node_modules, ~/.gradle, and CocoaPods (Pods/ or ~/Library/Caches/CocoaPods) via actions/cache dramatically cuts build time since native dependency resolution is slow. Signing secrets (keystores, provisioning profiles, API keys) are stored as encrypted GitHub Secrets and decoded at runtime rather than committed to the repo. A common pattern is splitting workflows: a fast PR-triggered job (lint, unit tests, JS bundle check) and a separate, slower release-triggered job that does the full native build and store upload.",
    code: "name: RN CI\non: [pull_request]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with: { node-version: 20, cache: 'npm' }\n      - run: npm ci\n      - run: npm run lint && npm test -- --ci\n\n  build-android:\n    needs: test\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: gradle/actions/setup-gradle@v3\n      - run: cd android && ./gradlew assembleRelease",
    interviewQuestion: "Why do iOS build jobs on GitHub Actions cost more and run slower than Android jobs, and how would you optimize the pipeline?",
  },
  {
    id: "reactnative-bitrise-for-rn",
    category: "reactnative",
    difficulty: "Basic",
    topic: "CI/CD",
    title: "Bitrise for RN",
    summary: "Mobile-first CI/CD SaaS with a visual step-based workflow editor and prebuilt Steps for RN-specific tasks.",
    explanation: "Bitrise is purpose-built for mobile (unlike general CI like GitHub Actions), offering a bitrise.yml workflow made of composable 'Steps' from a marketplace (e.g. React Native pod install, Gradle Runner, Deploy to Bitrise.io, App Store/Play Store deploy steps) that you can also configure visually. It manages code signing files (certificates, provisioning profiles, keystores) natively within its dashboard rather than requiring a separate tool like Fastlane match, though many teams still layer Fastlane inside a Bitrise Script step for consistency across CI providers. Bitrise Machines come with Xcode/Android SDKs preinstalled, avoiding the setup overhead you'd hand-roll on a generic runner. It's often chosen over GitHub Actions specifically for teams wanting less YAML/glue code for mobile-specific concerns.",
    code: "# bitrise.yml (conceptual)\nworkflows:\n  primary:\n    steps:\n      - activate-ssh-key: {}\n      - git-clone: {}\n      - npm@1: { inputs: [command: install] }\n      - react-native-bundle@1: {}\n      - cocoapods-install@2: {}\n      - xcode-archive@4:\n          inputs:\n            - scheme: MyApp\n      - deploy-to-itunesconnect-application-loader@1: {}",
    interviewQuestion: "How does Bitrise's approach to mobile CI/CD differ from a general-purpose CI tool like GitHub Actions?",
  },
  {
    id: "reactnative-app-center-for-rn",
    category: "reactnative",
    difficulty: "Basic",
    topic: "CI/CD",
    title: "App Center for RN",
    summary: "Microsoft's mobile DevOps platform historically offering build, test-on-device-farm, distribution, and CodePush OTA updates — now being retired.",
    explanation: "App Center offered an integrated pipeline: cloud builds triggered from a connected repo, distribution to testers/App Store Connect/Play Console, crash reporting (Diagnostics), and CodePush for JS/asset OTA updates without a store review cycle. It's important in interviews mainly for historical/migration context — Microsoft announced App Center's retirement (build/test/distribute services shutting down), pushing teams to migrate CodePush usage to community forks (like react-native-code-push community maintenance) or Expo EAS Update, and CI/CD to GitHub Actions/Bitrise/Fastlane. A candidate should know App Center existed as an all-in-one solution and be able to explain what replaced each of its pieces.",
    code: "// CodePush usage pattern historically wired through App Center\nimport codePush from 'react-native-code-push';\n\nconst App = () => <RootNavigator />;\n\nexport default codePush({\n  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,\n  installMode: codePush.InstallMode.ON_NEXT_RESTART,\n})(App);",
    interviewQuestion: "App Center's mobile CI/build/distribute services are being retired — what would you migrate the CI pipeline and OTA updates to?",
  },
  {
    id: "reactnative-ble-in-rn",
    category: "reactnative",
    difficulty: "Advanced",
    topic: "Native Device APIs",
    title: "Bluetooth Low Energy (BLE) in RN",
    summary: "Connecting to BLE peripherals (wearables, sensors) via libraries like react-native-ble-plx, working with services/characteristics.",
    explanation: "BLE communication is modeled around GATT: a peripheral exposes Services, each containing Characteristics (readable/writable/notifiable values identified by UUIDs). react-native-ble-plx wraps CoreBluetooth (iOS) and the Android BLE stack behind a Promise/Observable API for scanning, connecting, discovering services, and subscribing to characteristic notifications. iOS requires NSBluetoothAlwaysUsageDescription and Android requires runtime BLUETOOTH_SCAN/BLUETOOTH_CONNECT (API 31+) or location permission (pre-31, since BLE scan results can infer location). Connection state is fragile — apps must handle disconnects/reconnection explicitly, and background BLE scanning is heavily restricted by both OSes for battery/privacy reasons.",
    code: "import { BleManager } from 'react-native-ble-plx';\nconst manager = new BleManager();\n\nmanager.startDeviceScan(null, null, (error, device) => {\n  if (device?.name === 'HeartRateMonitor') {\n    manager.stopDeviceScan();\n    device.connect()\n      .then((d) => d.discoverAllServicesAndCharacteristics())\n      .then((d) => d.monitorCharacteristicForService(\n        SERVICE_UUID, CHAR_UUID,\n        (err, characteristic) => updateHeartRate(characteristic.value)\n      ));\n  }\n});",
    interviewQuestion: "Why does Android require location permission for BLE scanning on older API levels, and how do GATT services/characteristics relate to reading sensor data?",
  },
  {
    id: "reactnative-nfc-in-react-native",
    category: "reactnative",
    difficulty: "Intermediate",
    topic: "Native Device APIs",
    title: "NFC in React Native",
    summary: "Reading/writing NFC tags (e.g. NDEF payloads) via react-native-nfc-manager, plus platform differences in background tag detection.",
    explanation: "react-native-nfc-manager wraps Core NFC (iOS) and the Android NFC APIs to scan for tags, read/write NDEF (NFC Data Exchange Format) records, and in some cases do HCE (Host Card Emulation). iOS NFC reading requires explicit user-triggered scanning sessions (a system sheet appears) and has stricter background limitations compared to Android, which can register intent filters to launch the app automatically when a tag is tapped even from a locked/background state. Both platforms need capability/entitlement setup (Near Field Communication Tag Reading capability on iOS, NFC permission + intent-filter on Android). It's commonly used for access badges, payment-adjacent tap flows, and asset tagging in inventory apps.",
    code: "import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';\n\nasync function readTag() {\n  await NfcManager.requestTechnology(NfcTech.Ndef);\n  const tag = await NfcManager.getTag();\n  const text = Ndef.text.decodePayload(tag.ndefMessage[0].payload);\n  console.log('Tag content:', text);\n  await NfcManager.cancelTechnologyRequest();\n}",
    interviewQuestion: "How does NFC tag detection differ between iOS and Android in terms of background/locked-screen behavior?",
  },
  {
    id: "reactnative-camera-apis-vision-camera",
    category: "reactnative",
    difficulty: "Advanced",
    topic: "Native Device APIs",
    title: "Camera APIs (react-native-vision-camera)",
    summary: "High-performance camera library built on native AVFoundation/CameraX, supporting frame processors for real-time ML/vision pipelines.",
    explanation: "VisionCamera exposes the native camera pipeline directly (AVFoundation on iOS, CameraX on Android) rather than a WebView-style camera preview, enabling high frame-rate capture and low-latency photo/video. Its standout feature is Frame Processors — JS worklets (via Reanimated/JSI) that run synchronously on the camera's video output thread per-frame, enabling real-time barcode scanning, face detection, or custom ML model inference without round-tripping frames through the JS thread. Because frame processors run off the main JS thread on a dedicated frame processor thread, they must be pure and fast to avoid frame drops; heavy work should be offloaded. It requires careful permission handling (camera + microphone) and format/pixel-format configuration for the target use case (photo vs. high-fps video vs. frame processing).",
    code: "import { Camera, useCameraDevice, useFrameProcessor } from 'react-native-vision-camera';\nimport { scanBarcodes } from 'vision-camera-barcode-scanner';\n\nfunction ScannerScreen() {\n  const device = useCameraDevice('back');\n  const frameProcessor = useFrameProcessor((frame) => {\n    'worklet';\n    const barcodes = scanBarcodes(frame);\n    if (barcodes.length) runOnJS(handleBarcode)(barcodes[0].value);\n  }, []);\n\n  return device ? (\n    <Camera style={{ flex: 1 }} device={device} isActive frameProcessor={frameProcessor} />\n  ) : null;\n}",
    interviewQuestion: "What is a VisionCamera frame processor, what thread does it run on, and why must it stay lightweight?",
  },
  {
    id: "reactnative-maps-integration-rn-maps",
    category: "reactnative",
    difficulty: "Intermediate",
    topic: "Native Device APIs",
    title: "Maps Integration (react-native-maps)",
    summary: "Renders native Google Maps (Android/iOS) or Apple Maps (iOS) views with markers, polylines, and region control.",
    explanation: "react-native-maps renders a true native MapView (GoogleMaps SDK or MKMapView) rather than a WebView-embedded map, giving native scroll/zoom performance and gesture handling. It requires platform-specific API key setup — a Google Maps API key in AndroidManifest.xml for Android, and either Apple Maps (no key needed) or Google Maps SDK w/ key for iOS via the provider prop. Rendering large numbers of Markers can hurt performance; the common optimization is clustering (react-native-map-clustering) or switching to lower-level Polygon/Polyline overlays. Region/camera changes are controlled imperatively via a ref (animateToRegion/animateCamera) rather than purely through props, since map gestures also mutate the visible region outside of React's render cycle.",
    code: "import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';\n\nfunction StoreMap({ stores }) {\n  const mapRef = useRef(null);\n\n  return (\n    <MapView\n      ref={mapRef}\n      provider={PROVIDER_GOOGLE}\n      style={{ flex: 1 }}\n      initialRegion={{ latitude: 37.78, longitude: -122.42, latitudeDelta: 0.05, longitudeDelta: 0.05 }}\n    >\n      {stores.map((s) => (\n        <Marker key={s.id} coordinate={s.coords} title={s.name} />\n      ))}\n    </MapView>\n  );\n}",
    interviewQuestion: "Why can rendering hundreds of Markers on react-native-maps cause jank, and how would you fix it?",
  },
  {
    id: "reactnative-video-streaming-playback",
    category: "reactnative",
    difficulty: "Intermediate",
    topic: "Media",
    title: "Video Streaming/Playback in RN",
    summary: "Playing local/streamed video (HLS/DASH) via react-native-video, covering buffering states, adaptive bitrate, and background audio.",
    explanation: "react-native-video wraps native players (AVPlayer on iOS, ExoPlayer on Android) which natively support adaptive bitrate streaming protocols like HLS (.m3u8) — the player automatically switches quality based on measured bandwidth, no manual bitrate-switching logic needed in JS. Buffering/loading/error states are surfaced via onBuffer, onLoad, and onError callbacks that should drive UI spinners and retry logic. For background audio-only playback (e.g. podcast-style video-to-audio), you need platform config: UIBackgroundModes 'audio' on iOS and a foreground service/MediaSession on Android, plus playInBackground/playWhenInactive props. Picture-in-picture and full-screen handling typically require additional native configuration beyond the base component props.",
    code: "import Video from 'react-native-video';\n\nfunction Player({ streamUrl }) {\n  const [buffering, setBuffering] = useState(false);\n\n  return (\n    <>\n      <Video\n        source={{ uri: streamUrl }}\n        style={{ width: '100%', height: 220 }}\n        controls\n        resizeMode=\"contain\"\n        onBuffer={({ isBuffering }) => setBuffering(isBuffering)}\n        onError={(e) => console.warn('Playback error', e)}\n      />\n      {buffering && <ActivityIndicator />}\n    </>\n  );\n}",
    interviewQuestion: "How does adaptive bitrate streaming work when playing an HLS stream with react-native-video, and what do you need to configure for background audio playback?",
  },
];
