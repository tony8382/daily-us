import { DailyUsApiInterface, CoupleProfile, FeedItem, MoodStatus, User } from '../api.types';

// Re-using the data from the original mock file, but wrapping in a class
// In a real refactor we might move that data definition inside here or keep it separate.
// For now, I'll copy the data structure here to be self-contained in the service layer 
// or import it if we want to keep `data/mock.ts` as the "database".
// Let's import to minimize code duplication for now, but eventually `data/mock.ts` should be retired.
import { MOCK_COUPLE, MOCK_FEED, MOCK_MOOD, MOCK_USER_CURRENT } from '../../data/mock';

export class MockAdapter implements DailyUsApiInterface {
    async getCoupleProfile(): Promise<CoupleProfile> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return MOCK_COUPLE;
    }

    async getMoodStatus(): Promise<MoodStatus> {
        await new Promise(resolve => setTimeout(resolve, 300));
        return MOCK_MOOD;
    }

    async updateMood(note: string): Promise<MoodStatus> {
        await new Promise(resolve => setTimeout(resolve, 500));
        // Simulate updating the mock object
        MOCK_MOOD.note = note;
        MOCK_MOOD.lastUpdatedDate = new Date();
        return { ...MOCK_MOOD };
    }

    async createPost(post: Omit<FeedItem, 'id' | 'likes' | 'comments' | 'createdDate' | 'isLiked'>): Promise<FeedItem> {
        await new Promise(resolve => setTimeout(resolve, 800));

        const newPost: FeedItem = {
            id: Math.random().toString(36).substr(2, 9),
            ...post,
            createdDate: new Date(), // Created now
            likes: { count: 0, lastLikedBy: MOCK_USER_CURRENT }, // Default likes
            comments: 0,
            isLiked: false,
        };

        // Prepend to mock feed
        MOCK_FEED.unshift(newPost);

        return newPost;
    }

    async getFeed(): Promise<FeedItem[]> {
        await new Promise(resolve => setTimeout(resolve, 800));
        return MOCK_FEED;
    }
}
