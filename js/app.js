// ---------- Menú móvil ----------
const burger = document.querySelector('.burger');
const menu = document.getElementById('menu');
burger.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
menu.addEventListener('click', e => {
  if (e.target.tagName === 'A') {
    menu.classList.remove('open');
    burger.setAttribute('aria-expanded', false);
  }
});

// ---------- Estrellas con canvas ----------
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let stars = [];
function setup() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  const n = Math.min(220, Math.floor(canvas.width * canvas.height / 5500));
  stars = Array.from({ length: n }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.6 + .3,
    p: Math.random() * Math.PI * 2,
    s: Math.random() * .02 + .005
  }));
}
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const s of stars) {
    s.p += s.s;
    ctx.globalAlpha = .45 + Math.sin(s.p) * .45;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, 6.283);
    ctx.fill();
  }
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) requestAnimationFrame(draw);
}
window.addEventListener('resize', setup);
setup();
draw();

// ---------- Planetas ----------
const planets = [
  ['Mercurio', 'radial-gradient(circle at 30% 30%,#c9c2bb,#7d7670)', 'El más cercano al Sol. Un año allí dura solo 88 días terrestres.'],
  ['Venus', 'radial-gradient(circle at 30% 30%,#ffe2a8,#c88a3d)', 'Es el planeta más caliente del sistema solar por su atmósfera densa, aunque Mercurio esté más cerca del Sol.'],
  ['Tierra', 'radial-gradient(circle at 30% 30%,#7fd0ff,#2c6bd1 55%,#2f9a5b)', 'Nuestro hogar. Es el único lugar donde sabemos con certeza que hay vida.'],
  ['Marte', 'radial-gradient(circle at 30% 30%,#ff9d72,#a8412a)', 'Tiene el volcán más grande conocido: el Monte Olimpo, casi tres veces más alto que el Everest.'],
  ['Júpiter', 'repeating-linear-gradient(180deg,#e8c9a0 0 8px,#b9855a 8px 16px)', 'Es tan grande que cabrían más de mil Tierras dentro. Su Gran Mancha Roja es una tormenta de siglos.'],
  ['Saturno', 'repeating-linear-gradient(180deg,#f1dca6 0 7px,#cfae6c 7px 14px)', 'Sus anillos son de hielo y roca. Es tan poco denso que flotaría en una tina gigante de agua.'],
  ['Urano', 'radial-gradient(circle at 30% 30%,#c7f4f4,#5fb7c4)', 'Gira “acostado”, con el eje casi horizontal, así que sus estaciones duran décadas.'],
  ['Neptuno', 'radial-gradient(circle at 30% 30%,#8fb0ff,#2b3fb5)', 'Tiene los vientos más rápidos del sistema solar, de más de 2000 km/h.']
];
const list = document.getElementById('planet-list');
const info = document.getElementById('planet-info');
planets.forEach(([name, bg, text]) => {
  const b = document.createElement('button');
  b.className = 'planet';
  b.setAttribute('aria-pressed', 'false');
  b.innerHTML = `<i style="background:${bg}"></i>${name}`;
  b.addEventListener('click', () => {
    list.querySelectorAll('.planet').forEach(x => x.setAttribute('aria-pressed', 'false'));
    b.setAttribute('aria-pressed', 'true');
    info.textContent = `${name}: ${text}`;
  });
  list.appendChild(b);
});

// ---------- Datos curiosos ----------
const facts = [
  'La luz del Sol tarda unos 8 minutos en llegar a la Tierra.',
  'Un día en Venus (una rotación completa) dura más que un año venusiano.',
  'Se estima que hay más estrellas en el universo que granos de arena en todas las playas de la Tierra.',
  'Las huellas de los astronautas en la Luna durarán millones de años: no hay viento que las borre.',
  'Cuando miras una estrella, ves su luz del pasado, a veces de hace miles de años.',
  'La galaxia de Andrómeda y la Vía Láctea se acercan y chocarán dentro de unos 4000 millones de años.',
  'En el espacio no se oye nada, porque no hay aire que transmita el sonido.'
];
const factEl = document.getElementById('fact');
let last = -1;
document.getElementById('fact-btn').addEventListener('click', () => {
  let i;
  do { i = Math.floor(Math.random() * facts.length); } while (i === last);
  last = i;
  factEl.textContent = facts[i];
});

// ---------- PWA: service worker e instalación ----------
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js'));
}
let promptEvt;
const installBtn = document.getElementById('install');
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  promptEvt = e;
  installBtn.hidden = false;
});
installBtn.addEventListener('click', async () => {
  if (!promptEvt) return;
  promptEvt.prompt();
  await promptEvt.userChoice;
  promptEvt = null;
  installBtn.hidden = true;
});
