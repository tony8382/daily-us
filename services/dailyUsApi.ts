import { DailyUsApiInterface } from './api.types';
import { MockAdapter } from './adapters/mock';

// Here we can switch between Mock and Real based on env var
const USE_MOCK = true;
// Import needed for types in createPost signature
import { FeedItem } from './api.types';

class DailyUsApiService {
    private adapter: DailyUsApiInterface;

    constructor() {
        if (USE_MOCK) {
            this.adapter = new MockAdapter();
        } else {
            // this.adapter = new RealAdapter();
            this.adapter = new MockAdapter(); // Fallback
        }
    }

    get profile() {
        return this.adapter.getCoupleProfile();
    }

    get mood() {
        return this.adapter.getMoodStatus();
    }

    updateMood(note: string) {
        return this.adapter.updateMood(note);
    }

    createPost(post: Omit<FeedItem, 'id' | 'likes' | 'comments' | 'createdDate' | 'isLiked' | 'isPartnerLiked'>) {
        return this.adapter.createPost(post);
    }

    updatePost(postId: string, post: Partial<Omit<FeedItem, 'id' | 'likes' | 'comments' | 'createdDate' | 'isLiked' | 'isPartnerLiked'>>) {
        return this.adapter.updatePost(postId, post);
    }

    toggleLike(postId: string) {
        return this.adapter.toggleLike(postId);
    }

    deletePost(postId: string) {
        return this.adapter.deletePost(postId);
    }

    get feed() {
        return this.adapter.getFeed();
    }

    deleteResponse(postId: string, responseId: string) {
        return this.adapter.deleteResponse(postId, responseId);
    }
}

export const api = new DailyUsApiService();
