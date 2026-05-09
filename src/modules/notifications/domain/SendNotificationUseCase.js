export class SendNotificationUseCase {
    // Nesta POC não injetamos um EmailProviderPort para manter simples,
    // mas num sistema real, seria aqui que a injeção de dependência entraria.
    constructor() {}

    /**
     * @param {Object} input - DTO com os dados necessários para o email
     */
    async execute({ videoId, title, correlationId }) {
        console.log(`\n[SendNotificationUseCase] [${correlationId}] SIMULAÇÃO: A enviar email aos subscritores...`);
        console.log(`   -> Assunto: Novo vídeo publicado!`);
        console.log(`   -> Corpo: Não perca o nosso novo vídeo "${title}" (ID: ${videoId}).`);
        
        // Simula um pequeno delay no envio de emails
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log(`[SendNotificationUseCase] [${correlationId}] Email enviado com sucesso!`);
    }
}
