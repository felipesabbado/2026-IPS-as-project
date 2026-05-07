export class VideoController {
    constructor(uploadVideoUseCase, listVideosUseCase) {
        this.uploadVideoUseCase = uploadVideoUseCase;
        this.listVideosUseCase = listVideosUseCase;
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
        try {
            const videos = await this.listVideosUseCase.execute();
            
            return res.status(200).json(videos);
        } catch (error) {
            console.error("[Erro no Controller (List)]:", error.message)
            return res.status(500).json({
                error: "Internal Server Error",
                message: error.message
            })
        }
    }
}
