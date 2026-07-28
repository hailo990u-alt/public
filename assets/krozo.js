document.addEventListener('click',e=>{
  if(e.target.closest('[data-menu-toggle]')){
    const n=document.querySelector('[data-mobile-nav]');
    n.hidden=!n.hidden;
  }
  if(e.target.closest('[data-sticky-submit]')){
    document.querySelector('.product-atc')?.click();
  }
});

const atc=document.querySelector('.product-atc');
const sticky=document.querySelector('[data-sticky-atc]');
if(atc&&sticky){
  const observer=new IntersectionObserver(([entry])=>{sticky.hidden=entry.isIntersecting},{threshold:.1});
  observer.observe(atc);
}
