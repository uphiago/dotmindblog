+++
author = "iceteash"
title = "Practical Guide to Agentic Engineering: Skills Stack, MCP, and Project Context"
date = 2026-03-10T00:00:00-03:00
description = "How to structure Skills, MCP, and project context to build robust, interoperable autonomous agents across any AI runtime."
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

> **Author's Note:** This guide consolidates best practices for prompt engineering and autonomous systems architecture. It is designed for developers who want to move beyond simple "prompts" toward robust and reliable agentic systems.

<!--more-->

---

## 0. Quick Setup (TL;DR)

Want to get started right now? Here's how to configure Skills support in common agentic environments.

| Platform | How to Configure |
| :--- | :--- |
| **Codex** | Keep skills in `skills/` in your workspace and project rules in `AGENTS.md`. The agent uses these artifacts as its primary source of operational context. |
| **Claude** | Add the `skills/` folder path to your `claude_desktop_config.json` or simply drag the folder into the chat context. |
| **OpenCode** | Skills are loaded automatically if placed at the project root under `.opencode/skills` or `skills/`. Make sure the Agent plugin is active. |
| **Antigravity** | No action needed. Antigravity scans the `skills/` folder at workspace startup and automatically indexes `SKILL.md` files. |

> **Interoperability:** The key advantage of this architecture is that **a single Skill works across different runtimes/agents**. Don't create per-tool versions; the file system is the universal source of truth.

---

## 1. The New Frontier: Agentic Engineering

The era of using LLMs purely as consultative chatbots is over. We are living through the transition to **Autonomous Agents** — systems capable of orchestrating planning, tool execution, and result verification. However, an agent's effectiveness is directly proportional to the quality of the tools (Skills) provided to it.

Unlike a standalone prompt, a **Skill** is a modular, reusable, and deterministic functional unit that extends the model's native capabilities.

### The Skills Architecture Pattern

To guarantee interoperability across platforms like Codex, Claude, OpenCode, and Antigravity, we adopt an architecture based on **Context Isolation** and **Safe Execution**.

This solves the "Functional Hallucination" problem: research from Anthropic and DeepMind indicates that models "grounded" in well-defined tools make significantly fewer logical errors.

### The Agentic Stack

To build truly effective agents that understand your organization's context, we use three complementary patterns aligned with the **Agentic AI Foundation** ecosystem:

1. **MCP (Model Context Protocol):** The **Data Access** layer. Answers "What tools and data can I access?" (e.g., connecting to Postgres or Jira).
2. **Agent Skills:** The **Know-How** layer. Answers "How should I perform this task?" (e.g., the company's Code Review methodology).
3. **AGENTS.md:** The **Project Context** layer. Answers "What are the rules for this specific project?" (e.g., use React with Tailwind).

---

## 2. Technical Architecture of a Skill

To build a robust skill, we abandon organic structures in favor of strict organization. It's not just about folders — it's about **Progressive Disclosure**.

### The "Progressive Disclosure" Pattern

Loading all knowledge at once would blow up the model's context. That's why the architecture operates in 3 distinct phases:

- **Phase 1 (Discovery):** The agent scans only metadata (YAML). Cost: ~100 tokens.
- **Phase 2 (Activation):** Upon selecting a skill, the agent reads the full `SKILL.md`. Cost: ~2k–5k tokens.
- **Phase 3 (Execution):** Scripts and heavy references are accessed only on demand. Cost: Zero until used.

This pattern aligns with Anthropic's official recommendations for context management and agent construction:

- **Claude Docs - Long context prompting tips:** [platform.claude.com/docs/en/build-with-claude/prompt-engineering/long-context-tips](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/long-context-tips)
- **Anthropic Engineering - Building effective agents:** [anthropic.com/engineering/building-effective-agents](https://www.anthropic.com/engineering/building-effective-agents)
- **Academic evidence on context ("Lost in the Middle"):** [arxiv.org/abs/2307.03172](https://arxiv.org/abs/2307.03172)

![Progressive Disclosure pattern diagram](/images/2025/agentic-engineering-progressive-disclosure.png)

---

### Skill Directory Structure

A skill located at `skills/<skill-name>/` should implement the following components:

### A. The Behavior Manifest (`SKILL.md`)

This file acts as the **Control Interface** or dedicated *System Prompt*.

- **Purpose:** Define activation triggers and business rules.
- **Tech Spec:** Should contain YAML metadata (frontmatter) and concise Markdown instructions.
- **Naming Convention:** Use gerund verbs for better semantic discovery by the agent (e.g., `processing-pdfs`, `managing-databases`, `reviewing-code`).

> **Design Pattern: Degrees of Freedom**
>
> - **Low Freedom:** For critical tasks (migrations, infra), use rigid scripts. Don't let the AI "think".
> - **High Freedom:** For creative tasks (code review, docs), provide guidelines and examples, but allow adaptation.

### Frontmatter and Advanced Execution

Beyond `name` and `description`, these fields make your skill more predictable and powerful:

- **`allowed-tools`**: defines which tools are permitted during the skill.
- **`disable-model-invocation`**: if `true`, the skill only runs via manual invocation.
- **`user-invocable`**: controls whether the skill appears in the command menu.
- **`argument-hint`**: documents the expected argument format.
- **`context: fork` + `agent`**: runs in an isolated sub-agent for long or specialized tasks.

Example:

```yaml
---
name: review-pr
description: Reviews PR with security, testing, and readability checklist.
argument-hint: [pr-number]
allowed-tools: Read, Grep, Bash(gh pr view *), Bash(gh pr diff *)
---
```

### B. The Execution Layer (`scripts/`)

Where determinism happens. Don't ask the AI to "imagine" how to run a database migration.

- **Purpose:** Python, Bash, or Node.js scripts that handle the heavy lifting.
- **Security:** Enables code auditing and sandbox execution.
- **Progressive Disclosure (Level 3):** These files are NEVER read by the LLM — only executed. This guarantees zero token consumption for heavy logic.

### C. The Knowledge Base (`references/`)

Static documentation and examples (One-shot learning).

- **Purpose:** Provide *Just-in-Time* context. The agent only loads these files when the task demands it, saving tokens.

![Skill directory structure](/images/2025/agentic-engineering-directory-structure.png)

---

## 3. Implementation and Usage by Environment

### Codex, Claude, OpenCode, and Antigravity: Shared Foundations

All four environments follow the same pillars of agentic architecture: **MCP + Skills + Plan → Execute → Verify loop**.

1. **Planning (Plan):** The agent understands context and current state via project memory and local rules (e.g., `AGENTS.md`, `CLAUDE.md`, `project-memory` skills).
2. **Execution (Execute):** The agent uses tools and scripts (`scripts/`) to apply changes deterministically.
3. **Verification (Verify):** The agent validates the result with tests, checks, and quality criteria before completing the task.

What differs between Codex, Claude, OpenCode, and Antigravity is mainly the **configuration/orchestration experience** (where to declare agents, memory, and integrations) — not the operational principles.

- **MCP everywhere:** MCP is an open standard and can be used across all environments to connect external data and tools.
- **Codex (practical example):** `skills/` + `AGENTS.md` as the project's local contract, with tool execution in the workspace.
- **Claude (practical example):** *Personas* in `.claude/agents` and persistent context in `CLAUDE.md`.
- **OpenCode/Antigravity (practical example):** Skills in `skills/`, script-based execution, and continuous validation in the autonomous loop.

> **Critical Security:** Configure destructive skills (e.g., `git push`, file deletion) to require explicit human approval (*Human-in-the-loop*), regardless of the agent's autonomy level.

---

## 4. Case Study: Building the `git-safe` Skill

Let's build a real skill to enforce safe Git operations.

**Directory Structure:**

```text
skills/
└── git-safe/
    ├── SKILL.md
    └── scripts/
        └── pre_push_check.sh
```

**`SKILL.md` contents (Manifest):**

```markdown
---
name: git-safe
description: Utility for safe version control operations.
allowed-tools: bash
---
# Guidelines
1. TRIGGER: When the user requests sync/push.
2. ACTION: Execute `scripts/pre_push_check.sh`.
3. RULE: If the script fails, abort the operation and report the error.
4. FORBIDDEN: Never use `--human-override` flags without explicit permission.
```

**`pre_push_check.sh` contents (Execution):**

```bash
#!/bin/bash
# Blocks direct push to main
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" = "main" ]; then
  echo "ERROR: Direct push to main blocked by security policy."
  exit 1
fi
```

---

## 5. Advanced Architecture Patterns

To take your agents to the next level, you can implement advanced design patterns that mirror complex human workflows.

### A. The "Evaluator-Optimizer" Pattern

Instead of trusting the AI's first response, this pattern creates an internal feedback loop.

- **Concept:** A "Generator" agent produces a solution, and a "Critic" agent evaluates it. If the evaluation is negative, the Generator reworks the output based on the feedback.
- **Practical Application (Code Review):**
  1. **Agent 1 (Dev):** Generates the skill code.
  2. **Agent 2 (Sr. Engineer):** Analyzes the code for vulnerabilities. If found, sends it back to Agent 1.
  3. **Result:** Only "approved" code reaches the user.

### B. Quality Loop (Validate-Fix-Repeat)

Never trust the first output. The secret to quality is an **immediate** feedback loop.

1. **Action:** The agent executes a task (e.g., generates a JSON).
2. **Validation:** A script runs immediately to verify integrity (e.g., `validate_json.py`).
3. **Decision:**
   - If **Failure**: The agent reads the error, fixes it, and tries again.
   - If **Success**: Only then is the result presented to the user.

This prevents cascading errors and ensures robust outputs. For massive tasks, a single agent gets lost. The solution is delegation.

- **The Orchestrator:** Doesn't get its hands dirty. It analyzes the request ("Build a complete app"), breaks it into sub-tasks ("Create DB", "Create Frontend"), and delegates.
- **The Workers:** Specialist agents that only see their own tools. The *Worker-SQL* has no access to CSS tools, and vice versa. This dramatically increases both security and precision.

### C. Automated Testing (LLM-as-a-Judge)

How do you know if your agent is performing well? Use another AI to test it.

- **Frameworks:** Tools like *DeepEval* or custom scripts allow you to create "Unit Tests" for prompts.
- **Skill Test Example:**

```python
# test_agent.py
def test_git_safe_block():
    response = agent.run("Push to main")
    assert "blocked" in response.output
    assert agent.tools_called == ["pre_push_check.sh"]
```

---

## 6. Technical Guide for Contributors

This section is a practical checklist for getting productive with agents, skills, and MCP on a daily basis.

### 1. Where Skills Should Live

- **Project:** `skills/<skill-name>/SKILL.md` (recommended for team-wide standards).
- **Personal:** user skills directory (when the skill is a utility not specific to the project).
- **Rule of thumb:** if it affects the repository's code or rules, keep it in the repository.

### 2. How the Agent Discovers Skills

- The agent first reads metadata (`name`, `description`).
- Then loads the `SKILL.md` of the relevant skill.
- Scripts and references only come in when necessary (progressive disclosure).
- Good description = good activation. Vague description = skill rarely triggered.

### 3. Recommended Skill Structure

```text
skills/
└── skill-name/
    ├── SKILL.md
    ├── references/
    │   └── guide.md
    └── scripts/
        └── run.sh
```

- `SKILL.md`: objective, trigger, flow, and success criteria.
- `references/`: long details, examples, patterns.
- `scripts/`: deterministic execution for critical or repetitive tasks.

### 4. Good Skill vs. Weak Skill

- **Good:** clear scope, explicit inputs, defined expected output.
- **Weak:** "does everything", no validation criteria, no examples.

### 5. Day-to-Day Technical Security

- Never put secrets in `SKILL.md`, `references/`, or `AGENTS.md`.
- Always prefer scripts for sensitive or repetitive actions over free-form generation.
- For destructive actions, require explicit human confirmation.

### 6. Recommended Workflow

1. Define the task.
2. Check if a skill already exists in the repository.
3. If not, create a minimal skill.
4. Run the `Plan → Execute → Verify` loop.
5. If it worked, evolve it with examples and scripts.
6. If it ran 3 times successfully, it's a candidate for an official team skill.

### 7. Common Beginner Mistakes

- Writing a long `SKILL.md` without splitting into `references/`.
- Not declaring argument format.
- Not validating output (test/check/lint).
- Mixing project rules inside a temporary prompt instead of `AGENTS.md`.

---

## 7. Resources and References

To deepen your knowledge of agent architecture and best practices, refer to the following industry reference materials:

**Documentation & Standards:**

- **Model Context Protocol (MCP):** [modelcontextprotocol.io/docs/getting-started/intro](https://modelcontextprotocol.io/docs/getting-started/intro) — The open standard for connecting AI assistants to systems.
- **Claude Prompt Engineering (System prompts):** [platform.claude.com/docs/en/build-with-claude/prompt-engineering/give-claude-a-role-system-prompts](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/give-claude-a-role-system-prompts) — Official guide on roles and system instructions.
- **Claude Prompt Engineering (Long context):** [platform.claude.com/docs/en/build-with-claude/prompt-engineering/long-context-tips](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/long-context-tips) — Best practices for long prompts and extended context.

**Recommended Reading:**

- *"Building Effective Agents"* (Anthropic Engineering): [anthropic.com/engineering/building-effective-agents](https://www.anthropic.com/engineering/building-effective-agents)
- *"ReAct: Synergizing Reasoning and Acting in Language Models"*: [arxiv.org/abs/2210.03629](https://arxiv.org/abs/2210.03629)
- *"Toolformer: Language Models Can Teach Themselves to Use Tools"*: [arxiv.org/abs/2302.04761](https://arxiv.org/abs/2302.04761)
- *"Lost in the Middle: How Language Models Use Long Contexts"*: [arxiv.org/abs/2307.03172](https://arxiv.org/abs/2307.03172)

**Example Repositories:**

- `awesome-mcp-servers`: [github.com/punkpeye/awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers)
- "Agentic Workflows" examples: [LangChain](https://github.com/langchain-ai/langchain) and [AutoGen](https://github.com/microsoft/autogen)

---

## Conclusion

Skills + MCP + project context form a modern operational standard for engineering teams. Start small, standardize early, and evolve with consistency.

Have you been doing something like this with AI? Tell us how it has accelerated your workflow, where it truly helped, and what challenges are still in the way.
