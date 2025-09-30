// Configuración
const COUNT = 6; // cuántas imágenes mostrar
const AUTOPLAY_MS = 3500;

// Generador de imágenes aleatorias (picsum)
function makeSeed() { return Math.random().toString(36).slice(2,9); }
function imageUrl(seed){ return `https://picsum.photos/seed/${seed}/1200/700`; }

// Estado
let seeds = Array.from({length:COUNT},()=>makeSeed());
let current = 0;
let autoplay = true;
let timer = null;

// DOM
const slidesEl = document.getElementById('slides');
const dotsEl = document.getElementById('dots');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const playPauseBtn = document.getElementById('playPause');
const shuffleBtn = document.getElementById('shuffle');
const reloadBtn = document.getElementById('reload');
const carousel = document.getElementById('carousel');

// Construir slides/Dots
function build(){
  slidesEl.innerHTML=''; dotsEl.innerHTML='';
  for(let i=0;i<seeds.length;i++){
    const s = document.createElement('div'); 
    s.className='slide'; 
    s.dataset.index=i;

    const img = document.createElement('img'); 
    img.loading='lazy'; 
    img.alt=`Imagen aleatoria ${i+1}`; 
    img.src = imageUrl(seeds[i]);

    s.appendChild(img);
    slidesEl.appendChild(s);

    const dot = document.createElement('button'); 
    dot.className='dot'; 
    dot.setAttribute('aria-label',`Ir a imagen ${i+1}`);
    dot.addEventListener('click',()=>goTo(i));
    dotsEl.appendChild(dot);
  }
  update();
}

function update(){
  slidesEl.style.transform = `translateX(-${current * 100}%)`;
  Array.from(dotsEl.children).forEach((d,idx)=> d.classList.toggle('active', idx===current));
}

function prev(){ current = (current -1 + seeds.length)%seeds.length; update(); resetTimer(); }
function next(){ current = (current +1)%seeds.length; update(); resetTimer(); }
function goTo(i){ current = i%seeds.length; update(); resetTimer(); }

function shuffle(){
  for(let i=seeds.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1)); 
    [seeds[i],seeds[j]]=[seeds[j],seeds[i]];
  }
  current = 0; build();
}

function reloadImages(){ seeds = Array.from({length:COUNT},()=>makeSeed()); build(); }

function play(){ autoplay=true; playPauseBtn.textContent='Pause'; resetTimer(); }
function pause(){ autoplay=false; playPauseBtn.textContent='Play'; clearTimeout(timer); }

function resetTimer(){ clearTimeout(timer); if(autoplay) timer = setTimeout(()=>{ next(); }, AUTOPLAY_MS); }

// Eventos
prevBtn.addEventListener('click',prev);
nextBtn.addEventListener('click',next);
playPauseBtn.addEventListener('click',()=>{ autoplay?pause():play(); });
shuffleBtn.addEventListener('click',shuffle);
reloadBtn.addEventListener('click',reloadImages);

window.addEventListener('keydown',(e)=>{
  if(e.key==='ArrowLeft') prev();
  if(e.key==='ArrowRight') next();
  if(e.key===' ') { e.preventDefault(); autoplay?pause():play(); }
});

// Hover pausa
carousel.addEventListener('mouseenter',()=>{ clearTimeout(timer); });
carousel.addEventListener('mouseleave',()=>{ resetTimer(); });

// Swipe táctil
let touchStartX = 0; let touchEndX = 0;
slidesEl.addEventListener('touchstart', e=>{ touchStartX = e.changedTouches[0].screenX; });
slidesEl.addEventListener('touchend', e=>{ touchEndX = e.changedTouches[0].screenX; handleSwipe(); });
function handleSwipe(){ if(touchEndX + 40 < touchStartX) next(); else if(touchEndX - 40 > touchStartX) prev(); }

// Inicializar
build(); resetTimer();
