// Simulação da lógica do "processo pesado" e mudança do estado da entidade Video
export class ProcessVideoUseCase {
    /**
     * @param {import('../ports/VideoRepository')} videoRepository
     * @param {import('../../../shared/ports/EventBusPort')} eventBusPort
     * @param {import('../../../shared/ports/LoggerPort')} loggerPort
     */
    constructor(videoRepository, eventBusPort, loggerPort) {
        this.videoRepository = videoRepository;
        this.eventBusPort = eventBusPort;
        this.loggerPort = loggerPort;
    }

    /**
     * @param {Object} input - DTO contendo videoId e correlationId
     */
    async execute({ videoId, correlationId }) {
        this.loggerPort.info('[ProcessVideoUseCase] Iniciando transcodificação do vídeo', { 
            correlationId, 
            videoId, 
            action: 'START_PROCESSING' 
        });

        // Recuperar a entidade do repositório
        const video = await this.videoRepository.findById(videoId);
        if (!video) {
            this.loggerPort.error('[ProcessVideoUseCase] Vídeo não encontrado no repositório', { correlationId, videoId });
            throw new Error(`Vídeo com ID ${videoId} não encontrado no repositório.`);
        }

        // Atualizar estado para PROCESSING e guardar
        video.startProcessing();
        await this.videoRepository.save(video);

        // Simular um processo pesado que demora 5 segundos (ex: conversão para 1080p e 4K)
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Executar as suas regras de negócio (Transcodificação)
        video.addQuality('720p');
        video.addQuality('1080p');
        video.addQuality('4k');

        // Publicar o vídeo
        video.publish();

        // Guardar o novo estado no repositório
        await this.videoRepository.save(video);

        this.loggerPort.info('[ProcessVideoUseCase] Vídeo processado e publicado', { 
            correlationId, 
            videoId, 
            qualities: video.qualities 
        });

        this.eventBusPort.publish('VideoPublished', {
            correlationId,
            videoId: video.id,
            title: video.title,
            author: video.author
        });
    }
}
