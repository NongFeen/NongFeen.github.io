// Turns every .gallery into a slideshow. With more than one screenshot it gets
// arrow buttons, a caption ("<alt text> · 1 / 5") and a clickable thumbnail
// strip. Every screenshot, and any <img data-zoom>, opens full size when clicked.

const viewer = document.createElement('dialog');
viewer.className = 'viewer';
viewer.append(document.createElement('img'));
viewer.addEventListener('click', () => viewer.close());
document.body.append(viewer);

function enableZoom(img) {
  img.addEventListener('click', () => {
    const big = viewer.querySelector('img');
    big.src = img.currentSrc || img.src;
    big.alt = img.alt;
    viewer.showModal();
  });
}

for (const img of document.querySelectorAll('img[data-zoom]')) enableZoom(img);

for (const gallery of document.querySelectorAll('.gallery')) {
  const images = [...gallery.querySelectorAll('img')];
  images.forEach(enableZoom);

  if (images.length < 2) continue;

  const frame = document.createElement('div');
  frame.className = 'gallery-frame';
  gallery.before(frame);
  frame.append(gallery);

  const prev = makeButton('gallery-button prev', 'Previous screenshot', '‹');
  const next = makeButton('gallery-button next', 'Next screenshot', '›');
  const counter = document.createElement('span');
  counter.className = 'gallery-counter';
  frame.append(prev, next, counter);

  const thumbs = document.createElement('div');
  thumbs.className = 'gallery-thumbs';
  const thumbButtons = images.map((img, index) => {
    const button = makeButton('gallery-thumb', `Show ${img.alt || `screenshot ${index + 1}`}`);
    const thumb = document.createElement('img');
    thumb.src = img.getAttribute('src');
    thumb.alt = '';
    thumb.loading = 'lazy';
    button.append(thumb);
    button.addEventListener('click', () => goTo(index));
    thumbs.append(button);
    return button;
  });
  frame.after(thumbs);

  const current = () => Math.round(gallery.scrollLeft / gallery.clientWidth);
  const goTo = (index) =>
    gallery.scrollTo({ left: index * gallery.clientWidth, behavior: 'smooth' });

  let shown = -1;
  const update = () => {
    const index = current();
    if (index === shown) return;
    shown = index;

    const caption = images[index].alt;
    counter.textContent = `${caption ? `${caption} · ` : ''}${index + 1} / ${images.length}`;
    prev.disabled = index === 0;
    next.disabled = index === images.length - 1;

    thumbButtons.forEach((button, i) => {
      button.classList.toggle('active', i === index);
      button.setAttribute('aria-current', i === index ? 'true' : 'false');
    });
    // Keep the active thumbnail in view without scrolling the page.
    const active = thumbButtons[index];
    thumbs.scrollTo({
      left: active.offsetLeft - (thumbs.clientWidth - active.offsetWidth) / 2,
      behavior: 'smooth',
    });
  };

  prev.addEventListener('click', () => goTo(current() - 1));
  next.addEventListener('click', () => goTo(current() + 1));
  gallery.addEventListener('scroll', update, { passive: true });
  update();
}

function makeButton(className, label, symbol = '') {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  button.setAttribute('aria-label', label);
  button.textContent = symbol;
  return button;
}
