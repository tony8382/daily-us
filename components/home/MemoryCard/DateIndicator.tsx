import React from 'react';
import { View } from 'react-native';
import { ThemedText } from '../../ui/ThemedText';

interface DateIndicatorProps {
    day: string;
    month: string;
}

export const DateIndicator = ({ day, month }: DateIndicatorProps) => (
    <View className="w-12 items-center pt-2">
        <ThemedText className="text-xl font-bold">{day}</ThemedText>
        <ThemedText className="text-[10px] font-bold uppercase text-text-secondary">{month}</ThemedText>
    </View>
);
