import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { ThemedText } from '../../ui/ThemedText';

interface MediaGridProps {
    items: string[];
    onMediaPress: (index: number) => void;
}

export const MediaGrid = ({ items, onMediaPress }: MediaGridProps) => {
    if (items.length === 0) return null;

    if (items.length === 1) {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => onMediaPress(0)}
                className="w-full h-48 rounded-2xl overflow-hidden mb-4 bg-surface"
            >
                <Image source={{ uri: items[0] }} className="w-full h-full" resizeMode="cover" />
            </TouchableOpacity>
        );
    }

    // Layout for 3 images (1 main left, 2 stacked right) like the design
    if (items.length >= 3) {
        return (
            <View className="flex-row h-64 w-full gap-1 mb-4 rounded-2xl overflow-hidden">
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => onMediaPress(0)}
                    className="flex-1 h-full bg-surface"
                >
                    <Image source={{ uri: items[0] }} className="w-full h-full" resizeMode="cover" />
                </TouchableOpacity>
                <View className="flex-1 h-full gap-1">
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => onMediaPress(1)}
                        className="flex-1 bg-surface"
                    >
                        <Image source={{ uri: items[1] }} className="w-full h-full" resizeMode="cover" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => onMediaPress(2)}
                        className="flex-1 bg-surface relative"
                    >
                        <Image source={{ uri: items[2] }} className="w-full h-full" resizeMode="cover" />
                        {items.length > 3 && (
                            <View className="absolute inset-0 bg-black/40 items-center justify-center">
                                <ThemedText className="text-white font-bold text-lg">+{items.length - 3}</ThemedText>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // Default 2 images (side by side)
    return (
        <View className="flex-row h-48 w-full gap-1 mb-4 rounded-2xl overflow-hidden">
            {items.map((img, i) => (
                <TouchableOpacity
                    key={i}
                    activeOpacity={0.9}
                    onPress={() => onMediaPress(i)}
                    className="flex-1 bg-surface"
                >
                    <Image source={{ uri: img }} className="w-full h-full" resizeMode="cover" />
                </TouchableOpacity>
            ))}
        </View>
    );
};
