+++
author = "iceteash"
title = "Secure Boot com MOK: assinando módulos personalizados em ambientes UEFI"
date = 2025-03-27T12:10:31-03:00
description = "Configure o Secure Boot no Linux e aprenda a assinar módulos do kernel com sua própria chave (MOK)."
tags = [
  "linux",
  "bios",
  "nvidia",
  "distro",
  "kernel",
  "debian",
]
authors = ["iceteash"]
draft = true
+++

<!---->
<!---->
<!---->
<!--more-->
----
Com o aumento das aplicações de IA que exigem GPUs de alto desempenho, é comum a necessidade de utilizar módulos personalizados, incluindo <a href="https://github.com/NVIDIA/open-gpu-kernel-modules" target="_blank">drivers open-source como os da NVIDIA</a>. Esses módulos precisam ser assinados manualmente para funcionar corretamente em distribuições Linux que utilizam Secure Boot.

Este guia mostra como criar e cadastrar sua própria chave (MOK) no firmware UEFI, permitindo assinar com segurança esses módulos personalizados sem precisar desativar o Secure Boot.
<br></br>

## 1. Conceitos de Secure Boot e MOK

- **Secure Boot** é um recurso do firmware que carrega apenas binários assinados com chaves confiáveis. Em várias distribuições Linux, usa-se o binário "shim", já assinado pela Microsoft, garantindo compatibilidade.

- **MOK (Machine Owner Key)** chave para assinar kernels/módulos (ex.: drivers NVIDIA, DKMS) no firmware, com Secure Boot ativo.

## 2. Gerando e cadastrando a MOK

1. Em distribuições baseadas em Debian/Ubuntu, gere uma nova chave MOK com:

```bash
sudo update-secureboot-policy new-key
```
Isso criará os seguintes arquivos em `/var/lib/shim-signed/mok/`:

- MOK.der
- MOK.priv
- .rnd

2. Importe a chave pública (MOK.der) no firmware UEFI com o comando:

```bash
mokutil --import /var/lib/shim-signed/mok/MOK.der
```

Será solicitado que você defina uma senha que será confirmada na próximo boot.

3. Faça um reboot. Durante o boot seguinte, o sistema entrará automaticamente no MOK Manager (Shim).

Siga o passo a passo abaixo para confirmar a inclusão da nova chave no firmware.

## 3. Passo a passo no MOK Manager

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
