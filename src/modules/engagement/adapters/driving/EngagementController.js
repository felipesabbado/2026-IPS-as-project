export class EngagementController {
    constructor(registerViewUseCase, engagementRepository) {
        this.registerViewUseCase = registerViewUseCase;
        this.engagementRepository = engagementRepository;
    }

    async registerView(req, res) {
        try {
            const { videoId } = req.params;
            const viewCount = await this.registerViewUseCase.execute(videoId);
            res.json(viewCount);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getStats(req, res) {
        const { videoId } = req.params;
        const viewCount = await this.engagementRepository.findByVideoId(videoId);
        res.json(viewCount || { videoId, views: 0 });
    }
}
