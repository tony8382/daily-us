import { CoupleProfile, FeedItem, MoodStatus, User } from "services/api.types";

export const MOCK_USER_CURRENT: User = {
    id: 'u1',
    name: 'Sarah',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    config: {
        maxImagesPerPost: 5,
        maxDescriptionLength: 200,
    }
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
    lastUpdatedDate: new Date(),
    mood: 'Missing you',
    note: 'Missing you a little extra today...',
    authorId: 'u1',
};

export const MOCK_FEED: FeedItem[] = [
    {
        id: 'f1',
        type: 'photo',
        createdDate: new Date('2023-10-10T10:00:00Z'),
        lastUpdatedDate: new Date('2023-10-10T16:00:00Z'),
        title: 'Kyoto Adventures 🍵',
        description: 'The matcha ice cream was amazing! Can’t wait to go back. Walking through Fushimi Inari was tiring but worth it for the view.',
        media: [
            'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80', // Street
            'https://plus.unsplash.com/premium_photo-1664368832311-7fe635e32c7c?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Ice cream / Food
            'https://images.unsplash.com/photo-1504150558240-0b4fd8946624?q=80&w=928&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Couple/People
        ],
        location: 'Kyoto, Japan',
        likes: { count: 3, lastLikedBy: MOCK_USER_PARTNER },
        isLiked: false,
        comments: 2,
    },
    {
        id: 'f2',
        type: 'video',
        createdDate: new Date('2023-09-12T18:30:00Z'),
        lastUpdatedDate: new Date('2023-09-12T18:30:00Z'),
        title: 'Movie Marathon Night 🍿',
        description: 'Late night Harry Potter marathon. I fell asleep halfway through the 4th...',
        media: [
            'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80', // TV/Movie placeholder
        ],
        likes: { count: 1, lastLikedBy: MOCK_USER_CURRENT },
        isLiked: true, // This one is liked by current user
        comments: 4,
    },
    {
        id: 'f3',
        type: 'text',
        createdDate: new Date('2023-09-12T20:00:00Z'),
        lastUpdatedDate: new Date('2023-09-12T20:00:00Z'),
        title: 'Movie Marathon Night 🍿',
        description: 'Late night Harry Potter marathon. I fell asleep halfway through the 4th...',
        media: [
            'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80', // TV/Movie placeholder
        ],
        likes: { count: 1, lastLikedBy: MOCK_USER_CURRENT },
        isLiked: true,
        comments: 4,
    }
];
