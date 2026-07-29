document.addEventListener('DOMContentLoaded',()=>{
  const shell=document.querySelector('[data-mobile-nav-shell]');
  const toggle=document.querySelector('[data-menu-toggle]');
  const faqShell=document.querySelector('[data-faq-shell]');
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
  const openFaq=()=>{
    if(!faqShell)return;
    faqShell.hidden=false;
    requestAnimationFrame(()=>faqShell.classList.add('is-open'));
    document.body.classList.add('faq-open');
    faqShell.querySelector('[data-faq-close]')?.focus();
  };
  const closeFaq=()=>{
    if(!faqShell)return;
    faqShell.classList.remove('is-open');
    document.body.classList.remove('faq-open');
    window.setTimeout(()=>{if(!faqShell.classList.contains('is-open'))faqShell.hidden=true},260);
  };
  document.addEventListener('click',event=>{
    if(event.target.closest('[data-menu-toggle]'))openMenu();
    if(event.target.closest('[data-menu-close]')||event.target.closest('[data-mobile-nav] a'))closeMenu();
    if(event.target.closest('[data-faq-open]')){
      event.preventDefault();
      closeMenu();
      openFaq();
    }
    if(event.target.closest('[data-faq-close]'))closeFaq();
    if(event.target.closest('[data-sticky-submit]'))document.querySelector('.product-atc')?.click();
  });
  document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeMenu();closeFaq()}});
});
