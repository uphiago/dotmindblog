+++
author = "iceteash"
title = "Secure Boot BIOS e Linux Distros"
date = 2025-03-27T12:10:31-03:00
description = "Entenda como configurar o Secure Boot, cadastrar a MOK no firmware UEFI e assinar módulos personalizados."
tags = [
  "linux",
  "bios",
  "nvidia",
  "distro",
  "kernel",
  "debian",
]
draft = true
+++
<br></br>
Com o crescimento de aplicações de IA exigindo GPUs de alto desempenho, muitos usuários precisam instalar e **assinar** módulos proprietários (como drivers NVIDIA) em suas distros Linux, sem desativar o Secure Boot. Este guia explica como manter o Secure Boot ativo e, ao mesmo tempo, usar kernels e drivers customizados de forma segura.
<br></br>
  
<!--more-->
---
<br></br>
O Secure Boot é um recurso de segurança importante em sistemas modernos, mas pode causar dificuldades ao usar Linux, especialmente com drivers proprietários. Este guia mostra como manter a segurança do Secure Boot enquanto usa módulos personalizados no Linux.
<br></br>

## 1. Conceitos de Secure Boot e MOK

- **Secure Boot** é um recurso do firmware UEFI que carrega apenas binários assinados com chaves confiáveis (geralmente as da Microsoft). Em várias distros Linux, utiliza-se o binário "shim", que já vem assinado pela Microsoft, para garantir compatibilidade.

- **MOK (Machine Owner Key)** é a chave que você mesmo pode gerar e cadastrar no firmware, permitindo assinar kernels e módulos customizados (ex.: drivers NVIDIA, DKMS) sem desativar o Secure Boot.

## 2. Gerando e Enrolando a Chave (MOK)

1. Em distros baseadas em Debian/Ubuntu, gere a chave com:

```bash
sudo update-secureboot-policy new-key
```

Isso criará os seguintes arquivos em /var/lib/shim-signed/mok/:

- MOK.der
- MOK.priv
- MOK.pem

2. Importe a chave no firmware:

```bash
mokutil --import /var/lib/shim-signed/mok/MOK.der
```

Será solicitada uma senha que você confirmará no próximo boot.

3. Reinicie o PC. Ao reiniciar, o sistema entrará no MOK Manager (Shim UEFI key management console). Siga o passo a passo abaixo para concluir a inclusão da chave:

### Passo a passo no MOK Manager

1. (Reboot) Assim que a máquina reiniciar, o utilitário de gerenciamento de chaves UEFI "Shim" deve aparecer.  
   ![Tela inicial do MOK Manager exibindo interface de gerenciamento de chaves](/images/2025/secure-boot-bios-2.png)
   _Figura 1: Interface de gerenciamento de chaves UEFI Shim após reinicialização_

2. Pressione qualquer tecla para começar. A tela "Perform MOK management" é exibida.

3. Selecione "Enroll MOK".  
   ![uefi1](/images/2025/secure-boot-bios-3.png)
   A tela "Enroll MOK" é exibida.

4. Se desejar conferir mais detalhes, selecione "View key 0".  
   ![uefi1](/images/2025/secure-boot-bios-4.png)  
   O detalhamento da chave será mostrado.  
   ![uefi1](/images/2025/secure-boot-bios-5.png)

5. Pressione qualquer tecla para retornar à tela "Enroll MOK".

6. Selecione "Continue".  
   ![uefi1](/images/2025/secure-boot-bios-6.png)  
   A tela "Enroll the key(s)?" é exibida.

7. Selecione "Yes".  
   ![uefi1](/images/2025/secure-boot-bios-7.png)

8. Digite a senha que você definiu ao importar a chave (ou a senha de root, conforme o caso de sua distro).  
   ![uefi1](/images/2025/secure-boot-bios-8.png)  
   A tela "Perform MOK management" reaparecerá.

9. Selecione "Reboot".  
   ![uefi1](/images/2025/secure-boot-bios-9.png)

Ao voltar para o sistema operacional, sua chave já estará inclusa no firmware.

4. Verifique o status do Secure Boot:

```bash
mokutil --sb-state
```

## 3. Assinando Módulos (Ex.: NVIDIA/DKMS)

- Se estiver usando DKMS, configure o arquivo /etc/dkms/framework.conf para apontar para sua MOK (chave privada e pública). Assim, os módulos recompilados serão assinados automaticamente.

- Para assinar manualmente:

```bash
sudo /usr/src/linux-headers-$(uname -r)/scripts/sign-file sha256 \
  /var/lib/shim-signed/mok/MOK.priv \
  /var/lib/shim-signed/mok/MOK.der \
  /caminho/do/modulo.ko
```

- Confirme a assinatura com:

```bash
modinfo /caminho/do/modulo.ko | grep signer
```

## 4. Boas Práticas & Cuidados

- **Importante**: Proteja sua chave privada (.priv).
- Se esquecer a senha do MOK Manager, gere/importe outra chave.
- Confira logs (dmesg, journalctl) para erros como “module signature verification failed”.
- Em algumas placas-mãe ou configuradores de VM (ex.: Hyper-V), é preciso configurar o Secure Boot para aceitar chaves da “Microsoft UEFI Certificate Authority” antes de gerar ou importar a MOK.

## 5. Conclusão

Mantendo o Secure Boot ativo e cadastrando sua própria MOK, você consegue executar drivers e kernels customizados de forma segura. Para cenários mais avançados ou detalhes específicos de cada distro, consulte a documentação oficial (por exemplo, Wiki Debian, Ubuntu Docs ou páginas da sua distribuição).

![Secure Boot BIOS Screenshot](/images/2025/secure-boot-bios-1.png)

## Referências

- [Documentação Oficial Ubuntu sobre Secure Boot](link)
- [Wiki Debian - SecureBoot](link)
- [Arch Linux Wiki - Secure Boot](link)
- [Documentação DKMS](link)
