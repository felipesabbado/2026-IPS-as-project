export class VideoController {
    /**
     * @param {import('../../domain/UploadVideoUseCase')} uploadVideoUseCase 
     * @param {import('../../domain/ListVideosUseCase')} listVideosUseCase 
     * @param {import('../../../../shared/ports/LoggerPort')} loggerPort 
     */
    constructor(uploadVideoUseCase, listVideosUseCase, loggerPort) {
        this.uploadVideoUseCase = uploadVideoUseCase;
        this.listVideosUseCase = listVideosUseCase;
        this.loggerPort = loggerPort;
    }

    async upload(req, res) {
        const { title, description, author } = req.body;
        // Gera um ID de correlação simples para rastreio
        const correlationId = req.headers['x-correlation-id'] || `corr-${Math.random().toString(36).substring(2, 9)}`;
        
        try {
            const video = await this.uploadVideoUseCase.execute({
                title,
                description,
                author,
                correlationId
            });

            this.loggerPort.info('[VideoController] Vídeo recebido e em processamento...', {
                correlationId,
                title: video.title,
                author: video.author
            });

            return res.status(202).json({ // Mudamos de 201 Created para 202 Accepted (Processamento Assíncrono)
                message: "Vídeo recebido e em processamento",
                data: video
            });

        } catch (error) {
            this.loggerPort.error('[VideoController] Falha no processamento', {
                correlationId,
                message: error.message
            });

            return res.status(400).json({ error: error.message });
        }
    }

    async list(req, res) {
        try {
            const videos = await this.listVideosUseCase.execute();

            this.loggerPort.info('[VideoController] Exibindo lista de vídeos', { });
            
            return res.status(200).json(videos);
            
        } catch (error) {
            this.loggerPort.error('[VideoController] Falha na lista de vídeos', {
                message: error.message
            });

            return res.status(500).json({
                error: "Internal Server Error",
                message: error.message
            });
        }
    }
}
