// Simulação da lógica do "processo pesado" e mudança do estado da entidade Video
export class ProcessVideoUseCase {
    /**
     * @param {import('../ports/VideoRepository')} videoRepository
     */
    constructor(videoRepository) {
        this.videoRepository = videoRepository;
    }

    /**
     * @param {Object} input - DTO contendo videoId e correlationId
     */
    async execute({ videoId, correlationId }) {
        console.log(`\n[ProcessVideoUseCase] [${correlationId}] Iniciando transcodificação do vídeo ${videoId}...`);

        // Recuperar a entidade do repositório
        const video = await this.videoRepository.findById(videoId);
        if (!video) {
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

        console.log(`[ProcessVideoUseCase] [${correlationId}] Vídeo ${videoId} processado e publicado com sucesso!`);
    }
}
