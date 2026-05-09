export class EngagementEventConsumer {
    /**
     * @param {import('../../../../shared/ports/EventBusPort')} eventBusPort 
     * @param {import('../../domain/InitializeVideoStatsUseCase')} initializeVideoStatsUseCase 
     */
    constructor(eventBusPort, initializeVideoStatsUseCase) {
        this.eventBusPort = eventBusPort;
        this.initializeVideoStatsUseCase = initializeVideoStatsUseCase;
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
                console.error(`[EngagementConsumer] [${correlationId}] Falha ao inicializar stats para ${videoId}:`, error.message);
            }
        });
    }
}