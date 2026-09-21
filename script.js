const spinnerBox = document.getElementById('spinner-box');
const spinnerSvg = document.getElementById('spinner-svg');
const spinnerText = document.getElementById('spinner-text');
const titleBox = document.getElementById('title-box');
const manifestoBox = document.getElementById('manifesto-box');
const manifestoFooter = document.getElementById('manifesto-footer');

let currentRunId = 0;
let currentText = '';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function updateDOM() {
  spinnerText.innerHTML = `<span>${currentText}</span><span class="cursor"></span>`;
}

function getCommonPrefix(a, b) {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) {
    i++;
  }
  return a.slice(0, i);
}

// Intelligently transitions between words:
// Only deletes characters back to the common prefix, then types in the rest.
async function transitionTo(targetText, typeSpeed = 55, deleteSpeed = 30, runId) {
  const prefix = getCommonPrefix(currentText, targetText);

  // Backspace until we reach the common prefix
  while (currentText.length > prefix.length) {
    if (runId !== currentRunId) return false;
    currentText = currentText.slice(0, -1);
    updateDOM();
    await sleep(deleteSpeed);
  }

  // Brief pause before typing next part if characters were deleted
  if (currentText.length > 0 && currentText !== targetText) {
    await sleep(120);
  }

  // Type the remainder of targetText
  for (let i = prefix.length; i < targetText.length; i++) {
    if (runId !== currentRunId) return false;
    currentText += targetText[i];
    updateDOM();
    await sleep(typeSpeed);
  }

  return true;
}

// Type into a text node or element for manifesto lines
async function typeIntoNode(container, text, speed, runId) {
  const textNode = document.createTextNode('');
  container.appendChild(textNode);
  for (let i = 0; i < text.length; i++) {
    if (runId !== currentRunId) return false;
    textNode.nodeValue += text[i];
    await sleep(speed);
  }
  return true;
}

// Types the manifesto lines sequentially
async function typeManifesto(runId) {
  manifestoBox.innerHTML = `
    <p id="m-line-1"></p>
    <p id="m-line-2"></p>
    <p id="m-line-3"></p>
  `;

  const l1 = document.getElementById('m-line-1');
  const l2 = document.getElementById('m-line-2');
  const l3 = document.getElementById('m-line-3');

  // Helper to type WAITING ROOM logo mark prefix
  async function typeLogoPrefix(lineElement, runId) {
    const logoSpan = document.createElement('span');
    logoSpan.className = 'wr-logo';
    lineElement.appendChild(logoSpan);
    return await typeIntoNode(logoSpan, 'WAITING ROOM', 30, runId);
  }

  // Line 1
  if (!await typeLogoPrefix(l1, runId)) return;
  if (!await typeIntoNode(l1, ' is every room AI is in.', 30, runId)) return;
  await sleep(400);

  // Line 2 (with clickable link)
  if (!await typeLogoPrefix(l2, runId)) return;
  if (!await typeIntoNode(l2, ' is ', 30, runId)) return;
  const link1 = document.createElement('a');
  link1.href = '#software';
  link1.setAttribute('data-target', 'software');
  link1.className = 'manifesto-link';
  l2.appendChild(link1);
  if (!await typeIntoNode(link1, 'a software', 30, runId)) return;
  if (!await typeIntoNode(l2, ' that keeps us human.', 30, runId)) return;
  await sleep(400);

  // Line 3 (with clickable link)
  if (!await typeLogoPrefix(l3, runId)) return;
  if (!await typeIntoNode(l3, ' is ', 30, runId)) return;
  const link2 = document.createElement('a');
  link2.href = '#furniture';
  link2.setAttribute('data-target', 'furniture');
  link2.className = 'manifesto-link';
  l3.appendChild(link2);
  if (!await typeIntoNode(link2, 'the office furniture', 30, runId)) return;
  if (!await typeIntoNode(l3, ' of the future.', 30, runId)) return;
  await sleep(400);

  // Bottom footer: WAITING ROOM is Tina Tarighian's latest work
  if (manifestoFooter) {
    manifestoFooter.style.display = 'block';
    manifestoFooter.innerHTML = '<p id="m-footer-line"></p>';
    const fLine = document.getElementById('m-footer-line');
    if (!await typeLogoPrefix(fLine, runId)) return;
    if (!await typeIntoNode(fLine, ' is ', 30, runId)) return;
    const tinaLink = document.createElement('a');
    tinaLink.href = 'https://www.tina.zone';
    tinaLink.target = '_blank';
    tinaLink.rel = 'noopener noreferrer';
    tinaLink.className = 'manifesto-link';
    fLine.appendChild(tinaLink);
    if (!await typeIntoNode(tinaLink, 'Tina Tarighian', 30, runId)) return;
    if (!await typeIntoNode(fLine, "'s latest work.", 30, runId)) return;
  }
}

const BLURBS = {
  software: `A browser-based instrument across ChatGPT, Claude, and Gemini that logs cumulative AI latency as unmeasured labor data. In the pregnant gaps between prompt and generation, it connects you via live video to a random stranger waiting at the exact same moment.`,
  furniture: `As AI handles cognitive production, human labor shifts from acting to awaiting. This speculative installation imagines office furniture designed for the contested future of work: chairs engineered for alert passivity, desks optimized for screen-watching, and casino-inspired ergonomics built around waiting rather than working.`
};

function renderHomeState(state) {
  if (manifestoFooter) {
    manifestoFooter.style.display = 'block';
    manifestoFooter.classList.toggle('is-faded', state !== 'default');
    manifestoFooter.innerHTML = `<p><span class="wr-logo">WAITING ROOM</span> is <a href="https://www.tina.zone" target="_blank" rel="noopener noreferrer" class="manifesto-link">Tina Tarighian</a>'s latest work.</p>`;
  }

  if (state === 'software') {
    document.body.classList.add('page-yellow');
    manifestoBox.innerHTML = `
      <p class="manifesto-line is-faded"><span class="wr-logo">WAITING ROOM</span> is every room AI is in.</p>
      <p class="manifesto-line is-active">
        <button class="inline-back-btn" id="backBtn" aria-label="Back to home" title="Back to home">←</button><span class="wr-logo">WAITING ROOM</span> is <span class="manifesto-link">a software</span> that keeps us human.
      </p>
      <div class="blurb-box">${BLURBS.software}</div>
      <p class="manifesto-line is-faded"><span class="wr-logo">WAITING ROOM</span> is <a href="#furniture" class="manifesto-link" data-target="furniture">the office furniture</a> of the future.</p>
    `;
  } else if (state === 'furniture') {
    document.body.classList.add('page-yellow');
    manifestoBox.innerHTML = `
      <p class="manifesto-line is-faded"><span class="wr-logo">WAITING ROOM</span> is every room AI is in.</p>
      <p class="manifesto-line is-faded"><span class="wr-logo">WAITING ROOM</span> is <a href="#software" class="manifesto-link" data-target="software">a software</a> that keeps us human.</p>
      <p class="manifesto-line is-active">
        <button class="inline-back-btn" id="backBtn" aria-label="Back to home" title="Back to home">←</button><span class="wr-logo">WAITING ROOM</span> is <span class="manifesto-link">the office furniture</span> of the future.
      </p>
      <div class="blurb-box">${BLURBS.furniture}</div>
    `;
  } else {
    document.body.classList.remove('page-yellow');
    manifestoBox.innerHTML = `
      <p class="manifesto-line"><span class="wr-logo">WAITING ROOM</span> is every room AI is in.</p>
      <p class="manifesto-line"><span class="wr-logo">WAITING ROOM</span> is <a href="#software" class="manifesto-link" data-target="software">a software</a> that keeps us human.</p>
      <p class="manifesto-line"><span class="wr-logo">WAITING ROOM</span> is <a href="#furniture" class="manifesto-link" data-target="furniture">the office furniture</a> of the future.</p>
    `;
  }
}

async function runSequence() {
  const runId = ++currentRunId;
  currentText = '';

  // Reset displays and states
  document.body.classList.remove('page-yellow');
  if (manifestoFooter) {
    manifestoFooter.style.display = 'none';
    manifestoFooter.innerHTML = '';
    manifestoFooter.classList.remove('is-faded');
  }
  spinnerSvg.classList.remove('paused');
  spinnerBox.style.display = 'flex';
  titleBox.style.display = 'none';
  manifestoBox.style.display = 'none';
  manifestoBox.innerHTML = '';
  spinnerText.innerHTML = '';

  // Frame 1: Big spinner spinning alone a bit before text starts
  await sleep(2200);
  if (runId !== currentRunId) return;

  // Frame 2: in the age of ai
  if (!await transitionTo('in the age of ai', 60, 30, runId)) return;
  await sleep(2000);
  if (runId !== currentRunId) return;

  // Frame 3: "work"
  if (!await transitionTo('"work"', 60, 25, runId)) return;
  await sleep(1600);
  if (runId !== currentRunId) return;

  // Frame 4: "work" is now "wait" (keeps "work" and types remainder!)
  if (!await transitionTo('"work" is now "wait"', 55, 30, runId)) return;
  await sleep(2000);
  if (runId !== currentRunId) return;

  // Frame 5: wait for a generation
  if (!await transitionTo('wait for a generation', 50, 25, runId)) return;
  await sleep(1800);
  if (runId !== currentRunId) return;

  // Frame 6: wait for the Perfect generation (keeps "wait for " and replaces suffix!)
  if (!await transitionTo('wait for the Perfect generation', 50, 30, runId)) return;
  await sleep(1800);
  if (runId !== currentRunId) return;

  // The moment when the loader stops before WAITING ROOM comes in
  spinnerSvg.classList.add('paused');
  await sleep(1400);
  if (runId !== currentRunId) return;

  // Frame 7: Spinner disappears, WAITING ROOM title appears
  spinnerBox.style.display = 'none';
  titleBox.style.display = 'block';
  await sleep(2600);
  if (runId !== currentRunId) return;

  // Frame 8: Manifesto lines type in, placed higher up
  titleBox.style.display = 'none';
  manifestoBox.style.display = 'block';
  await typeManifesto(runId);
}

function showManifestoDirectly() {
  spinnerBox.style.display = 'none';
  titleBox.style.display = 'none';
  manifestoBox.style.display = 'block';
  const hash = window.location.hash.replace('#', '');
  if (hash === 'software' || hash === 'furniture') {
    renderHomeState(hash);
  } else {
    renderHomeState('default');
  }
}

// Run on page load
window.addEventListener('load', () => {
  if (window.location.hash === '#home' || window.location.search.includes('home') || window.location.hash === '#software' || window.location.hash === '#furniture') {
    showManifestoDirectly();
  } else {
    runSequence();
  }
});

// Click delegation
document.addEventListener('click', (e) => {
  const link = e.target.closest('[data-target]');
  if (link) {
    e.preventDefault();
    const target = link.getAttribute('data-target');
    renderHomeState(target);
    history.pushState({ state: target }, '', '#' + target);
    return;
  }
  const backBtn = e.target.closest('#backBtn');
  if (backBtn) {
    e.preventDefault();
    renderHomeState('default');
    history.pushState({ state: 'default' }, '', window.location.pathname);
    return;
  }
  // Click background to restart intro only if not in detail state
  if (document.body.classList.contains('page-yellow')) {
    return;
  }
  if (!e.target.closest('a') && !e.target.closest('button')) {
    runSequence();
  }
});

window.addEventListener('popstate', () => {
  const hash = window.location.hash.replace('#', '');
  if (hash === 'software' || hash === 'furniture') {
    renderHomeState(hash);
  } else {
    renderHomeState('default');
  }
});
