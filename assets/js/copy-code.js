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
    const rawB64 = postCopyBtn.getAttribute('data-raw-content');
    if (rawB64) {
      postCopyBtn.addEventListener('click', () => {
        try {
          const rawText = decodeURIComponent(atob(rawB64).split('').map(c =>
            '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
          ).join(''));
          navigator.clipboard.writeText(rawText).then(() => {
            postCopyBtn.querySelector('span').textContent = 'Copied!';
            postCopyBtn.classList.add('copied');
          }).catch(() => {
            postCopyBtn.querySelector('span').textContent = 'Failed';
          });
          setTimeout(() => {
            postCopyBtn.querySelector('span').textContent = 'Copy Markdown';
            postCopyBtn.classList.remove('copied');
          }, 1500);
        } catch (e) {
          console.error(e);
          postCopyBtn.querySelector('span').textContent = 'Error';
          setTimeout(() => {
            postCopyBtn.querySelector('span').textContent = 'Copy Markdown';
          }, 1500);
        }
      });
    }
  }
});
