export class VideoController {
    constructor(uploadVideoUseCase, videoRepository) {
        this.uploadVideoUseCase = uploadVideoUseCase;
        this.videoRepository = videoRepository;
    }

    async upload(req, res) {
        try {
            const { title, description, author } = req.body;
            const video = await this.uploadVideoUseCase.execute({ title, description, author });
            res.status(201).json(video);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async list(req, res) {
        const videos = await this.videoRepository.findAll();
        res.json(videos);
    }
}
