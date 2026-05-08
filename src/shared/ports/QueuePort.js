export class QueuePort {
    async publish(queueName, message) {
        throw new Error('Method not implemented')
    }

    async consume(queueName, callback) {
        throw new Error('Method not implemented')
    }
}
