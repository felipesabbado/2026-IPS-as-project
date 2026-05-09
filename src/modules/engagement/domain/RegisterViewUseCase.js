import { ViewCount } from './ViewCount.js';

export class RegisterViewUseCase {
    constructor(engagementRepository) {
        this.engagementRepository = engagementRepository;
    }

    async execute(videoId) {
        let data = await this.engagementRepository.findByVideoId(videoId);

        if (!data) {
            throw new Error(`Estatísticas para o vídeo ${videoId} não encontradas.`);
        }

        const viewCount = new ViewCount({
            videoId: data.videoId,
            views: data.views,
            createdAt: data.createdAt
        });

        viewCount.increment();
        await this.engagementRepository.save(viewCount);

        console.log(`[Engagement] View registered for video ${videoId}. Total views: ${viewCount.views}`);

        return viewCount;
    }
}
