import { Text, TextProps } from 'react-native';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ThemedTextProps extends TextProps {
    className?: string;
    variant?: 'default' | 'title' | 'subtitle' | 'caption';
}

export function ThemedText({ className, variant = 'default', ...props }: ThemedTextProps) {
    const baseStyle = "text-text-primary dark:text-text-primary"; // Ensuring it hits the variable

    const variants = {
        default: "text-base",
        title: "text-xl font-bold",
        subtitle: "text-lg font-medium text-text-secondary",
        caption: "text-xs text-text-secondary",
    };

    return (
        <Text
            className={twMerge(baseStyle, variants[variant], className)}
            {...props}
        />
    );
}
