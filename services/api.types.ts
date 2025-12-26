export interface User {
    id: string;
    name: string;
    avatar: string;
}

export interface CoupleProfile {
    user1: User;
    user2: User;
    anniversaryDate: string; // ISO String
    coverImage?: string;
    daysTogether: number;
}

export interface MoodStatus {
    lastUpdated: string;
    mood: string;
    note: string;
    authorId: string;
}

export interface FeedItem {
    id: string;
    type: 'photo' | 'video' | 'text';
    date: string; // ISO String for sorting
    displayDate: {
        day: string;
        month: string;
    }; // For the left side indicator
    title: string;
    description: string;
    media: string[]; // URLs
    location?: string;
    likes: {
        count: number;
        lastLikedBy: User;
    };
    isLiked: boolean; // Current user liked status
    comments: number;
}

export interface DailyUsApiInterface {
    getCoupleProfile(): Promise<CoupleProfile>;
    getMoodStatus(): Promise<MoodStatus>;
    updateMood(note: string): Promise<MoodStatus>;
    getFeed(): Promise<FeedItem[]>;
}
