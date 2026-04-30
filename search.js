// Codex Cloudflarensis · Search (Pagefind)
(function() {
  'use strict';

  const STYLE = `
    .codex-search-trigger {
      position: fixed; top: 12px; right: 32px; z-index: 200;
      background: rgba(241, 228, 196, 0.96);
      border: 1px solid #8b6914;
      padding: 6px 14px;
      font-family: 'Cinzel', serif;
      font-size: 11px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #3d2a18;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s;
      box-shadow: 0 0 0 1px rgba(139, 105, 20, 0.3);
    }
    .codex-search-trigger:hover { color: #8b1a1a; box-shadow: 0 0 0 2px rgba(139, 105, 20, 0.5); }
    .codex-search-trigger kbd {
      font-family: 'EB Garamond', serif;
      font-style: italic;
      font-size: 10px;
      color: #8b6914;
      padding: 1px 6px;
      border: 1px solid #8b6914;
      background: rgba(255, 248, 220, 0.6);
    }

    .codex-search-overlay {
      position: fixed; inset: 0; z-index: 999;
      background: rgba(26, 15, 5, 0.7);
      backdrop-filter: blur(6px);
      display: none;
      align-items: flex-start;
      justify-content: center;
      padding: 80px 24px 24px;
      overflow-y: auto;
    }
    .codex-search-overlay.open { display: flex; animation: codex-fade-in 0.3s ease; }
    @keyframes codex-fade-in { from { opacity: 0; } to { opacity: 1; } }

    .codex-search-modal {
      width: 100%;
      max-width: 720px;
      background: linear-gradient(180deg, #f9efd1 0%, #f1e4c4 100%);
      border: 1px solid #c9b685;
      box-shadow:
        0 0 0 1px #8b6914 inset,
        0 0 0 4px #f1e4c4 inset,
        0 0 0 5px #8b6914 inset,
        0 24px 48px -12px rgba(26, 15, 5, 0.5);
      padding: 48px 40px 32px;
      position: relative;
    }

    .codex-search-modal-head {
      text-align: center;
      margin-bottom: 24px;
      padding-bottom: 18px;
      border-bottom: 1px dotted rgba(26, 15, 5, 0.15);
    }

    .codex-search-eyebrow {
      font-family: 'EB Garamond', serif;
      font-style: italic;
      font-size: 12px;
      letter-spacing: 0.3em;
      color: #6b5236;
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    .codex-search-title {
      font-family: 'Cinzel', serif;
      font-weight: 700;
      font-size: 22px;
      letter-spacing: 0.06em;
      color: #1a0f05;
      text-transform: uppercase;
    }

    .codex-search-close {
      position: absolute;
      top: 16px;
      right: 20px;
      background: none;
      border: none;
      cursor: pointer;
      font-family: serif;
      font-size: 24px;
      color: #6b5236;
      transition: color 0.2s;
    }
    .codex-search-close:hover { color: #8b1a1a; }

    /* Pagefind UI overrides — match parchment aesthetic */
    #codex-search-pagefind {
      --pagefind-ui-scale: 0.9;
      --pagefind-ui-primary: #8b1a1a;
      --pagefind-ui-text: #1a0f05;
      --pagefind-ui-background: #f9efd1;
      --pagefind-ui-border: #8b6914;
      --pagefind-ui-tag: rgba(212, 168, 67, 0.2);
      --pagefind-ui-border-width: 1px;
      --pagefind-ui-border-radius: 0;
      --pagefind-ui-image-border-radius: 0;
      --pagefind-ui-image-box-ratio: 3/2;
      --pagefind-ui-font: 'Cormorant Garamond', serif;
    }
    #codex-search-pagefind .pagefind-ui__form::before {
      filter: invert(15%) sepia(60%) saturate(800%) hue-rotate(355deg);
    }
    #codex-search-pagefind .pagefind-ui__search-input {
      font-family: 'Cormorant Garamond', serif !important;
      font-size: 18px !important;
      background: rgba(255, 248, 220, 0.5) !important;
      border: 1px solid #8b6914 !important;
      color: #1a0f05 !important;
    }
    #codex-search-pagefind .pagefind-ui__search-clear {
      font-family: 'Cinzel', serif !important;
      color: #6b5236 !important;
    }
    #codex-search-pagefind .pagefind-ui__result {
      border-top: 1px dotted rgba(26, 15, 5, 0.15) !important;
      padding-top: 14px !important;
    }
    #codex-search-pagefind .pagefind-ui__result-title {
      font-family: 'Cinzel', serif !important;
      font-weight: 700 !important;
      font-size: 14px !important;
      letter-spacing: 0.06em !important;
      text-transform: uppercase !important;
    }
    #codex-search-pagefind .pagefind-ui__result-title a {
      color: #1a0f05 !important;
      text-decoration: none !important;
      border-bottom: 1px dotted #8b6914 !important;
    }
    #codex-search-pagefind .pagefind-ui__result-title a:hover {
      color: #8b1a1a !important;
      border-bottom-color: #8b1a1a !important;
    }
    #codex-search-pagefind .pagefind-ui__result-excerpt {
      font-family: 'Cormorant Garamond', serif !important;
      font-size: 15px !important;
      line-height: 1.55 !important;
      color: #3d2a18 !important;
    }
    #codex-search-pagefind .pagefind-ui__result-excerpt mark {
      background: rgba(212, 168, 67, 0.3) !important;
      color: #1a0f05 !important;
      padding: 0 2px !important;
    }
    #codex-search-pagefind .pagefind-ui__message {
      font-family: 'EB Garamond', serif !important;
      font-style: italic !important;
      color: #6b5236 !important;
    }

    @media (max-width: 700px) {
      .codex-search-trigger { right: 16px; padding: 4px 10px; font-size: 9px; }
      .codex-search-trigger kbd { display: none; }
      .codex-search-modal { padding: 32px 20px 20px; }
    }
  `;

  // Inject style
  const styleEl = document.createElement('style');
  styleEl.textContent = STYLE;
  document.head.appendChild(styleEl);

  // Inject pagefind UI css
  const pfCss = document.createElement('link');
  pfCss.rel = 'stylesheet';
  pfCss.href = '/pagefind/pagefind-ui.css';
  document.head.appendChild(pfCss);

  // Build trigger button
  const trigger = document.createElement('button');
  trigger.className = 'codex-search-trigger';
  trigger.innerHTML = '<span>❦</span> Quaere <kbd>⌘K</kbd>';
  trigger.setAttribute('aria-label', 'Buscar en codex');

  // Build modal
  const overlay = document.createElement('div');
  overlay.className = 'codex-search-overlay';
  overlay.innerHTML = `
    <div class="codex-search-modal" role="dialog" aria-label="Búsqueda">
      <button class="codex-search-close" aria-label="Cerrar">×</button>
      <div class="codex-search-modal-head">
        <div class="codex-search-eyebrow">— Quaere in Codice —</div>
        <div class="codex-search-title">Búsqueda en Codex</div>
      </div>
      <div id="codex-search-pagefind"></div>
    </div>
  `;

  document.body.appendChild(trigger);
  document.body.appendChild(overlay);

  let pagefindInitialized = false;

  function open() {
    overlay.classList.add('open');
    if (!pagefindInitialized) {
      const script = document.createElement('script');
      script.src = '/pagefind/pagefind-ui.js';
      script.onload = () => {
        new window.PagefindUI({
          element: '#codex-search-pagefind',
          showSubResults: true,
          showImages: false,
          translations: {
            placeholder: 'Buscar primitivas, patterns, theoremas...',
            zero_results: 'Nullum reperitur — no se encontró nada para [SEARCH_TERM]',
            many_results: '[COUNT] resultados para [SEARCH_TERM]',
            one_result: '1 resultado para [SEARCH_TERM]',
            searching: 'Quaerens... [SEARCH_TERM]'
          }
        });
        pagefindInitialized = true;
        setTimeout(() => {
          const input = document.querySelector('.pagefind-ui__search-input');
          if (input) input.focus();
        }, 100);
      };
      document.head.appendChild(script);
    } else {
      const input = document.querySelector('.pagefind-ui__search-input');
      if (input) input.focus();
    }
  }

  function close() {
    overlay.classList.remove('open');
  }

  trigger.addEventListener('click', open);
  overlay.querySelector('.codex-search-close').addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (overlay.classList.contains('open')) close();
      else open();
    }
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      close();
    }
  });
})();
