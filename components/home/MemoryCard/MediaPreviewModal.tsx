import React, { useState, useEffect, useRef } from 'react';
import { View, Image, TouchableOpacity, Modal, Dimensions, FlatList, Share } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
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
import { ThemedText } from '../../ui/ThemedText';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface MediaPreviewModalProps {
    visible: boolean;
    onClose: () => void;
    media: string[];
    initialIndex?: number;
}

export const MediaPreviewModal = ({
    visible,
    onClose,
    media,
    initialIndex = 0
}: MediaPreviewModalProps) => {
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
                translateY.value = withTiming(event.translationY > 0 ? SCREEN_HEIGHT : -SCREEN_HEIGHT, { duration: 250 }, () => {
                    runOnJS(onClose)();
                });
            } else {
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
            animationType="none"
            onRequestClose={onClose}
        >
            <GestureHandlerRootView style={{ flex: 1 }}>
                <Animated.View style={[{ flex: 1 }, backgroundStyle]}>
                    <GestureDetector gesture={gesture}>
                        <View style={{ flex: 1 }}>
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
