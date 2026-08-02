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

  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'){
      closeMenu();
      closeFaq();
    }
  });

  const prefetchedPages=new Set();
  const prefetchPage=link=>{
    if(!link||link.target||link.hasAttribute('download'))return;
    if(navigator.connection?.saveData||navigator.connection?.effectiveType==='2g')return;
    const url=new URL(link.href,location.href);
    if(url.origin!==location.origin||url.pathname===location.pathname||url.hash&&url.pathname===location.pathname)return;
    if(!/^\/(products|collections|pages|blogs)(\/|$)/.test(url.pathname)||prefetchedPages.has(url.href))return;
    prefetchedPages.add(url.href);
    const hint=document.createElement('link');
    hint.rel='prefetch';
    hint.as='document';
    hint.href=url.href;
    document.head.appendChild(hint);
  };

  document.addEventListener('pointerover',event=>prefetchPage(event.target.closest('a[href]')),{passive:true});
  document.addEventListener('focusin',event=>prefetchPage(event.target.closest('a[href]')));
});
