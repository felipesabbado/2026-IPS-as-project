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

---
*Trabalho realizado no âmbito da disciplina de Arquitetura de Software.*
