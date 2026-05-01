import { Video } from './Video.js';

export class UploadVideoUseCase {
    constructor(videoRepository) {
        this.videoRepository = videoRepository;
    }

    async execute({ title, description, author }) {
        // Regra de Negócio: Título é obrigatório
        if (!title) {
            throw new Error('Title is required');
        }

        const video = new Video({
            id: crypto.randomUUID(),
            title,
            description,
            author,
            status: 'PENDING'
        });

        await this.videoRepository.save(video);

        console.log(`[VideoCatalog] Video uploaded: ${video.title} (ID: ${video.id})`);
        
        return video;
    }
}
