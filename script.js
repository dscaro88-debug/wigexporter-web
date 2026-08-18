const path=location.pathname.split('/').pop()||'index.html';
const _pathSegs=location.pathname.split('/').filter(Boolean);
const LOCALES=['es','de','fr'];
const locale=LOCALES.includes(_pathSegs[0])?_pathSegs[0]:'';
const LOCALIZED_PAGES=/*__LOCALIZED_PAGES_START__*/{"synthetic-wigs-hairpieces.html":true}/*__LOCALIZED_PAGES_END__*/;
const UI_EN={
  home:'Home',collections:'Collections',hhe:'Human Hair Extensions',clipin:'Clip-in',tapein:'Tape-in',ktip:'K-tip',
  genius:'Genius Weft',machine:'Machine Weft',nano:'Nano Ring',hhwt:'Human Hair Wigs &amp; Toppers',hhw:'Human Hair Wigs',
  lacewigs:'Lace Wigs',hht:'Human Hair Toppers',ponytails:'Ponytails',swh:'Synthetic Wigs &amp; Hairpieces',
  sw:'Synthetic Wigs',hairpieces:'Hairpieces',bangs:'Bangs / Fringes',citoppers:'Clip-in Toppers',
  salon:'Salon Supplies',kits:'Kits',single:'Single Products',viewall:'VIEW ALL COLLECTIONS →',
  trade:'Trade Services',develop:'Develop Your Range',samples:'Samples',colourkits:'Colour Kits',
  studio:'Colour &amp; Packaging Studio',build:'Build Your Brand',oem:'OEM / Private Label',
  packaging:'Custom Packaging',account:'Trade Account',blog:'Blog',about:'About Us',contact:'Contact',
  company:'Company',ukSite:'DS HAIR Beauty UK →',
  copyright:'© 2026 DS HAIR · WigExporter. B2B wholesale, OEM and private-label enquiries.',
  whatsappBtn:'WHATSAPP US',waPrefill:"Hi! I'm interested in wholesale hair products.",
  ariaHome:'DS HAIR home',ariaOpen:'Open navigation',ariaClose:'Close navigation',ariaSocial:'Social media',
  ariaWa:'Chat with DS HAIR on WhatsApp',
  sending:'Sending your enquiry…',
  thanks:'Thank you. Your enquiry has been delivered to our sourcing team.',
  failGeneric:'We could not send the form.',failDelivery:'Delivery failed',
  emailLink:'Email caro@wigexporter.com',orWa:'or contact us on WhatsApp.',
  prefillNote:'Your selected product specification has been carried into this brief. Review it before submitting.',
  sampleRef:'Sample reference carried forward:'
};
const UI={
  es:{
    home:'Inicio',collections:'Colecciones',hhe:'Extensiones de cabello natural',clipin:'Clip-in',tapein:'Tape-in',ktip:'K-tip',
    genius:'Genius Weft',machine:'Cortina a máquina',nano:'Nano Ring',hhwt:'Pelucas y toppers de cabello natural',
    hhw:'Pelucas de cabello natural',lacewigs:'Pelucas de encaje',hht:'Toppers de cabello natural',ponytails:'Coletas',
    swh:'Pelucas y postizos sintéticos',sw:'Pelucas sintéticas',hairpieces:'Postizos',bangs:'Flequillos',
    citoppers:'Toppers con clip',salon:'Suministros para salón',kits:'Kits',single:'Productos individuales',
    viewall:'VER TODAS LAS COLECCIONES →',trade:'Servicios para mayoristas',develop:'Desarrolla tu gama',
    samples:'Muestras',colourkits:'Kits de color',studio:'Estudio de color y packaging',build:'Construye tu marca',
    oem:'OEM / marca propia',packaging:'Packaging personalizado',account:'Cuenta mayorista',blog:'Blog',
    about:'Sobre nosotros',contact:'Contacto',company:'Empresa',ukSite:'DS HAIR Beauty UK →',
    copyright:'© 2026 DS HAIR · WigExporter. Consultas de venta al por mayor B2B, OEM y marca propia.',
    whatsappBtn:'ESCRÍBENOS',waPrefill:'¡Hola! Me interesan los productos de cabello al por mayor.',
    ariaHome:'DS HAIR inicio',ariaOpen:'Abrir navegación',ariaClose:'Cerrar navegación',ariaSocial:'Redes sociales',
    ariaWa:'Chatea con DS HAIR en WhatsApp',
    sending:'Enviando tu consulta…',
    thanks:'Gracias. Tu consulta se ha enviado a nuestro equipo de compras.',
    failGeneric:'No hemos podido enviar el formulario.',failDelivery:'Error de envío',
    emailLink:'Escribe a caro@wigexporter.com',orWa:'o contáctanos por WhatsApp.',
    prefillNote:'La especificación de producto seleccionada se ha incorporado a este briefing. Revísala antes de enviar.',
    sampleRef:'Referencia de muestra transferida:'
  },
  de:{
    home:'Startseite',collections:'Kollektionen',hhe:'Echthaar-Extensions',clipin:'Clip-in',tapein:'Tape-in',ktip:'K-Tip',
    genius:'Genius Weft',machine:'Maschinentresse',nano:'Nano-Ring',hhwt:'Echthaar-Perücken &amp; Topper',
    hhw:'Echthaar-Perücken',lacewigs:'Lace-Perücken',hht:'Echthaar-Topper',ponytails:'Pferdeschwänze',
    swh:'Kunsthaar-Perücken &amp; Haarteile',sw:'Kunsthaar-Perücken',hairpieces:'Haarteile',bangs:'Fransen / Ponys',
    citoppers:'Clip-in-Topper',salon:'Salonbedarf',kits:'Kits',single:'Einzelprodukte',
    viewall:'ALLE KOLLEKTIONEN ANSEHEN →',trade:'Handelsservices',develop:'Ihr Sortiment entwickeln',
    samples:'Muster',colourkits:'Farbkits',studio:'Farb- &amp; Verpackungsstudio',build:'Ihre Marke aufbauen',
    oem:'OEM / Eigenmarke',packaging:'Individuelle Verpackung',account:'Händlerkonto',blog:'Blog',
    about:'Über uns',contact:'Kontakt',company:'Unternehmen',ukSite:'DS HAIR Beauty UK →',
    copyright:'© 2026 DS HAIR · WigExporter. Anfragen für B2B-Großhandel, OEM und Eigenmarken.',
    whatsappBtn:'WHATSAPP',waPrefill:'Hallo! Ich interessiere mich für Haarprodukte im Großhandel.',
    ariaHome:'DS HAIR Startseite',ariaOpen:'Navigation öffnen',ariaClose:'Navigation schließen',ariaSocial:'Soziale Medien',
    ariaWa:'Mit DS HAIR auf WhatsApp chatten',
    sending:'Ihre Anfrage wird gesendet…',
    thanks:'Vielen Dank. Ihre Anfrage wurde an unser Sourcing-Team übermittelt.',
    failGeneric:'Das Formular konnte nicht gesendet werden.',failDelivery:'Übermittlung fehlgeschlagen',
    emailLink:'E-Mail an caro@wigexporter.com',orWa:'oder kontaktieren Sie uns über WhatsApp.',
    prefillNote:'Die ausgewählte Produktspezifikation wurde in dieses Briefing übernommen. Bitte prüfen Sie sie vor dem Absenden.',
    sampleRef:'Übernommene Musterreferenz:'
  },
  fr:{
    home:'Accueil',collections:'Collections',hhe:'Extensions de cheveux naturels',clipin:'Clip-in',tapein:'Tape-in',ktip:'K-tip',
    genius:'Genius Weft',machine:'Bande tissée machine',nano:'Nano Ring',hhwt:'Perruques et toppers en cheveux naturels',
    hhw:'Perruques en cheveux naturels',lacewigs:'Perruques lace',hht:'Toppers en cheveux naturels',ponytails:'Queues de cheval',
    swh:'Perruques et postiches synthétiques',sw:'Perruques synthétiques',hairpieces:'Postiches',bangs:'Franges',
    citoppers:'Toppers à clips',salon:'Fournitures de salon',kits:'Kits',single:"Produits à l'unité",
    viewall:'VOIR TOUTES LES COLLECTIONS →',trade:'Services professionnels',develop:'Développer votre gamme',
    samples:'Échantillons',colourkits:'Kits couleur',studio:'Studio couleur &amp; packaging',build:'Construire votre marque',
    oem:'OEM / marque propre',packaging:'Packaging personnalisé',account:'Compte professionnel',blog:'Blog',
    about:'À propos',contact:'Contact',company:'Société',ukSite:'DS HAIR Beauty UK →',
    copyright:'© 2026 DS HAIR · WigExporter. Demandes de gros B2B, OEM et marque propre.',
    whatsappBtn:'ÉCRIVEZ-NOUS',waPrefill:'Bonjour ! Je suis intéressé(e) par les produits capillaires en gros.',
    ariaHome:'DS HAIR accueil',ariaOpen:'Ouvrir la navigation',ariaClose:'Fermer la navigation',ariaSocial:'Réseaux sociaux',
    ariaWa:'Discuter avec DS HAIR sur WhatsApp',
    sending:'Envoi de votre demande…',
    thanks:'Merci. Votre demande a été transmise à notre équipe sourcing.',
    failGeneric:"Nous n'avons pas pu envoyer le formulaire.",failDelivery:"Échec de l'envoi",
    emailLink:'Écrivez à caro@wigexporter.com',orWa:'ou contactez-nous sur WhatsApp.',
    prefillNote:'La spécification produit sélectionnée a été reportée dans ce brief. Vérifiez-la avant envoi.',
    sampleRef:"Référence d'échantillon reportée :"
  }
};
const t=(k)=>((locale&&UI[locale]&&UI[locale][k])||UI_EN[k]||'');
const tp=(k)=>t(k).replace(/&amp;/g,'&');
const localizeLinks=(root)=>{
  if(!locale||!root)return;
  root.querySelectorAll('a[href]').forEach((a)=>{
    const href=a.getAttribute('href')||'';
    if(/^(https?:|mailto:|tel:|#|\/\/)/.test(href))return;
    const [file,hash]=href.split('#');
    if(LOCALIZED_PAGES[file])a.setAttribute('href',`/${locale}/${file}${hash?('#'+hash):''}`);
    else a.setAttribute('href',`/${file}${hash?('#'+hash):''}`);
  });
};
document.querySelectorAll('.wordmark').forEach(wordmark=>{
  wordmark.setAttribute('aria-label',t('ariaHome'));
  wordmark.innerHTML='<strong>DS HAIR</strong><span>WIGEXPORTER · GLOBAL B2B</span>';
});
const nav=document.querySelector('.primary-nav');
if(nav){
  const active=(...pages)=>pages.includes(path)?' active':'';
  nav.innerHTML=`
    <a class="nav-link${active('index.html')}" href="index.html">${t('home')}</a>
    <div class="nav-dropdown">
      <button class="nav-trigger${active('products.html','human-hair-extensions.html','clip-in-human-hair-extensions.html','tape-in-human-hair-extensions.html','k-tip-human-hair-extensions.html','genius-weft-human-hair-extensions.html','machine-weft-human-hair-extensions.html','nano-ring-human-hair-extensions.html','human-hair-wigs-toppers.html','synthetic-wigs-hairpieces.html','salon-supplies.html')}" type="button" aria-expanded="false">${t('collections')} <svg viewBox="0 0 12 8" aria-hidden="true"><path d="M1 1l5 5 5-5" fill="none" stroke="currentColor"/></svg></button>
      <div class="mega-menu mega-menu-collections">
        <div class="mega-group"><strong>${t('hhe')}</strong><a href="clip-in-human-hair-extensions.html">${t('clipin')}</a><a href="tape-in-human-hair-extensions.html">${t('tapein')}</a><a href="k-tip-human-hair-extensions.html">${t('ktip')}</a><a href="genius-weft-human-hair-extensions.html">${t('genius')}</a><a href="machine-weft-human-hair-extensions.html">${t('machine')}</a><a href="nano-ring-human-hair-extensions.html">${t('nano')}</a></div>
        <div class="mega-group"><strong>${t('hhwt')}</strong><a href="human-hair-wigs-toppers.html#human-hair-wigs">${t('hhw')}</a><a href="human-hair-wigs-toppers.html#lace-wigs">${t('lacewigs')}</a><a href="human-hair-wigs-toppers.html#human-hair-toppers">${t('hht')}</a><a href="human-hair-wigs-toppers.html#ponytails">${t('ponytails')}</a></div>
        <div class="mega-group"><strong>${t('swh')}</strong><a href="synthetic-wigs-hairpieces.html#synthetic-wigs">${t('sw')}</a><a href="synthetic-wigs-hairpieces.html#hairpieces">${t('hairpieces')}</a><a href="synthetic-wigs-hairpieces.html#bangs-fringes">${t('bangs')}</a><a href="synthetic-wigs-hairpieces.html#clip-in-toppers">${t('citoppers')}</a></div>
        <div class="mega-group"><strong>${t('salon')}</strong><a href="salon-supplies.html#kits">${t('kits')}</a><a href="salon-supplies.html#single-products">${t('single')}</a></div>
        <a class="mega-all" href="products.html">${t('viewall')}</a>
      </div>
    </div>
    <div class="nav-dropdown">
      <button class="nav-trigger${active('sample.html','free-color-kits.html','hair-colour-chart-custom-packaging.html','customization.html','trade-account.html')}" type="button" aria-expanded="false">${t('trade')} <svg viewBox="0 0 12 8" aria-hidden="true"><path d="M1 1l5 5 5-5" fill="none" stroke="currentColor"/></svg></button>
      <div class="mega-menu mega-menu-services">
        <div class="mega-group"><strong>${t('develop')}</strong><a href="sample.html">${t('samples')}</a><a href="free-color-kits.html">${t('colourkits')}</a><a href="hair-colour-chart-custom-packaging.html">${t('studio')}</a></div>
        <div class="mega-group"><strong>${t('build')}</strong><a href="customization.html">${t('oem')}</a><a href="customization.html#custom-packaging">${t('packaging')}</a><a href="trade-account.html">${t('account')}</a></div>
      </div>
    </div>
    <a class="nav-link${active('blog.html','tape-hair-vs-k-tip-vs-weft.html','how-to-evaluate-wholesale-wig-sample.html','build-repeatable-hair-colour-system.html')}" href="blog.html">${t('blog')}</a>
    <a class="nav-link${active('about.html')}" href="about.html">${t('about')}</a>
    <a class="nav-link${active('contact.html')}" href="contact.html">${t('contact')}</a>`;
  localizeLinks(nav);
}
const scrollToHashTarget=()=>{
  if(!location.hash)return;
  const target=document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if(!target)return;
  requestAnimationFrame(()=>target.scrollIntoView({block:'start'}));
};
if(location.hash){
  scrollToHashTarget();
  window.addEventListener('load',scrollToHashTarget,{once:true});
}
window.addEventListener('hashchange',scrollToHashTarget);
const toggle=document.querySelector('.menu-toggle');
if(toggle&&!toggle.getAttribute('aria-label'))toggle.setAttribute('aria-label',t('ariaOpen'));
if(toggle&&nav){toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));toggle.setAttribute('aria-label',open?t('ariaOpen'):t('ariaClose'));nav.classList.toggle('open',!open)});}
document.querySelectorAll('.nav-trigger').forEach(trigger=>trigger.addEventListener('click',()=>{const item=trigger.closest('.nav-dropdown');const open=item.classList.toggle('open');trigger.setAttribute('aria-expanded',String(open));document.querySelectorAll('.nav-dropdown').forEach(other=>{if(other!==item){other.classList.remove('open');const otherTrigger=other.querySelector('.nav-trigger');if(otherTrigger)otherTrigger.setAttribute('aria-expanded','false')}})}));
document.addEventListener('click',event=>{if(!event.target.closest('.nav-dropdown'))document.querySelectorAll('.nav-dropdown.open').forEach(item=>{item.classList.remove('open');item.querySelector('.nav-trigger')?.setAttribute('aria-expanded','false')})});
const footer=document.querySelector('.site-footer');
if(footer)footer.innerHTML=`
  <div class="footer-col"><a class="footer-brand" href="index.html"><strong>DS HAIR</strong><span>WigExporter · Global B2B</span></a><div class="social-links" aria-label="${t('ariaSocial')}">
    <a href="https://www.facebook.com/D.SHairBeauty" target="_blank" rel="noopener" aria-label="Facebook"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.3 8.4V6.7c0-.8.5-1 1-1h2.5V2.1L14.4 2C11 2 9.8 4.1 9.8 6.3v2.1H7.5v4h2.3V22h4.5v-9.6h3l.5-4z"/></svg></a>
    <a href="https://www.instagram.com/d.shairbeauty" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle class="social-dot" cx="17.5" cy="6.5" r="1.2"/></svg></a>
    <a href="https://www.tiktok.com/@d.shairbeauty" target="_blank" rel="noopener" aria-label="TikTok"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3v11.2a3.2 3.2 0 1 1-2.6-3.1V7.5a6.7 6.7 0 1 0 6.4 6.7V9.1c1.2.8 2.6 1.3 4.2 1.3V6.7A4.5 4.5 0 0 1 17.7 3z"/></svg></a>
    <a href="https://youtube.com/@dshairbeauty" target="_blank" rel="noopener" aria-label="YouTube"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="4"/><path class="social-fill" d="m10 9 6 3-6 3z"/></svg></a>
    <a href="https://uk.pinterest.com/dshairbeautyuk" target="_blank" rel="noopener" aria-label="Pinterest"><svg viewBox="0 0 24 24" aria-hidden="true"><text x="7" y="18">P</text></svg></a>
    <a href="https://linkedin.com/company/dshairbeauty" target="_blank" rel="noopener" aria-label="LinkedIn"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.3 8.1H1.7V22h3.6zM3.5 2A2.1 2.1 0 1 0 3.5 6.2 2.1 2.1 0 0 0 3.5 2zM22 14c0-4.2-2.2-6.2-5.2-6.2-2.4 0-3.5 1.3-4.1 2.2V8.1H9.1V22h3.6v-6.9c0-1.8.4-3.6 2.7-3.6s2.3 2.1 2.3 3.7V22H22z"/></svg></a>
  </div></div>
  <div class="footer-col"><h3>${t('collections')}</h3><a href="human-hair-extensions.html">${t('hhe')}</a><a href="human-hair-wigs-toppers.html">${t('hhwt')}</a><a href="synthetic-wigs-hairpieces.html">${t('swh')}</a><a href="salon-supplies.html">${t('salon')}</a></div>
  <div class="footer-col"><h3>${t('trade')}</h3><a href="sample.html">${t('samples')}</a><a href="free-color-kits.html">${t('colourkits')}</a><a href="hair-colour-chart-custom-packaging.html">${t('studio')}</a><a href="customization.html">${t('oem')}</a><a href="customization.html#custom-packaging">${t('packaging')}</a><a href="trade-account.html">${t('account')}</a></div>
  <div class="footer-col"><h3>${t('company')}</h3><a href="about.html">${t('about')}</a><a href="blog.html">${t('blog')}</a><a href="contact.html">${t('contact')}</a><a class="footer-uk" href="https://dshairbeauty.co.uk" target="_blank" rel="noopener">${t('ukSite')}</a><a href="mailto:caro@wigexporter.com">caro@wigexporter.com</a><a href="tel:+8613516946001">+86 135 1694 6001</a></div>
  <p class="copyright">${t('copyright')}</p>`;
if(footer)localizeLinks(footer);
if(!document.querySelector('.floating-contact')){
  const whatsApp=document.createElement('a');
  whatsApp.className='floating-contact';
  whatsApp.href='https://wa.me/8613516946001?text='+encodeURIComponent(tp('waPrefill'));
  whatsApp.target='_blank';
  whatsApp.rel='noopener';
  whatsApp.setAttribute('aria-label',t('ariaWa'));
  whatsApp.innerHTML='<span class="whatsapp-ripple" aria-hidden="true"></span><svg class="whatsapp-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 3.5A11.8 11.8 0 0 0 2 17.7L.4 23.6l6-1.6A11.8 11.8 0 0 0 20.5 3.5ZM12 21a9.4 9.4 0 0 1-4.8-1.3l-.3-.2-3.6 1 1-3.5-.2-.4A9.4 9.4 0 1 1 12 21Zm5.2-7c-.3-.1-1.7-.8-2-.9-.2-.1-.5-.1-.7.2l-.9 1.1c-.2.3-.5.3-.8.1-2-.8-3.3-2.9-3.5-3.2-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.4.3-.6.1-.2 0-.5 0-.6L9.3 6.6c-.2-.6-.5-.5-.7-.5H8c-.3 0-.7.1-1 .5-.3.4-1.3 1.3-1.3 3.1 0 1.9 1.4 3.7 1.5 3.9.2.3 2.7 4.1 6.6 5.8.9.4 1.6.6 2.2.7.9.3 1.8.2 2.4.1.8-.1 2.4-1 2.7-1.9.3-1 .3-1.8.2-1.9-.1-.2-.3-.3-.6-.4Z"/></svg><small>'+t('whatsappBtn')+'</small><b aria-hidden="true">1</b>';
  document.body.appendChild(whatsApp);
}
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('visible')}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(element=>observer.observe(element));
if(path==='sample.html'){
  const params=new URLSearchParams(location.search);
  const product=params.get('product');
  const sampleLink=document.querySelector('[data-sample-contact]');
  if(product&&sampleLink){
    sampleLink.href=`contact.html?${new URLSearchParams({project:'Sample request',product}).toString()}`;
    const context=document.createElement('p');
    context.className='sample-context';
    context.textContent=`${tp('sampleRef')} ${product}`;
    sampleLink.before(context);
  }
}
if(path==='contact.html'){
  const params=new URLSearchParams(location.search);
  const form=document.querySelector('[data-inquiry-form]');
  const product=params.get('product');
  const project=params.get('project');
  if(form&&(product||project)){
    const select=form.querySelector('select');
    const serviceSelect=form.querySelector('select[name="service"]');
    const textarea=form.querySelector('textarea');
    const formProduct=product||'';
    const formService=project==='Colour and Packaging Studio'?'Colour & Packaging Studio':'';
    if(select&&formProduct){
      const matching=[...select.options].find(option=>option.value.toLowerCase()===formProduct.toLowerCase() || option.textContent.toLowerCase()===formProduct.toLowerCase());
      if(matching)select.value=matching.value;
      else{const option=new Option(formProduct,formProduct,true,true);select.add(option);}
    }
    if(serviceSelect&&formService)serviceSelect.value=formService;
    const details=[...params.entries()].filter(([key])=>!['product','project'].includes(key)).map(([key,value])=>`${key.replaceAll('_',' ')}: ${value}`);
    if(textarea)textarea.value=[project?`Project: ${project}`:'',formProduct?`Product: ${formProduct}`:'',formService?`Service: ${formService}`:'',...details].filter(Boolean).join('\n');
    const note=document.createElement('p');
    note.className='form-prefill full';
    note.textContent=tp('prefillNote');
    form.prepend(note);
  }
}
document.querySelectorAll('[data-inquiry-form]').forEach(form=>{
  const honeypot=document.createElement('input');
  honeypot.type='text';
  honeypot.name='website';
  honeypot.tabIndex=-1;
  honeypot.autocomplete='off';
  honeypot.setAttribute('aria-hidden','true');
  honeypot.style.cssText='position:absolute;left:-9999px;width:1px;height:1px;opacity:0';
  form.appendChild(honeypot);
  form.addEventListener('submit',async event=>{
    event.preventDefault();
    const button=form.querySelector('button[type="submit"]');
    const note=form.querySelector('.form-note');
    if(button)button.disabled=true;
    if(note){note.textContent=tp('sending');note.classList.remove('form-success')}
    const payload=Object.fromEntries(new FormData(form).entries());
    payload.form_type=form.dataset.inquiryForm;
    payload.page_url=location.href;
    try{
      const response=await fetch('/api/inquiry',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      const result=await response.json().catch(()=>({}));
      if(!response.ok||!result.ok)throw new Error(result.error||tp('failDelivery'));
      form.reset();
      if(note){note.textContent=tp('thanks');note.classList.add('form-success')}
    }catch(error){
      const message = error?.message || tp('failGeneric');
      if(note){note.innerHTML=`${message} <a href="mailto:caro@wigexporter.com">${t('emailLink')}</a> ${t('orWa')}`;note.classList.remove('form-success')}
    }finally{
      if(button)button.disabled=false;
    }
  });
});
