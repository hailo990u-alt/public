document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.product-description img').forEach(image=>{
    image.loading='lazy';
    image.decoding='async';
  });

  document.querySelectorAll('[data-product-form]').forEach(form=>{
    const productPage=form.closest('.product-page');
    const variantSelect=form.querySelector('[data-variant-select]');
    const variantInput=variantSelect||form.querySelector('[name="id"]');
    const quantity=form.querySelector('[data-product-quantity]');
    let unitPrice=productPage?.querySelector('[data-unit-price]');
    let totalPrice=form.querySelector('[data-product-total]');
    const availability=productPage?.querySelector('[data-product-availability]');
    const addButton=form.querySelector('.product-atc');
    let stickyPrice=document.querySelector('[data-sticky-price]');
    const stickyButton=document.querySelector('[data-sticky-submit]');
    const gallery=productPage?.querySelector('[data-product-gallery]');
    const currency=form.dataset.currency||'USD';

    const formatMoney=cents=>new Intl.NumberFormat(document.documentElement.lang||'en',{
      style:'currency',currency
    }).format((Number(cents)||0)/100);

    const parseDisplayedAmount=value=>{
      const clean=String(value||'').replace(/[^\d,.-]/g,'');
      const comma=clean.lastIndexOf(',');
      const dot=clean.lastIndexOf('.');
      const separator=Math.max(comma,dot);
      if(separator<0)return Number(clean.replace(/[^\d-]/g,''));
      const decimalDigits=clean.length-separator-1;
      if(decimalDigits!==2)return Number(clean.replace(/[^\d-]/g,''));
      const integer=clean.slice(0,separator).replace(/[^\d-]/g,'');
      const decimal=clean.slice(separator+1).replace(/\D/g,'');
      return Number(`${integer}.${decimal}`);
    };

    const selectedData=()=>variantSelect
      ?variantSelect.options[variantSelect.selectedIndex]?.dataset
      :variantInput?.dataset;

    const getBucksConversion=()=>{
      const converted=unitPrice?.getAttribute('bucks-current');
      const targetCurrency=unitPrice?.getAttribute('bucks-currency');
      const baseCents=Number(unitPrice?.dataset.priceCents||0);
      const convertedAmount=parseDisplayedAmount(converted);
      if(!converted||!targetCurrency||!baseCents||!Number.isFinite(convertedAmount))return null;
      return {currency:targetCurrency,rate:convertedAmount/(baseCents/100)};
    };

    const formatConvertedMoney=(cents,conversion)=>new Intl.NumberFormat(document.documentElement.lang||'en',{
      style:'currency',currency:conversion.currency,currencyDisplay:'narrowSymbol'
    }).format((Number(cents)||0)/100*conversion.rate);

    const resetVariantOptionPrices=()=>variantSelect?.querySelectorAll('option').forEach(option=>{
      const title=option.dataset.variantTitle||option.textContent.split(' — ')[0];
      option.textContent=`${title} — ${formatMoney(option.dataset.price)}`;
    });

    const renderConvertibleMoney=(node,cents)=>{
      if(!node)return node;
      const replacement=node.cloneNode(false);
      [...replacement.attributes].forEach(attribute=>{
        if(attribute.name.startsWith('bucks-'))replacement.removeAttribute(attribute.name);
      });
      replacement.classList.remove('buckscc-converted','buckscc-money');
      replacement.classList.add('money');
      replacement.textContent=formatMoney(cents);
      replacement.dataset.priceCents=String(cents);
      node.replaceWith(replacement);
      return replacement;
    };

    const syncBucksPrices=()=>{
      const conversion=getBucksConversion();
      if(!conversion)return;
      const count=Math.max(1,Number.parseInt(quantity?.value||'1',10)||1);
      const selected=selectedData()||{};
      const selectedCents=Number(selected.price||unitPrice?.dataset.priceCents||0);
      if(totalPrice)totalPrice.textContent=formatConvertedMoney(selectedCents*count,conversion);
      if(stickyPrice)stickyPrice.textContent=formatConvertedMoney(selectedCents*count,conversion);
      variantSelect?.querySelectorAll('option').forEach(option=>{
        const title=option.dataset.variantTitle||option.textContent.split(' — ')[0];
        option.textContent=`${title} — ${formatConvertedMoney(option.dataset.price,conversion)}`;
      });
    };

    const update=()=>{
      const data=selectedData()||{};
      const cents=Number(data.price||unitPrice?.dataset.priceCents||0);
      const count=Math.max(1,Number.parseInt(quantity?.value||'1',10)||1);
      const isAvailable=data.available!=='false';
      unitPrice=renderConvertibleMoney(unitPrice,cents);
      totalPrice=renderConvertibleMoney(totalPrice,cents*count);
      stickyPrice=renderConvertibleMoney(stickyPrice,cents*count);
      resetVariantOptionPrices();
      if(availability)availability.lastChild.textContent=isAvailable?'In stock and ready to order':'Currently unavailable';
      if(addButton){addButton.disabled=!isAvailable;addButton.textContent=isAvailable?'Add to cart':'Sold out';}
      if(stickyButton){stickyButton.disabled=!isAvailable;stickyButton.textContent=isAvailable?'Add to cart':'Sold out';}
      if(gallery&&data.mediaId){
        const target=gallery.querySelector(`[data-media-id="${data.mediaId}"]`);
        gallery.querySelectorAll('[data-media-id]').forEach(item=>item.classList.toggle('is-variant-active',item===target));
        if(target&&window.matchMedia('(max-width:750px)').matches)gallery.scrollTo({left:target.offsetLeft,behavior:'smooth'});
      }
      window.setTimeout(syncBucksPrices,80);
    };

    variantSelect?.addEventListener('change',update);
    quantity?.addEventListener('input',update);
    quantity?.addEventListener('change',update);
    update();

    const mainPriceShell=unitPrice?.closest('.price');
    if(mainPriceShell){
      let queued=false;
      const bucksObserver=new MutationObserver(()=>{
        if(queued)return;
        queued=true;
        requestAnimationFrame(()=>{
          queued=false;
          syncBucksPrices();
        });
      });
      bucksObserver.observe(mainPriceShell,{subtree:true,childList:true,characterData:true,attributes:true});
      window.setTimeout(syncBucksPrices,500);
      window.setTimeout(syncBucksPrices,1500);
    }
  });
});
