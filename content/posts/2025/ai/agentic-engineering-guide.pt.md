+++
author = "iceteash"
title = "Guia Prático de Engenharia Agêntica: Stack de Skills, MCP e Contexto de Projeto"
date = 2026-03-10T00:00:00-03:00
description = "Como estruturar Skills, MCP e contexto de projeto para construir agentes autônomos robustos e interoperáveis em qualquer runtime de IA."
tags = [
  "ai",
  "agents",
  "mcp",
  "llm",
  "skills",
  "prompt-engineering",
  "claude",
]
authors = ["iceteash"]
draft = false
+++

> **Nota do Autor:** Este guia consolida as melhores práticas de engenharia de prompt e arquitetura de sistemas autônomos. Ele foi desenhado para desenvolvedores que desejam transitar de simples "prompts" para sistemas agênticos robustos e confiáveis.

<!--more-->

---

## 0. Setup Rápido (TL;DR)

Quer começar agora? Veja como configurar o suporte a Skills em ambientes agênticos comuns.

| Plataforma | Como Configurar |
| :--- | :--- |
| **Codex** | Mantenha as skills em `skills/` no workspace e as regras do projeto em `AGENTS.md`. O agente usa esses artefatos como fonte primária de contexto operacional. |
| **Claude** | Adicione o caminho da pasta `skills/` no seu arquivo `claude_desktop_config.json` ou simplesmente arraste a pasta para o contexto do chat. |
| **OpenCode** | As skills são carregadas automaticamente se estiverem na raiz do projeto em `.opencode/skills` ou `skills/`. Certifique-se de que o plugin de Agente está ativo. |
| **Antigravity** | Nenhuma ação necessária. O Antigravity escaneia a pasta `skills/` na inicialização do workspace e indexa os arquivos `SKILL.md` automaticamente. |

> **Interoperabilidade:** A grande vantagem desta arquitetura é que **uma única Skill funciona em diferentes runtimes/agentes**. Não crie versões por ferramenta; o sistema de arquivos é a fonte da verdade universal.

---

## 1. A Nova Fronteira: Engenharia Agêntica

A era de utilizar LLMs apenas como chatbots consultivos acabou. Estamos vivendo a transição para **Agentes Autônomos**, sistemas capazes de orquestrar planejamento, execução de ferramentas e verificação de resultados. No entanto, a eficácia de um agente é diretamente proporcional à qualidade das ferramentas (Skills) fornecidas a ele.

Diferente de um prompt isolado, uma **Skill** é uma unidade funcional modular, reutilizável e determinística que expande as capacidades nativas do modelo.

### O Padrão de Arquitetura de Skills

Para garantir interoperabilidade entre plataformas como Codex, Claude, OpenCode e Antigravity, adotamos uma arquitetura baseada em **Isolamento de Contexto** e **Execução Segura**.

Isso resolve o problema da "Alucinação Funcional": pesquisas da Anthropic e da DeepMind indicam que modelos "aterrados" (grounded) em ferramentas bem definidas cometem significativamente menos erros lógicos.

### O "Stack" Agêntico

Para criar agentes realmente eficazes que entendam o contexto da sua organização, utilizamos três padrões complementares alinhados ao ecossistema da **Agentic AI Foundation**:

1. **MCP (Model Context Protocol):** A camada de **Acesso a Dados**. Responde "Quais ferramentas e dados posso acessar?" (ex: conectar ao Postgres ou Jira).
2. **Agent Skills:** A camada de **Know-How**. Responde "Como devo realizar esta tarefa?" (ex: metodologia de Code Review da empresa).
3. **AGENTS.md:** A camada de **Contexto do Projeto**. Responde "Quais são as regras deste projeto específico?" (ex: usar React com Tailwind).

---

## 2. Arquitetura Técnica de uma Skill

Para construir uma skill robusta, abandonamos estruturas orgânicas em favor de uma organização estrita. Não é apenas sobre pastas, é sobre **Progressive Disclosure** (Divulgação Progressiva).

### O Padrão "Progressive Disclosure"

Se carregássemos todo o conhecimento de uma vez, estouraríamos o contexto do modelo. Por isso, a arquitetura opera em 3 fases distintas:

- **Fase 1 (Discovery):** O agente escaneia apenas os metadados (YAML). Custo: ~100 tokens.
- **Fase 2 (Activation):** Ao escolher uma skill, o agente lê o `SKILL.md` completo. Custo: ~2k-5k tokens.
- **Fase 3 (Execution):** Scripts e referências pesadas são acessados apenas sob demanda. Custo: Zero até ser usado.

Esse padrão está alinhado com as recomendações oficiais da Anthropic para gerenciamento de contexto e construção de agentes:

- **Claude Docs - Long context prompting tips:** [platform.claude.com/docs/en/build-with-claude/prompt-engineering/long-context-tips](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/long-context-tips)
- **Anthropic Engineering - Building effective agents:** [anthropic.com/engineering/building-effective-agents](https://www.anthropic.com/engineering/building-effective-agents)
- **Evidência acadêmica sobre contexto ("Lost in the Middle"):** [arxiv.org/abs/2307.03172](https://arxiv.org/abs/2307.03172)

![Diagrama do padrão Progressive Disclosure](/images/2025/agentic-engineering-progressive-disclosure.png)

---

### Estrutura de Diretórios da Skill

Uma skill localizada em `skills/<nome-da-skill>/` deve implementar os seguintes componentes:

### A. O Manifesto de Comportamento (`SKILL.md`)

Este arquivo atua como a **Interface de Controle** ou *System Prompt* dedicado.

- **Função:** Definir gatilhos de ativação e regras de negócio.
- **Tech Spec:** Deve conter metadados em YAML (frontmatter) e instruções em Markdown conciso.
- **Convenção de Nomes:** Use verbos no gerúndio para facilitar a descoberta semântica pelo agente (ex: `processing-pdfs`, `managing-databases`, `reviewing-code`).

> **Design Pattern: Graus de Liberdade (Degrees of Freedom)**
>
> - **Baixa Liberdade:** Para tarefas críticas (migrações, infra), use scripts rígidos. Não deixe a IA "pensar".
> - **Alta Liberdade:** Para tarefas criativas (code review, docs), dê diretrizes e exemplos, mas permita adaptação.

### Frontmatter e Execução Avançada

Além de `name` e `description`, estes campos deixam a skill mais previsível e poderosa:

- **`allowed-tools`**: define ferramentas permitidas durante a skill.
- **`disable-model-invocation`**: se `true`, a skill só roda por invocação manual.
- **`user-invocable`**: controla se a skill aparece no menu de comandos.
- **`argument-hint`**: documenta o formato esperado de argumentos.
- **`context: fork` + `agent`**: roda em subagente isolado para tarefas longas ou especializadas.

Exemplo:

```yaml
---
name: review-pr
description: Revisa PR com checklist de segurança, testes e legibilidade.
argument-hint: [pr-number]
allowed-tools: Read, Grep, Bash(gh pr view *), Bash(gh pr diff *)
---
```

### B. A Camada de Execução (`scripts/`)

Onde o determinismo acontece. Não peça para a IA "imaginar" como executar uma migração de banco de dados.

- **Função:** Scripts em Python, Bash ou Node.js que realizam a tarefa pesada.
- **Segurança:** Permite auditoria de código e execução em sandbox.
- **Progressive Disclosure (Nível 3):** Estes arquivos NUNCA são lidos pelo LLM, apenas executados. Isso garante zero consumo de tokens para a lógica pesada.

### C. A Base de Conhecimento (`references/`)

Documentação estática e exemplos (One-shot learning).

- **Função:** Fornecer contexto *Just-in-Time*. O agente só carrega esses arquivos se a tarefa exigir, economizando tokens.

![Estrutura de diretórios de uma skill](/images/2025/agentic-engineering-directory-structure.png)

---

## 3. Implementação e Uso por Ambiente

### Codex, Claude, OpenCode e Antigravity: Fundamentos Compartilhados

Os quatro ambientes seguem os mesmos pilares de arquitetura agêntica: **MCP + Skills + Loop Plan → Execute → Verify**.

1. **Planejamento (Plan):** O agente entende contexto e estado atual via memória de projeto e regras locais (ex: `AGENTS.md`, `CLAUDE.md`, skills de `project-memory`).
2. **Execução (Execute):** O agente usa ferramentas e scripts (`scripts/`) para aplicar mudanças de forma determinística.
3. **Verificação (Verify):** O agente valida o resultado com testes, checks e critérios de qualidade antes de encerrar a tarefa.

O que muda entre Codex, Claude, OpenCode e Antigravity é principalmente a **experiência de configuração/orquestração** (onde declarar agentes, memória e integrações), e não os princípios operacionais.

- **MCP em todos:** MCP é um padrão aberto e pode ser usado em todos os ambientes para conectar dados e ferramentas externas.
- **Codex (exemplo prático):** uso de `skills/` + `AGENTS.md` como contrato local do projeto e execução de ferramentas no workspace.
- **Claude (exemplo prático):** *Personas* em `.claude/agents` e contexto persistente em `CLAUDE.md`.
- **OpenCode/Antigravity (exemplo prático):** Skills em `skills/`, execução por scripts e validação contínua no loop autônomo.

> **Segurança Crítica:** Configure skills destrutivas (ex: `git push`, deleção de arquivos) para exigir aprovação humana explícita (*Human-in-the-loop*), independentemente da autonomia do agente.

---

## 4. Estudo de Caso: Criando a Skill `git-safe`

Vamos construir uma skill real para garantir operações Git seguras.

**Estrutura de Diretórios:**

```text
skills/
└── git-safe/
    ├── SKILL.md
    └── scripts/
        └── pre_push_check.sh
```

**Conteúdo do `SKILL.md` (Manifesto):**

```markdown
---
name: git-safe
description: Utilitário para operações seguras de versionamento.
allowed-tools: bash
---
# Diretrizes
1. GATILHO: Quando o usuário solicitar sync/push.
2. AÇÃO: Execute `scripts/pre_push_check.sh`.
3. REGRA: Se o script falhar, aborte a operação e reporte o erro.
4. PROIBIDO: Nunca use flags `--human-override` sem permissão explícita.
```

**Conteúdo do `pre_push_check.sh` (Execução):**

```bash
#!/bin/bash
# Bloqueia push direto na main
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" = "main" ]; then
  echo "ERRO: Push direto na main bloqueado por política de segurança."
  exit 1
fi
```

---

## 5. Padrões Avançados de Arquitetura

Para levar seus agentes ao próximo nível, você pode implementar padrões de design avançados que imitam fluxos de trabalho humanos complexos.

### A. O Padrão "Evaluator-Optimizer"

Em vez de confiar na primeira resposta da IA, este padrão cria um loop de feedback interno.

- **Conceito:** Um agente "Gerador" produz uma solução, e um agente "Crítico" avalia. Se a avaliação for negativa, o Gerador refaz o trabalho com base no feedback.
- **Aplicação Prática (Code Review):**
  1. **Agente 1 (Dev):** Gera o código da skill.
  2. **Agente 2 (Sr. Engineer):** Analisa o código procurando vulnerabilidades. Se encontrar, devolve para o Agente 1.
  3. **Resultado:** Apenas código "aprovado" chega ao usuário.

### B. Loop de Qualidade (Validate-Fix-Repeat)

Nunca confie na primeira saída. O segredo da qualidade é o loop de feedback **imediato**.

1. **Ação:** O agente executa uma tarefa (ex: gera um JSON).
2. **Validação:** Um script roda imediatamente para verificar a integridade (ex: `validate_json.py`).
3. **Decisão:**
   - Se **Falha**: O agente lê o erro, corrige e tenta de novo.
   - Se **Sucesso**: Só então o resultado é apresentado ao usuário.

Isso previne o efeito cascata de erros e garante saídas robustas. Para tarefas massivas, um único agente se perde. A solução é delegar.

- **O Orquestrador:** Não põe a mão na massa. Ele analisa o pedido ("Construa um app completo"), quebra em sub-tarefas ("Criar DB", "Criar Frontend") e delega.
- **Os Operários (Workers):** Agentes especialistas que só enxergam suas próprias ferramentas. O *Worker-SQL* não tem acesso a ferramentas de CSS, e vice-versa. Isso aumenta drasticamente a segurança e a precisão.

### C. Testes Automatizados (LLM-as-a-Judge)

Como saber se seu agente está performando bem? Use outra IA para testar.

- **Frameworks:** Ferramentas como *DeepEval* ou scripts customizados permitem criar "Unit Tests" para prompts.
- **Exemplo de Teste de Skill:**

```python
# test_agent.py
def test_git_safe_block():
    response = agent.run("Faça um push na main")
    assert "bloqueado" in response.output
    assert agent.tools_called == ["pre_push_check.sh"]
```

---

## 6. Guia Técnico para Colaboradores

Esta seção é um checklist prático para começar a produzir com agentes, skills e MCP no dia a dia.

### 1. Onde as Skills Devem Ficar

- **Projeto:** `skills/<skill-name>/SKILL.md` (recomendado para padrões do time).
- **Pessoal:** diretório de skills do usuário (quando a skill for utilitária e não específica do projeto).
- **Regra prática:** se afeta código/regras do repositório, mantenha no próprio repositório.

### 2. Como o Agente Descobre Skills

- O agente lê primeiro metadados (`name`, `description`).
- Depois carrega o `SKILL.md` da skill relevante.
- Scripts e referências só entram quando necessário (progressive disclosure).
- Descrição boa = ativação boa. Descrição vaga = skill pouco acionada.

### 3. Estrutura Recomendada de Skill

```text
skills/
└── nome-da-skill/
    ├── SKILL.md
    ├── references/
    │   └── guia.md
    └── scripts/
        └── run.sh
```

- `SKILL.md`: objetivo, gatilho, fluxo e critérios de sucesso.
- `references/`: detalhes longos, exemplos, padrões.
- `scripts/`: execução determinística para tarefas críticas/repetitivas.

### 4. Skill Boa vs Skill Fraca

- **Boa:** escopo claro, entradas explícitas, saída esperada definida.
- **Fraca:** "faz tudo", sem critério de validação, sem exemplos.

### 5. Segurança Técnica no Uso Diário

- Nunca coloque segredo em `SKILL.md`, `references/` ou `AGENTS.md`.
- Sempre prefira script para ações sensíveis/repetitivas em vez de geração livre.
- Para ações destrutivas, exigir confirmação humana explícita.

### 6. Fluxo de Trabalho Recomendado

1. Defina a tarefa.
2. Veja se já existe skill no repositório.
3. Se não existir, crie uma skill mínima.
4. Rode no loop `Plan → Execute → Verify`.
5. Se funcionou, evolua com exemplos e script.
6. Se repetiu 3 vezes, virou candidata oficial do time.

### 7. Erros Comuns no Início

- Escrever `SKILL.md` longo sem separar em `references/`.
- Não declarar formato de argumentos.
- Não validar saída (teste/check/lint).
- Misturar regra do projeto dentro de prompt temporário em vez de `AGENTS.md`.

---

## 7. Recursos e Referências

Para aprofundar seu conhecimento em arquitetura de agentes e melhores práticas, consulte os seguintes materiais de referência da indústria:

**Documentação & Padrões:**

- **Model Context Protocol (MCP):** [modelcontextprotocol.io/docs/getting-started/intro](https://modelcontextprotocol.io/docs/getting-started/intro) — O padrão aberto para conectar assistentes de IA a sistemas.
- **Claude Prompt Engineering (System prompts):** [platform.claude.com/docs/en/build-with-claude/prompt-engineering/give-claude-a-role-system-prompts](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/give-claude-a-role-system-prompts) — Guia oficial de papéis e instruções de sistema.
- **Claude Prompt Engineering (Long context):** [platform.claude.com/docs/en/build-with-claude/prompt-engineering/long-context-tips](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/long-context-tips) — Boas práticas para prompts longos e contexto extenso.

**Artigos Recomendados:**

- *"Building Effective Agents"* (Anthropic Engineering): [anthropic.com/engineering/building-effective-agents](https://www.anthropic.com/engineering/building-effective-agents)
- *"ReAct: Synergizing Reasoning and Acting in Language Models"*: [arxiv.org/abs/2210.03629](https://arxiv.org/abs/2210.03629)
- *"Toolformer: Language Models Can Teach Themselves to Use Tools"*: [arxiv.org/abs/2302.04761](https://arxiv.org/abs/2302.04761)
- *"Lost in the Middle: How Language Models Use Long Contexts"*: [arxiv.org/abs/2307.03172](https://arxiv.org/abs/2307.03172)

**Repositórios de Exemplo:**

- `awesome-mcp-servers`: [github.com/punkpeye/awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers)
- Exemplos de "Agentic Workflows": [LangChain](https://github.com/langchain-ai/langchain) e [AutoGen](https://github.com/microsoft/autogen)

---

## Conclusão

Skills + MCP + contexto de projeto formam um padrão operacional moderno para times de engenharia. Comece pequeno, padronize cedo e evolua com consistência.

E aí, você já tem feito algo desse tipo com IA? Conta pra gente como isso tem acelerado seu fluxo de trabalho, onde ajudou de verdade e quais desafios ainda estão no caminho.
