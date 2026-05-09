export class EngagementEventConsumer {
    /**
     * @param {import('../../../../shared/ports/EventBusPort')} eventBusPort 
     * @param {import('../../domain/InitializeVideoStatsUseCase')} initializeVideoStatsUseCase
     * @param {import('../../../../shared/adapters/driven/StructuredLoggerAdapter.js')} loggerPort
     */
    constructor(eventBusPort, initializeVideoStatsUseCase, loggerPort) {
        this.eventBusPort = eventBusPort;
        this.initializeVideoStatsUseCase = initializeVideoStatsUseCase;
        this.loggerPort = loggerPort;
    }

    /**
     * Inicia a escuta de eventos. Deve ser chamado na inicialização do sistema.
     */
    start() {
        console.log("[EngagementConsumer] A escutar eventos do sistema...");

        this.eventBusPort.subscribe('VideoPublished', async (eventData) => {
            // Extrai os dados enviados pelo módulo Video Catalog
            const { videoId, correlationId } = eventData;
            
            try {
                // Delega a tarefa para o Caso de Uso
                await this.initializeVideoStatsUseCase.execute({ videoId, correlationId });
            } catch (error) {
                this.loggerPort.error('[EngagementConsumer] Falha ao inicializar stats', {
                    correlationId,
                    videoId
                })
            }
        });
    }
}