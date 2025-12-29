import { useState, useEffect, useCallback } from 'react';
import { Alert, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { api } from '../../../services/dailyUsApi';
import { FeedItem, Response, User } from '../../../services/api.types';
import { t } from '../../../i18n/t';

export const useMemoryActions = (item: FeedItem, myId: string, myName: string) => {
    const navigation = useNavigation<any>();
    const [responses, setResponses] = useState<Response[]>(item.responses || []);
    const [likes, setLikes] = useState<string[]>(item.likes || []);
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [showerVisible, setShowerVisible] = useState(false);

    useEffect(() => {
        setResponses(item.responses || []);
        setLikes(item.likes || []);
    }, [item.responses, item.likes]);

    const handleToggleLike = async () => {
        try {
            await api.toggleLike(item.id);
            if (likes.includes(myId)) {
                setLikes(likes.filter(id => id !== myId));
            } else {
                setLikes([...likes, myId]);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSendReply = () => {
        if (!replyText.trim()) return;

        const newResponse: Response = {
            id: `r-${Date.now()}`,
            userId: myId,
            userName: myName,
            createdDate: new Date(),
            message: replyText.trim(),
        };

        setResponses(prev => [...prev, newResponse]);
        setReplyText('');
        setShowReplyInput(false);
        Keyboard.dismiss();
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
                            setResponses(prev => prev.filter(r => r.id !== id));
                        } catch (error) {
                            console.error('Failed to delete response', error);
                        }
                    }
                }
            ]
        );
    };

    const confirmDeletePost = useCallback(() => {
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
    }, [item.id]);

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

    return {
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
    };
};
