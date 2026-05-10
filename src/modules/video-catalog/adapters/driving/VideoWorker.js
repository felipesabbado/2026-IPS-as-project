// Implementação dos 'retries' (tentativas) com Exponential Backoff
// utilizando uma biblioteca adequada (async-retry)
import retry from 'async-retry';

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
                // Envolvemos a execução na biblioteca async-retry
                await retry(async (bail, attempt) => {
                    if (attempt > 1) {
                        this.loggerPort.warn(`[Worker] Tentativa ${attempt} de processar o vídeo`, { correlationId, videoId });
                    }
                    // O Worker delega a execução para o Domínio
                    await this.processVideoUseCase.execute({ videoId, correlationId });
                }, {
                    retries: 3, // Tenta até 3 vezes extra (4 tentativas no total)
                    factor: 2, // Multiplicador de tempo (ex: 1s, 2s, 4s, ...)
                    minTimeout: 1000, // Espera mínima de 1 segundo entre tentativas
                    onRetry: (error, attempt) => {
                        // Rastreio de falhas parciais (Observabilidade e Resiliência juntas)
                        this.loggerPort.error(`[Worker] Falha transitória na tentativa ${attempt}: ${error.message}. A preparar nova tentativa...`, { correlationId, videoId });
                    }
                });
            } catch (error) {
                this.loggerPort.error('[VideoWorker] Falha DEFINITIVA. O vídeo não pôde ser processado após múltiplos retries.', {
                    correlationId,
                    videoId,
                    message: error.message
                });
            }
        });
    }
}
