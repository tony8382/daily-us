import { DailyUsApiInterface, CoupleProfile, FeedItem, MoodStatus, User } from '../api.types';

// Re-using the data from the original mock file, but wrapping in a class
// In a real refactor we might move that data definition inside here or keep it separate.
// For now, I'll copy the data structure here to be self-contained in the service layer 
// or import it if we want to keep `data/mock.ts` as the "database".
// Let's import to minimize code duplication for now, but eventually `data/mock.ts` should be retired.
import { MOCK_COUPLE, MOCK_FEED, MOCK_MOOD, MOCK_USER_CURRENT, MOCK_USER_PARTNER } from '../../data/mock';

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

    async createPost(post: Omit<FeedItem, 'id' | 'likes' | 'comments' | 'createdDate'>): Promise<FeedItem> {
        await new Promise(resolve => setTimeout(resolve, 800));

        const newPost: FeedItem = {
            id: Math.random().toString(36).substr(2, 9),
            ...post,
            createdDate: new Date(),
            likes: [],
            comments: 0,
        };

        // Prepend to mock feed
        MOCK_FEED.unshift(newPost);

        return newPost;
    }

    async updatePost(postId: string, postUpdates: Partial<Omit<FeedItem, 'id' | 'likes' | 'comments' | 'createdDate'>>): Promise<FeedItem> {
        await new Promise(resolve => setTimeout(resolve, 500));
        const index = MOCK_FEED.findIndex(p => p.id === postId);
        if (index === -1) throw new Error('Post not found');

        MOCK_FEED[index] = { ...MOCK_FEED[index], ...postUpdates, lastUpdatedDate: new Date() };
        return MOCK_FEED[index];
    }

    async deletePost(postId: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 500));
        const index = MOCK_FEED.findIndex(p => p.id === postId);
        if (index !== -1) {
            MOCK_FEED.splice(index, 1);
        }
    }

    async toggleLike(postId: string): Promise<FeedItem> {
        await new Promise(resolve => setTimeout(resolve, 300));
        const post = MOCK_FEED.find(p => p.id === postId);
        if (!post) throw new Error('Post not found');

        const userId = MOCK_USER_CURRENT.id;
        if (post.likes.includes(userId)) {
            post.likes = post.likes.filter(id => id !== userId);
        } else {
            post.likes.push(userId);
        }

        return { ...post };
    }

    async getFeed(): Promise<FeedItem[]> {
        await new Promise(resolve => setTimeout(resolve, 800));
        return MOCK_FEED;
    }

    async deleteResponse(postId: string, responseId: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 300));
        const post = MOCK_FEED.find(p => p.id === postId);
        if (post && post.responses) {
            post.responses = post.responses.filter(r => r.id !== responseId);
        }
    }
}
