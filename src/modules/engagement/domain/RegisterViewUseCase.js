import { ViewCount } from './ViewCount.js';

export class RegisterViewUseCase {
    /**
     * @param {import('../ports/EngagementRepository')} engagementRepository
     * @param {import('../../../../shared/adapters/driven/StructuredLoggerAdapter.js')} loggerPort
     */
    constructor(engagementRepository, loggerPort) {
        this.engagementRepository = engagementRepository;
        this.loggerPort = loggerPort;
    }

    async execute(videoId) {
        let data = await this.engagementRepository.findByVideoId(videoId);

        if (!data) {
            this.loggerPort.error('[RegisterViewUseCase] Estatísticas para o vídeo não encontradas', {
                videoId
            })
            throw new Error(`Estatísticas para o vídeo ${videoId} não encontradas.`);
        }

        const viewCount = new ViewCount({
            videoId: data.videoId,
            views: data.views,
            createdAt: data.createdAt
        });

        viewCount.increment();
        await this.engagementRepository.save(viewCount);

        this.loggerPort.info('[RegisterViewUseCase] View registada para o vídeo', {
            videoId,
            totalViews: viewCount.views
        })

        return viewCount;
    }
}
