(()=>{
  const mobile=window.matchMedia('(max-width:750px)');
  if(!mobile.matches)return;

  const style=document.createElement('style');
  style.id='KrozoCurrencyDrawerStyles';
  style.textContent=`
    @media(max-width:750px){
      .buckscc-currency-wrapper.krozo-currency-drawer{
        position:fixed!important;
        left:0!important;
        right:auto!important;
        bottom:calc(78px + env(safe-area-inset-bottom))!important;
        max-width:calc(100vw - 12px)!important;
        overflow:visible!important;
        transform:translate3d(calc(-100% + 56px),0,0)!important;
        transition:transform .28s ease!important;
        will-change:transform!important;
        z-index:8900!important;
      }
      .buckscc-currency-wrapper.krozo-currency-drawer.is-open{
        transform:translate3d(0,0,0)!important;
      }
      .krozo-currency-drawer__toggle{
        position:absolute!important;
        top:0!important;
        right:0!important;
        width:56px!important;
        height:100%!important;
        min-height:62px!important;
        display:flex!important;
        align-items:center!important;
        justify-content:center!important;
        margin:0!important;
        padding:0!important;
        border:0!important;
        border-left:1px solid #ddd8cc!important;
        border-radius:0!important;
        background:#fffefa!important;
        color:#344535!important;
        box-shadow:none!important;
        font:500 34px/1 Arial,sans-serif!important;
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
        transform:rotate(0deg);
        transition:transform .28s ease;
      }
      .krozo-currency-drawer.is-open .krozo-currency-drawer__arrow{
        transform:rotate(180deg);
      }
    }
  `;
  document.head.appendChild(style);

  const removeOldControls=()=>{
    document.querySelectorAll('.krozo-currency-toggle,[data-currency-toggle]').forEach(control=>control.remove());
    document.body.classList.remove('krozo-currency-open');
  };

  const setup=()=>{
    const wrapper=document.querySelector('.buckscc-currency-wrapper');
    if(!wrapper)return false;

    removeOldControls();
    wrapper.classList.add('krozo-currency-drawer');
    wrapper.classList.remove('is-open');

    let toggle=wrapper.querySelector('[data-krozo-currency-drawer-toggle]');
    if(!toggle){
      toggle=document.createElement('button');
      toggle.type='button';
      toggle.className='krozo-currency-drawer__toggle';
      toggle.dataset.krozoCurrencyDrawerToggle='';
      toggle.setAttribute('aria-label','Show currency selector');
      toggle.setAttribute('aria-expanded','false');
      toggle.innerHTML='<span class="krozo-currency-drawer__arrow" aria-hidden="true">›</span>';
      wrapper.appendChild(toggle);
    }

    const setOpen=open=>{
      wrapper.classList.toggle('is-open',open);
      toggle.setAttribute('aria-expanded',String(open));
      toggle.setAttribute('aria-label',open?'Hide currency selector':'Show currency selector');
      if(open){
        const face=wrapper.querySelector('.buckscc-select-styled');
        const options=wrapper.querySelector('.buckscc-select-options');
        if(face&&options){
          const styles=getComputedStyle(options);
          if(styles.display==='none'||styles.visibility==='hidden'){
            window.setTimeout(()=>face.dispatchEvent(new MouseEvent('click',{bubbles:true})),40);
          }
        }
      }
    };

    if(toggle.dataset.bound!=='true'){
      toggle.dataset.bound='true';
      toggle.addEventListener('click',event=>{
        event.preventDefault();
        event.stopPropagation();
        setOpen(!wrapper.classList.contains('is-open'));
      });

      wrapper.addEventListener('click',event=>{
        if(event.target.closest('[data-krozo-currency-drawer-toggle]'))return;
        if(wrapper.classList.contains('is-open'))window.setTimeout(()=>setOpen(false),220);
      });

      document.addEventListener('click',event=>{
        if(wrapper.classList.contains('is-open')&&!wrapper.contains(event.target))setOpen(false);
      });

      document.addEventListener('keydown',event=>{
        if(event.key==='Escape')setOpen(false);
      });
    }

    setOpen(false);
    return true;
  };

  const boot=()=>{
    if(setup())return;
    const observer=new MutationObserver(()=>{
      if(setup())observer.disconnect();
    });
    observer.observe(document.body,{childList:true,subtree:true});
    window.setTimeout(()=>observer.disconnect(),10000);
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
