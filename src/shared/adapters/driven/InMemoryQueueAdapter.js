import { EventEmitter } from 'events';
import { QueuePort } from "../../ports/QueuePort.js";

export class InMemoryQueueAdapter extends QueuePort {
    constructor(loggerPort) {
        super();
        this.emitter = new EventEmitter();
        this.loggerPort = loggerPort;
    }

    async publish(queueName, message) {
        // console.log(`[Queue - Publish] Fila: '${queueName}' | Msg:`, message);
        this.loggerPort.info('[Queue] Fila publicada', {
            queueName,
            type: 'Publish',
            message
        })

        // O setImmediate desacopla a execução. Ele garante que a emissão do evento
        // ocorra no próximo ciclo do Event Loop, permitindo que a função publish 
        // retorne imediatamente e o Express responda ao utilizador sem bloqueios.
        setImmediate(() => {
            this.emitter.emit(queueName, message);
        });
    }

    async consume(queueName, callback) {
        // console.log(`[Queue - Consume] Worker registado na fila '${queueName}'`);
        this.loggerPort.info('[Queue] Worker registado na fila', {
            queueName,
            type: 'Consume'
        })

        // Fica à escuta de eventos com o nome da fila
        this.emitter.on(queueName, async (message) => {
            try {
                // Executa a regra de negócio do caso de uso (injetada via callback)
                await callback(message);
            } catch (error) {
                // Tratamento inicial de falhas (preparação para o requisito de Resiliência)
                // console.error(`\n[Queue - Error] Falha ao processar mensagem na fila '${queueName}':`, error.message);
                this.loggerPort.error('[Queue] Falha ao processar mensagem', {
                    queueName,
                    type: 'Error',
                    message: error.message
                })
            }
        });
    }

}
