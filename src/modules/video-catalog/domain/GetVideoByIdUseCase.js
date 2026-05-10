export class GetVideoByIdUseCase {
    /**
     * @param {import('../ports/VideoRepository')} videoRepository
     * @param {import('../../../shared/ports/LoggerPort')} loggerPort
     */
    constructor(videoRepository, loggerPort) {
        this.videoRepository = videoRepository;
        this.loggerPort = loggerPort;
    }

    async execute({ videoId, correlationId }) {
        this.loggerPort.info(`A procurar detalhes do vídeo ${videoId}`, { correlationId, videoId });

        const video = await this.videoRepository.findById(videoId);
        
        if (!video) {
            this.loggerPort.warn(`Vídeo ${videoId} não encontrado na pesquisa.`, { correlationId, videoId });
            throw new Error('VideoNotFound'); // Identificador específico para o Controller tratar
        }

        return video;
    }
}