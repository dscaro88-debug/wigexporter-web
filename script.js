const path=location.pathname.split('/').pop()||'index.html';
document.querySelectorAll('.wordmark').forEach(wordmark=>{
  wordmark.setAttribute('aria-label','DS HAIR home');
  wordmark.innerHTML='<strong>DS HAIR</strong><span>WIGEXPORTER · GLOBAL B2B</span>';
});
const nav=document.querySelector('.primary-nav');
if(nav){
  const active=(...pages)=>pages.includes(path)?' active':'';
  nav.innerHTML=`
    <a class="nav-link${active('index.html')}" href="index.html">Home</a>
    <div class="nav-dropdown">
      <button class="nav-trigger${active('products.html','human-hair-extensions.html','genius-weft-human-hair-extensions.html','human-hair-wigs-toppers.html','synthetic-wigs-hairpieces.html','salon-supplies.html')}" type="button" aria-expanded="false">Collections <svg viewBox="0 0 12 8" aria-hidden="true"><path d="M1 1l5 5 5-5" fill="none" stroke="currentColor"/></svg></button>
      <div class="mega-menu mega-menu-collections">
        <div class="mega-group"><strong>Human Hair Extensions</strong><a href="human-hair-extensions.html#clip-in">Clip-in</a><a href="human-hair-extensions.html#tape-in">Tape-in</a><a href="human-hair-extensions.html#k-tip">K-tip</a><a href="human-hair-extensions.html#genius-weft">Genius Weft</a><a href="human-hair-extensions.html#machine-weft">Machine Weft</a><a href="human-hair-extensions.html#hand-tied-weft">Hand-tied Weft</a></div>
        <div class="mega-group"><strong>Human Hair Wigs & Toppers</strong><a href="human-hair-wigs-toppers.html#human-hair-wigs">Human Hair Wigs</a><a href="human-hair-wigs-toppers.html#lace-wigs">Lace Wigs</a><a href="human-hair-wigs-toppers.html#human-hair-toppers">Human Hair Toppers</a><a href="human-hair-wigs-toppers.html#ponytails">Ponytails</a></div>
        <div class="mega-group"><strong>Synthetic Wigs & Hairpieces</strong><a href="synthetic-wigs-hairpieces.html#synthetic-wigs">Synthetic Wigs</a><a href="synthetic-wigs-hairpieces.html#hairpieces">Hairpieces</a><a href="synthetic-wigs-hairpieces.html#bangs-fringes">Bangs / Fringes</a><a href="synthetic-wigs-hairpieces.html#clip-in-toppers">Clip-in Toppers</a></div>
        <div class="mega-group"><strong>Salon Supplies</strong><a href="salon-supplies.html#kits">Kits</a><a href="salon-supplies.html#single-products">Single Products</a></div>
        <a class="mega-all" href="products.html">VIEW ALL COLLECTIONS →</a>
      </div>
    </div>
    <div class="nav-dropdown">
      <button class="nav-trigger${active('sample.html','free-color-kits.html','hair-colour-chart-custom-packaging.html','customization.html','trade-account.html')}" type="button" aria-expanded="false">Trade Services <svg viewBox="0 0 12 8" aria-hidden="true"><path d="M1 1l5 5 5-5" fill="none" stroke="currentColor"/></svg></button>
      <div class="mega-menu mega-menu-services">
        <div class="mega-group"><strong>Develop Your Range</strong><a href="sample.html">Samples</a><a href="free-color-kits.html">Colour Kits</a><a href="hair-colour-chart-custom-packaging.html">Colour & Packaging Studio</a></div>
        <div class="mega-group"><strong>Build Your Brand</strong><a href="customization.html">OEM / Private Label</a><a href="customization.html#custom-packaging">Custom Packaging</a><a href="trade-account.html">Trade Account</a></div>
      </div>
    </div>
    <a class="nav-link${active('blog.html','tape-hair-vs-k-tip-vs-weft.html','how-to-evaluate-wholesale-wig-sample.html','build-repeatable-hair-colour-system.html')}" href="blog.html">Blog</a>
    <a class="nav-link${active('about.html')}" href="about.html">About Us</a>
    <a class="nav-link${active('contact.html')}" href="contact.html">Contact</a>`;
}
const toggle=document.querySelector('.menu-toggle');
if(toggle&&!toggle.getAttribute('aria-label'))toggle.setAttribute('aria-label','Open navigation');
if(toggle&&nav){toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));toggle.setAttribute('aria-label',open?'Open navigation':'Close navigation');nav.classList.toggle('open',!open)});}
document.querySelectorAll('.nav-trigger').forEach(trigger=>trigger.addEventListener('click',()=>{const item=trigger.closest('.nav-dropdown');const open=item.classList.toggle('open');trigger.setAttribute('aria-expanded',String(open));document.querySelectorAll('.nav-dropdown').forEach(other=>{if(other!==item){other.classList.remove('open');const otherTrigger=other.querySelector('.nav-trigger');if(otherTrigger)otherTrigger.setAttribute('aria-expanded','false')}})}));
document.addEventListener('click',event=>{if(!event.target.closest('.nav-dropdown'))document.querySelectorAll('.nav-dropdown.open').forEach(item=>{item.classList.remove('open');item.querySelector('.nav-trigger')?.setAttribute('aria-expanded','false')})});
const footer=document.querySelector('.site-footer');
if(footer)footer.innerHTML=`
  <div><a class="footer-brand" href="index.html"><strong>DS HAIR</strong><span>WigExporter · Global B2B</span></a><div class="social-links" aria-label="Social media">
    <a href="https://www.facebook.com/D.SHairBeauty" target="_blank" rel="noopener" aria-label="Facebook"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.3 8.4V6.7c0-.8.5-1 1-1h2.5V2.1L14.4 2C11 2 9.8 4.1 9.8 6.3v2.1H7.5v4h2.3V22h4.5v-9.6h3l.5-4z"/></svg></a>
    <a href="https://www.instagram.com/d.shairbeauty" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle class="social-dot" cx="17.5" cy="6.5" r="1.2"/></svg></a>
    <a href="https://www.tiktok.com/@d.shairbeauty" target="_blank" rel="noopener" aria-label="TikTok"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3v11.2a3.2 3.2 0 1 1-2.6-3.1V7.5a6.7 6.7 0 1 0 6.4 6.7V9.1c1.2.8 2.6 1.3 4.2 1.3V6.7A4.5 4.5 0 0 1 17.7 3z"/></svg></a>
    <a href="https://youtube.com/@dshairbeauty" target="_blank" rel="noopener" aria-label="YouTube"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="4"/><path class="social-fill" d="m10 9 6 3-6 3z"/></svg></a>
    <a href="https://uk.pinterest.com/dshairbeautyuk" target="_blank" rel="noopener" aria-label="Pinterest"><svg viewBox="0 0 24 24" aria-hidden="true"><text x="7" y="18">P</text></svg></a>
    <a href="https://linkedin.com/company/dshairbeauty" target="_blank" rel="noopener" aria-label="LinkedIn"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.3 8.1H1.7V22h3.6zM3.5 2A2.1 2.1 0 1 0 3.5 6.2 2.1 2.1 0 0 0 3.5 2zM22 14c0-4.2-2.2-6.2-5.2-6.2-2.4 0-3.5 1.3-4.1 2.2V8.1H9.1V22h3.6v-6.9c0-1.8.4-3.6 2.7-3.6s2.3 2.1 2.3 3.7V22H22z"/></svg></a>
  </div></div>
  <div><h3>Collections</h3><a href="human-hair-extensions.html">Human Hair Extensions</a><a href="human-hair-wigs-toppers.html">Human Hair Wigs & Toppers</a><a href="synthetic-wigs-hairpieces.html">Synthetic Wigs & Hairpieces</a><a href="salon-supplies.html">Salon Supplies</a></div>
  <div><h3>Trade Services</h3><a href="sample.html">Samples</a><a href="free-color-kits.html">Colour Kits</a><a href="hair-colour-chart-custom-packaging.html">Colour & Packaging Studio</a><a href="customization.html">OEM / Private Label</a><a href="customization.html#custom-packaging">Custom Packaging</a><a href="trade-account.html">Trade Account</a></div>
  <div><h3>Company</h3><a href="about.html">About Us</a><a href="blog.html">Blog</a><a href="contact.html">Contact</a><a href="mailto:caro@wigexporter.com">caro@wigexporter.com</a><a href="tel:+8613516946001">+86 135 1694 6001</a></div>
  <p class="copyright">© 2026 DS HAIR · WigExporter. B2B wholesale, OEM and private-label enquiries.</p>`;
if(!document.querySelector('.floating-contact')){
  const whatsApp=document.createElement('a');
  whatsApp.className='floating-contact';
  whatsApp.href='https://wa.me/8613516946001?text=Hi!%20I%27m%20interested%20in%20wholesale%20hair%20products.';
  whatsApp.target='_blank';
  whatsApp.rel='noopener';
  whatsApp.setAttribute('aria-label','Chat with DS HAIR on WhatsApp');
  whatsApp.innerHTML='<span class="whatsapp-ripple" aria-hidden="true"></span><svg class="whatsapp-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 3.5A11.8 11.8 0 0 0 2 17.7L.4 23.6l6-1.6A11.8 11.8 0 0 0 20.5 3.5ZM12 21a9.4 9.4 0 0 1-4.8-1.3l-.3-.2-3.6 1 1-3.5-.2-.4A9.4 9.4 0 1 1 12 21Zm5.2-7c-.3-.1-1.7-.8-2-.9-.2-.1-.5-.1-.7.2l-.9 1.1c-.2.3-.5.3-.8.1-2-.8-3.3-2.9-3.5-3.2-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.4.3-.6.1-.2 0-.5 0-.6L9.3 6.6c-.2-.6-.5-.5-.7-.5H8c-.3 0-.7.1-1 .5-.3.4-1.3 1.3-1.3 3.1 0 1.9 1.4 3.7 1.5 3.9.2.3 2.7 4.1 6.6 5.8.9.4 1.6.6 2.2.7.9.3 1.8.2 2.4.1.8-.1 2.4-1 2.7-1.9.3-1 .3-1.8.2-1.9-.1-.2-.3-.3-.6-.4Z"/></svg><small>WHATSAPP US</small><b aria-hidden="true">1</b>';
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
    context.textContent=`Sample reference carried forward: ${product}`;
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
      const matching=[...select.options].find(option=>option.textContent.toLowerCase()===formProduct.toLowerCase());
      if(matching)select.value=matching.value;
      else{const option=new Option(formProduct,formProduct,true,true);select.add(option);}
    }
    if(serviceSelect&&formService)serviceSelect.value=formService;
    const details=[...params.entries()].filter(([key])=>!['product','project'].includes(key)).map(([key,value])=>`${key.replaceAll('_',' ')}: ${value}`);
    if(textarea)textarea.value=[project?`Project: ${project}`:'',formProduct?`Product: ${formProduct}`:'',formService?`Service: ${formService}`:'',...details].filter(Boolean).join('\n');
    const note=document.createElement('p');
    note.className='form-prefill full';
    note.textContent='Your selected product specification has been carried into this brief. Review it before submitting.';
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
    if(note){note.textContent='Sending your enquiry…';note.classList.remove('form-success')}
    const payload=Object.fromEntries(new FormData(form).entries());
    payload.form_type=form.dataset.inquiryForm;
    payload.page_url=location.href;
    try{
      const response=await fetch('/api/inquiry',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      const result=await response.json().catch(()=>({}));
      if(!response.ok||!result.ok)throw new Error(result.error||'Delivery failed');
      form.reset();
      if(note){note.textContent='Thank you. Your enquiry has been delivered to our sourcing team.';note.classList.add('form-success')}
    }catch(error){
      if(note){note.innerHTML='We could not send the form. Please email <a href="mailto:caro@wigexporter.com">caro@wigexporter.com</a> or contact us on WhatsApp.';note.classList.remove('form-success')}
    }finally{
      if(button)button.disabled=false;
    }
  });
});
