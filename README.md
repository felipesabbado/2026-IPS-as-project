# ProtoTube – Sistema de Gestão e Transcodificação de Vídeo (Fase 1)

Este projeto é uma **Prova de Conceito (POC)** desenvolvida para a unidade curricular de Arquitetura de Software. O objetivo da Entrega 1 é demonstrar um **Monólito Hexagonal** bem estruturado em JavaScript (Node.js).

## 🚀 Como Executar

1. Instalar dependências:
   ```bash
   npm install
   ```

2. Executar o servidor:
   ```bash
   npm start
   ```

3. Executar testes unitários (Core):
   ```bash
   npm test
   ```

## 🏗️ Arquitetura

O sistema utiliza a **Arquitetura Hexagonal (Ports and Adapters)** para garantir que as regras de negócio (Core) sejam independentes de infraestrutura e tecnologias externas.

### Estrutura de Pastas
- `src/modules/video-catalog`: Domínio de Gestão de Vídeos.
- `src/modules/engagement`: Domínio de Estatísticas de Interação.
- `src/shared`: Código partilhado entre módulos.
- `tests/`: Testes unitários focados no core (domínio e casos de uso).

### Requisitos Não Funcionais (RNF) Implementados
- **RNF1: Segurança e Privacidade:** Validações de integridade no core.
- **RNF2: Manutenibilidade e DIP:** O core não tem dependências de frameworks (como Express) ou bibliotecas externas.
- **RNF3: Evolutibilidade:** Divisão clara em contextos delimitados, facilitando a migração futura para Microservices.

## 📝 Justificação da Abordagem Monolítica
Nesta fase inicial, optou-se por um monólito devido à baixa complexidade operacional. A arquitetura hexagonal garante a separação de responsabilidades necessária para evoluir o sistema sem comprometer a integridade das regras de negócio. O uso de persistência em memória cumpre os requisitos da Entrega 1, focando na qualidade das decisões arquiteturais em vez da completude da infraestrutura.

# ProtoTube – Sistema de Gestão e Transcodificação de Vídeo (Fase 2)

Este projeto é uma **Prova de Conceito (POC)** desenvolvida para a unidade curricular de Arquitetura de Software. O objetivo da Entrega 2 é evoluir o **Monólito Hexagonal** da Fase 1, introduzindo padrões de **Assincronismo, Desacoplamento via Eventos, Observabilidade e Resiliência**, mantendo a restrição de utilização de bases de dados em memória.

## 🚀 Como Executar

O processo de execução é o mesmo da fase 1, mas é necessário atualizar as dependências para incluir o `async-retry`.
Contudo, agora o sistema conta com uma interface gráfica que pode ser acessada pelo endpoint raiz: `http://localhost:3000`.

*Nota: Ao executar o projeto, observe o terminal. Os logs agora são emitidos em formato estruturado (JSON) demonstrando o fluxo assíncrono e os retries.*

## 🏗️ Evolução Arquitetural (Fase 2)

O sistema mantém a base da **Arquitetura Hexagonal (Ports and Adapters)**, garantindo o DIP (Princípio da Inversão de Dependência), mas foi expandido para suportar os seguintes requisitos avançados:

### Padrões Implementados

* **Web-Queue-Worker:** O upload de vídeos (`POST /videos`) agora responde imediatamente com `202 Accepted`. O processamento pesado (simulação de transcodificação) foi movido para segundo plano através de uma fila em memória e consumido por um *Worker* dedicado.
* **Event-Driven (Pub/Sub):** Comunicação entre domínios totalmente desacoplada. Após o processamento, o módulo de Catálogo de Vídeos emite o evento `VideoPublished`.
* **Múltiplos Consumidores:** O módulo de **Engagement** escuta o evento para inicializar estatísticas a zero, e um módulo simulado de **Notificações** reage enviando alertas, provando a independência dos consumidores.
* **Observabilidade Evoluída:** Substituição de logs simples por **Logging Estruturado (JSON)**. Foi introduzido um `correlationId` gerado no momento da requisição HTTP, que viaja através das filas e eventos, permitindo o rastreio (Tracing) de ponta a ponta.
* **Resiliência e Tratamento de Falhas:** O *Worker* de processamento utiliza a biblioteca `async-retry` para aplicar *Exponential Backoff*. Foi injetada uma simulação de falha (70% de taxa de erro no serviço de transcodificação) para demonstrar a capacidade do sistema de recuperar de falhas transitórias, visível através do rastreio de logs.
* **Interface Gráfica**: O endpoint raiz agora leva a um ambiente gráfico onde se pode testar o upload de vídeos e as visualizações ao mesmo tempo em são exibidos os logs.

### Estrutura de Pastas Atualizada

* `src/modules/video-catalog`: Domínio de Gestão e Processamento de Vídeos (Producer).
* `src/modules/engagement`: Domínio de Estatísticas de Interação (Consumer).
* `src/modules/notifications`: Domínio simulado para alertas e e-mails (Consumer).
* `src/modules/public`: Domínio de interface gráfica.
* `src/shared`:
   * `ports/`: Contratos arquiteturais (`QueuePort`, `EventBusPort`, `LoggerPort`).
   * `adapters/driven/`: Implementações em memória das portas partilhadas.
   * `tests/`: Testes unitários focados no core.

## 📝 Justificação da Abordagem

A transição de um modelo estritamente síncrono para *Event-Driven* e *Web-Queue-Worker* justifica-se pela necessidade de melhorar a experiência do utilizador (não bloqueando a *thread* HTTP durante processos demorados) e garantir a escalabilidade futura. Os domínios agora reagem a eventos em vez de se chamarem mutuamente, o que nos aproxima de uma futura transição suave para Microsserviços na Fase 3.

---
*Trabalho realizado no âmbito da disciplina de Arquitetura de Software.*
