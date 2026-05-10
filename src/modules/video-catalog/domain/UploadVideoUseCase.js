import { Video } from './Video.js';

export class UploadVideoUseCase {
    /**
     * @param {import('../ports/VideoRepository')} videoRepository - Porta de persistência
     * @param {import('../../../shared/ports/QueuePort')} queuePort - Porta de mensageria
     * @param {import('../../../../shared/ports/LoggerPort')} loggerPort 
     */
    constructor(videoRepository, queuePort, loggerPort) {
        this.videoRepository = videoRepository;
        this.queuePort = queuePort;
        this.loggerPort = loggerPort;
    }

    /**
     * @param {Object} input - DTO com os dados do vídeo e metadata
     */
    async execute(input) {
        // Receber um correlationId.
        // Se não for fornecido pelo controller, geramos um provisório.
        const correlationId = input.correlationId || `req-${Date.now()}`;

        this.loggerPort.info('[UploadUseCase] Iniciando upload do vídeo', {
            correlationId,
            title: input.title
        })

        // Regra de Negócio: Título é obrigatório.
        if (!input.title) {
            throw new Error('Title is required');
        }

        // Instancia a entidade. O status padrão da entidade Video é 'PENDING'
        const video = new Video({
            id: crypto.randomUUID(),
            title: input.title,
            description: input.description,
            author: input.author
        });

        // Persistência dos dados de forma síncrona.
        await this.videoRepository.save(video);

        this.loggerPort.info('[UploadUseCase] Vídeo guardado no repositório', {
            correlationId,
            videoId: video.id,
            title: video.title,
            status: 'PENDING'
        })

        // Integração Assíncrona (Padrão Web-Queue-Worker).
        // Publicamos uma mensagem na fila e não esperamos que o processamento acabe.
        await this.queuePort.publish('video-processing', {
            videoId: video.id,
            correlationId: correlationId // Essencial para o requisito de Observabilidade.
        });
        
        return video;
    }
}
