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
  furniture: `As AI handles cognitive production, human labor shifts from acting to awaiting. This speculative installation imagines office furniture designed for the contested future of work: computers inspired by casino ergonomics, tech accessories that flatten their hosts’ use, chairs engineered for alert passivity, and desk setups optimized for screen-watching.`
};

const SOFTWARE_PHRASES = [
  'omegle for waiting',
  'peer2peer pause',
  'human speed bump',
  'loading as a surface',
  'wut ru generating?'
];

let ephemeralTimer = null;
let phraseIndex = 0;

function startEphemeralLoop() {
  stopEphemeralLoop();
  phraseIndex = 0;

  function showNext() {
    const text = SOFTWARE_PHRASES[phraseIndex];
    phraseIndex = (phraseIndex + 1) % SOFTWARE_PHRASES.length;

    const el = document.createElement('div');
    el.id = 'ephemeralText';
    el.className = 'ephemeral-text';
    el.textContent = text;

    const container = document.getElementById('ephemeralTextContainer');
    if (container) {
      container.appendChild(el);
    } else {
      document.body.appendChild(el);
    }

    el.addEventListener('animationend', () => {
      el.remove();
      ephemeralTimer = setTimeout(showNext, 350);
    }, { once: true });
  }

  showNext();
}

function stopEphemeralLoop() {
  if (ephemeralTimer) {
    clearTimeout(ephemeralTimer);
    ephemeralTimer = null;
  }
  const el = document.getElementById('ephemeralText');
  if (el) el.remove();
}

function showSoftwareVideos() {
  removeSoftwareVideos();

  const wrapper = document.createElement('div');
  wrapper.id = 'softwareVideosWrapper';
  wrapper.className = 'software-videos-container';
  wrapper.innerHTML = `
    <div class="software-videos-row">
      <div id="videoTopRight" class="software-video software-video-top-right">
        <video src="/faces2.mp4" autoplay muted loop playsinline></video>
      </div>
      <div id="videoBottomLeft" class="software-video software-video-bottom-left">
        <video src="/faces1.mp4" autoplay muted loop playsinline></video>
      </div>
    </div>
    <div id="ephemeralTextContainer" class="ephemeral-text-container"></div>
  `;

  const container = document.querySelector('.container') || document.body;
  const footer = document.getElementById('manifesto-footer');
  if (footer && footer.parentNode === container) {
    container.insertBefore(wrapper, footer);
  } else {
    container.appendChild(wrapper);
  }
}

function removeSoftwareVideos() {
  const w = document.getElementById('softwareVideosWrapper');
  if (w) w.remove();
  const v1 = document.getElementById('videoTopRight');
  if (v1) v1.remove();
  const v2 = document.getElementById('videoBottomLeft');
  if (v2) v2.remove();
}

const AI_ICONS = [
  // Gemini Spark (Google's 4-point gradient sparkle)
  `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gemGradScript" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop stop-color="#1BA1E3"/>
        <stop offset="0.5" stop-color="#9B72CF"/>
        <stop offset="1" stop-color="#D96570"/>
      </linearGradient>
    </defs>
    <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" fill="url(#gemGradScript)"/>
  </svg>`,
  // ChatGPT Black Blinking Dot
  `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="7.5" fill="#000000" class="gpt-blink-dot"/>
  </svg>`,
  // Claude Official Orange Mark
  `<svg viewBox="0 0 24 24" fill="#D96B43" xmlns="http://www.w3.org/2000/svg">
    <path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z"/>
  </svg>`
];

let twinkleInterval = null;

function spawnTwinkle() {
  // Keep logos sparse: only 1 or 2 on screen at a time
  if (document.querySelectorAll('.ai-twinkle').length >= 2) return;

  const iconHtml = AI_ICONS[Math.floor(Math.random() * AI_ICONS.length)];
  const el = document.createElement('div');
  el.className = 'ai-twinkle';
  el.innerHTML = iconHtml;

  const x = 8 + Math.random() * 82;
  const y = 10 + Math.random() * 78;
  el.style.left = `${x}%`;
  el.style.top = `${y}%`;

  document.body.appendChild(el);
  el.addEventListener('animationend', () => el.remove(), { once: true });
}

function startTwinkles() {
  stopTwinkles();
  setTimeout(spawnTwinkle, 700);
  twinkleInterval = setInterval(() => {
    if (Math.random() > 0.25) {
      spawnTwinkle();
    }
  }, 2800);
}

function stopTwinkles() {
  if (twinkleInterval) {
    clearInterval(twinkleInterval);
    twinkleInterval = null;
  }
  document.querySelectorAll('.ai-twinkle').forEach(el => el.remove());
}

function showFurnitureStills() {
  removeFurnitureStills();
  const el = document.createElement('div');
  el.id = 'furnitureStills';
  el.className = 'furniture-stills-container';
  el.innerHTML = `
    <div class="furniture-stills-grid">
      <div id="item-chair" class="furniture-item furniture-chair stop-motion-step-chair" data-id="chair">
        <img src="/furniture_chair.webp" alt="Alert Passivity Recliner Chair" class="furniture-img" draggable="false" />
      </div>
      <div id="item-slot" class="furniture-item furniture-slot stop-motion-step" data-id="slot">
        <img src="/furniture_slot.webp" alt="Slot Machine Desk" class="furniture-img" draggable="false" />
      </div>
      <div id="item-cover" class="furniture-item furniture-cover stop-motion-step-cover" data-id="cover">
        <img src="/furniture_cover.webp" alt="Laptop Keyboard Cover ('GENERATE')" class="furniture-img" draggable="false" />
      </div>
      <div id="item-exersaucer" class="furniture-item furniture-exersaucer stop-motion-step-alt" data-id="exersaucer">
        <img src="/furniture_exersaucer.webp" alt="Neon Adult Exersaucer with Laptop" class="furniture-img" draggable="false" />
      </div>
    </div>
    <div id="furnitureVisionBox" class="furniture-vision-box">
      <span class="furniture-vision-text"></span><span class="furniture-vision-cursor"></span>
    </div>
  `;

  const container = document.querySelector('.container') || document.body;
  const footer = document.getElementById('manifesto-footer');
  if (footer && footer.parentNode === container) {
    container.insertBefore(el, footer);
  } else {
    container.appendChild(el);
  }

  startVisionTypewriter();
}

let visionTypewriterTimer = null;

function startVisionTypewriter() {
  stopVisionTypewriter();
  const box = document.getElementById('furnitureVisionBox');
  if (!box) return;
  const textSpan = box.querySelector('.furniture-vision-text');
  if (!textSpan) return;
  textSpan.textContent = '';

  const message = "i want to display this furniture, make fake furniture catalogues to send to real AI-first companies, and host weworks for people to experience them firsthand";
  let i = 0;

  function typeNext() {
    if (i < message.length) {
      textSpan.textContent += message[i];
      const char = message[i];
      i++;
      const delay = char === ',' ? 160 : 32;
      visionTypewriterTimer = setTimeout(typeNext, delay);
    }
  }

  let fontIdx = 0;
  const weirdFonts = [
    { name: "'VT323', monospace", size: '19px', weight: '400' },
    { name: "'Rubik Glitch', monospace", size: '15px', weight: '700' },
    { name: "'Silkscreen', monospace", size: '13px', weight: '700' },
    { name: "'Syne', sans-serif", size: '14px', weight: '800' },
    { name: "'UnifrakturMaguntia', cursive", size: '18px', weight: '400' },
    { name: "'Wingdings', 'Webdings', monospace", size: '16px', weight: '400' },
    { name: "'Major Mono Display', monospace", size: '13px', weight: '400' }
  ];

  box.onclick = () => {
    fontIdx = (fontIdx + 1) % weirdFonts.length;
    box.style.fontFamily = weirdFonts[fontIdx].name;
    box.style.fontSize = weirdFonts[fontIdx].size;
    box.style.fontWeight = weirdFonts[fontIdx].weight;
  };

  visionTypewriterTimer = setTimeout(typeNext, 400);
}

function stopVisionTypewriter() {
  if (visionTypewriterTimer) {
    clearTimeout(visionTypewriterTimer);
    visionTypewriterTimer = null;
  }
}

function removeFurnitureStills() {
  stopVisionTypewriter();
  const el = document.getElementById('furnitureStills');
  if (el) el.remove();
}

function renderHomeState(state) {
  if (manifestoFooter) {
    manifestoFooter.style.display = 'block';
    manifestoFooter.classList.toggle('is-faded', state !== 'default');
    manifestoFooter.innerHTML = `<p><span class="wr-logo">WAITING ROOM</span> is <a href="https://www.tina.zone" target="_blank" rel="noopener noreferrer" class="manifesto-link">Tina Tarighian</a>'s latest work.</p>`;
  }

  if (state === 'software') {
    removeFurnitureStills();
    showSoftwareVideos();
    startTwinkles();
    startEphemeralLoop();
    document.body.classList.add('page-yellow');
    manifestoBox.innerHTML = `
      <p class="manifesto-line is-faded"><span class="wr-logo">WAITING ROOM</span> is every room AI is in.</p>
      <p class="manifesto-line is-active">
        <button class="inline-back-btn" id="backBtn" aria-label="Back to home" title="Back to home">←</button><span class="wr-logo">WAITING ROOM</span> is <span class="manifesto-link">a software</span> that keeps us human.
      </p>
      <div class="blurb-box">${BLURBS.software}</div>
      <p class="manifesto-line is-faded"><span class="wr-logo">WAITING ROOM</span> is <a href="#furniture" class="manifesto-link" data-target="furniture">the office furniture</a> of the future.</p>
    `;
  } else {
    stopTwinkles();
    removeSoftwareVideos();
    stopEphemeralLoop();

    if (state === 'furniture') {
      showFurnitureStills();
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
      removeFurnitureStills();
      document.body.classList.remove('page-yellow');
      manifestoBox.innerHTML = `
        <p class="manifesto-line"><span class="wr-logo">WAITING ROOM</span> is every room AI is in.</p>
        <p class="manifesto-line"><span class="wr-logo">WAITING ROOM</span> is <a href="#software" class="manifesto-link" data-target="software">a software</a> that keeps us human.</p>
        <p class="manifesto-line"><span class="wr-logo">WAITING ROOM</span> is <a href="#furniture" class="manifesto-link" data-target="furniture">the office furniture</a> of the future.</p>
      `;
    }
  }
}

async function runSequence() {
  const runId = ++currentRunId;
  currentText = '';

  // Reset displays and states
  removeFurnitureStills();
  stopTwinkles();
  removeSoftwareVideos();
  stopEphemeralLoop();
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
