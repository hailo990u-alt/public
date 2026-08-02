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
  const productBenefitCopy={
    'anti-choke-bowl-plastic-dog-bowl-healthy-feeder':['Maze pattern helps fast eaters slow down naturally','Turns every meal into gentle mental enrichment','Rounded food channels are quick to rinse clean'],
    'dog-water-cup-drinking-food-garbage-bag-three-in-one-portable-small-multi-functional-pet-cups-pets-supplies':['Carries water, treats and waste bags in one bottle','One-hand dispensing keeps walk breaks effortless','Unused water flows back to reduce waste'],
    'gps-tracker-for-dogs-cat-pet-child-smart-tag-gadgets-keychain-for-keys-search-key-finder-mini-anti-lost-alarm-gps-locator-pets-products':['Compact tag stays light on collars and keychains','Audible alert helps find nearby pets or belongings','App connection adds everyday location reassurance'],
    'interactive-cat-scratching-post':['Natural sisal gives claws a satisfying scratch surface','Hanging ball encourages batting and active play','Helps redirect scratching away from your furniture'],
    'interactive-cat-toy-ball-super-drive-cat-rolling-ball':['Self-moving ball sparks chasing and hunting instincts','Travels across common floors to keep play unpredictable','Helps indoor cats stay active when playing alone'],
    'krozo™-automatic-pet-water-fountain':['Circulating water encourages pets to drink more often','Quiet flow keeps hydration calm and inviting','Replaceable filtration helps keep every sip fresher'],
    'krozo™-litter-scoop-with-waste-bin':['Built-in waste bin keeps disposal bags within reach','Scoop and contain litter mess in one simple motion','Compact design keeps clean-up tools neatly organised'],
    'krozo™-one-click-pet-brush':['Rounded bristles remove loose fur without harsh pulling','One-click release clears collected hair in seconds','Comfortable grip makes regular grooming easier'],
    'krozo™-smart-treat-puzzle-feeder':['Turns treats into a rewarding problem-solving game','Random dispensing keeps curious pets engaged longer','Encourages slower snacking and independent play'],
    'new-portable-pet-dog-water-bottle-soft-silicone-leaf-design-for-dog-pets-outdoor-travel-drinking-bowls-water-dispenser':['Built-in silicone bowl unfolds for easy outdoor drinking','Leak-resistant seal protects bags during travel','Lightweight shape slips easily into walk essentials'],
    'pet-stairs-steps-cat-and-dog-climb-stairs-3-stairs-pet-bed-stairs':['Three gentle steps make sofas and beds easier to reach','Supportive foam cushions paws and joints while climbing','Removable cover simplifies everyday cleaning'],
    'pet-water-dispenser-automatic-loop-water-fountain':['Continuous circulation keeps the water moving','Wide drinking surface gives pets comfortable access','Generous reservoir reduces frequent bowl refills'],
    'portable-lightweight-dog-pooper-scooper-with-built-in-poop-bag-dispenser-eight-claw-shovel-for-pet-toilet-picker-pet-products':['Claw pickup keeps hands farther from outdoor waste','Built-in bag dispenser keeps clean-up supplies ready','Portable shape clips easily onto walking gear'],
    'roller-brush-pet-gluer-hair-cleaner-hair-remover-brush':['Lifts embedded pet hair from sofas and clothing','Reusable roller reduces reliance on disposable sheets','Compact cleaner is ready for quick daily touch-ups'],
    'cat-house-cat-house-villa-cat-bed-small-dog-kennel':['Enclosed cave creates a warm private place to rest','Soft cushioning supports comfortable naps and sleep','Hanging ball adds gentle play beside the bed']
  };
  const productHandle=decodeURIComponent(location.pathname.split('/').filter(Boolean).pop()||'');
  const tailoredBenefits=productBenefitCopy[productHandle];
  if(tailoredBenefits){
    document.querySelectorAll('.product-benefit-list .product-benefit p').forEach((item,index)=>{
      if(tailoredBenefits[index])item.textContent=tailoredBenefits[index];
    });
  }

});
