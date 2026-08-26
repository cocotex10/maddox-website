const track=document.getElementById('track');
const panels=[...document.querySelectorAll('.panel')];
const items=[...document.querySelectorAll('.rail-item')];
const progress=document.getElementById('progress');
let current=0;
let lock=false;

function go(i){
  current=Math.max(0,Math.min(panels.length-1,i));
  panels[current].scrollIntoView({behavior:'smooth',inline:'start',block:'nearest'});
  update();
}
function update(){
  items.forEach((x,i)=>x.classList.toggle('active',i===current));
  progress.style.width=((current+1)/panels.length*100)+'%';
}
document.getElementById('next').onclick=()=>go(current+1);
document.getElementById('prev').onclick=()=>go(current-1);
document.getElementById('pNext').onclick=()=>go(current+1);
document.getElementById('pPrev').onclick=()=>go(current-1);

items.forEach((item,i)=>item.addEventListener('click',e=>{e.preventDefault();go(i)}));

track.addEventListener('wheel',e=>{
  if(Math.abs(e.deltaY)<Math.abs(e.deltaX)) return;
  e.preventDefault();
  if(lock)return;
  lock=true;
  go(current+(e.deltaY>0?1:-1));
  setTimeout(()=>lock=false,650);
},{passive:false});

track.addEventListener('scroll',()=>{
  const i=Math.round(track.scrollLeft/track.clientWidth);
  if(i!==current){current=i;update();}
});

let startX=0;
track.addEventListener('touchstart',e=>startX=e.touches[0].clientX,{passive:true});
track.addEventListener('touchend',e=>{
  const dx=e.changedTouches[0].clientX-startX;
  if(Math.abs(dx)>50)go(current+(dx<0?1:-1));
},{passive:true});

document.addEventListener('keydown',e=>{
  if(e.key==='ArrowRight')go(current+1);
  if(e.key==='ArrowLeft')go(current-1);
});

update();
