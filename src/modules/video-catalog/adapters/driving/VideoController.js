export class VideoController {
    constructor(uploadVideoUseCase, listVideosUseCase) {
        this.uploadVideoUseCase = uploadVideoUseCase;
        this.listVideosUseCase = listVideosUseCase;
    }

    async upload(req, res) {
        try {
            const { title, description, author } = req.body;
            
            // Gera um ID de correlação simples para rastreio
            const correlationId = req.headers['x-correlation-id'] || `corr-${Math.random().toString(36).substring(2, 9)}`;
            
            const video = await this.uploadVideoUseCase.execute({
                title,
                description,
                author,
                correlationId
            });

            return res.status(202).json({ // Mudamos de 201 Created para 202 Accepted (Processamento Assíncrono)
                message: "Vídeo recebido e em processamento",
                data: video
            });

        } catch (error) {
            console.error("\n[Erro Detalhado no Controller]:", error);
            return res.status(400).json({ error: error.message });
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
