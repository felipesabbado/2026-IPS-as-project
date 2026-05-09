import { SendNotificationUseCase } from "../../../notifications/domain/SendNotificationUseCase.js";

export class EngagementController {
    constructor(registerViewUseCase, listViewStasUseCase) {
        this.registerViewUseCase = registerViewUseCase;
        this.listViewStasUseCase = listViewStasUseCase;
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
        try {
            const { videoId } = req.params;
            const viewCount = await this.listViewStasUseCase.execute(videoId);
            if (!viewCount) {
                console.log(`[EngagementController] Vídeo '${videoId}' não encontrado.`)
                return res.status(404).json({
                    videoId,
                    message: "Vídeo não encontado."
                })
            }
            return res.json(viewCount);
        } catch (error) {
            console.error("[Erro no Controller (getStats)]:", error.message);
            return res.status(500).json({
                error: "Internal Server Error",
                message: error.message
            });
        }
    }
}
