export class NotificationEventConsumer {
    /**
     * @param {import('../../../../shared/ports/EventBusPort')} eventBusPort 
     * @param {import('../../domain/SendNotificationUseCase')} sendNotificationUseCase 
     */
    constructor(eventBusPort, sendNotificationUseCase) {
        this.eventBusPort = eventBusPort;
        this.sendNotificationUseCase = sendNotificationUseCase;
    }

    start() {
        console.log("[NotificationConsumer] A escutar eventos para enviar notificações...");

        // Subscreve EXATAMENTE ao mesmo evento que o módulo Engagement
        this.eventBusPort.subscribe('VideoPublished', async (eventData) => {
            const { videoId, title, correlationId } = eventData;
            
            try {
                await this.sendNotificationUseCase.execute({ videoId, title, correlationId });
            } catch (error) {
                console.error(`[NotificationConsumer] [${correlationId}] Falha ao enviar notificação para ${videoId}:`, error.message);
            }
        });
    }
}
