export interface UserConfig {
    maxImagesPerPost: number;
    maxDescriptionLength: number;
}

export interface User {
    id: string;
    name: string;
    avatar: string;
    config?: UserConfig;
}

export interface CoupleProfile {
    user1: User;
    user2: User;
    anniversaryDate: string; // ISO String
    coverImage?: string;
    daysTogether: number;
}

export interface MoodStatus {
    lastUpdatedDate: Date;
    mood: string;
    note: string;
    authorId: string;
}

export interface Response {
    id: string;
    userId: string;
    userName: string;
    createdDate: Date;
    message: string;
}

export interface FeedItem {
    id: string;
    type: 'photo' | 'video' | 'text';
    createdDate: Date;
    lastUpdatedDate: Date;
    title: string;
    description: string;
    media: string[]; // URLs
    location?: string;
    likes: {
        count: number;
        lastLikedBy: User;
    };
    isLiked: boolean; // Current user liked status
    isPartnerLiked?: boolean; // Partner liked status
    comments: number;
    hashtags?: string[];
    responses?: Response[];
}

export interface DailyUsApiInterface {
    getCoupleProfile(): Promise<CoupleProfile>;
    getMoodStatus(): Promise<MoodStatus>;
    updateMood(note: string): Promise<MoodStatus>;
    getFeed(): Promise<FeedItem[]>;
    createPost(post: Omit<FeedItem, 'id' | 'likes' | 'comments' | 'createdDate' | 'isLiked' | 'isPartnerLiked'>): Promise<FeedItem>;
    updatePost(postId: string, post: Partial<Omit<FeedItem, 'id' | 'likes' | 'comments' | 'createdDate' | 'isLiked' | 'isPartnerLiked'>>): Promise<FeedItem>;
    toggleLike(postId: string): Promise<FeedItem>;
    deletePost(postId: string): Promise<void>;
    deleteResponse(postId: string, responseId: string): Promise<void>;
}
