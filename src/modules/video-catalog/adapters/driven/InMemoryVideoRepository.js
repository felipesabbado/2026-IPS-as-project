import { VideoRepository } from '../../ports/VideoRepository.js';

export class InMemoryVideoRepository extends VideoRepository {
    constructor() {
        super();
        this.videos = new Map();
    }

    async save(video) {
        this.videos.set(video.id, video);
    }

    async findById(id) {
        return this.videos.get(id);
    }

    async findAll() {
        return Array.from(this.videos.values());
    }
}
