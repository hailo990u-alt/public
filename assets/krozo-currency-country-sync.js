(()=>{
  if(!window.matchMedia('(max-width:750px)').matches)return;

  const flagFromRegion=region=>{
    const code=String(region||'').toUpperCase();
    if(code==='EU')return '🇪🇺';
    if(!/^[A-Z]{2}$/.test(code))return '🌐';
    return [...code].map(char=>String.fromCodePoint(127397+char.charCodeAt(0))).join('');
  };

  const getSelectedCurrency=()=>{
    const selected=document.querySelector('.krozo-currency-panel__option.is-selected');
    const fromData=selected?.dataset.currencyCode;
    if(/^[A-Z]{3}$/.test(fromData||''))return fromData;

    const converted=document.querySelector('[bucks-currency]')?.getAttribute('bucks-currency');
    if(/^[A-Z]{3}$/i.test(converted||''))return converted.toUpperCase();

    const statusText=document.querySelector('[data-krozo-detected-currency]')?.textContent||'';
    return statusText.toUpperCase().match(/\b([A-Z]{3})\b/)?.[1]||'';
  };

  const sync=()=>{
    const shell=document.querySelector('[data-krozo-currency-shell]');
    if(!shell)return false;

    const status=shell.querySelector('[data-krozo-detected-currency]');
    const country=shell.querySelector('[data-krozo-detected-country]');
    const flag=shell.querySelector('[data-krozo-detected-flag]');
    if(!status||!country||!flag)return false;

    const locationCountry=String(window.KROZO_LOCALIZATION?.country||'').toUpperCase();
    const locationName=window.KROZO_LOCALIZATION?.countryName||'Your location';
    const selectedCurrency=getSelectedCurrency();
    const manuallySelected=sessionStorage.getItem('krozoCurrencyManualSelection')==='1';

    if(locationCountry){
      flag.textContent=flagFromRegion(locationCountry);
      country.textContent=locationName;
    }

    if(selectedCurrency){
      status.textContent=`${selectedCurrency} · ${manuallySelected?'Current selection':'Automatically selected for your location'}`;
    }

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
