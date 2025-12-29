import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '../../ui/ThemedText';
import { Response } from '../../../services/api.types';

interface ResponseItemProps {
    response: Response;
    onDelete: (id: string) => void;
    canDelete: boolean;
}

export const ResponseItem = ({ response, onDelete, canDelete }: ResponseItemProps) => (
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
