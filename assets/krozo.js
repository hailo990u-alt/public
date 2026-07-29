document.addEventListener('DOMContentLoaded',()=>{
  const shell=document.querySelector('[data-mobile-nav-shell]');
  const toggle=document.querySelector('[data-menu-toggle]');
  const openMenu=()=>{
    if(!shell||!toggle)return;
    shell.hidden=false;
    requestAnimationFrame(()=>shell.classList.add('is-open'));
    toggle.setAttribute('aria-expanded','true');
    document.body.classList.add('menu-open');
  };
  const closeMenu=()=>{
    if(!shell||!toggle)return;
    shell.classList.remove('is-open');
    toggle.setAttribute('aria-expanded','false');
    document.body.classList.remove('menu-open');
    window.setTimeout(()=>{if(!shell.classList.contains('is-open'))shell.hidden=true},260);
  };
  document.addEventListener('click',event=>{
    if(event.target.closest('[data-menu-toggle]'))openMenu();
    if(event.target.closest('[data-menu-close]')||event.target.closest('[data-mobile-nav] a'))closeMenu();
    if(event.target.closest('[data-sticky-submit]'))document.querySelector('.product-atc')?.click();
  });
  document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu()});
});
