import React, { useState, useEffect, useRef } from 'react';
import { View, Image, TouchableOpacity, Modal, Dimensions, FlatList, Share } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { FeedItem } from '../../services/api.types';
import { ThemedText } from '../ui/ThemedText';
import { t } from '../../i18n/t';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import clsx from 'clsx';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    runOnJS,
    interpolate
} from 'react-native-reanimated';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const DateIndicator = ({ day, month }: { day: string; month: string }) => (
    <View className="w-12 items-center pt-2">
        <ThemedText className="text-xl font-bold">{day}</ThemedText>
        <ThemedText className="text-[10px] font-bold uppercase text-text-secondary">{month}</ThemedText>
    </View>
);

const MediaPreviewModal = ({
    visible,
    onClose,
    media,
    initialIndex = 0
}: {
    visible: boolean;
    onClose: () => void;
    media: string[];
    initialIndex?: number;
}) => {
    const insets = useSafeAreaInsets();
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const flatListRef = useRef<FlatList>(null);

    // Reanimated Shared Values
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(1);
    const scale = useSharedValue(1);

    useEffect(() => {
        if (visible) {
            setCurrentIndex(initialIndex);
            translateY.value = 0;
            opacity.value = 1;
            scale.value = 1;
        }
    }, [visible, initialIndex]);

    const handleShare = async () => {
        try {
            await Share.share({
                url: media[currentIndex],
                message: `Check out this memory from DailyUs!`,
            });
        } catch (error) {
            console.error(error);
        }
    };

    // Gesture Handling
    const gesture = Gesture.Pan()
        .onUpdate((event) => {
            translateY.value = event.translationY;
            // Dim background and scale down image slightly as we pull away
            opacity.value = interpolate(
                Math.abs(event.translationY),
                [0, 300],
                [1, 0.4],
                'clamp'
            );
            scale.value = interpolate(
                Math.abs(event.translationY),
                [0, 300],
                [1, 0.85],
                'clamp'
            );
        })
        .onEnd((event) => {
            if (Math.abs(event.translationY) > 180 || Math.abs(event.velocityY) > 1200) {
                // Dismiss
                translateY.value = withTiming(event.translationY > 0 ? SCREEN_HEIGHT : -SCREEN_HEIGHT, { duration: 250 }, () => {
                    runOnJS(onClose)();
                });
            } else {
                // Reset
                translateY.value = withSpring(0);
                opacity.value = withSpring(1);
                scale.value = withSpring(1);
            }
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: translateY.value },
            { scale: scale.value }
        ],
    }));

    const backgroundStyle = useAnimatedStyle(() => ({
        backgroundColor: `rgba(0, 0, 0, ${opacity.value})`,
    }));

    const renderItem = ({ item }: { item: string }) => (
        <View style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT - insets.top - insets.bottom - 200 }} className="items-center justify-center">
            <Image
                source={{ uri: item }}
                style={{ width: SCREEN_WIDTH, height: '100%' }}
                resizeMode="contain"
            />
        </View>
    );

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none" // Custom animation with reanimated
            onRequestClose={onClose}
        >
            <GestureHandlerRootView style={{ flex: 1 }}>
                <Animated.View style={[{ flex: 1 }, backgroundStyle]}>
                    <GestureDetector gesture={gesture}>
                        <View style={{ flex: 1 }}>
                            {/* Header Actions */}
                            <View
                                style={{ paddingTop: insets.top + 10 }}
                                className="absolute top-0 left-0 right-0 z-10 flex-row justify-between px-6"
                            >
                                <TouchableOpacity
                                    onPress={onClose}
                                    className="w-10 h-10 bg-white/10 rounded-full items-center justify-center"
                                >
                                    <Ionicons name="close" size={24} color="white" />
                                </TouchableOpacity>

                                {media.length > 1 && (
                                    <View className="bg-white/10 px-3 py-1.5 rounded-full items-center justify-center">
                                        <ThemedText className="text-white text-xs font-bold">
                                            {currentIndex + 1} / {media.length}
                                        </ThemedText>
                                    </View>
                                )}

                                <TouchableOpacity
                                    onPress={handleShare}
                                    className="w-10 h-10 bg-white/10 rounded-full items-center justify-center"
                                >
                                    <Feather name="share" size={20} color="white" />
                                </TouchableOpacity>
                            </View>

                            {/* Media Content - Swipeable FlatList with Vertical Drag */}
                            <Animated.View style={[{ flex: 1, paddingTop: insets.top + 80, paddingBottom: insets.bottom + 120 }, animatedStyle]}>
                                <FlatList
                                    ref={flatListRef}
                                    data={media}
                                    renderItem={renderItem}
                                    horizontal
                                    pagingEnabled
                                    showsHorizontalScrollIndicator={false}
                                    initialScrollIndex={initialIndex}
                                    onScrollToIndexFailed={() => { }}
                                    getItemLayout={(_, index) => ({
                                        length: SCREEN_WIDTH,
                                        offset: SCREEN_WIDTH * index,
                                        index,
                                    })}
                                    onMomentumScrollEnd={(e) => {
                                        const newIndex = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
                                        setCurrentIndex(newIndex);
                                    }}
                                    keyExtractor={(item, index) => `${item}-${index}`}
                                />
                            </Animated.View>

                            {/* Footer / Pagination Indicator */}
                            <View style={{ position: 'absolute', bottom: insets.bottom + 40, width: '100%', alignItems: 'center' }}>
                                {media.length > 1 && (
                                    <View className="flex-row gap-1.5 px-6">
                                        {media.map((_, i) => (
                                            <View
                                                key={i}
                                                className={clsx(
                                                    "w-1.5 h-1.5 rounded-full",
                                                    i === currentIndex ? "bg-blue-500 w-4" : "bg-white/30"
                                                )}
                                            />
                                        ))}
                                    </View>
                                )}
                            </View>
                        </View>
                    </GestureDetector>
                </Animated.View>
            </GestureHandlerRootView>
        </Modal>
    );
};

const MediaGrid = ({ items, onMediaPress }: { items: string[], onMediaPress: (index: number) => void }) => {
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
        )
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
    )
}

export const MemoryCard = ({ item }: { item: FeedItem }) => {
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewIndex, setPreviewIndex] = useState(0);

    // Format date from lastUpdatedDate
    const date = new Date(item.lastUpdatedDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();

    const handleMediaPress = (index: number) => {
        setPreviewIndex(index);
        setPreviewVisible(true);
    };

    return (
        <View className="flex-row px-4 mb-8">
            {/* Date Column */}
            <DateIndicator day={day} month={month} />

            {/* Content Column */}
            <View className="flex-1 ml-4 bg-background border border-border rounded-3xl p-4 shadow-sm">

                {/* Media */}
                <View className="relative">
                    <MediaGrid items={item.media} onMediaPress={handleMediaPress} />

                    {/* Floating Badges */}
                    <View className="absolute top-3 right-3 flex-row gap-2">
                        {item.media.length > 1 && (
                            <View className="bg-black/60 px-2 py-1 rounded-full flex-row items-center gap-1 border border-white/20">
                                <Feather name="image" size={10} color="white" />
                                <ThemedText className="text-white text-[10px] font-bold">{t('feed.tripDay2')}</ThemedText>
                            </View>
                        )}
                    </View>
                </View>

                {/* Header/Title */}
                <View className="flex-row items-center justify-between mb-2 px-1">
                    <ThemedText variant="title" className="text-lg font-bold">{item.title}</ThemedText>
                    <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <Feather name="more-horizontal" size={20} className="text-text-secondary" />
                    </TouchableOpacity>
                </View>

                {/* Description */}
                <ThemedText className="text-text-secondary text-sm leading-5 mb-4 px-1">
                    {item.description}
                </ThemedText>

                {/* Footer Actions */}
                <View className="flex-row items-center justify-between mt-2 pt-3 border-t border-border">
                    <View className="flex-row items-center gap-2">
                        <Ionicons
                            name={item.isLiked ? "heart" : "heart-outline"}
                            size={20}
                            color={item.isLiked ? "#ef4444" : "#71717a"}
                        />
                        <ThemedText className="text-xs text-text-secondary font-medium">
                            <ThemedText className="font-bold text-text-primary">{item.likes.lastLikedBy.name}</ThemedText> {t('feed.likedThis')}
                        </ThemedText>
                    </View>

                    <View className="flex-row items-center gap-4">
                        <TouchableOpacity className="flex-row items-center gap-1.5 bg-surface px-3 py-1.5 rounded-full border border-border">
                            <Feather name="message-circle" size={14} className="text-blue-500" />
                            <ThemedText className="text-xs text-text-secondary font-medium">{t('feed.reply')}</ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>

            {/* Media Preview Modal */}
            <MediaPreviewModal
                visible={previewVisible}
                onClose={() => setPreviewVisible(false)}
                media={item.media}
                initialIndex={previewIndex}
            />
        </View>
    );
};
