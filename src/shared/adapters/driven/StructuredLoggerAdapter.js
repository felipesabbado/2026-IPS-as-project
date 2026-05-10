import { LoggerPort } from '../../ports/LoggerPort.js';

export class StructuredLoggerAdapter extends LoggerPort {
    constructor() {
        super();
        this.logs = []; // Buffer para armazenar logs em memória
        this.maxLogs = 50; // Limite para não sobrecarregar a memória
    }

    _createLogEntry(level, message, context) {
        const { correlationId, ...restContext } = context;
        return {
            timestamp: new Date().toISOString(),
            level: level.toUpperCase(),
            correlationId: correlationId || 'SYSTEM',
            message: message,
            context: Object.keys(restContext).length > 0 ? restContext : undefined
        };
    }

    _pushLog(entry) {
        this.logs.unshift(entry); // Adiciona no início para o mais recente aparecer primeiro
        if (this.logs.length > this.maxLogs) {
            this.logs.pop(); // Remove o mais antigo
        }
    }

    info(message, context = {}) {
        const entry = this._createLogEntry('info', message, context);
        console.log(JSON.stringify(entry));
        this._pushLog(entry);
    }

    error(message, context = {}) {
        const entry = this._createLogEntry('error', message, context);
        console.error(JSON.stringify(entry));
        this._pushLog(entry);
    }

    warn(message, context = {}) {
        const entry = this._createLogEntry('warn', message, context);
        console.warn(JSON.stringify(entry));
        this._pushLog(entry);
    }

    // método para o Front-end consultar
    getLogs() {
        return this.logs;
    }
}