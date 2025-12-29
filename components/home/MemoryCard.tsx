import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { FeedItem } from '../../services/api.types';
import { useDailyUsData } from '../../hooks/useDailyUsData';
import { ThemedText } from '../ui/ThemedText';
import { t } from '../../i18n/t';

// Sub-components
import { DateIndicator } from './MemoryCard/DateIndicator';
import { MediaGrid } from './MemoryCard/MediaGrid';
import { MediaPreviewModal } from './MemoryCard/MediaPreviewModal';
import { ResponseItem } from './MemoryCard/ResponseItem';
import { HeartShower } from './MemoryCard/HeartShower';

// Custom Hook
import { useMemoryActions } from './MemoryCard/useMemoryActions';

export const MemoryCard = ({ item }: { item: FeedItem }) => {
    const { profile } = useDailyUsData();

    // User derivation
    const currentUser = profile?.me;
    const partnerUser = profile?.partner;
    const myId = currentUser?.id || 'u1';
    const partnerId = partnerUser?.id || 'u2';
    const myName = currentUser?.name || 'Sarah';
    const partnerName = partnerUser?.name || 'Mike';
    const currentUserId = myId;

    // Actions Hook
    const {
        responses,
        likes,
        showReplyInput,
        setShowReplyInput,
        replyText,
        setReplyText,
        showerVisible,
        setShowerVisible,
        handleToggleLike,
        handleSendReply,
        handleDeleteResponse,
        handleMenuPress
    } = useMemoryActions(item, myId, myName);

    // Local State for Preview
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewIndex, setPreviewIndex] = useState(0);

    // Derived State for Likes
    const isLiked = likes.includes(myId);
    const isPartnerLiked = likes.includes(partnerId);

    // Date Logic
    const date = new Date(item.lastUpdatedDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();

    // Keyboard handling for auto-close
    useEffect(() => {
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => setShowReplyInput(false)
        );
        return () => keyboardDidHideListener.remove();
    }, []);

    const getLikeText = () => {
        if (isLiked && isPartnerLiked) return t('feed.bothLiked', { me: myName, partner: partnerName });
        if (isLiked) return t('feed.onlyMeLiked', { me: myName });
        if (isPartnerLiked) return t('feed.onlyPartnerLiked', { partner: partnerName });
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

    return (
        <View className="flex-row px-4 mb-8">
            <DateIndicator day={day} month={month} />

            <View className="flex-1 ml-4 bg-background border border-border rounded-3xl p-4 shadow-sm">
                <View className="relative">
                    <MediaGrid
                        items={item.media}
                        onMediaPress={(index) => {
                            setPreviewIndex(index);
                            setPreviewVisible(true);
                        }}
                    />
                    <View className="absolute top-3 right-3 flex-row gap-2">
                        {item.media.length > 1 && (
                            <View className="bg-black/60 px-2 py-1 rounded-full flex-row items-center gap-1 border border-white/20">
                                <Feather name="image" size={10} color="white" />
                                <ThemedText className="text-white text-[10px] font-bold">{t('feed.tripDay2')}</ThemedText>
                            </View>
                        )}
                    </View>
                </View>

                <View className="flex-row items-center justify-between mb-2 px-1">
                    <ThemedText variant="title" className="text-lg font-bold">{item.title}</ThemedText>
                    <TouchableOpacity onPress={handleMenuPress} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <Feather name="more-horizontal" size={20} className="text-text-secondary" />
                    </TouchableOpacity>
                </View>

                <ThemedText className="text-text-secondary text-sm leading-5 mb-2 px-1">
                    {item.description}
                </ThemedText>

                {item.hashtags && item.hashtags.length > 0 && (
                    <View className="flex-row flex-wrap gap-x-2 px-1 mb-4">
                        {item.hashtags.map((tag, idx) => (
                            <ThemedText key={idx} className="text-blue-500 text-xs font-medium">#{tag}</ThemedText>
                        ))}
                    </View>
                )}

                <View className="flex-row items-center justify-between mt-2 pt-3 border-t border-border">
                    <TouchableOpacity
                        onPress={handleToggleLike}
                        onLongPress={() => setShowerVisible(true)}
                        delayLongPress={300}
                        className="flex-row items-center gap-2"
                    >
                        <Ionicons name={getLikeIcon() as any} size={22} color={getLikeColor()} />
                        <ThemedText className="text-xs text-text-secondary font-medium">{getLikeText()}</ThemedText>
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
                        <TouchableOpacity onPress={handleSendReply} className="bg-blue-500 w-10 h-10 rounded-xl items-center justify-center shadow-sm">
                            <Feather name="send" size={18} color="white" />
                        </TouchableOpacity>
                    </View>
                )}

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

            <HeartShower visible={showerVisible} onClose={() => setShowerVisible(false)} />

            <MediaPreviewModal
                visible={previewVisible}
                onClose={() => setPreviewVisible(false)}
                media={item.media}
                initialIndex={previewIndex}
            />
        </View>
    );
};
