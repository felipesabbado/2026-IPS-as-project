import test from 'node:test';
import assert from 'node:assert';
import { RegisterViewUseCase } from '../src/modules/engagement/domain/RegisterViewUseCase.js';

class MockEngagementRepository {
    constructor() {
        this.stats = new Map();
    }
    async findByVideoId(id) {
        return this.stats.get(id);
    }
    async save(viewCount) {
        this.stats.set(viewCount.videoId, viewCount);
    }
}

test('RegisterViewUseCase - should increment views', async (t) => {
    const repo = new MockEngagementRepository();
    const useCase = new RegisterViewUseCase(repo);
    const videoId = 'video-123';

    // First view
    await useCase.execute(videoId);
    let stats = await repo.findByVideoId(videoId);
    assert.strictEqual(stats.views, 1);

    // Second view
    await useCase.execute(videoId);
    stats = await repo.findByVideoId(videoId);
    assert.strictEqual(stats.views, 2);
});
