import React, { useRef, useEffect } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HomeHeader } from '../components/home/HomeHeader';
import { MoodStatusCard } from '../components/home/MoodStatusCard';
import { MemoryCard } from '../components/home/MemoryCard';
import { useDailyUsData } from '../hooks/useDailyUsData';
import { ThemedText } from '../components/ui/ThemedText';
import { t } from '../i18n/t';

export default function HomeScreen() {
    const { profile, mood, feed, loading } = useDailyUsData();
    const ref = useRef<FlatList>(null);
    const navigation = useNavigation();

    useEffect(() => {
        // Manually handle tab press to ensure scroll-to-top works
        // @ts-ignore - tabPress is valid for tab navigators, ignoring inference issue
        const unsubscribe = navigation.addListener('tabPress', (e) => {
            if (navigation.isFocused()) {
                // If already focused, scroll to top
                ref.current?.scrollToOffset({ offset: 0, animated: true });
            }
        });

        return unsubscribe;
    }, [navigation]);

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-background">
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-background">
            <HomeHeader profile={profile} />

            <FlatList
                ref={ref}
                data={feed}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <MemoryCard item={item} />}
                ListHeaderComponent={() => (
                    <View>
                        <MoodStatusCard mood={mood} daysTogether={profile?.daysTogether || 0} />
                        <View className="h-4" />
                        <View className="flex-row items-center justify-center mb-6">
                            <ThemedText className="text-[10px] font-bold tracking-widest text-text-secondary uppercase">{t('home.memories')}</ThemedText>
                        </View>
                    </View>
                )}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}
