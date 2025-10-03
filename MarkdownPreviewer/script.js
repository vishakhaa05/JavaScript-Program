const editor = document.getElementById('editor');
const preview = document.getElementById('preview');
const themeToggle = document.getElementById('themeToggle');
const wordCount = document.getElementById('wordCount');
const charCount = document.getElementById('charCount');
const readTime = document.getElementById('readTime');
const toc = document.getElementById('toc');

function addLineNumbers(code) {
  const lines = code.split('\n').map(line => `<span>${line}</span>`).join('\n');
  return lines;
}

function addCopyButtons() {
  preview.querySelectorAll('pre').forEach(pre => {
    if (!pre.querySelector('.copy-btn')) {
      const btn = document.createElement('button');
      btn.textContent = 'Copy';
      btn.className = 'copy-btn';
      btn.onclick = () => navigator.clipboard.writeText(pre.innerText);
      pre.style.position = 'relative';
      pre.appendChild(btn);
    }
  });
}

function renderMarkdown() {
  const text = editor.value;
  let html = marked.parse(text);

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  // Code blocks
  tempDiv.querySelectorAll('pre code').forEach(block => {
    block.innerHTML = addLineNumbers(block.innerText);
    hljs.highlightElement(block);
  });

  preview.innerHTML = tempDiv.innerHTML;

  preview.style.opacity = 0;
  setTimeout(() => preview.style.opacity = 1, 50);

  // Update stats
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const chars = text.length;
  const minutes = Math.ceil(words / 200);
  wordCount.textContent = `Words: ${words}`;
  charCount.textContent = `Chars: ${chars}`;
  readTime.textContent = `Read: ${minutes} min`;

  // Table of Contents
  const headings = tempDiv.querySelectorAll('h1,h2,h3');
  toc.innerHTML = '<strong>Headings</strong><br>';
  headings.forEach((h, idx) => {
    const a = document.createElement('a');
    const id = `heading-${idx}`;
    h.id = id;
    a.href = `#${id}`;
    a.innerText = h.innerText;
    a.style.display = 'block';
    a.style.color = '#fff';
    a.style.marginBottom = '5px';
    toc.appendChild(a);
  });

  addCopyButtons();

  if (window.mermaid) {
    mermaid.initialize({startOnLoad : true});
    preview.querySelectorAll('.language-mermaid')
        .forEach(div => { mermaid.init(undefined, div); });
  }

  preview.querySelectorAll('code').forEach(code => {
    try {
      katex.render(code.innerText, code, {throwOnError : false});
    } catch (e) {
    }
  });
}

editor.addEventListener('input', renderMarkdown);

editor.value = `# Markdown Previewer

\`\`\`java
System.out.println("Hello, World!");
\`\`\``

renderMarkdown();

editor.addEventListener('scroll',
                        () => { preview.scrollTop = editor.scrollTop; });

// Export
function exportMarkdown() {
  const blob = new Blob([ editor.value ], {type : 'text/markdown'});
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'document.md';
  link.click();
}

function exportHTML() {
  const blob = new Blob([ preview.innerHTML ], {type : 'text/html'});
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'document.html';
  link.click();
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
  if (document.body.classList.contains('light-theme')) {
    document.body.style.background =
        'linear-gradient(135deg, #f0f0f0, #d0d0ff)';
    document.body.style.color = '#1b1b2f';
  } else {
    document.body.style.background =
        'linear-gradient(135deg, #1f1f2f, #2b2b44)';
    document.body.style.color = '#f0f0f0';
  }
});
