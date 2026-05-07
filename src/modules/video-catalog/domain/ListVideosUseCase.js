export class ListVideosUseCase {
    /**
     * @param {import('../ports/VideoRepository')} videoRepository
     */
    constructor(videoRepository) {
        this.videoRepository = videoRepository;
    }

    async execute() {
        // Aqui poderiam existir regras de negócio (ex: filtrar vídeos privados)
        // Como é uma listagem simples na POC, apenas delegamos para o repositório
        return await this.videoRepository.findAll();
    }
}