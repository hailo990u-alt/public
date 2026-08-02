document.addEventListener('DOMContentLoaded',()=>{
  const bar=document.querySelector('[data-sticky-atc]');
  if(!bar||!window.matchMedia('(max-width:750px)').matches)return;

  const style=document.createElement('style');
  style.textContent=`
    @media(max-width:750px){
      .sticky-atc.krozo-sticky-drawer{
        left:0!important;
        right:0!important;
        transform:translateX(calc(-100% + 54px));
        transition:transform .28s ease;
        padding-left:68px!important;
        will-change:transform;
      }
      .sticky-atc.krozo-sticky-drawer.is-open{transform:translateX(0)}
      .krozo-sticky-toggle{
        position:absolute;
        top:0;
        right:0;
        width:54px;
        height:100%;
        min-height:72px;
        display:grid;
        place-items:center;
        padding:0;
        border:0;
        border-left:1px solid #ddd8cc;
        background:#fffefa;
        color:var(--olive,#344535);
        cursor:pointer;
        z-index:2;
        -webkit-tap-highlight-color:transparent;
      }
      .krozo-sticky-toggle svg{
        width:24px;
        height:24px;
        fill:none;
        stroke:currentColor;
        stroke-width:2;
        stroke-linecap:round;
        stroke-linejoin:round;
        transition:transform .28s ease;
      }
      .sticky-atc.krozo-sticky-drawer.is-open .krozo-sticky-toggle svg{transform:rotate(180deg)}
      .sticky-atc.krozo-sticky-drawer>span{padding-right:8px}
      .sticky-atc.krozo-sticky-drawer .button{margin-right:54px}
    }
  `;
  document.head.appendChild(style);

  bar.classList.add('krozo-sticky-drawer');
  const toggle=document.createElement('button');
  toggle.type='button';
  toggle.className='krozo-sticky-toggle';
  toggle.setAttribute('aria-label','Open quick add to cart');
  toggle.setAttribute('aria-expanded','false');
  toggle.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>';
  bar.appendChild(toggle);

  const setOpen=open=>{
    bar.classList.toggle('is-open',open);
    toggle.setAttribute('aria-expanded',String(open));
    toggle.setAttribute('aria-label',open?'Hide quick add to cart':'Open quick add to cart');
  };

  toggle.addEventListener('click',event=>{
    event.preventDefault();
    event.stopPropagation();
    setOpen(!bar.classList.contains('is-open'));
  });
});
