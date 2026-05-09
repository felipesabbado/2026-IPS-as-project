export class VideoWorker {
    /**
     * @param {import('../../../shared/ports/QueuePort')} queuePort 
     * @param {import('../../domain/ProcessVideoUseCase')} processVideoUseCase
     * @param {import('../../../../shared/ports/LoggerPort')} loggerPort
     */
    constructor(queuePort, processVideoUseCase, loggerPort) {
        this.queuePort = queuePort;
        this.processVideoUseCase = processVideoUseCase;
        this.loggerPort = loggerPort;
    }

    /**
     * Inicia a escuta da fila.
     */
    start() {
        this.loggerPort.info('[VideoWorker] Worker ativo e a escutar a fila "video-processing"...', { });

        this.queuePort.consume('video-processing', async (message) => {
            const { videoId, correlationId } = message;
            
            try {
                // O Worker delega a execução para o Domínio
                await this.processVideoUseCase.execute({ videoId, correlationId });
            } catch (error) {
                this.loggerPort.error('[VideoWorker] Falha ao processar o vídeo', {
                    correlationId,
                    videoId,
                    message: error.message
                });
                
                // Nota para a Fase 2: É neste bloco catch que implementaremos 
                // a lógica de "Retries e tratamento de falhas" posteriormente.
            }
        });
    }
}
