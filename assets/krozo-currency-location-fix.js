(()=>{
  const mobile=window.matchMedia('(max-width:750px)');
  if(!mobile.matches)return;

  const CURRENCY_REGION={
    USD:'US',EUR:'EU',GBP:'GB',CAD:'CA',AUD:'AU',NZD:'NZ',TRY:'TR',
    AED:'AE',SAR:'SA',QAR:'QA',KWD:'KW',BHD:'BH',OMR:'OM',JOD:'JO',
    JPY:'JP',CNY:'CN',HKD:'HK',SGD:'SG',CHF:'CH',SEK:'SE',NOK:'NO',
    DKK:'DK',PLN:'PL',CZK:'CZ',HUF:'HU',RON:'RO',BGN:'BG',INR:'IN',
    PKR:'PK',ZAR:'ZA',MXN:'MX',BRL:'BR',KRW:'KR',THB:'TH',IDR:'ID',
    MYR:'MY',PHP:'PH',VND:'VN',ILS:'IL',EGP:'EG',MAD:'MA'
  };

  const flagFromRegion=region=>{
    const code=String(region||'').toUpperCase();
    if(code==='EU')return '🇪🇺';
    if(!/^[A-Z]{2}$/.test(code))return '🌐';
    return [...code].map(char=>String.fromCodePoint(127397+char.charCodeAt(0))).join('');
  };

  const regionName=region=>{
    if(region==='EU')return 'European Union';
    try{
      return new Intl.DisplayNames([document.documentElement.lang||'en'],{type:'region'}).of(region)||region;
    }catch(error){return region;}
  };

  const activeCurrency=()=>{
    const detectedText=document.querySelector('[data-krozo-detected-currency]')?.textContent||'';
    const detectedMatch=detectedText.toUpperCase().match(/\b[A-Z]{3}\b/);
    if(detectedMatch)return detectedMatch[0];

    const converted=document.querySelector('[bucks-currency]')?.getAttribute('bucks-currency');
    if(/^[A-Z]{3}$/i.test(converted||''))return converted.toUpperCase();

    const selected=document.querySelector('.krozo-currency-panel__option.is-selected')?.dataset.currencyCode;
    if(/^[A-Z]{3}$/i.test(selected||''))return selected.toUpperCase();

    const shopifyCurrency=window.Shopify?.currency?.active;
    return /^[A-Z]{3}$/i.test(shopifyCurrency||'')?shopifyCurrency.toUpperCase():'';
  };

  const sync=()=>{
    const currency=activeCurrency();
    const region=CURRENCY_REGION[currency];
    if(!currency||!region)return;

    const flag=document.querySelector('[data-krozo-detected-flag]');
    const country=document.querySelector('[data-krozo-detected-country]');
    const currencyCopy=document.querySelector('[data-krozo-detected-currency]');

    if(flag)flag.textContent=flagFromRegion(region);
    if(country)country.textContent=regionName(region);
    if(currencyCopy){
      const manual=sessionStorage.getItem('krozoCurrencyManualSelection')==='1';
      currencyCopy.textContent=`${currency} · ${manual?'Current selection':'Automatically selected for your location'}`;
    }
  };

  const boot=()=>{
    sync();
    const observer=new MutationObserver(()=>requestAnimationFrame(sync));
    observer.observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['class','bucks-currency','aria-selected']});
    window.setInterval(sync,1000);
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
