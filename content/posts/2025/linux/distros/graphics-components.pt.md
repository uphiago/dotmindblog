+++
author = "iceteash"
title = "DE, WM, X11 e Wayland"
date = 2025-05-01T00:27:00-03:00
description = "DE, WM, X11 e Wayland no Linux"

tags = [
  "linux",
  "nvidia",
  "distro",
  "kernel",
  "debian",
]
authors = ["iceteash"]
draft = false
+++
<!--more-->

## Componentes que formam a interface gráfica do Linux

Antes de falarmos de drivers, vale entender como funcionam os principais componentes da interface gráfica no Linux.

<br>

**TL;DR:** No Linux, o DE fornece a interface visual, o WM organiza as janelas, e X11 ou Wayland define como os aplicativos se comunicam com a GPU e o servidor gráfico.

## Ambiente de Área de Trabalho (DE)

O **Desktop Environment** reúne tudo aquilo que você "vê e toca" diariamente:

- barra de tarefas e bandeja do sistema
- menus, notificações e janelas (estilo, animações, botões)
- gerenciador de arquivos, painéis, widgets
- temas, ícones e fontes

**Ex.:** GNOME, KDE Plasma (sou fã), Cinnamon, Budgie...

Cada um equilibra desempenho, visual e recursos de forma diferente.

---

## Gerenciador de Janelas (WM)

O **Window Manager** decide onde e como cada janela aparece na sua tela:

- posicionamento (flutuante, mosaico, monocle)
- atalhos de teclado para mover/redimensionar
- bordas, sombras e pilha de janelas
- regras de foco e workspaces

Você pode usar o WM que já vem integrado ao DE, ou optar por um WM independente para ter mais controle e personalização.

**Ex.:** i3, bspwm, Sway, Hyprland.

---

## Protocolos Gráficos

O protocolo gráfico funciona como intermediário entre as aplicações, o WM/DE e o hardware de vídeo. No Linux essa função é sustentada por dois protocolos principais, cada um com suas características e limitações:

### X11 (Xorg)

- **Por que escolher**
  - Alta compatibilidade com aplicativos, ambientes gráficos e drivers existentes.
  - Ecossistema maduro, com suporte a extensões, depuração, automação e forwarding remoto.
  - Recomendado para cenários legados ou quando ferramentas específicas ainda exigem X11.

- **Onde pode doer**  
  - Arquitetura antiga, com camadas que elevam a latência e dificultam otimizações.
  - Suporte limitado a HiDPI, múltiplas GPUs e monitores de alta taxa de atualização.
  - Segurança frágil: qualquer aplicativo pode interceptar entradas globais (teclado/mouse).

---

### Wayland

- **Por que escolher**
  - Arquitetura moderna com renderização direta, que reduz a latência e melhora o uso de recursos.
  - Modelo de segurança isolado: aplicações não têm acesso às entradas ou janelas umas das outras.
  - Suporte nativo aprimorado para HiDPI, escala fracionada e rotação de tela.

- **Onde pode doer**
  - Aplicações legadas ainda exigem X11, embora o XWayland forneça compatibilidade parcial.
  - Ferramentas gráficas avançadas e alguns drivers ainda enfrentam limitações ou instabilidades.
  - Captura de tela e gravação podem ter limitações dependendo do compositor.

> **Dica rápida:** Algumas distros permitem alternar entre Wayland e Xorg na tela de login. Se algo essencial não funcionar em Wayland, basta voltar ao X11.

Com esses conceitos, você poderá ajustar compositor, protocolo e window manager, dando maior controle sobre latência, renderização e uso da GPU para o seu dia a dia.