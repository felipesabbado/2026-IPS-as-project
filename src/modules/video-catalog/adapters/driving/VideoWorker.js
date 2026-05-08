export class VideoWorker {
    /**
     * @param {import('../../../shared/ports/QueuePort')} queuePort 
     * @param {import('../../domain/ProcessVideoUseCase')} processVideoUseCase 
     */
    constructor(queuePort, processVideoUseCase) {
        this.queuePort = queuePort;
        this.processVideoUseCase = processVideoUseCase;
    }

    /**
     * Inicia a escuta da fila.
     */
    start() {
        console.log("[Worker] VideoWorker ativo e a escutar a fila 'video-processing'...");

        this.queuePort.consume('video-processing', async (message) => {
            const { videoId, correlationId } = message;
            
            try {
                // O Worker delega a execução para o Domínio
                await this.processVideoUseCase.execute({ videoId, correlationId });
            } catch (error) {
                console.error(`[Worker] [${correlationId}] Falha ao processar o vídeo ${videoId}:`, error.message);
                
                // Nota para a Fase 2: É neste bloco catch que implementaremos 
                // a lógica de "Retries e tratamento de falhas" posteriormente.
            }
        });
    }
}
