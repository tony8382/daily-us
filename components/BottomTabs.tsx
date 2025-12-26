import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, useColorScheme } from 'react-native';
import { MemoriesScreen, CalendarScreen, SettingsScreen, AddPostScreen } from '../screens/PlaceholderScreens';
import HomeScreen from '../screens/HomeScreen';
import { Feather } from '@expo/vector-icons';
import clsx from 'clsx';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

// Custom Button Component for the middle "+"
const CustomTabBarButton = ({ children, onPress }: any) => (
    <TouchableOpacity
        style={{
            top: -24, // Lift the button up
            justifyContent: 'center',
            alignItems: 'center',
        }}
        onPress={onPress}
        activeOpacity={0.8}
    >
        <View className="w-16 h-16 rounded-full bg-blue-500 items-center justify-center shadow-lg shadow-blue-500/40 border-4 border-white dark:border-zinc-950">
            {children}
        </View>
    </TouchableOpacity>
);

export default function BottomTabs() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const insets = useSafeAreaInsets();

    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerShown: false,
                // Styling the tab bar
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: isDark ? '#09090b' : '#ffffff', // zinc-950 or white
                    borderTopWidth: 0,
                    height: 60 + insets.bottom, // Add safe area
                    paddingTop: 8,
                    paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
                    elevation: 0, // Remove Android shadow if desired, or keep it
                },
                tabBarShowLabel: true,
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: 'medium',
                    marginTop: 4,
                },
                tabBarActiveTintColor: '#3b82f6', // blue-500
                tabBarInactiveTintColor: isDark ? '#71717a' : '#a1a1aa', // zinc-400 / zinc-500
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Feather name="home" color={color} size={size} />
                }}
            />
            <Tab.Screen
                name="Memories"
                component={MemoriesScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Feather name="image" color={color} size={size} />
                }}
            />
            {/* Middle Button */}
            <Tab.Screen
                name="NewPost"
                component={AddPostScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Feather name="plus" size={32} color="#ffffff" />
                    ),
                    tabBarButton: (props) => <CustomTabBarButton {...props} />,
                    tabBarLabel: () => null,
                }}
            />
            <Tab.Screen
                name="Calendar"
                component={CalendarScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Feather name="calendar" color={color} size={size} />
                }}
            />
            <Tab.Screen
                name="Setting"
                component={SettingsScreen}
                options={{
                    tabBarLabel: "Settings",
                    tabBarIcon: ({ color, size }) => <Feather name="settings" color={color} size={size} />
                }}
            />
        </Tab.Navigator>
    );
}
