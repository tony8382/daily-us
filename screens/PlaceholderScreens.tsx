import { View, Text } from 'react-native';

const ScreenLayout = ({ title }: { title: string }) => (
    <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-zinc-900">
        <Text className="text-xl font-bold text-gray-900 dark:text-white">{title}</Text>
    </View>
);

export const HomeScreen = () => <ScreenLayout title="Home" />;
export const MemoriesScreen = () => <ScreenLayout title="Memories" />;
export const CalendarScreen = () => <ScreenLayout title="Calendar" />;
export const SettingsScreen = () => <ScreenLayout title="Settings" />;
export const AddPostScreen = () => <ScreenLayout title="New Post" />;
