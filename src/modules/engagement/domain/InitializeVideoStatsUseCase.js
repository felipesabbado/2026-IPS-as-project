import { ViewCount } from './ViewCount.js';

export class InitializeVideoStatsUseCase {
    /**
     * @param {import('../ports/EngagementRepository')} engagementRepository
     * @param {import('../../../../shared/adapters/driven/StructuredLoggerAdapter.js')} loggerPort
     */
    constructor(engagementRepository, loggerPort) {
        this.engagementRepository = engagementRepository;
        this.loggerPort = loggerPort;
    }

    /**
     * @param {Object} input - DTO com videoId e correlationId
     */
    async execute({ videoId, correlationId }) {
        try {
            this.loggerPort.info('[InitializeVideoStatsUseCase] A criar registo inicial de estatísticas para o vídeo', {
                correlationId,
                videoId
            })

            // Cria a estrutura inicial de visualizações. 
            const initialStats = new ViewCount({
                videoId: videoId,
                views: 0
            });

            // Guarda no repositório. 
            await this.engagementRepository.save(initialStats);

            this.loggerPort.info('[InitializeVideoStatsUseCase] Estatísticas do vídeo inicializadas com sucesso!', {
                correlationId,
                videoId
            })
        } catch (error) {
            this.loggerPort.error('[InitializeVideoStatsUseCase] Falha na inicialização das estatísticas', {
                correlationId,
                videoId,
                message: error.message
            })
            res.status(400).json({ error: error.message });
        }
    }
}
