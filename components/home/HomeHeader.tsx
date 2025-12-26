
import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { CoupleProfile } from '../../services/api.types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '../ui/ThemedText';
import { t } from '../../i18n/t';

export const HomeHeader = ({ profile }: { profile: CoupleProfile | null }) => {
    const insets = useSafeAreaInsets();

    if (!profile) return null;

    return (
        <View
            className="flex-row items-center justify-between px-4 pb-4 bg-background"
            style={{ paddingTop: insets.top + 12 }}
        >
            <View className="flex-row items-center space-x-3 gap-3">
                {/* Overlapping Avatars */}
                <View className="flex-row">
                    <View className="w-10 h-10 rounded-full border-2 border-background overflow-hidden z-10">
                        <Image source={{ uri: profile.user1.avatar }} className="w-full h-full" />
                    </View>
                    <View className="w-10 h-10 rounded-full border-2 border-background overflow-hidden z-0">
                        <Image source={{ uri: profile.user2.avatar }} className="w-full h-full" />
                    </View>
                </View>

                <View>
                    <ThemedText variant="default" className="font-bold">
                        {profile.user1.name} & {profile.user2.name}
                    </ThemedText>
                    <View className="flex-row items-center space-x-1 gap-1">
                        <View className="w-2 h-2 rounded-full bg-green-500" />
                        <ThemedText variant="caption">{t('common.together')}</ThemedText>
                    </View>
                </View>
            </View>

            <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-surface">
                <Feather name="bell" size={20} className="text-text-primary" />
            </TouchableOpacity>
        </View>
    );
};
