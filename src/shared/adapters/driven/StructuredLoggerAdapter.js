import { LoggerPort } from '../../ports/LoggerPort.js';

export class StructuredLoggerAdapter extends LoggerPort {
    _formatLog(level, message, context) {
        // Separa o correlationId do resto do contexto para o colocar na raiz do JSON
        const { correlationId, ...restContext } = context;

        const logEntry = {
            timestamp: new Date().toISOString(),
            level: level.toUpperCase(),
            correlationId: correlationId || 'SYSTEM', // Rastreio de fluxos
            message: message,
            context: Object.keys(restContext).length > 0 ? restContext : undefined
        };

        return JSON.stringify(logEntry);
    }

    info(message, context = {}) {
        console.log(this._formatLog('info', message, context));
    }

    error(message, context = {}) {
        console.error(this._formatLog('error', message, context));
    }

    warn(message, context = {}) {
        console.warn(this._formatLog('warn', message, context));
    }
}