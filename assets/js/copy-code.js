document.addEventListener("DOMContentLoaded", () => {
  const svgCopy = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" stroke="#888" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>`;

  const svgCopied = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" stroke="#4caf50" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20 6 9 17l-5-5"/>
  </svg>`;

  const svgFail = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" stroke="#f44336" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>`;

  function addCopyButton(container) {
    const button = document.createElement('button');
    button.className = 'highlight-copy-btn';
    button.innerHTML = svgCopy;

    button.addEventListener('click', () => {
      navigator.clipboard.writeText(container.innerText).then(() => {
        button.innerHTML = svgCopied;
      }).catch(err => {
        console.error(err);
        button.innerHTML = svgFail;
      });
      setTimeout(() => button.innerHTML = svgCopy, 1500);
    });

    container.style.position = 'relative';
    container.appendChild(button);
  }

  document.querySelectorAll('.highlight').forEach(addCopyButton);

  // Copy entire post as Markdown
  const postCopyBtn = document.querySelector('.copy-post-btn');
  if (postCopyBtn) {
    const filePath = postCopyBtn.getAttribute('data-file-path');
    if (filePath) {
      const rawUrl = `https://raw.githubusercontent.com/uphiago/dotmindblog/main/content/${filePath}`;
      const iconCopy = postCopyBtn.innerHTML;
      postCopyBtn.addEventListener('click', () => {
        postCopyBtn.disabled = true;
        fetch(rawUrl)
          .then(r => r.text())
          .then(text => navigator.clipboard.writeText(text))
          .then(() => {
            postCopyBtn.innerHTML = svgCopied;
            postCopyBtn.classList.add('copied');
          })
          .catch(() => { postCopyBtn.innerHTML = svgFail; })
          .finally(() => {
            postCopyBtn.disabled = false;
            setTimeout(() => {
              postCopyBtn.innerHTML = iconCopy;
              postCopyBtn.classList.remove('copied');
            }, 1500);
          });
      });
    }
  }
});
