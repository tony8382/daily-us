import React, { useEffect } from 'react';
import { View, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const FallingHeart = () => {
    const startX = Math.random() * SCREEN_WIDTH;
    const endX = startX + (Math.random() - 0.5) * 150;
    const duration = 2500 + Math.random() * 2000;
    const delay = Math.random() * 2000;
    const size = 15 + Math.random() * 25;
    const color = ['#ef4444', '#ec4899', '#f43f5e', '#fb7185'][Math.floor(Math.random() * 4)];

    const translateY = useSharedValue(-50);
    const translateX = useSharedValue(startX);
    const opacity = useSharedValue(1);
    const rotate = useSharedValue(Math.random() * 360);

    useEffect(() => {
        translateY.value = withDelay(delay, withTiming(SCREEN_HEIGHT + 50, { duration }));
        translateX.value = withDelay(delay, withTiming(endX, { duration }));
        opacity.value = withDelay(delay + duration * 0.8, withTiming(0, { duration: duration * 0.2 }));
        rotate.value = withDelay(delay, withTiming(rotate.value + (Math.random() > 0.5 ? 360 : -360), { duration }));
    }, []);

    const style = useAnimatedStyle(() => ({
        position: 'absolute',
        top: 0,
        left: 0,
        transform: [
            { translateY: translateY.value },
            { translateX: translateX.value },
            { rotate: `${rotate.value}deg` }
        ],
        opacity: opacity.value,
    }));

    return (
        <Animated.View style={style} pointerEvents="none">
            <Ionicons name="heart" size={size} color={color} />
        </Animated.View>
    );
};

interface HeartShowerProps {
    visible: boolean;
    onClose: () => void;
}

export const HeartShower = ({ visible, onClose }: HeartShowerProps) => {
    useEffect(() => {
        if (visible) {
            const timer = setTimeout(onClose, 5000);
            return () => clearTimeout(timer);
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={{ flex: 1, backgroundColor: 'transparent' }} pointerEvents="none">
                {[...Array(40)].map((_, i) => (
                    <FallingHeart key={i} />
                ))}
            </View>
        </Modal>
    );
};
