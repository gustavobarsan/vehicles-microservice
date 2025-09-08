# API de Gerenciamento de Veículos (Microsserviço)

## 1. Introdução

Este documento descreve a API de Gerenciamento de Veículos. O objetivo do sistema é fornecer uma plataforma robusta e escalável para realizar o cadastro e a consulta de veículos, utilizando uma arquitetura de microsserviços.

---

## 2. Arquitetura e Padrões

O projeto foi desenvolvido seguindo os princípios da **Arquitetura de Microsserviços** e da **Arquitetura Hexagonal (Ports & Adapters)**.

### 2.1. Microsserviços

A aplicação é dividida em dois serviços principais:

*   **`api-gateway`**: É o ponto de entrada (edge service) da aplicação. Ele recebe as requisições HTTP, atua como um cliente para a fila de mensagens e encaminha as solicitações para o microsserviço apropriado.
*   **`vehicles-microservice`**: Contém toda a lógica de negócio para o gerenciamento de veículos. Ele é completamente agnóstico ao protocolo de entrada (HTTP, por exemplo) e se comunica com o mundo exterior através de mensagens.

### 2.2. Comunicação Assíncrona com RabbitMQ

A comunicação entre o `api-gateway` e o `vehicles-microservice` é feita de forma assíncrona utilizando o **RabbitMQ** como message broker. Isso garante desacoplamento e maior escalabilidade entre os serviços.

### 2.3. Arquitetura Hexagonal no `vehicles-microservice`

O microsserviço de veículos é estruturado da seguinte forma:

*   **Core (Domínio):** Contém as entidades (`Vehicle`), os casos de uso (`VehiclesUseCases`) e as abstrações dos repositórios (`VehiclesRepository`). É o coração da aplicação, totalmente isolado de frameworks e tecnologias externas.
*   **Adaptadores (Adapters):**
    *   **Infraestrutura:** Implementações concretas para interagir com tecnologias externas, como o `PrismaVehiclesRepository` que se comunica com o banco de dados PostgreSQL.
    *   **Nest Adapters:** Camada que adapta o *core* para o framework NestJS, recebendo as mensagens do RabbitMQ e orquestrando as chamadas para os casos de uso.

---

## 3. Débito Técnico: Ausência de Testes

O projeto possui uma suíte de testes unitários focada nos casos de uso, garantindo a correta implementação da lógica de negócio principal.

No entanto, é importante ressaltar o débito técnico relacionado à **ausência de testes de integração e ponta-a-ponta (e2e)**. A criação desses testes é um próximo passo crucial para garantir a robustez e a correta comunicação entre os microsserviços e com as camadas de infraestrutura (banco de dados, mensageria).

---

## 4. Documentação da API (Swagger)

A API está documentada utilizando o padrão OpenAPI (Swagger). Após iniciar a aplicação, a documentação interativa fica disponível e é a melhor forma de explorar os endpoints, seus parâmetros, e os schemas de requisição e resposta.

*   **URL do Swagger:** http://localhost:3000/api

---

## 5. Guia de Início Rápido (Get Started)

Siga os passos abaixo para executar o projeto em seu ambiente.

### 5.1. Pré-requisitos

*   Node.js (versão 18 ou superior)
*   Yarn ou NPM
*   Docker e Docker Compose

### 5.2. Executando com Docker Compose (Recomendado)

Esta é a forma mais simples de executar o projeto, pois o Docker Compose gerencia o banco de dados, o message broker e as aplicações.

1.  **Clone o repositório:**
    ```bash
    git clone <url-do-repositorio>
    cd vehicles-microservice
    ```

2.  **Configure as variáveis de ambiente:**
    *   Crie uma cópia do arquivo `.env.example` e renomeie para `.env`.
    *   As variáveis no `.env` já estão configuradas para a comunicação entre os containers.

3.  **Inicie os containers:**
    *   Este comando irá construir as imagens (se necessário) e iniciar os containers da API, do microsserviço, do PostgreSQL e do RabbitMQ em background (`-d`).
    ```bash
    docker-compose up -d --build
    ```
    *   As migrações do banco de dados (`Prisma`) serão executadas automaticamente ao iniciar o container do `vehicles-microservice`.

4.  **Acesse a API:**
    *   A API estará disponível em `http://localhost:3000`.
    *   A documentação Swagger estará em `http://localhost:3000/api`.
    *   O painel de gerenciamento do RabbitMQ estará em `http://localhost:15672`.

5.  **Para parar os containers:**
    ```bash
    docker-compose down
    ```

### 5.3. Executando Localmente

1.  **Clone o repositório** (se ainda não o fez).

2.  **Inicie a infraestrutura (Postgres e RabbitMQ):**
    *   Você pode usar o Docker para subir apenas os serviços de infraestrutura:
    ```bash
    docker-compose up -d postgres rabbitmq
    ```

3.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    ```

4.  **Configure as variáveis de ambiente:**
    *   Crie uma cópia do arquivo `.env.example` e renomeie para `.env`.
    *   Assegure que a variável `DATABASE_URL` aponta para sua instância local do PostgreSQL.

5.  **Execute as migrações do banco de dados:**
    *   Este comando irá criar as tabelas no banco de dados com base no `schema.prisma`.
    ```bash
    npx prisma migrate dev
    ```

6.  **Inicie as aplicações:**
    *   Abra dois terminais separados.
    *   No primeiro, inicie o microsserviço de veículos:
        ```bash
        npm run start:dev vehicles-microservice
        ```
    *   No segundo, inicie o API Gateway:
        ```bash
        npm run start:dev api-gateway
        ```

7.  **Acesse a API:**
    *   A API estará disponível em `http://localhost:3000`.

---

