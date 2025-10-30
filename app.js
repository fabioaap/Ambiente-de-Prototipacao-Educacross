/* app.js - comportamento modularizado para enviar_missoes prototype */
(function(){
  // Helpers
  const $ = selector => document.querySelector(selector);
  const $$ = selector => Array.from(document.querySelectorAll(selector));

  function debounce(fn, wait = 150){
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(()=> fn.apply(this,args), wait); };
  }

  function formatDate(iso){
    if(!iso) return '—';
    const [y,m,d] = iso.split('-');
    return `${d}/${m}/${y}`;
  }

  // Drawer elements
  const drawer = $('#drawer');
  const backdrop = $('#backdrop');
  const openDrawerBtn = $('#openDrawer');
  const closeDrawerBtn = $('#closeDrawer');
  const confirmBtn = $('#confirmBtn');
  const cancelBtn = $('#cancelBtn');

  // KPIs / selection
  const kpiMissions = $('#kpiMissions');
  const kpiSchools  = $('#kpiSchools');
  const kpiStudents = $('#kpiStudents');

  // Period
  const useDefault = $('#useDefaultPeriod');
  const startDate  = $('#startDate');
  const endDate    = $('#endDate');
  const badgeStart = $('#badgeStart');
  const badgeEnd   = $('#badgeEnd');
  const periodHint = $('#periodHint');

  // School list container (event delegation)
  const schoolsContainer = document.querySelector('.list[aria-labelledby="schools-title"]');

  // Trackers
  let selectedMissions = 1; // assumido como antes
  // Query checkboxes on init
  function schoolCheckboxes(){ return $$('.school'); }

  function computeKpis(){
    const selected = schoolCheckboxes().filter(cb => cb.checked);
    const totalStudents = selected.reduce((s,cb)=> s + Number(cb.dataset.students||0), 0);
    kpiMissions.textContent = String(selectedMissions);
    kpiSchools.textContent  = String(selected.length);
    kpiStudents.textContent = String(totalStudents);
    validateFooter();
  }

  // Delegation: listen once on container for checkbox changes
  if(schoolsContainer){
    schoolsContainer.addEventListener('change', (e)=>{
      if(e.target && e.target.matches('.school')) computeKpis();
    });
  }

  // Select all / clear (buttons remain by id)
  $('#selectAll')?.addEventListener('click', ()=>{ schoolCheckboxes().forEach(cb=>cb.checked=true); computeKpis(); });
  $('#clearAll')?.addEventListener('click', ()=>{ schoolCheckboxes().forEach(cb=>cb.checked=false); computeKpis(); });

  // Focus management: store opener to return focus
  let lastOpener = null;
  function openDrawer(opener){
    lastOpener = opener || document.activeElement;
    drawer.classList.add('open'); backdrop.classList.add('open');
    drawer.setAttribute('aria-hidden','false');
    backdrop.setAttribute('aria-hidden','false');
    // update aria-expanded on toggles if exist
    if(openDrawerBtn) openDrawerBtn.setAttribute('aria-expanded','true');
    // trap focus (simple)
    trapFocus(drawer);
    computeKpis();
    // give initial focus to first focusable title/button
    setTimeout(()=>{
      const focusable = drawer.querySelector('h2, [tabindex], select, input, button');
      if(focusable && focusable.focus) focusable.focus();
    },10);
  }

  function closeDrawer(){
    drawer.classList.remove('open'); backdrop.classList.remove('open');
    drawer.setAttribute('aria-hidden','true');
    backdrop.setAttribute('aria-hidden','true');
    if(openDrawerBtn) openDrawerBtn.setAttribute('aria-expanded','false');
    releaseFocusTrap();
    // return focus
    if(lastOpener && lastOpener.focus) lastOpener.focus();
  }

  // Simple focus trap implementation
  let previouslyFocused = null;
  function trapFocus(root){
    previouslyFocused = document.activeElement;
    const focusable = root.querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length-1];
    function keyHandler(e){
      if(e.key === 'Tab'){
        if(e.shiftKey){ if(document.activeElement === first){ e.preventDefault(); last.focus(); } }
        else { if(document.activeElement === last){ e.preventDefault(); first.focus(); } }
      } else if(e.key === 'Escape'){ closeDrawer(); }
    }
    root.__focusHandler = keyHandler;
    document.addEventListener('keydown', keyHandler);
  }
  function releaseFocusTrap(){
    if(drawer.__focusHandler) document.removeEventListener('keydown', drawer.__focusHandler);
  }

  // Attach openers/closers
  $$('#openDrawer, [data-open-assistant]').forEach(el=> el.addEventListener('click', (e)=> openDrawer(e.currentTarget)));
  closeDrawerBtn?.addEventListener('click', closeDrawer);
  cancelBtn?.addEventListener('click', closeDrawer);
  backdrop?.addEventListener('click', closeDrawer);

  // Period handling (debounced)
  const DEFAULT_PERIOD = { start: '', end: '' };

  function updatePeriodBadge(){
    const s = startDate.value || (useDefault.checked ? DEFAULT_PERIOD.start : '');
    const e = endDate.value   || (useDefault.checked ? DEFAULT_PERIOD.end   : '');
    badgeStart.textContent = formatDate(s);
    badgeEnd.textContent   = formatDate(e);
  }

  const validateFooter = debounce(function(){
    const schoolsOk  = Number(kpiSchools.textContent)  > 0;
    const missionsOk = Number(kpiMissions.textContent) > 0;
    let s = startDate.value, e = endDate.value;
    if(useDefault.checked){ s = s || DEFAULT_PERIOD.start; e = e || DEFAULT_PERIOD.end; }
    const periodOk = Boolean(s && e && (new Date(s) <= new Date(e)));
    if(!periodOk){ periodHint.textContent = 'Defina Início e Fim para continuar'; periodHint.classList.remove('ok'); }
    else if(new Date(s) > new Date(e)){ periodHint.textContent = 'A data inicial não pode ser maior que a final'; periodHint.classList.remove('ok'); }
    else{ periodHint.textContent = 'Tudo pronto para enviar'; periodHint.classList.add('ok'); }
    confirmBtn.disabled = !(schoolsOk && missionsOk && periodOk);
  }, 120);

  [useDefault, startDate, endDate].forEach(el=>{
    el?.addEventListener('change', ()=>{ updatePeriodBadge(); validateFooter(); });
    el?.addEventListener('input',  ()=>{ updatePeriodBadge(); validateFooter(); });
  });

  // Confirm action (simulate API call with error handling)
  confirmBtn?.addEventListener('click', async ()=>{
    try{
      const payload = {
        missions: selectedMissions,
        schools: schoolCheckboxes().filter(cb=>cb.checked).length,
        students: Number(kpiStudents.textContent),
        period: {
          start: startDate.value || (useDefault.checked ? DEFAULT_PERIOD.start : ''),
          end:   endDate.value   || (useDefault.checked ? DEFAULT_PERIOD.end   : ''),
          useDefault: useDefault.checked
        }
      };
      confirmBtn.disabled = true; const prev = confirmBtn.textContent; confirmBtn.textContent = 'Enviando...';
      // Simulate network call - replace with fetch/axios in real app
      await new Promise((res,rej)=> setTimeout(res, 700));
      confirmBtn.textContent = prev; confirmBtn.disabled = false; closeDrawer();
      alert('Envio em lote iniciado com sucesso.');
    }catch(err){ console.error('Falha no envio', err); alert('Falha ao iniciar envio. Tente novamente.'); confirmBtn.disabled = false; confirmBtn.textContent = 'Confirmar envio'; }
  });

  // Initialize
  (function init(){
    if(DEFAULT_PERIOD.start){ startDate.placeholder = formatDate(DEFAULT_PERIOD.start); }
    if(DEFAULT_PERIOD.end){   endDate.placeholder   = formatDate(DEFAULT_PERIOD.end); }
    updatePeriodBadge();
    computeKpis();
  })();

})();
