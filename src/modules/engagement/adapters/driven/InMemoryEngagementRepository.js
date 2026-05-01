import { EngagementRepository } from '../../ports/EngagementRepository.js';

export class InMemoryEngagementRepository extends EngagementRepository {
    constructor() {
        super();
        this.stats = new Map();
    }

    async findByVideoId(videoId) {
        return this.stats.get(videoId);
    }

    async save(viewCount) {
        this.stats.set(viewCount.videoId, viewCount);
    }
}
