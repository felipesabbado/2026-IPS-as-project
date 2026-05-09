import { SendNotificationUseCase } from "../../../notifications/domain/SendNotificationUseCase.js";

export class EngagementController {
    /**
     * @param {import('../../domain/RegisterViewUseCase.js')} registerViewUseCase 
     * @param {import('../../domain/ListViewStatsUseCase.js')} listViewStasUseCase 
     * @param {import('../../../../shared/adapters/driven/StructuredLoggerAdapter.js')} loggerPort
     */
    constructor(registerViewUseCase, listViewStasUseCase, loggerPort) {
        this.registerViewUseCase = registerViewUseCase;
        this.listViewStasUseCase = listViewStasUseCase;
        this.loggerPort = loggerPort;
    }

    async registerView(req, res) {
        const { videoId } = req.params;
        try {
            const viewCount = await this.registerViewUseCase.execute(videoId);
            this.loggerPort.info('[EngagementController] Vídeo visualizado', {
                videoId
            })
            res.status(200).json(viewCount);
        } catch (error) {
            this.loggerPort.error('[EngagementController] Erro na visualização do vídeo', {
                videoId,
                message: error.message
            })
            res.status(400).json({ error: error.message });
        }
    }

    async getStats(req, res) {
        const { videoId } = req.params;
        try {
            const viewCount = await this.listViewStasUseCase.execute(videoId);
            if (!viewCount) {
                this.loggerPort.warn('[EngagementController] Vídeo não encontrado', {
                    videoId
                });
                
                return res.status(404).json({
                    videoId,
                    message: "Vídeo não encontado."
                })
            }
            return res.json(viewCount);
        } catch (error) {
            this.loggerPort.error('[EngagementController] Erro nas estatísticas', {
                videoId,
                message: error.message
            })
            
            return res.status(500).json({
                error: "Internal Server Error",
                message: error.message
            });
        }
    }
}
