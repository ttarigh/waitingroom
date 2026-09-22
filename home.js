// WAITING ROOM — Interactive Home Behavior
(function() {
  'use strict';

  const manifestoBox = document.getElementById('manifesto-box');
  const manifestoFooter = document.getElementById('manifesto-footer');
  if (!manifestoBox) return;

  const BLURBS = {
    software: `A browser-based instrument across ChatGPT, Claude, and Gemini that logs cumulative AI latency as unmeasured labor data. In the pregnant gaps between prompt and generation, it connects you via live video to a random stranger waiting at the exact same moment.`,
    furniture: `As AI handles cognitive production, human labor shifts from acting to awaiting. This speculative installation imagines office furniture designed for the contested future of work: chairs engineered for alert passivity, desks optimized for screen-watching, and casino-inspired ergonomics built around waiting rather than working.`
  };

  function triggerEphemeralText(text) {
    const existing = document.getElementById('ephemeralText');
    if (existing) existing.remove();

    const el = document.createElement('div');
    el.id = 'ephemeralText';
    el.className = 'ephemeral-text';
    el.textContent = text;
    document.body.appendChild(el);

    el.addEventListener('animationend', () => {
      el.remove();
    });
  }

  function renderState(state) {
    const existingEphem = document.getElementById('ephemeralText');

    if (state === 'software') {
      triggerEphemeralText('omegle for waiting?');
      document.body.classList.add('page-yellow');
      if (manifestoFooter) manifestoFooter.classList.add('is-faded');
      manifestoBox.innerHTML = `
        <p class="manifesto-line is-faded"><span class="wr-logo">WAITING ROOM</span> is every room AI is in.</p>
        <p class="manifesto-line is-active">
          <button class="inline-back-btn" id="backBtn" aria-label="Back to home" title="Back to home">←</button><span class="wr-logo">WAITING ROOM</span> is <span class="manifesto-link">a software</span> that keeps us human.
        </p>
        <div class="blurb-box">${BLURBS.software}</div>
        <p class="manifesto-line is-faded"><span class="wr-logo">WAITING ROOM</span> is <a href="#furniture" class="manifesto-link" data-target="furniture">the office furniture</a> of the future.</p>
      `;
    } else if (state === 'furniture') {
      if (existingEphem) existingEphem.remove();
      document.body.classList.add('page-yellow');
      if (manifestoFooter) manifestoFooter.classList.add('is-faded');
      manifestoBox.innerHTML = `
        <p class="manifesto-line is-faded"><span class="wr-logo">WAITING ROOM</span> is every room AI is in.</p>
        <p class="manifesto-line is-faded"><span class="wr-logo">WAITING ROOM</span> is <a href="#software" class="manifesto-link" data-target="software">a software</a> that keeps us human.</p>
        <p class="manifesto-line is-active">
          <button class="inline-back-btn" id="backBtn" aria-label="Back to home" title="Back to home">←</button><span class="wr-logo">WAITING ROOM</span> is <span class="manifesto-link">the office furniture</span> of the future.
        </p>
        <div class="blurb-box">${BLURBS.furniture}</div>
      `;
    } else {
      if (existingEphem) existingEphem.remove();
      document.body.classList.remove('page-yellow');
      if (manifestoFooter) manifestoFooter.classList.remove('is-faded');
      manifestoBox.innerHTML = `
        <p class="manifesto-line"><span class="wr-logo">WAITING ROOM</span> is every room AI is in.</p>
        <p class="manifesto-line"><span class="wr-logo">WAITING ROOM</span> is <a href="#software" class="manifesto-link" data-target="software">a software</a> that keeps us human.</p>
        <p class="manifesto-line"><span class="wr-logo">WAITING ROOM</span> is <a href="#furniture" class="manifesto-link" data-target="furniture">the office furniture</a> of the future.</p>
      `;
    }
  }

  function setState(state, push = true) {
    renderState(state);
    if (push) {
      if (state === 'software') history.pushState({ state: 'software' }, '', '#software');
      else if (state === 'furniture') history.pushState({ state: 'furniture' }, '', '#furniture');
      else history.pushState({ state: 'default' }, '', window.location.pathname);
    }
  }

  // Click delegation
  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-target]');
    if (link) {
      e.preventDefault();
      setState(link.getAttribute('data-target'));
      return;
    }
    const backBtn = e.target.closest('#backBtn');
    if (backBtn) {
      e.preventDefault();
      setState('default');
      return;
    }
  });

  // Handle browser back/forward buttons
  window.addEventListener('popstate', () => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'software' || hash === 'furniture') {
      renderState(hash);
    } else {
      renderState('default');
    }
  });

  // Initialize from current URL hash
  const initialHash = window.location.hash.replace('#', '');
  if (initialHash === 'software' || initialHash === 'furniture') {
    renderState(initialHash);
  } else {
    renderState('default');
  }

  window.initHomeBehavior = renderState;
})();
