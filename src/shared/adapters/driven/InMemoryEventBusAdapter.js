import { EventEmitter } from 'events';
import { EventBusPort } from '../../ports/EventBusPort.js';

export class InMemoryEventBusAdapter extends EventBusPort {
    constructor(loggerPort) {
        super();
        this.emitter = new EventEmitter();
        // Aumentar o limite de listeners para evitar avisos de memory leak
        // do Node.js caso tenhamos muitos consumidores no mesmo evento.
        this.emitter.setMaxListeners(20);
        this.loggerPort = loggerPort;
    }

    publish(eventName, eventData) {
        // console.log(`[EventBus - Publish] Evento: '${eventName}' disparado.`);
        this.loggerPort.info('[EventBus] Evento disparado', {
            eventName,
            status: 'Publish'
        });
        
        // setImmediate garante que o evento é disparado de forma assíncrona,
        // não bloqueando a execução de quem publicou o evento.
        setImmediate(() => {
            this.emitter.emit(eventName, eventData);
        });
    }

    subscribe(eventName, handler) {
        // console.log(`[EventBus - Subscribe] Novo consumidor registado no evento '${eventName}'`);
        this.loggerPort.info('[EventBus] Novo consumidor registado', {
            eventName,
            status: 'Subscribe'
        });
        
        // Permite múltiplos handlers independentes para o mesmo eventName
        this.emitter.on(eventName, async (eventData) => {
            try {
                await handler(eventData);
            } catch (error) {
                const correlationId = eventData.correlationId || 'N/A';
                // console.error(`\n[EventBus - Error] [${correlationId}] Falha num consumidor do evento '${eventName}':`, error.message);
                this.loggerPort.error('[EventBus] Falha num consumidor', {
                    correlationId,
                    eventName,
                    status: 'Error',
                    message: error.message
                });
            }
        });
    }
}
