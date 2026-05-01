import { ViewCount } from './ViewCount.js';

export class RegisterViewUseCase {
    constructor(engagementRepository) {
        this.engagementRepository = engagementRepository;
    }

    async execute(videoId) {
        let viewCount = await this.engagementRepository.findByVideoId(videoId);

        if (!viewCount) {
            viewCount = new ViewCount({ videoId });
        }

        viewCount.increment();
        await this.engagementRepository.save(viewCount);

        console.log(`[Engagement] View registered for video ${videoId}. Total views: ${viewCount.views}`);

        return viewCount;
    }
}
