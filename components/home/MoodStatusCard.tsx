import React, { useState } from 'react';
import { View, TouchableOpacity, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { MoodStatus } from '../../services/api.types';
import { ThemedText } from '../ui/ThemedText';
import { t } from '../../i18n/t';

const CountdownItem = ({ value, label }: { value: string; label: string }) => (
    <View className="items-center justify-center bg-surface-highlight rounded-2xl w-20 h-24 border border-border">
        <ThemedText className="text-2xl font-bold mb-1 text-text-primary">{value}</ThemedText>
        <ThemedText className="text-[10px] uppercase font-medium text-text-secondary tracking-wider">{label}</ThemedText>
    </View>
);

interface MoodStatusCardProps {
    mood: MoodStatus | null;
    daysTogether: number;
    onUpdateMood?: (note: string) => void;
}

export const MoodStatusCard = ({ mood, daysTogether, onUpdateMood }: MoodStatusCardProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(mood?.note || '');

    if (!mood) return null;

    const handleSave = () => {
        if (onUpdateMood && editValue.trim() !== mood.note) {
            onUpdateMood(editValue);
        }
        setIsEditing(false);
    };

    return (
        <View className="px-4 mb-6">
            <View className="p-5 rounded-[32px] bg-surface border border-border shadow-sm relative overflow-hidden">

                {/* Mood Section */}
                <View className="mb-6">
                    <View className="flex-row items-center justify-between mb-2">
                        <ThemedText className="text-[10px] font-bold text-red-400 tracking-widest uppercase">{t('home.moodTitle')}</ThemedText>
                        <TouchableOpacity onPress={() => {
                            if (isEditing) handleSave();
                            else {
                                setEditValue(mood.note);
                                setIsEditing(true);
                            }
                        }}>
                            <Feather
                                name={isEditing ? "check" : "edit-2"}
                                size={14}
                                className={isEditing ? "text-green-500" : "text-text-secondary"}
                            />
                        </TouchableOpacity>
                    </View>

                    {isEditing ? (
                        <TextInput
                            value={editValue}
                            onChangeText={setEditValue}
                            className="text-lg font-medium italic text-text-primary p-0"
                            autoFocus
                            multiline
                            onBlur={handleSave}
                        />
                    ) : (
                        <ThemedText className="text-lg font-medium italic opacity-90">"{mood.note}"</ThemedText>
                    )}
                </View>

                {/* Divider */}
                <View className="h-[1px] bg-border w-full mb-5" />

                {/* Anniversary Header */}
                <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-row items-center gap-2">
                        <Feather name="calendar" size={14} color="#f87171" />
                        <ThemedText className="text-text-secondary text-xs">{t('home.anniversary')}</ThemedText>
                    </View>
                    <View className="bg-red-500/10 px-2 py-1 rounded-full border border-red-500/20">
                        <ThemedText className="text-red-400 text-[10px] font-bold">{t('common.upcoming')}</ThemedText>
                    </View>
                </View>

                {/* Countdown */}
                <View className="flex-row justify-between mb-2">
                    <CountdownItem value="02" label={t('time.months')} />
                    <CountdownItem value="14" label={t('time.days')} />
                    <CountdownItem value="08" label={t('time.hours')} />
                </View>

            </View>

            {/* Days Together Footer */}
            <View className="items-center mt-4 flex-row justify-center gap-2">
                <Feather name="heart" size={14} color="#f87171" fill="#f87171" />
                <ThemedText className="text-text-secondary text-sm font-medium">
                    {t('home.lovingFor')} <ThemedText className="font-bold">{daysTogether} {t('home.days')}</ThemedText>
                </ThemedText>
            </View>
        </View>
    );
};
