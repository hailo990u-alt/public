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

  document.querySelectorAll('[data-product-form]').forEach(form=>{
    const productPage=form.closest('.product-page');
    const variantSelect=form.querySelector('[data-variant-select]');
    const variantInput=variantSelect||form.querySelector('[name="id"]');
    const quantity=form.querySelector('[data-product-quantity]');
    const unitPrice=productPage?.querySelector('[data-unit-price]');
    const totalPrice=form.querySelector('[data-product-total]');
    const availability=productPage?.querySelector('[data-product-availability]');
    const addButton=form.querySelector('.product-atc');
    const stickyPrice=document.querySelector('[data-sticky-price]');
    const stickyButton=document.querySelector('[data-sticky-submit]');
    const gallery=productPage?.querySelector('[data-product-gallery]');
    const currency=form.dataset.currency||'USD';
    const formatMoney=cents=>new Intl.NumberFormat(document.documentElement.lang||'en',{style:'currency',currency}).format((Number(cents)||0)/100);
    const selectedData=()=>variantSelect?variantSelect.options[variantSelect.selectedIndex]?.dataset:variantInput?.dataset;
    const update=()=>{
      const data=selectedData()||{};
      const cents=Number(data.price||unitPrice?.dataset.priceCents||0);
      const count=Math.max(1,Number.parseInt(quantity?.value||'1',10)||1);
      const isAvailable=data.available!=='false';
      if(unitPrice){unitPrice.textContent=formatMoney(cents);unitPrice.dataset.priceCents=String(cents)}
      if(totalPrice)totalPrice.textContent=formatMoney(cents*count);
      if(stickyPrice)stickyPrice.textContent=formatMoney(cents*count);
      if(availability)availability.lastChild.textContent=isAvailable?'In stock and ready to order':'Currently unavailable';
      if(addButton){addButton.disabled=!isAvailable;addButton.textContent=isAvailable?'Add to cart':'Sold out'}
      if(stickyButton){stickyButton.disabled=!isAvailable;stickyButton.textContent=isAvailable?'Add to cart':'Sold out'}
      if(gallery&&data.mediaId){
        const target=gallery.querySelector(`[data-media-id="${data.mediaId}"]`);
        gallery.querySelectorAll('[data-media-id]').forEach(item=>item.classList.toggle('is-variant-active',item===target));
        if(target&&window.matchMedia('(max-width:750px)').matches)gallery.scrollTo({left:target.offsetLeft,behavior:'smooth'});
      }
    };
    variantSelect?.addEventListener('change',update);
    quantity?.addEventListener('input',update);
    quantity?.addEventListener('change',update);
    update();
  });
});
