import { ViewCount } from './ViewCount.js';

export class InitializeVideoStatsUseCase {
    /**
     * @param {import('../ports/EngagementRepository')} engagementRepository 
     */
    constructor(engagementRepository) {
        this.engagementRepository = engagementRepository;
    }

    /**
     * @param {Object} input - DTO com videoId e correlationId
     */
    async execute({ videoId, correlationId }) {
        console.log(`\n[InitializeVideoStatsUseCase] [${correlationId}] A criar registo inicial de estatísticas para o vídeo ${videoId}...`);

        // Cria a estrutura inicial de visualizações. 
        const initialStats = new ViewCount({
            videoId: videoId,
            views: 0
        });

        // Guarda no repositório. 
        await this.engagementRepository.save(initialStats);

        console.log(`[InitializeVideoStatsUseCase] [${correlationId}] Estatísticas do vídeo ${videoId} inicializadas com sucesso!`);
    }
}
