import { Video } from './Video.js';

export class UploadVideoUseCase {
    /**
     * @param {import('../ports/VideoRepository')} videoRepository - Porta de persistência
     * @param {import('../../../shared/ports/QueuePort')} queuePort - Porta de mensageria 
     */
    constructor(videoRepository, queuePort) {
        this.videoRepository = videoRepository;
        this.queuePort = queuePort;
    }

    /**
     * @param {Object} input - DTO com os dados do vídeo e metadata
     */
    async execute(input) {
        // Receber um correlationId.
        // Se não for fornecido pelo controller, geramos um provisório.
        const correlationId = input.correlationId || `req-${Date.now()}`;

        console.log(`[UploadUseCase] [${correlationId}] Iniciando upload do vídeo: ${input.title}`);

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

        console.log(`[UploadUseCase] [${correlationId}] Vídeo guardado no repositório com estado PENDING.`);

        // Integração Assíncrona (Padrão Web-Queue-Worker).
        // Publicamos uma mensagem na fila e não esperamos que o processamento acabe.
        await this.queuePort.publish('video-processing', {
            videoId: video.id,
            correlationId: correlationId // Essencial para o requisito de Observabilidade.
        });
        
        return video;
    }
}
