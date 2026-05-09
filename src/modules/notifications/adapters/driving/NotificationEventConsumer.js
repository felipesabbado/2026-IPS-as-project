export class NotificationEventConsumer {
    /**
     * @param {import('../../../../shared/ports/EventBusPort')} eventBusPort 
     * @param {import('../../domain/SendNotificationUseCase')} sendNotificationUseCase
     * @param {import('../../../../shared/ports/LoggerPort')} loggerPort
     */
    constructor(eventBusPort, sendNotificationUseCase, loggerPort) {
        this.eventBusPort = eventBusPort;
        this.sendNotificationUseCase = sendNotificationUseCase;
        this.loggerPort = loggerPort;
        
    }

    start() {
        this.loggerPort.info('[NotificationConsumer] A escutar eventos para enviar notificações...', { })

        this.eventBusPort.subscribe('VideoPublished', async (eventData) => {
            const { videoId, title, correlationId } = eventData;
            
            try {
                await this.sendNotificationUseCase.execute({ videoId, title, correlationId });
            } catch (error) {
                this.loggerPort.error('[NotificationConsumer] Falha ao enviar notificações', {
                    correlationId,
                    videoId,
                    title,
                    message: error.message
                })
            }
        });
    }
}
