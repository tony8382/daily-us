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
    comments: number;
}

export const MOCK_USER_CURRENT: User = {
    id: 'u1',
    name: 'Sarah',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
};

export const MOCK_USER_PARTNER: User = {
    id: 'u2',
    name: 'Mike',
    avatar: 'https://i.pravatar.cc/150?u=mike',
};

export const MOCK_COUPLE: CoupleProfile = {
    user1: MOCK_USER_CURRENT,
    user2: MOCK_USER_PARTNER,
    anniversaryDate: '2022-05-14', // Example
    daysTogether: 1240,
};

export const MOCK_MOOD: MoodStatus = {
    lastUpdated: new Date().toISOString(),
    mood: 'Missing you',
    note: 'Missing you a little extra today...',
    authorId: 'u1',
};

export const MOCK_FEED: FeedItem[] = [
    {
        id: 'f1',
        type: 'photo',
        date: '2023-10-05',
        displayDate: { day: '05', month: 'OCT' },
        title: 'Kyoto Adventures 🍵',
        description: 'The matcha ice cream was amazing! Can’t wait to go back. Walking through Fushimi Inari was tiring but worth it for the view.',
        media: [
            'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80', // Street
            'https://plus.unsplash.com/premium_photo-1664368832311-7fe635e32c7c?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Ice cream / Food
            'https://images.unsplash.com/photo-1504150558240-0b4fd8946624?q=80&w=928&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Couple/People
        ],
        location: 'Kyoto, Japan',
        likes: { count: 3, lastLikedBy: MOCK_USER_PARTNER },
        comments: 2,
    },
    {
        id: 'f2',
        type: 'video',
        date: '2023-09-12',
        displayDate: { day: '12', month: 'SEP' },
        title: 'Movie Marathon Night 🍿',
        description: 'Late night Harry Potter marathon. I fell asleep halfway through the 4th...',
        media: [
            'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80', // TV/Movie placeholder
        ],
        likes: { count: 1, lastLikedBy: MOCK_USER_CURRENT },
        comments: 4,
    },
    {
        id: 'f3',
        type: 'text',
        date: '2023-09-12',
        displayDate: { day: '12', month: 'SEP' },
        title: 'Movie Marathon Night 🍿',
        description: 'Late night Harry Potter marathon. I fell asleep halfway through the 4th...',
        media: [
            'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80', // TV/Movie placeholder
        ],
        likes: { count: 1, lastLikedBy: MOCK_USER_CURRENT },
        comments: 4,
    }
];
