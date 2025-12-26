import { useState, useEffect } from 'react';
import { api } from '../services/dailyUsApi';
import { CoupleProfile, FeedItem, MoodStatus } from '../services/api.types';

export const useDailyUsData = () => {
    const [profile, setProfile] = useState<CoupleProfile | null>(null);
    const [mood, setMood] = useState<MoodStatus | null>(null);
    const [feed, setFeed] = useState<FeedItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [profileData, moodData, feedData] = await Promise.all([
                    api.profile,
                    api.mood,
                    api.feed,
                ]);
                setProfile(profileData);
                setMood(moodData);
                setFeed(feedData);
            } catch (error) {
                console.error('Failed to load data', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const updateMood = async (note: string) => {
        try {
            const newMood = await api.updateMood(note);
            setMood(newMood);
        } catch (error) {
            console.error('Failed to update mood', error);
        }
    };

    return { profile, mood, feed, loading, updateMood };
};
