import { Feather, Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import clsx from 'clsx';
import * as ImagePicker from 'expo-image-picker';
import React, { useState, useCallback } from 'react';
import { Alert, Image, ScrollView, TextInput, TouchableOpacity, View, Platform, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '../components/ui/ThemedText';
import { MOCK_USER_CURRENT } from '../data/mock';
import { t } from '../i18n/t';
import { api } from '../services/dailyUsApi';

export default function AddPostScreen() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    // Config from User
    const config = MOCK_USER_CURRENT.config || { maxImagesPerPost: 5, maxDescriptionLength: 200 };

    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [hashtags, setHashtags] = useState<string[]>([]);
    const [newHashtag, setNewHashtag] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    useFocusEffect(
        useCallback(() => {
            resetForm();
        }, [])
    );

    const pickImage = async () => {
        if (selectedImages.length >= config.maxImagesPerPost) {
            Alert.alert("Limit Reached", `You can only upload up to ${config.maxImagesPerPost} images.`);
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsMultipleSelection: true,
            selectionLimit: config.maxImagesPerPost - selectedImages.length,
            quality: 0.8,
        });

        if (!result.canceled) {
            const newUris = result.assets.map(asset => asset.uri);
            setSelectedImages(prev => [...prev, ...newUris].slice(0, config.maxImagesPerPost));
        }
    };

    const removeImage = (uri: string) => {
        setSelectedImages(selectedImages.filter(i => i !== uri));
    };

    const addHashtag = () => {
        if (newHashtag.trim() && !hashtags.includes(newHashtag.trim())) {
            setHashtags([...hashtags, newHashtag.trim()]);
            setNewHashtag('');
        }
    };

    const removeHashtag = (tag: string) => {
        setHashtags(hashtags.filter(h => h !== tag));
    };

    const onDateChange = (event: any, date?: Date) => {
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }
        if (date) {
            setSelectedDate(date);
        }
    };

    const resetForm = () => {
        setSelectedImages([]);
        setTitle('');
        setDescription('');
        setHashtags([]);
        setNewHashtag('');
        setSelectedDate(new Date());
    };

    const handlePost = async () => {
        if (!title.trim()) {
            Alert.alert(t('common.error'), "Please enter a title");
            return;
        }

        try {
            await api.createPost({
                type: selectedImages.length > 0 ? 'photo' : 'text',
                title,
                description,
                media: selectedImages,
                lastUpdatedDate: selectedDate,
            });
            resetForm();
            navigation.goBack();
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to create post");
        }
    };

    const formattedDate = selectedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });

    return (
        <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-border mb-2">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ThemedText className="text-text-secondary text-base">Cancel</ThemedText>
                </TouchableOpacity>
                <ThemedText className="text-lg font-bold">New Post</ThemedText>
                <TouchableOpacity onPress={handlePost}>
                    <ThemedText className="text-blue-500 font-bold text-base">Post</ThemedText>
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>

                {/* Media Section */}
                <View className="px-4 mb-6">
                    <View className="flex-row items-center justify-between mb-3">
                        <ThemedText className="text-text-secondary font-medium text-sm">Media Library</ThemedText>
                        <ThemedText className="text-text-secondary text-xs">{selectedImages.length}/{config.maxImagesPerPost}</ThemedText>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-3">
                        <TouchableOpacity
                            onPress={pickImage}
                            className="w-24 h-24 rounded-2xl border border-dashed border-border items-center justify-center bg-surface"
                        >
                            <Ionicons name="add-circle-outline" size={32} color="#71717a" />
                            <ThemedText className="text-[10px] text-text-secondary mt-1">Add Media</ThemedText>
                        </TouchableOpacity>

                        {selectedImages.map((uri, index) => (
                            <View key={index} className="relative w-24 h-24 rounded-2xl overflow-hidden">
                                <Image source={{ uri }} className="w-full h-full" resizeMode="cover" />
                                <TouchableOpacity
                                    onPress={() => removeImage(uri)}
                                    className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full items-center justify-center"
                                >
                                    <Ionicons name="close" size={14} color="white" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* Content Section */}
                <View className="px-4 mb-6">
                    <ThemedText className="text-text-secondary font-medium mb-3 text-sm">Content</ThemedText>
                    <View className="bg-surface rounded-3xl border border-border p-5 pb-2 shadow-sm">
                        <TextInput
                            placeholder="Memory Title..."
                            placeholderTextColor="#52525b"
                            value={title}
                            onChangeText={setTitle}
                            className="text-xl font-bold text-text-primary mb-4 border-b border-border/50 pb-2"
                        />

                        <TextInput
                            placeholder="Write your story here..."
                            placeholderTextColor="#71717a"
                            value={description}
                            onChangeText={(text) => {
                                if (text.length <= config.maxDescriptionLength) {
                                    setDescription(text);
                                }
                            }}
                            multiline
                            textAlignVertical="top"
                            className="text-base text-text-secondary min-h-[120px] mb-2"
                        />

                        <View className="flex-row justify-end mb-2">
                            <ThemedText className={clsx(
                                "text-[10px] font-medium px-2 py-0.5 rounded-full bg-background border border-border",
                                description.length >= config.maxDescriptionLength ? "text-red-400 border-red-400/20" : "text-text-secondary"
                            )}>
                                {description.length}/{config.maxDescriptionLength}
                            </ThemedText>
                        </View>
                    </View>
                </View>

                {/* Details Section */}
                <View className="px-4 mb-6">
                    <ThemedText className="text-text-secondary font-medium mb-3 text-sm">Details</ThemedText>

                    <View className="bg-surface rounded-3xl border border-border p-5 shadow-sm">
                        {/* Date Selection */}
                        <View className="mb-6">
                            <ThemedText className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-3">Published Date</ThemedText>
                            <TouchableOpacity
                                onPress={() => setShowDatePicker(true)}
                                className="flex-row items-center justify-between bg-background border border-border rounded-2xl px-4 py-4"
                            >
                                <ThemedText className="text-text-primary font-medium">{formattedDate}</ThemedText>
                                <Feather name="calendar" size={18} color="#71717a" />
                            </TouchableOpacity>
                        </View>

                        {/* Hashtags */}
                        <View>
                            <ThemedText className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-3">Hashtags</ThemedText>

                            <View className="flex-row flex-wrap gap-2 mb-3">
                                {hashtags.map((tag, idx) => (
                                    <View key={idx} className="bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-full flex-row items-center gap-2">
                                        <ThemedText className="text-blue-400 text-xs font-medium">#{tag}</ThemedText>
                                        <TouchableOpacity onPress={() => removeHashtag(tag)}>
                                            <Ionicons name="close-circle" size={14} color="#60a5fa" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>

                            <View className="flex-row items-center bg-background border border-border rounded-2xl px-4 overflow-hidden">
                                <ThemedText className="text-text-secondary font-bold mr-1">#</ThemedText>
                                <TextInput
                                    placeholder="add_tag"
                                    placeholderTextColor="#52525b"
                                    value={newHashtag}
                                    onChangeText={setNewHashtag}
                                    className="flex-1 py-3 text-text-primary text-sm"
                                    onSubmitEditing={addHashtag}
                                    autoCorrect={false}
                                    autoCapitalize="none"
                                />
                                <TouchableOpacity onPress={addHashtag}>
                                    <Ionicons name="add-circle" size={24} color={newHashtag.trim() ? "#3b82f6" : "#27272a"} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Final Actions */}
                <View className="px-4 mb-4">
                    <TouchableOpacity
                        onPress={handlePost}
                        className="bg-blue-500 rounded-2xl py-5 items-center shadow-lg shadow-blue-500/20"
                    >
                        <ThemedText className="font-bold text-white text-lg">Post Memory</ThemedText>
                    </TouchableOpacity>
                </View>

            </ScrollView>

            {/* iOS Date Picker Modal */}
            {Platform.OS === 'ios' && (
                <Modal
                    visible={showDatePicker}
                    transparent
                    animationType="slide"
                >
                    <View className="flex-1 justify-end bg-black/40">
                        <View className="bg-surface rounded-t-3xl pb-10">
                            <View className="flex-row justify-between items-center px-6 py-4 border-b border-border">
                                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                                    <ThemedText className="text-text-secondary font-medium">Cancel</ThemedText>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                                    <ThemedText className="text-blue-500 font-bold">Done</ThemedText>
                                </TouchableOpacity>
                            </View>
                            <DateTimePicker
                                value={selectedDate}
                                mode="date"
                                display="spinner"
                                onChange={onDateChange}
                                style={{ height: 200 }}
                                textColor="#000000" // Explicitly black for visibility on white background
                                themeVariant="light" // Force light theme for the white modal background
                            />
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
}
