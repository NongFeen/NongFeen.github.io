// Plays sprite sheets as animations and cycles through each sprite's
// animations automatically. Each .sprite element describes its sheet with
// data attributes:
//
//   data-frame="80x64"     frame width x height in the sheet, in pixels
//   data-sheet-width="640" full sheet width, in pixels
//   data-fps="12"          playback speed
//   data-scale="2"         optional, how much to enlarge (default 2)
//   data-anims="idle 0 0 8, die 0 2 6 once"
//       name, start column, row, frame count, comma separated. Frames run
//       left to right and wrap onto the next row, like the game does.
//       Add "once" to play it a single time and hold the last frame.

const SPEED = 0.25;
const SHOW_SECONDS = 5;
const sprites = [];

for (const element of document.querySelectorAll(".sprite[data-anims]")) {
  const [frameWidth, frameHeight] = element.dataset.frame
    .split("x")
    .map(Number);
  const sheetWidth = Number(element.dataset.sheetWidth);
  const scale = Number(element.dataset.scale) || 2;

  const anims = element.dataset.anims.split(",").map((entry) => {
    const words = entry.trim().split(/\s+/);
    const once = words.at(-1) === "once";
    if (once) words.pop();
    // The last three words are numbers; everything before them is the name.
    const [col, row, frames] = words.slice(-3).map(Number);
    return { name: words.slice(0, -3).join(" "), col, row, frames, once };
  });

  element.style.setProperty("--fw", frameWidth);
  element.style.setProperty("--fh", frameHeight);
  element.style.setProperty("--sheet-w", sheetWidth);
  element.style.setProperty("--scale", scale);

  const sprite = {
    element,
    anims,
    columns: sheetWidth / frameWidth,
    frameWidth: frameWidth * scale,
    frameHeight: frameHeight * scale,
    frameSeconds: 1 / ((Number(element.dataset.fps) || 12) * SPEED),
    anim: 0,
    frame: 0,
    frameTimer: 0,
    animTimer: 0,
  };
  sprites.push(sprite);
  drawFrame(sprite);
}

function drawFrame(sprite) {
  const anim = sprite.anims[sprite.anim];
  const index = anim.col + anim.row * sprite.columns + sprite.frame;
  const x = index % sprite.columns;
  const y = Math.floor(index / sprite.columns);
  sprite.element.style.backgroundPosition = `${-x * sprite.frameWidth}px ${-y * sprite.frameHeight}px`;
}

function step(sprite, seconds) {
  const anim = sprite.anims[sprite.anim];
  sprite.animTimer += seconds;
  sprite.frameTimer += seconds;

  while (sprite.frameTimer >= sprite.frameSeconds) {
    sprite.frameTimer -= sprite.frameSeconds;
    if (sprite.frame < anim.frames - 1) sprite.frame++;
    else if (!anim.once) sprite.frame = 0;
  }

  // Move on once this animation has had its turn (and finished, if it plays once).
  const loopSeconds = anim.frames * sprite.frameSeconds;
  if (
    sprite.anims.length > 1 &&
    sprite.animTimer >= Math.max(SHOW_SECONDS, loopSeconds)
  ) {
    sprite.anim = (sprite.anim + 1) % sprite.anims.length;
    sprite.frame = 0;
    sprite.frameTimer = 0;
    sprite.animTimer = 0;
  }
  drawFrame(sprite);
}

// Always plays, even with the system's "reduce motion" setting on: the sprites
// animate in place and never move across the page.
if (sprites.length > 0) {
  let last = performance.now();
  const tick = (now) => {
    // Cap the step so a background tab doesn't skip through many animations.
    const seconds = Math.min((now - last) / 1000, 0.25);
    last = now;
    for (const sprite of sprites) step(sprite, seconds);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
