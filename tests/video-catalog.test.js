import test from 'node:test';
import assert from 'node:assert';
import { UploadVideoUseCase } from '../src/modules/video-catalog/domain/UploadVideoUseCase.js';

// Mock do Repositório (Poderia ser o InMemory também, mas aqui mostramos DIP)
class MockVideoRepository {
    constructor() {
        this.videos = [];
    }
    async save(video) {
        this.videos.push(video);
    }
}

test('UploadVideoUseCase - should create a video correctly', async (t) => {
    const repo = new MockVideoRepository();
    const useCase = new UploadVideoUseCase(repo);

    const videoData = {
        title: 'My First Video',
        description: 'Test description',
        author: 'Kelvin'
    };

    const video = await useCase.execute(videoData);

    assert.strictEqual(video.title, videoData.title);
    assert.strictEqual(video.status, 'PENDING');
    assert.strictEqual(repo.videos.length, 1);
    assert.strictEqual(repo.videos[0].id, video.id);
});

test('UploadVideoUseCase - should throw error if title is missing', async (t) => {
    const repo = new MockVideoRepository();
    const useCase = new UploadVideoUseCase(repo);

    await assert.rejects(
        () => useCase.execute({ description: 'No title' }),
        { message: 'Title is required' }
    );
});
