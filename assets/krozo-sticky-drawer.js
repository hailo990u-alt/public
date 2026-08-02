(()=>{
  const init=()=>{
    const bar=document.querySelector('[data-sticky-atc]');
    if(!bar||!window.matchMedia('(max-width:750px)').matches)return;

    if(!document.querySelector('#KrozoStickyDrawerStyles')){
      const style=document.createElement('style');
      style.id='KrozoStickyDrawerStyles';
      style.textContent=`
        @media(max-width:750px){
          .sticky-atc.krozo-sticky-drawer{
            position:fixed!important;
            left:0!important;
            right:auto!important;
            bottom:0!important;
            width:100vw!important;
            max-width:100vw!important;
            overflow:visible!important;
            transform:translate3d(calc(-100% + 58px),0,0)!important;
            transition:transform .28s ease!important;
            padding:10px 72px calc(10px + env(safe-area-inset-bottom)) 14px!important;
            will-change:transform;
          }
          .sticky-atc.krozo-sticky-drawer.is-open{
            transform:translate3d(0,0,0)!important;
          }
          .sticky-atc.krozo-sticky-drawer>span{
            min-width:0!important;
            overflow:hidden!important;
          }
          .sticky-atc.krozo-sticky-drawer .button{
            margin:0!important;
          }
          .krozo-sticky-toggle{
            position:absolute!important;
            top:0!important;
            right:0!important;
            bottom:0!important;
            width:58px!important;
            min-width:58px!important;
            min-height:72px!important;
            display:flex!important;
            align-items:center!important;
            justify-content:center!important;
            padding:0!important;
            border:0!important;
            border-left:1px solid #ddd8cc!important;
            background:#fffefa!important;
            color:#344535!important;
            font:500 34px/1 Arial,sans-serif!important;
            cursor:pointer!important;
            z-index:5!important;
            opacity:1!important;
            visibility:visible!important;
            -webkit-appearance:none!important;
            appearance:none!important;
            -webkit-tap-highlight-color:transparent;
          }
          .krozo-sticky-toggle__arrow{
            display:block!important;
            transform:rotate(0deg);
            transition:transform .28s ease;
          }
          .sticky-atc.krozo-sticky-drawer.is-open .krozo-sticky-toggle__arrow{
            transform:rotate(180deg);
          }
        }
      `;
      document.head.appendChild(style);
    }

    bar.classList.add('krozo-sticky-drawer');
    bar.classList.remove('is-open');

    let toggle=bar.querySelector('[data-sticky-drawer-toggle]');
    if(!toggle){
      toggle=document.createElement('button');
      toggle.type='button';
      toggle.className='krozo-sticky-toggle';
      toggle.dataset.stickyDrawerToggle='';
      toggle.setAttribute('aria-label','Open quick add to cart');
      toggle.setAttribute('aria-expanded','false');
      toggle.innerHTML='<span class="krozo-sticky-toggle__arrow" aria-hidden="true">›</span>';
      bar.appendChild(toggle);
    }

    toggle.addEventListener('click',event=>{
      event.preventDefault();
      event.stopPropagation();
      const open=!bar.classList.contains('is-open');
      bar.classList.toggle('is-open',open);
      toggle.setAttribute('aria-expanded',String(open));
      toggle.setAttribute('aria-label',open?'Hide quick add to cart':'Open quick add to cart');
    });
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
