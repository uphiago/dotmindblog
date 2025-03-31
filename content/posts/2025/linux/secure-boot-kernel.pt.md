+++
author = "iceteash"
title = "Secure Boot com MOK: assinando módulos personalizados em ambientes UEFI"
date = 2025-03-27T12:10:31-03:00
description = "Configure o Secure Boot no Linux e aprenda a assinar módulos do kernel com sua própria chave MOK."
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

<!--more-->
----
Com o aumento das aplicações de IA que exigem GPUs de alto desempenho, é comum a necessidade de utilizar módulos personalizados, incluindo <a href="https://github.com/NVIDIA/open-gpu-kernel-modules" target="_blank">drivers open-source como os da NVIDIA</a>. Esses módulos precisam ser assinados manualmente para funcionar corretamente em distribuições Linux que utilizam Secure Boot.

Este guia mostra como criar e cadastrar sua própria chave (MOK) no firmware UEFI, permitindo assinar com segurança esses módulos personalizados sem precisar desativar o Secure Boot.

<br></br>

## 1. Conceitos de Secure Boot e MOK

- **Secure Boot** é um recurso do firmware que carrega apenas binários assinados com chaves confiáveis. Em várias distribuições Linux, usa-se o binário "shim", já assinado pela Microsoft, garantindo compatibilidade.

- Verifique o status do Secure Boot:
```bash
mokutil --sb-state
```

- **MOK (Machine Owner Key)** chave para assinar kernels/módulos (ex.: drivers NVIDIA, DKMS) no firmware, com Secure Boot ativo.

## 2. Gerando e cadastrando a MOK

1. Em distribuições baseadas em Debian/Ubuntu, gere uma nova chave MOK com:

```bash
sudo mkdir -p /var/lib/shim-signed/mok/

sudo openssl req -nodes -new -x509 -newkey rsa:2048 \
  -keyout /var/lib/shim-signed/mok/MOK.priv \
  -outform DER -out /var/lib/shim-signed/mok/MOK.der \
  -days 36500 -subj "/CN=My Secure Boot Key/"
```

Isso criará os arquivos `MOK.der` e `MOK.priv` em `/var/lib/shim-signed/mok/`, verifique com:
```bash
ls -l /var/lib/shim-signed/mok/
```

2. Importe a chave pública (MOK.der) no firmware UEFI com o comando:

```bash
mokutil --import /var/lib/shim-signed/mok/MOK.der
```

Defina uma senha que será solicitada no próximo boot e reinicie o sistema em seguida.

3. Durante o boot seguinte, o sistema entrará automaticamente no MOK Manager (Shim).

## 3. Passo a passo no MOK Manager

1. Assim que a máquina reiniciar, o utilitário de gerenciamento de chaves UEFI "Shim" deve aparecer. Pressione qualquer tecla para começar.

![Tela inicial do MOK Manager exibindo interface de gerenciamento de chaves](/images/2025/secure-boot-bios-2.png)

3. Selecione "Enroll MOK".

![A tela "Perform MOK management" é exibida.](/images/2025/secure-boot-bios-3.png)

4. Selecione "Continue".

![uefi1](/images/2025/secure-boot-bios-6.png)

5. Selecione "Yes".

![uefi1](/images/2025/secure-boot-bios-7.png)

6. Digite a senha que você definiu ao importar a chave.

![uefi1](/images/2025/secure-boot-bios-8.png)

7. A tela "Perform MOK management" reaparecerá. Selecione "Reboot".

![uefi1](/images/2025/secure-boot-bios-9.png)

Ao voltar para o sistema operacional, sua chave já estará inclusa no firmware.

## 4. Assinando novos Módulos (Ex.: NVIDIA/DKMS)

- Se estiver usando DKMS, configure o arquivo `/etc/dkms/framework.conf` para apontar para sua MOK. Assim, os módulos recompilados serão assinados automaticamente.

```bash
mok_signing_key="/var/lib/shim-signed/mok/MOK.priv"
mok_certificate="/var/lib/shim-signed/mok/MOK.der"
```

- Para assinar manualmente:

   Substitua `nvidia` pelo `<module_name>` para localizar o módulo desejado:
   ```bash
   sudo modinfo -n nvidia
   ```
   Descompacte o módulo para um arquivo temporário:
   ```bash
   sudo zstd -d /lib/modules/$(uname -r)/updates/dkms/nvidia.ko.zst -o /tmp/nvidia.ko
   ```
   Assine o módulo recém-descompactado diretamente usando sign-file:
   ```bash
   sudo /usr/src/linux-headers-$(uname -r)/scripts/sign-file sha256 \
      /var/lib/shim-signed/mok/MOK.priv \
      /var/lib/shim-signed/mok/MOK.der \
      /tmp/nvidia.ko
   ```
   Após a assinatura, sobrescreva novamente o módulo assinado comprimido no sistema original:
   ```bash
   sudo zstd -f --rm /tmp/nvidia.ko -o /lib/modules/$(uname -r)/updates/dkms/nvidia.ko.zst
   ```
   Reconstrua o cache de módulos:
   ```bash
   sudo depmod -a
   ```
   Se necessário, atualize o initramfs para refletir nos módulos iniciais carregados durante o boot:
   ```bash
   sudo update-initramfs -u -k $(uname -r)
   ```

- (Opcional) Ver todos os módulos e confirmar suas assinaturas:

```bash
for mod in /lib/modules/$(uname -r)/updates/dkms/*.ko.zst; do
    out="/tmp/$(basename "$mod" .zst)"
    zstd -d "$mod" -o "$out"
    echo ">>> $(basename "$out")"
    modinfo "$out" | grep signer
done
```

## 5. Boas Práticas & Cuidados

- **Importante**: Proteja suas chaves privadas.
- Se você perder essa chave ou esquecer a senha, precisará gerar e importar novamente a MOK.
- Confira logs (dmesg, journalctl) para erros como “module signature verification failed”.
- Em algumas placas-mãe ou configuradores de VM (ex.: Hyper-V), é preciso configurar o Secure Boot para aceitar chaves da “Microsoft UEFI Certificate Authority” antes de gerar ou importar a MOK.

## 6. Conclusão

Mantendo o Secure Boot ativo e cadastrando sua própria MOK, você consegue executar drivers e kernels customizados de forma segura. Para cenários mais avançados ou detalhes específicos de cada distro, consulte a documentação oficial.

![Secure Boot BIOS Screenshot](/images/2025/secure-boot-bios-1.png)

## Referências

- [Wiki Debian - SecureBoot](https://wiki.debian.org/SecureBoot#MOK_-_Machine_Owner_Key)
- [Arch Linux Wiki - Secure Boot](https://wiki.archlinux.org/title/Unified_Extensible_Firmware_Interface/Secure_Boot)
- [Dynamic Kernel Module Support](https://wiki.archlinux.org/title/Dynamic_Kernel_Module_Support)
