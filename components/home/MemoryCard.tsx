import React, { useState, useEffect, useRef } from 'react';
import { View, Image, TouchableOpacity, Modal, Dimensions, FlatList, Share, TextInput, KeyboardAvoidingView, Platform, Keyboard, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { FeedItem, User } from '../../services/api.types';
import { api } from '../../services/dailyUsApi';
import { MOCK_USER_CURRENT } from '../../data/mock';
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

const ResponseItem = ({ response, onDelete, canDelete }: { response: any; onDelete: (id: string) => void, canDelete: boolean }) => (
    <View className="flex-row items-center justify-between py-2 border-b border-border/50">
        <View className="flex-1 pr-4">
            <View className="flex-row items-center gap-2 mb-0.5">
                <ThemedText className="text-xs font-bold text-text-primary">{response.userName}</ThemedText>
                <ThemedText className="text-[10px] text-text-secondary">
                    {new Date(response.createdDate).toLocaleDateString()}
                </ThemedText>
            </View>
            <ThemedText className="text-sm text-text-secondary">{response.message}</ThemedText>
        </View>
        {canDelete && (
            <TouchableOpacity
                onPress={() => onDelete(response.id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <Feather name="trash-2" size={12} className="text-text-secondary/50" />
            </TouchableOpacity>
        )}
    </View>
);

export const MemoryCard = ({ item }: { item: FeedItem }) => {
    const navigation = useNavigation<any>();
    const currentUserId = MOCK_USER_CURRENT.id;
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewIndex, setPreviewIndex] = useState(0);
    const [responses, setResponses] = useState(item.responses || []);
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [isLiked, setIsLiked] = useState(item.isLiked);
    const [isPartnerLiked, setIsPartnerLiked] = useState(item.isPartnerLiked);
    const [partnerName] = useState('Mike'); // Mock partner name
    const [myName] = useState('Sarah'); // Mock my name

    // Format date from lastUpdatedDate
    const date = new Date(item.lastUpdatedDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();

    const handleMediaPress = (index: number) => {
        setPreviewIndex(index);
        setPreviewVisible(true);
    };

    const handleSendReply = () => {
        if (!replyText.trim()) return;

        const newResponse = {
            id: `r-${Date.now()}`,
            userId: 'u1', // Hardcoded as current user for now
            userName: 'Sarah', // Hardcoded for now
            createdDate: new Date(),
            message: replyText.trim(),
        };

        setResponses([...responses, newResponse]);
        setReplyText('');
        setShowReplyInput(false);
        Keyboard.dismiss();
    };

    const handleToggleLike = async () => {
        try {
            await api.toggleLike(item.id);
            setIsLiked(!isLiked);
        } catch (error) {
            console.error(error);
        }
    };

    const getLikeText = () => {
        if (isLiked && isPartnerLiked) {
            return t('feed.bothLiked', { me: myName, partner: partnerName });
        }
        if (isLiked) {
            return t('feed.onlyMeLiked', { me: myName });
        }
        if (isPartnerLiked) {
            return t('feed.onlyPartnerLiked', { partner: partnerName });
        }
        return t('feed.noLikes');
    };

    const getLikeIcon = () => {
        if (isLiked && isPartnerLiked) return "heart-sharp";
        if (isLiked) return "heart";
        return "heart-outline";
    };

    const getLikeColor = () => {
        if (isLiked && isPartnerLiked) return "#ec4899";
        if (isLiked) return "#ef4444";
        return "#71717a";
    };

    const handleDeleteResponse = async (id: string) => {
        Alert.alert(
            t('feed.deleteReplyTitle') || "Delete Reply",
            t('feed.deleteReplyMessage') || "Are you sure you want to delete this reply?",
            [
                { text: t('common.cancel') || "Cancel", style: "cancel" },
                {
                    text: t('common.delete') || "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await api.deleteResponse(item.id, id);
                            setResponses(responses.filter(r => r.id !== id));
                        } catch (error) {
                            console.error('Failed to delete response', error);
                        }
                    }
                }
            ]
        );
    };

    const handleMenuPress = () => {
        Alert.alert(
            t('feed.menuTitle') || "Memory Actions",
            t('feed.menuMessage') || "What would you like to do?",
            [
                {
                    text: t('feed.editMemory') || "Edit",
                    onPress: () => navigation.navigate('NewPost', { editingPost: item })
                },
                {
                    text: t('feed.deleteMemory') || "Delete",
                    style: "destructive",
                    onPress: confirmDeletePost
                },
                { text: t('common.cancel') || "Cancel", style: "cancel" }
            ]
        );
    };

    const confirmDeletePost = () => {
        Alert.alert(
            t('feed.deletePostTitle') || "Delete Memory",
            t('feed.deletePostMessage') || "Are you sure you want to delete this memory?",
            [
                { text: t('common.cancel'), style: "cancel" },
                {
                    text: t('common.delete'),
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await api.deletePost(item.id);
                            Alert.alert(t('common.done'), t('feed.postDeleted') || "Memory deleted");
                        } catch (error) {
                            console.error(error);
                        }
                    }
                }
            ]
        );
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
                    <TouchableOpacity
                        onPress={handleMenuPress}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Feather name="more-horizontal" size={20} className="text-text-secondary" />
                    </TouchableOpacity>
                </View>

                {/* Description */}
                <ThemedText className="text-text-secondary text-sm leading-5 mb-2 px-1">
                    {item.description}
                </ThemedText>

                {/* Hashtags */}
                {item.hashtags && item.hashtags.length > 0 && (
                    <View className="flex-row flex-wrap gap-x-2 px-1 mb-4">
                        {item.hashtags.map((tag, idx) => (
                            <ThemedText key={idx} className="text-blue-500 text-xs font-medium">
                                #{tag}
                            </ThemedText>
                        ))}
                    </View>
                )}

                {/* Footer Actions */}
                <View className="flex-row items-center justify-between mt-2 pt-3 border-t border-border">
                    <TouchableOpacity
                        onPress={handleToggleLike}
                        className="flex-row items-center gap-2"
                    >
                        <Ionicons
                            name={getLikeIcon() as any}
                            size={22}
                            color={getLikeColor()}
                        />
                        <ThemedText className="text-xs text-text-secondary font-medium">
                            {getLikeText()}
                        </ThemedText>
                    </TouchableOpacity>

                    <View className="flex-row items-center gap-4">
                        <TouchableOpacity
                            onPress={() => setShowReplyInput(!showReplyInput)}
                            className="flex-row items-center gap-1.5 bg-surface px-3 py-1.5 rounded-full border border-border"
                        >
                            <Feather name="message-circle" size={14} className="text-blue-500" />
                            <ThemedText className="text-xs text-text-secondary font-medium">{t('feed.reply')}</ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Reply Input */}
                {showReplyInput && (
                    <View className="mt-4 pt-4 border-t border-border flex-row items-center gap-2">
                        <TextInput
                            className="flex-1 bg-surface border border-border rounded-xl px-3 py-2 text-text-primary text-sm"
                            placeholder={t('feed.writeReply') || "Write a reply..."}
                            placeholderTextColor="#a1a1aa"
                            value={replyText}
                            onChangeText={setReplyText}
                            autoFocus
                            multiline
                        />
                        <TouchableOpacity
                            onPress={handleSendReply}
                            className="bg-blue-500 w-10 h-10 rounded-xl items-center justify-center shadow-sm"
                        >
                            <Feather name="send" size={18} color="white" />
                        </TouchableOpacity>
                    </View>
                )}

                {/* Responses List */}
                {responses.length > 0 && (
                    <View className="mt-4 pt-2">
                        {responses.map((response) => (
                            <ResponseItem
                                key={response.id}
                                response={response}
                                onDelete={handleDeleteResponse}
                                canDelete={response.userId === currentUserId}
                            />
                        ))}
                    </View>
                )}

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
