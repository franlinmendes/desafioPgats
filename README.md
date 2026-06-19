🚀 Projeto com uma Pipeline de Testes E2E com Playwright, Mocha e GitHub Actions

Este repositório possui uma solução de Integração Contínua (CI) totalmente automatizada para a execução de testes de ponta a ponta (E2E). A arquitetura utiliza o **Playwright** como biblioteca de automação, o **Mocha** como executor de testes, e o **GitHub Actions** para orquestrar a execução e exibir relatórios visuais diretamente na plataforma.

---

## 🛠️ Tecnologias e Conceitos Utilizados

*   **Playwright (Library Mode):** Utilizado para controlar navegadores de forma rápida e confiável. Diferente do modo tradicional (`@playwright/test`), aqui ele é gerenciado programaticamente dentro de scripts Node.js puro.
*   **Mocha:** Framework de testes responsável por estruturar os cenários (`describe`, `it`) e gerenciar o ciclo de vida da execução.
*   **xUnit / JUnit XML (Formato de Relatório):** Um padrão universal de arquivos XML utilizado para descrever os resultados de testes automatizados (sucessos, falhas, tempo de execução). É o formato que permite a integração com ferramentas de terceiros e com o próprio GitHub.
*   **GitHub Actions (CI/CD):** Ferramenta de automação nativa do GitHub utilizada para rodar os testes a cada alteração de código ou de forma agendada.
*   **Artefatos de Build (Artifacts):** Arquivos gerados durante a execução da pipeline que são salvos pelo GitHub para que o usuário possa fazer o download posteriormente (neste caso, o próprio relatório XML).

---

## 📋 Como Funciona a Solução (Fluxo da Pipeline)

O arquivo de configuração do GitHub Actions (`.github/workflows/e2e-tests.yml`) segue uma sequência lógica projetada para garantir eficiência e visibilidade:

1. **Gatilhos (Triggers):** A pipeline é ativada automaticamente em três cenários:
   * **Manualmente:** Através do botão `Workflow Dispatch` na interface do GitHub.
   * **Push:** Sempre que um novo código é enviado para a branch `main`.
   * **Agendamento (Cron):** Executado de forma rotineira **todas as sextas-feiras às 09:00 AM**.

2. **Ambiente Isolado (Runner):** O trabalho roda em um container limpo com **Ubuntu 24.04** e **Node.js v22.x LTS**, garantindo que o teste execute sempre no mesmo ambiente controlado.

3. **Instalação Limpa (`npm ci`):** Garante a instalação exata das dependências do projeto com base no arquivo `package-lock.json`, evitando variações de versão.

4. **Instalação dos Navegadores:** O comando `npx playwright install --with-deps` baixa os binários do Chromium, Firefox e Webkit, além de instalar as dependências de sistema operacional necessárias para rodá-los no Linux.

5. **Geração Dinâmica do Reporter:** A pipeline instala o `mocha-junit-reporter` localmente antes da execução para mitigar qualquer ausência de dependência no ambiente de CI.

6. **Execução e Captura (`if: always()`):** Mesmo que um teste quebre e o comando `npm test` falhe, os passos seguintes de relatório **são forçados a rodar**. Isso garante que você descubra o que quebrou em vez de a pipeline simplesmente "apagar as luzes".

---

## 📊 Onde Encontrar os Resultados no GitHub

Com essa estrutura, você não precisa ler logs pretos de terminal para entender o que falhou. Os resultados são disponibilizados de duas formas:

### 1. Na aba Summary (Sumário)
Graças à biblioteca `test-summary/action`, o GitHub Actions lê o arquivo `test-results.xml` gerado pelo Mocha e cria uma tabela visual rica diretamente na página inicial da execução da sua pipeline. 

* **Como acessar:** Vá em **Actions** ➡️ Clique na execução do seu teste ➡️ Role até o final da página **Summary**. Você verá uma seção dedicada listando a quantidade de testes que passaram, falharam e o tempo de cada um.

### 2. Como Artefato de Download
O arquivo XML original de resultados é compactado e guardado pelo GitHub.
* **Como acessar:** Na mesma página do **Summary**, na seção inferior chamada **Artifacts**, haverá um arquivo para download chamado `resultados-dos-testes`. Ele pode ser baixado e importado em qualquer ferramenta de gerenciamento de testes ou visualizador de XML.

---

## ⚙️ Configuração Local Necessária (package.json)

Para que a pipeline execute com sucesso, o seu arquivo `package.json` local deve estar configurado para instruir o Mocha a usar o reporter do JUnit e salvar o arquivo no caminho esperado pela pipeline (`./test-results.xml`).

Certifique-se de que o seu bloco de scripts possua a seguinte linha:

```json
"scripts": {
  "test": "mocha seu-arquivo-de-teste.js --reporter mocha-junit-reporter --reporter-options mochaFile=test-results.xml"
}
```
