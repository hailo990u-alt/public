(()=>{
  if(!window.matchMedia('(max-width:750px)').matches)return;

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
    }catch(error){return region||'Your location';}
  };

  const getSelectedCurrency=()=>{
    const selected=document.querySelector('.krozo-currency-panel__option.is-selected');
    const fromData=selected?.dataset.currencyCode;
    if(/^[A-Z]{3}$/.test(fromData||''))return fromData;

    const currentText=document.querySelector('[data-krozo-detected-currency]')?.textContent||'';
    const textMatch=currentText.toUpperCase().match(/\b([A-Z]{3})\b/);
    if(textMatch)return textMatch[1];

    const converted=document.querySelector('[bucks-currency]')?.getAttribute('bucks-currency');
    return /^[A-Z]{3}$/i.test(converted||'')?converted.toUpperCase():'';
  };

  const sync=()=>{
    const shell=document.querySelector('[data-krozo-currency-shell]');
    if(!shell)return false;

    const status=shell.querySelector('[data-krozo-detected-currency]');
    const country=shell.querySelector('[data-krozo-detected-country]');
    const flag=shell.querySelector('[data-krozo-detected-flag]');
    if(!status||!country||!flag)return false;

    const currency=getSelectedCurrency();
    const region=CURRENCY_REGION[currency];
    if(!currency||!region)return true;

    const manuallySelected=sessionStorage.getItem('krozoCurrencyManualSelection')==='1'||/Current selection/i.test(status.textContent||'');
    const nextCountry=regionName(region);
    const nextFlag=flagFromRegion(region);
    const nextStatus=`${currency} · ${manuallySelected?'Current selection':'Automatically selected for your location'}`;

    if(country.textContent!==nextCountry)country.textContent=nextCountry;
    if(flag.textContent!==nextFlag)flag.textContent=nextFlag;
    if(status.textContent!==nextStatus)status.textContent=nextStatus;
    return true;
  };

  const boot=()=>{
    sync();
    let queued=false;
    const observer=new MutationObserver(()=>{
      if(queued)return;
      queued=true;
      requestAnimationFrame(()=>{
        queued=false;
        sync();
      });
    });
    observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['class','data-currency-code','bucks-currency']});

    let checks=0;
    const guard=setInterval(()=>{
      sync();
      checks+=1;
      if(checks>=40)clearInterval(guard);
    },400);
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
