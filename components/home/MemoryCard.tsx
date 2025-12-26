import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { FeedItem } from '../../services/api.types';
import { ThemedText } from '../ui/ThemedText';
import { t } from '../../i18n/t';

const DateIndicator = ({ day, month }: { day: string; month: string }) => (
    <View className="w-12 items-center pt-2">
        <ThemedText className="text-xl font-bold">{day}</ThemedText>
        <ThemedText className="text-[10px] font-bold uppercase text-text-secondary">{month}</ThemedText>
    </View>
);

const MediaGrid = ({ images }: { images: string[] }) => {
    if (images.length === 0) return null;

    if (images.length === 1) {
        return (
            <View className="w-full h-48 rounded-2xl overflow-hidden mb-4 bg-surface">
                <Image source={{ uri: images[0] }} className="w-full h-full" resizeMode="cover" />
            </View>
        );
    }

    // Layout for 3 images (1 main left, 2 stacked right) like the design
    if (images.length >= 3) {
        return (
            <View className="flex-row h-64 w-full gap-1 mb-4 rounded-2xl overflow-hidden">
                <View className="flex-1 h-full bg-surface">
                    <Image source={{ uri: images[0] }} className="w-full h-full" resizeMode="cover" />
                </View>
                <View className="flex-1 h-full gap-1">
                    <View className="flex-1 bg-surface">
                        <Image source={{ uri: images[1] }} className="w-full h-full" resizeMode="cover" />
                    </View>
                    <View className="flex-1 bg-surface relative">
                        <Image source={{ uri: images[2] }} className="w-full h-full" resizeMode="cover" />
                        {images.length > 3 && (
                            <View className="absolute inset-0 bg-black/40 items-center justify-center">
                                <ThemedText className="text-white font-bold text-lg">+{images.length - 3}</ThemedText>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        )
    }

    // Default 2 images (side by side)
    return (
        <View className="flex-row h-48 w-full gap-1 mb-4 rounded-2xl overflow-hidden">
            {images.map((img, i) => (
                <View key={i} className="flex-1 bg-surface">
                    <Image source={{ uri: img }} className="w-full h-full" resizeMode="cover" />
                </View>
            ))}
        </View>
    )
}

export const MemoryCard = ({ item }: { item: FeedItem }) => {
    return (
        <View className="flex-row px-4 mb-8">
            {/* Date Column */}
            <DateIndicator day={item.displayDate.day} month={item.displayDate.month} />

            {/* Content Column */}
            <View className="flex-1 ml-4 bg-background border border-border rounded-3xl p-4 shadow-sm">

                {/* Media */}
                <View className="relative">
                    <MediaGrid images={item.media} />
                    {/* Type Badge (Optional overlay) */}
                    {item.type === 'video' && (
                        <View className="absolute top-3 right-3 bg-black/60 px-2 py-1 rounded-full flex-row items-center gap-1">
                            <Feather name="play-circle" size={10} color="white" />
                            <ThemedText className="text-white text-[10px] font-bold">{t('feed.video')}</ThemedText>
                        </View>
                    )}
                    {item.type === 'photo' && item.media.length > 1 && (
                        <View className="absolute top-3 right-3 bg-black/60 px-2 py-1 rounded-full flex-row items-center gap-1">
                            <Feather name="image" size={10} color="white" />
                            {/* TODO: Add logic for trip day if needed, keeping static for now but translated */}
                            <ThemedText className="text-white text-[10px] font-bold">{t('feed.tripDay2')}</ThemedText>
                        </View>
                    )}
                </View>


                {/* Header/Title */}
                <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center gap-2">
                        <ThemedText variant="title" className="text-lg">{item.title}</ThemedText>
                    </View>
                    <TouchableOpacity>
                        <Feather name="more-horizontal" size={20} className="text-text-secondary" />
                    </TouchableOpacity>
                </View>

                {/* Description */}
                <ThemedText className="text-text-secondary text-sm leading-5 mb-4">
                    {item.description}
                </ThemedText>

                {/* Footer Actions */}
                <View className="flex-row items-center justify-between mt-2 pt-3 border-t border-border">
                    <View className="flex-row items-center gap-2">
                        <Ionicons
                            name={item.isLiked ? "heart" : "heart-outline"}
                            size={20}
                            color="#ef4444"
                        />
                        <ThemedText className="text-xs text-text-secondary font-medium">
                            <ThemedText className="font-bold text-text-primary">{item.likes.lastLikedBy.name}</ThemedText> {t('feed.likedThis')}
                        </ThemedText>
                    </View>

                    <View className="flex-row items-center gap-4">
                        <TouchableOpacity className="flex-row items-center gap-1">
                            <Feather name="message-circle" size={16} className="text-text-secondary" />
                            <ThemedText className="text-xs text-text-secondary">{t('feed.reply')}</ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        </View>
    );
};
