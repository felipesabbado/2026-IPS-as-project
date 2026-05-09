export class SendNotificationUseCase {
    // Nesta POC não injetamos um EmailProviderPort para manter simples,
    // mas num sistema real, seria aqui que a injeção de dependência entraria.

    /**
     * @param {import('../../../../shared/ports/LoggerPort')} loggerPort 
     */
    constructor(loggerPort) {
        this.loggerPort = loggerPort;
    }

    /**
     * @param {Object} input - DTO com os dados necessários para o email
     */
    async execute({ videoId, title, correlationId }) {
        this.loggerPort.info('[SendNotificationUseCase] SIMULAÇÃO: A enviar email aos subscritores...', {
            correlationId,
            videoId,
            title,
            assunto: 'Novo vídeo publicado!',
            corpo: `Não perca o nosso novo vídeo "${title}"`
        })
        
        // Simula um pequeno delay no envio de emails
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        this.loggerPort.info('[SendNotificationUseCase] Email enviado com sucesso!', {
            correlationId,
            videoId
        })
    }
}
