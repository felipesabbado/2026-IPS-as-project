/**
 * Interface para o repositório de vídeos.
 * Define o contrato que qualquer adaptador de persistência deve seguir.
 */
export class VideoRepository {
    async save(video) {
        throw new Error('Method not implemented');
    }

    async findById(id) {
        throw new Error('Method not implemented');
    }

    async findAll() {
        throw new Error('Method not implemented');
    }
}
