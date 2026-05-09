/**
 * Porta de Saída: EventBusPort
 * Define o contrato para publicação e subscrição de eventos de domínio.
 * Diferente de uma fila (1-para-1), um Event Bus permite que 
 * múltiplos consumidores escutem o mesmo evento (1-para-N).
 */
export class EventBusPort {
    /**
     * Publica um evento para todos os subscritores interessados.
     * @param {string} eventName - Nome do evento (ex: 'VideoPublished')
     * @param {Object} eventData - Dados que compõem o evento
     */
    publish(eventName, eventData) {
        throw new Error('Method not implemented');
    }

    /**
     * Regista uma função (handler) para reagir quando um evento ocorrer.
     * @param {string} eventName - Nome do evento a escutar
     * @param {Function} handler - Função a executar quando o evento ocorrer
     */
    subscribe(eventName, handler) {
        throw new Error('Method not implemented');
    }
}
