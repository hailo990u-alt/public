(()=>{
  const mobile=window.matchMedia('(max-width:750px)');
  if(!mobile.matches)return;

  const APP_WRAPPER_SELECTOR='.buckscc-currency-wrapper';
  const OPTION_SELECTOR='.buckscc-select-options li,.buckscc-option,[data-currency],[data-value]';

  const style=document.createElement('style');
  style.id='KrozoCurrencyDrawerStyles';
  style.textContent=`
    @media(max-width:750px){
      .buckscc-currency-wrapper.krozo-original-currency-hidden{
        position:fixed!important;
        left:-10000px!important;
        right:auto!important;
        top:0!important;
        bottom:auto!important;
        transform:none!important;
        opacity:0!important;
        visibility:hidden!important;
        pointer-events:none!important;
      }
      .krozo-currency-shell{
        position:fixed!important;
        left:0!important;
        bottom:calc(78px + env(safe-area-inset-bottom))!important;
        width:min(286px,calc(100vw - 16px))!important;
        z-index:8900!important;
        transform:translate3d(calc(-100% + 42px),0,0)!important;
        transition:transform .28s ease!important;
        will-change:transform!important;
      }
      .krozo-currency-shell.is-open{
        transform:translate3d(0,0,0)!important;
      }
      .krozo-currency-panel{
        position:relative!important;
        width:100%!important;
        max-height:min(58vh,430px)!important;
        overflow-y:auto!important;
        padding:12px 50px 12px 12px!important;
        border:1px solid #ddd8cc!important;
        border-left:0!important;
        border-radius:0 10px 10px 0!important;
        background:#fffefa!important;
        box-shadow:0 8px 28px rgba(31,45,32,.16)!important;
        opacity:0!important;
        visibility:hidden!important;
        pointer-events:none!important;
        transform:translateY(4px)!important;
        transition:opacity .18s ease,visibility .18s ease,transform .18s ease!important;
      }
      .krozo-currency-shell.is-open .krozo-currency-panel{
        opacity:1!important;
        visibility:visible!important;
        pointer-events:auto!important;
        transform:translateY(0)!important;
      }
      .krozo-currency-panel__title{
        margin:0 0 8px!important;
        padding:0 2px 8px!important;
        border-bottom:1px solid #e6e1d7!important;
        color:#344535!important;
        font:600 12px/1.3 var(--font-body,Arial,sans-serif)!important;
        letter-spacing:.04em!important;
      }
      .krozo-currency-panel__list{
        display:grid!important;
        gap:2px!important;
      }
      .krozo-currency-panel__option{
        width:100%!important;
        min-height:44px!important;
        display:flex!important;
        align-items:center!important;
        padding:10px 12px!important;
        border:0!important;
        border-radius:6px!important;
        background:transparent!important;
        color:#263328!important;
        text-align:left!important;
        font:500 14px/1.3 var(--font-body,Arial,sans-serif)!important;
        cursor:pointer!important;
        -webkit-appearance:none!important;
        appearance:none!important;
      }
      .krozo-currency-panel__option:active{
        background:#eee8da!important;
      }
      .krozo-currency-drawer__toggle{
        position:absolute!important;
        right:0!important;
        bottom:0!important;
        width:42px!important;
        height:42px!important;
        min-width:42px!important;
        min-height:42px!important;
        display:flex!important;
        align-items:center!important;
        justify-content:center!important;
        margin:0!important;
        padding:0!important;
        border:1px solid #ddd8cc!important;
        border-right:0!important;
        border-radius:0 8px 8px 0!important;
        background:#fffefa!important;
        color:#344535!important;
        box-shadow:none!important;
        font:500 20px/1 Arial,sans-serif!important;
        opacity:1!important;
        visibility:visible!important;
        cursor:pointer!important;
        z-index:20!important;
        -webkit-appearance:none!important;
        appearance:none!important;
        -webkit-tap-highlight-color:transparent;
      }
      .krozo-currency-drawer__arrow{
        display:block!important;
        line-height:1!important;
        transform:rotate(0deg)!important;
        transition:transform .28s ease!important;
      }
      .krozo-currency-shell.is-open .krozo-currency-drawer__arrow{
        transform:rotate(180deg)!important;
      }
    }
  `;
  document.head.appendChild(style);

  const normalize=value=>String(value||'').replace(/\s+/g,' ').trim();

  const ensureShell=()=>{
    let shell=document.querySelector('[data-krozo-currency-shell]');
    if(shell)return shell;

    shell=document.createElement('div');
    shell.className='krozo-currency-shell';
    shell.dataset.krozoCurrencyShell='';
    shell.innerHTML=`
      <div class="krozo-currency-panel" data-krozo-currency-panel>
        <p class="krozo-currency-panel__title">Choose currency</p>
        <div class="krozo-currency-panel__list" data-krozo-currency-list></div>
      </div>
      <button class="krozo-currency-drawer__toggle" type="button" aria-label="Show currency selector" aria-expanded="false" data-krozo-currency-toggle>
        <span class="krozo-currency-drawer__arrow" aria-hidden="true">›</span>
      </button>
    `;
    document.body.appendChild(shell);

    const toggle=shell.querySelector('[data-krozo-currency-toggle]');
    const setOpen=open=>{
      shell.classList.toggle('is-open',open);
      toggle.setAttribute('aria-expanded',String(open));
      toggle.setAttribute('aria-label',open?'Hide currency selector':'Show currency selector');
    };

    toggle.addEventListener('click',event=>{
      event.preventDefault();
      event.stopPropagation();
      setOpen(!shell.classList.contains('is-open'));
    });

    document.addEventListener('click',event=>{
      if(shell.classList.contains('is-open')&&!shell.contains(event.target))setOpen(false);
    });

    document.addEventListener('keydown',event=>{
      if(event.key==='Escape')setOpen(false);
    });

    shell._krozoSetOpen=setOpen;
    return shell;
  };

  const hideOriginalWrapper=wrapper=>{
    if(!wrapper)return;
    wrapper.classList.add('krozo-original-currency-hidden');
    wrapper.style.setProperty('left','-10000px','important');
    wrapper.style.setProperty('right','auto','important');
    wrapper.style.setProperty('top','0','important');
    wrapper.style.setProperty('bottom','auto','important');
    wrapper.style.setProperty('transform','none','important');
    wrapper.style.setProperty('opacity','0','important');
    wrapper.style.setProperty('visibility','hidden','important');
    wrapper.style.setProperty('pointer-events','none','important');
    wrapper.querySelectorAll('.krozo-currency-toggle,[data-currency-toggle],[data-krozo-currency-drawer-toggle]').forEach(control=>control.remove());
    document.body.classList.remove('krozo-currency-open');
  };

  const getOriginalOptions=wrapper=>{
    if(!wrapper)return [];
    const seen=new Set();
    return [...wrapper.querySelectorAll(OPTION_SELECTOR)].filter(node=>{
      const text=normalize(node.textContent);
      if(!text||seen.has(text))return false;
      if(!/(\([A-Z]{3}\)|\b[A-Z]{3}\b)/.test(text))return false;
      seen.add(text);
      return true;
    });
  };

  const triggerOriginalOption=option=>{
    if(!option)return;
    ['pointerdown','mousedown','pointerup','mouseup'].forEach(type=>{
      try{option.dispatchEvent(new MouseEvent(type,{bubbles:true,cancelable:true,view:window}));}catch(error){}
    });
    option.click();
  };

  const renderOptions=()=>{
    const wrapper=document.querySelector(APP_WRAPPER_SELECTOR);
    if(!wrapper)return false;

    hideOriginalWrapper(wrapper);
    const shell=ensureShell();
    const list=shell.querySelector('[data-krozo-currency-list]');
    const options=getOriginalOptions(wrapper);
    if(!options.length)return false;

    const signature=options.map(option=>normalize(option.textContent)).join('|');
    if(list.dataset.signature===signature)return true;

    list.dataset.signature=signature;
    list.innerHTML='';
    options.forEach(original=>{
      const button=document.createElement('button');
      button.type='button';
      button.className='krozo-currency-panel__option';
      button.textContent=normalize(original.textContent);
      button.addEventListener('click',event=>{
        event.preventDefault();
        event.stopPropagation();
        triggerOriginalOption(original);
        shell._krozoSetOpen?.(false);
      });
      list.appendChild(button);
    });
    return true;
  };

  const boot=()=>{
    ensureShell();
    renderOptions();

    let queued=false;
    const observer=new MutationObserver(()=>{
      if(queued)return;
      queued=true;
      requestAnimationFrame(()=>{
        queued=false;
        renderOptions();
      });
    });
    observer.observe(document.body,{childList:true,subtree:true});

    let checks=0;
    const guard=window.setInterval(()=>{
      renderOptions();
      checks+=1;
      if(checks>=20)window.clearInterval(guard);
    },500);
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
