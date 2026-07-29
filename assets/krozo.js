document.addEventListener('click',e=>{
  if(e.target.closest('[data-menu-toggle]')){
    const n=document.querySelector('[data-mobile-nav]');
    n.hidden=!n.hidden;
  }
  if(e.target.closest('[data-sticky-submit]')){
    document.querySelector('.product-atc')?.click();
  }
});
