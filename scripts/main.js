/* AltoAcesso — funções comuns. Aula 11 (funções), Aula 12 (DOM), Aula 13 (eventos),
   Aula 14 (Storage), Aula 15 (JWT didático). Não há autenticação real. */
const DEMO_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIzLCJuYW1lIjoiRW5nLiBDb21wdXRhXHUwMGU3XHUwMGUzbyIsInJvbGUiOiJKV1QiLCJpYXQiOjE3NTk5ODEzMTcsImV4cCI6MTc1OTk4NDkxN30.b1KfcSFInRwYnvRA0Ae5jYuL59KZmCsufPgISNGq0X0';
const page = document.body.dataset.page;
const isIndex = page === 'index.html';
const siteBase = isIndex ? '' : '../';
let profile = sessionStorage.getItem('altoacesso-demo-role') === 'doctor' ? 'doctor' : 'patient';
let documentZoom = 100;

function get(id) { return document.getElementById(id); }
function showMessage(text, error) {
  const box = get('global-msg');
  if (!box) return;
  box.textContent = text;
  box.classList.toggle('error', Boolean(error));
  box.hidden = false;
}
function clearMessage() { const box = get('global-msg'); if (box) box.hidden = true; }
function setRoleVisibility() {
  const isProfessional = profile === 'doctor';
  document.querySelectorAll('[data-show]').forEach(function (element) {
    const type = element.dataset.show;
    element.hidden = (type === 'doctor' && profile !== 'doctor') ||
      (type === 'patient' && profile !== 'patient') ||
      (type === 'professional' && !isProfessional);
  });
  const nm = get('account-name'), rl = get('account-role'), init = get('account-initials');
  if (nm) nm.textContent = profile === 'doctor' ? 'Dr. Marcus Vinícius' : 'Antônio Carlos Souza';
  if (rl) rl.textContent = profile === 'doctor' ? 'Cardiologista' : 'Beneficiário';
  if (init) init.textContent = profile === 'doctor' ? 'DM' : 'AC';
}

/* Barra superior: texto informativo no login e pendências locais após entrar.
   Os números consideram solicitações existentes no Web Storage (Aula 14) e
   os exemplos da interface; não são notificações enviadas por servidor. */
function updateTopBar() {
  const publicText = document.querySelector('[data-bar-public]');
  const privateLink = document.querySelector('[data-bar-private]');
  if (!publicText && !privateLink) return;
  const logged = !isIndex && !['cadastro.html', 'recuperar.html'].includes(page) && tokenLooksReadable();
  if (publicText) publicText.hidden = logged;
  if (!privateLink) return;
  privateLink.hidden = !logged;
  if (!logged) return;
  const examples = EXAMPLE_REQUESTS.map(function (item) { return exampleRequestById(item.id); });
  const requests = examples.concat(localRequests());
  const attention = requests.filter(function (request) {
    if (profile === 'patient') {
      return request.cpf === PATIENT_TEST_CPF && request.status === 'Pendente de Documento';
    }
    return request.status === 'Em Análise' || request.status === 'Salva no navegador';
  });
  const count = attention.length;
  const text = privateLink.querySelector('.gov-notification-text');
  const badge = privateLink.querySelector('.gov-count-badge');
  if (text) {
    if (count === 0) text.textContent = 'Nenhuma pendência';
    else if (profile === 'patient') text.textContent = count === 1 ? '1 correção pendente' : count + ' correções pendentes';
    else text.textContent = count === 1 ? '1 aguardando análise' : count + ' aguardando análise';
  }
  if (badge) {badge.textContent = String(count); badge.hidden = count === 0;}
  privateLink.classList.toggle('has-pending', count > 0);
  privateLink.setAttribute('aria-label', count === 0 ? 'Abrir solicitações. Nenhuma pendência' :
    'Abrir solicitações. ' + count + (profile === 'patient' ? ' correções pendentes' : ' solicitações aguardando análise'));
}

function tokenLooksReadable() {
  // Somente o exemplo exatamente fornecido no Laboratório 06 é aceito.
  // A conferência é local/didática, NÃO representa autenticação segura.
  const token = localStorage.getItem('token');
  const currentRole = sessionStorage.getItem('altoacesso-demo-role');
  if (token !== DEMO_JWT || !['patient', 'doctor'].includes(currentRole)) return false;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
    JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    return true;
  } catch (error) { return false; }
}
function enterDemo(nextRole) {
  if (!['patient', 'doctor'].includes(nextRole)) return;
  profile = nextRole;
  sessionStorage.setItem('altoacesso-demo-role', profile);
  localStorage.setItem('token', DEMO_JWT);
  window.location.href = siteBase + 'pages/painel.html';
}
function logout() {
  localStorage.removeItem('token');
  sessionStorage.removeItem('altoacesso-demo-role');
  sessionStorage.removeItem('altoacesso-doctor-name');
  sessionStorage.removeItem('altoacesso-doctor-crm');
  window.location.href = siteBase + 'index.html';
}
function initShell() {
  if (!isIndex && !['cadastro.html', 'recuperar.html'].includes(page) && !tokenLooksReadable()) {
    window.location.replace('../index.html');
    return;
  }
  if (page === 'prescricao.html' && profile !== 'doctor') {
    window.location.replace('../pages/painel.html');
    return;
  }
  const logged = !isIndex && !['cadastro.html', 'recuperar.html'].includes(page);
  const publicBar = document.querySelector('[data-public]');
  const privateBar = document.querySelector('[data-private]');
  if (publicBar) publicBar.hidden = logged;
  if (privateBar) privateBar.hidden = !logged;
  setRoleVisibility();
  updateTopBar();
  if (page === 'painel.html') {
    const banner = get('guide-banner');
    if (banner) {
      // O guia de solicitação de medicamentos pertence exclusivamente ao cidadão.
      banner.hidden = profile !== 'patient' || localStorage.getItem('altoacesso-guide-dismissed') === 'true';
    }
  }
  if (page === 'renovacao.html' && profile === 'doctor') {
    const summary = get('renewal-summary-holder'); if (summary) summary.hidden = true;
    const submit = get('renewal-submit'); if (submit) submit.disabled = true;
  }
  if (page === 'documentos.html' && profile === 'patient') {
    const panel = document.querySelector('.auditor-card'); if (panel) panel.hidden = true;
  }
}
function eventAction(action, element) {
  if (action === 'menu') {
    const menu = get('account-menu'); if (!menu) return;
    menu.hidden = !menu.hidden;
    element.setAttribute('aria-expanded', String(!menu.hidden));
  } else if (action === 'logout') logout();
  else if (action === 'guide') showMessage('Utilize os cartões para acessar solicitações, renovações e prazos.', false);
  else if (action === 'guide-dismiss') {
    localStorage.setItem('altoacesso-guide-dismissed', 'true'); get('guide-banner').hidden = true;
  } else if (action === 'pickup') {
    get('pickup-modal').hidden = false;
    const close = document.querySelector('[data-action="pickup-close"]'); if (close) close.focus();
  } else if (action === 'pickup-close') get('pickup-modal').hidden = true;
  else if (action === 'zoom-less' || action === 'zoom-more') {
    documentZoom = Math.max(80, Math.min(120, documentZoom + (action === 'zoom-more' ? 10 : -10)));
    const doc = get('medical-document');
    doc.style.transform = 'scale(' + documentZoom / 100 + ')';
    doc.style.transformOrigin = 'top center';
    get('zoom-indicator').textContent = documentZoom + '%';
  } else if (action === 'reminder') {
    element.textContent = 'Lembrete marcado';
    element.disabled = true;
    showMessage('Lembrete marcado nesta página. Nenhuma notificação foi programada.', false);
  } else if (action === 'delete-local-request') {
    if (window.confirm('Excluir esta solicitação e seus documentos deste navegador?')) {
      if (deleteLocalRequest(element.dataset.id)) {renderLocalRequests();renderLocalOrders();showMessage('Solicitação excluída.',false);}
      else showMessage('Não foi possível excluir a solicitação.',true);
    }
  } else if (action === 'delete-local-document') {
    if (window.confirm('Excluir este documento deste navegador?')) {
      if (deleteLocalDocument(element.dataset.id)) {
        renderLocalDocuments(new URLSearchParams(location.search).get('id'));showMessage('Documento excluído.',false);
      } else showMessage('Não foi possível excluir o documento.',true);
    }
  } else if (['approve','correct','reject'].includes(action)) saveDecisionFromPage(action);
  else if (action === 'history') showMessage('Confira as datas de retirada mostradas neste cartão.', false);
  else if (action === 'csv') exportCSV();
  else if (action === 'request-filter') filterRequests();
  else if (action === 'clear-request-dates') {
    const start = get('request-date-start'), end = get('request-date-end');
    if (start) start.value = '';
    if (end) end.value = '';
    updateDateLimits();
    filterRequests();
  }
}
/* Compara datas no formato YYYY-MM-DD (inclusive as duas extremidades).
   Aulas 08 e 13: input date nativo + eventos; sem biblioteca externa. */
function requestDateKey(value) {
  if (typeof value !== 'string') return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return year + '-' + month + '-' + day;
}
function updateDateLimits() {
  const start = get('request-date-start'), end = get('request-date-end');
  if (!start || !end) return;
  start.max = end.value || '';
  end.min = start.value || '';
}
function filterRequests() {
  const q = (get('request-query')?.value || '').toLowerCase().trim();
  const status = get('request-status')?.value || 'Todos os Status';
  const start = get('request-date-start')?.value || '';
  const end = get('request-date-end')?.value || '';
  const invalidDates = Boolean(start && end && start > end);
  const error = get('request-date-error');
  if (error) error.hidden = !invalidDates;
  let count = 0;
  document.querySelectorAll('#requests-tbody tr').forEach(function (row) {
    const inRole = profile !== 'patient' || row.dataset.cpf === PATIENT_TEST_CPF;
    const inSearch = (row.dataset.name || '').includes(q) || (row.dataset.cpf || '').includes(q);
    const inStatus = status === 'Todos os Status' || row.dataset.status === status;
    const date = row.dataset.date || '';
    const inDate = (!start || (date && date >= start)) && (!end || (date && date <= end));
    row.hidden = Boolean(invalidDates || !(inRole && inSearch && inStatus && inDate));
    if (!row.hidden) count++;
  });
  const empty = get('requests-empty');
  if (empty) empty.hidden = count > 0 || invalidDates;
}
function exportCSV() {
  const rows = [['Paciente','CPF','Data da Solicitação','Status']];
  document.querySelectorAll('#requests-tbody tr').forEach(function (r) {
    if (r.hidden) return;
    const name = r.cells[0].querySelector('[data-show="professional"]');
    const patientName = name ? name.textContent.trim() : '';
    rows.push([patientName,r.dataset.cpf,r.cells[2].textContent.trim(),r.dataset.status]);
  });
  const csv = '\uFEFF' + rows.map(function (row) {
    return row.map(function (cell) { return '"' + String(cell).replace(/"/g, '""') + '"'; }).join(';');
  }).join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = 'solicitacoes.csv';
  document.body.appendChild(a); a.click(); a.remove();
  showMessage('Arquivo CSV gerado com os registros visíveis na tabela.', false);
}
document.addEventListener('click', function (event) {
  const button = event.target.closest('[data-action]');
  if (button) { eventAction(button.dataset.action, button); return; }
  if (event.target.id === 'pickup-modal') get('pickup-modal').hidden = true;
});
document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    if (get('pickup-modal')) get('pickup-modal').hidden = true;
    if (get('account-menu')) get('account-menu').hidden = true;
    clearMessage();
  }
});
initShell();
if (page === 'solicitacoes.html') {
  const query = get('request-query'), status = get('request-status');
  const start = get('request-date-start'), end = get('request-date-end');
  if (query) query.addEventListener('input', filterRequests);
  if (status) status.addEventListener('change', filterRequests);
  [start, end].forEach(function (input) {
    if (!input) return;
    input.addEventListener('input', function () { updateDateLimits(); filterRequests(); });
    input.addEventListener('change', function () { updateDateLimits(); filterRequests(); });
  });
  updateDateLimits();
  filterRequests();
}

/* As seis solicitações iniciais também podem receber decisões locais. */
function statusClass(status) {
  if (status === 'Aprovado') return 'status-success';
  if (status === 'Recusado' || status === 'Pendente de Documento') return 'status-danger';
  if (status === 'Em Análise') return 'status-warning';
  return 'status-info';
}
function renderExampleDecisions() {
  document.querySelectorAll('tr[data-sample-id]').forEach(function (row) {
    const request=exampleRequestById(row.dataset.sampleId);
    if (!request) return;
    row.dataset.status=request.status;
    row.dataset.date=requestDateKey(request.date);
    row.dataset.cpf=request.cpf;
    row.dataset.name=request.name.toLowerCase();
    const medicine=row.querySelector('[data-show="patient"]');
    if (medicine) medicine.textContent=request.med;
    const label=row.querySelector('.status');
    if (label) {
      label.className='status '+statusClass(request.status);
      label.textContent=request.status;
      let note=row.querySelector('.review-note');
      if (!note) {
        note=document.createElement('small');
        note.className='review-note';
        label.parentElement.appendChild(note);
      }
      note.textContent=request.review && request.review.reason ? request.review.reason : '';
      note.hidden=!note.textContent;
    }
  });
  if (page==='solicitacoes.html') filterRequests();
}

/* Solicitações e anexos salvos no navegador. */
function createTextCell(value) {
  const cell = document.createElement('td');
  cell.textContent = value;
  return cell;
}
function formatLocalDate(iso) {
  const date = requestDateKey(iso);
  if (!date) return '';
  const parts = date.split('-');
  return parts[2] + '/' + parts[1] + '/' + parts[0];
}
function renderLocalRequests() {
  const tbody = get('requests-tbody');
  if (!tbody) return;
  tbody.querySelectorAll('tr[data-local-id]').forEach(function (row) { row.remove(); });
  localRequests().slice().reverse().forEach(function (request) {
    const tr = document.createElement('tr');
    tr.dataset.localId = request.id;
    tr.dataset.cpf = request.cpf;
    tr.dataset.name = request.name.toLowerCase();
    tr.dataset.status = request.status;
    tr.dataset.date = requestDateKey(request.date);
    const nameCell = document.createElement('td');
    const professional = document.createElement('strong');
    professional.dataset.show = 'professional';
    professional.textContent = request.name;
    const patient = document.createElement('strong');
    patient.dataset.show = 'patient';
    patient.textContent = request.med;
    nameCell.appendChild(professional);
    nameCell.appendChild(patient);
    tr.appendChild(nameCell);
    const cpfCell = createTextCell(request.cpf);
    cpfCell.dataset.show = 'professional';
    tr.appendChild(cpfCell);
    tr.appendChild(createTextCell(formatLocalDate(request.date)));
    const statusCell = document.createElement('td');
    const status = document.createElement('span');
    status.className = 'status ' + statusClass(request.status);
    status.textContent = request.status;
    statusCell.appendChild(status);
    if (request.review && request.review.reason) {
      const note=document.createElement('small');
      note.className='review-note';
      note.textContent=request.review.reason;
      statusCell.appendChild(note);
    }
    tr.appendChild(statusCell);
    const actions = document.createElement('td');
    const open = document.createElement('a');
    open.className = 'button button-primary';
    open.href = 'documentos.html?id=' + encodeURIComponent(request.id);
    open.textContent = 'Ver documentos';
    actions.appendChild(open);
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'button button-ghost small-btn';
    remove.dataset.action = 'delete-local-request';
    remove.dataset.id = request.id;
    remove.textContent = 'Excluir';
    actions.appendChild(remove);
    tr.appendChild(actions);
    tbody.prepend(tr);
  });
  setRoleVisibility();
  filterRequests();
}
/* Os cartões do painel são gerados a partir dos mesmos registros da tabela.
   Isso evita status antigos e evita mostrar pedidos de outros pacientes. */
function renderExampleOrders() {
  const section=document.querySelector('.orders');
  if (!section) return;
  section.querySelectorAll('.order[data-sample-id], .order[data-static-sample]').forEach(function(row){row.remove();});
  EXAMPLE_REQUESTS.forEach(function(example) {
    const request=exampleRequestById(example.id);
    if (profile==='patient' && request.cpf!==PATIENT_TEST_CPF) return;
    const row=document.createElement('div');
    row.className='order';
    row.dataset.sampleId=request.id;
    const dot=document.createElement('i');
    dot.className='dot '+(request.status==='Pendente de Documento'?'orange':request.status==='Em Análise'?'yellow':'blue');
    row.appendChild(dot);
    const details=document.createElement('div');
    const name=document.createElement('strong');
    name.textContent=request.med;
    const subtitle=document.createElement('small');
    subtitle.textContent='Protocolo: '+request.id+' • '+formatLocalDate(request.date)+(profile==='doctor'?' • '+request.name:'');
    details.appendChild(name);details.appendChild(subtitle);
    if (request.review && request.review.reason) {
      const reason=document.createElement('small');
      reason.className='review-note';
      reason.textContent=request.review.reason;
      details.appendChild(reason);
    }
    row.appendChild(details);
    const badge=document.createElement('span');
    badge.className='status '+statusClass(request.status);
    badge.textContent=request.status;
    row.appendChild(badge);
    const link=document.createElement('a');
    link.className='button '+(request.status==='Pendente de Documento'?'button-warning':'button-ghost');
    link.href='documentos.html?sample='+encodeURIComponent(request.id);
    link.textContent=request.status==='Pendente de Documento'?'Ver pendência':'Ver detalhes';
    row.appendChild(link);
    section.appendChild(row);
  });
}
function renderLocalOrders() {
  const box = get('local-orders');
  if (!box) return;
  box.replaceChildren();
  localRequests().filter(function (request) {
    return profile === 'doctor' || request.cpf === PATIENT_TEST_CPF;
  }).forEach(function (request) {
    const row = document.createElement('div'); row.className = 'order';
    const dot = document.createElement('i'); dot.className = 'dot blue'; row.appendChild(dot);
    const details = document.createElement('div');
    const name = document.createElement('strong'); name.textContent = request.med;
    const meta = document.createElement('small');
    meta.textContent = request.id + ' • Salva em ' + formatLocalDate(request.date) + (profile === 'doctor' ? ' • ' + request.name : '');
    details.appendChild(name); details.appendChild(meta);
    if (request.review && request.review.reason) {
      const note=document.createElement('small');note.className='review-note';note.textContent=request.review.reason;
      details.appendChild(note);
    }
    row.appendChild(details);
    const status = document.createElement('span'); status.className = 'status ' + statusClass(request.status);
    status.textContent = request.status; row.appendChild(status);
    const link = document.createElement('a'); link.className = 'button button-ghost';
    link.href = 'documentos.html?id=' + encodeURIComponent(request.id);
    link.textContent = 'Ver documentos'; row.appendChild(link);
    box.appendChild(row);
  });
}
function renderLocalDocuments(requestId) {
  const list = get('saved-documents-list');
  if (!list) return;
  list.replaceChildren();
  const saved = localDocuments().filter(function (d) { return d.requestId === requestId; });
  if (!saved.length) {
    const p = document.createElement('p');p.textContent = 'Nenhum documento anexado.';list.appendChild(p);
  }
  saved.forEach(function (doc) {
    if (!/^data:(application\/pdf|image\/png|image\/jpeg);base64,/i.test(doc.data)) return;
    const row = document.createElement('div');row.className='stored-document-row';
    const name = document.createElement('strong');name.textContent=doc.name;row.appendChild(name);
    const size=document.createElement('small');size.textContent = Math.ceil(doc.size/1024) + ' KB';row.appendChild(size);
    const link=document.createElement('a');link.className='button button-secondary';
    link.href=doc.data;link.download=doc.name;link.textContent='Baixar';row.appendChild(link);
    if (doc.type.startsWith('image/')) {
      const image=document.createElement('img');image.src=doc.data;image.alt=doc.name;
      image.className='stored-document-preview';image.hidden=true;
      const preview=document.createElement('button');preview.type='button';preview.className='button button-ghost';preview.textContent='Visualizar';
      preview.addEventListener('click',function(){image.hidden=!image.hidden;preview.textContent=image.hidden?'Visualizar':'Ocultar';});
      row.appendChild(preview);row.appendChild(image);
    }
    const remove=document.createElement('button');remove.type='button';remove.className='button button-ghost';
    remove.textContent='Excluir';remove.dataset.action='delete-local-document';remove.dataset.id=doc.id;
    row.appendChild(remove);list.appendChild(row);
  });
}
/* O visualizador utiliza o parâmetro id (registro criado) ou sample (exemplo). */
function currentDecisionTarget() {
  const params=new URLSearchParams(location.search);
  const id=params.get('id');
  const sample=params.get('sample');
  if (id) return {id:id,kind:'local'};
  return {id:sample||'EX-2',kind:'sample'};
}
function currentRequest() {
  const target=currentDecisionTarget();
  return requestForDecision(target.id,target.kind);
}
function updateDecisionDetails(request) {
  if (!request) return;
  const fullName=request.name || '';
  const initials=fullName.trim().split(/\s+/).slice(0,2).map(function(word){return word[0]||'';}).join('').toUpperCase();
  if (get('detail-patient-name')) get('detail-patient-name').textContent=fullName;
  if (get('detail-patient-initials')) get('detail-patient-initials').textContent=initials;
  if (get('detail-patient-extra')) get('detail-patient-extra').textContent='CPF: '+request.cpf;
  if (get('detail-protocol')) get('detail-protocol').textContent=request.id;
  if (get('detail-medication')) get('detail-medication').textContent=request.med;
  if (get('detail-unit')) get('detail-unit').textContent='—';
  if (get('saved-request-status')) get('saved-request-status').textContent=request.status;
  const summary=get('detail-status-summary');
  if(summary){
    summary.textContent='Status: '+request.status+(request.review && request.review.reason ? ' — '+request.review.reason : '');
  }
  if (get('model-name')) get('model-name').textContent=fullName;
  if (get('model-cpf')) get('model-cpf').textContent=request.cpf;
  if (get('model-med')) get('model-med').textContent=request.med;
  if (get('model-sus')) get('model-sus').textContent='Não informado';
  if (get('model-dose')) get('model-dose').textContent='Conforme orientação médica';
  if (get('model-duration')) get('model-duration').textContent='Não informado';
  const current=get('decision-current-status');
  if(current) current.textContent='Status atual: '+request.status;
  const reason=get('review-reason');
  const date=get('review-date');
  if(reason){
    reason.hidden=!(request.review && request.review.reason);
    reason.textContent=request.review && request.review.reason ? 'Observação: '+request.review.reason : '';
  }
  if(date){
    date.hidden=!(request.review && request.review.reviewedAt);
    date.textContent=!date.hidden ? 'Última atualização: '+formatLocalDate(request.review.reviewedAt) : '';
  }
  const feedback=get('decision-result');
  if (feedback) feedback.hidden=true;
}
function saveDecisionFromPage(action) {
  if(page!=='documentos.html' || profile!=='doctor') return;
  const target=currentDecisionTarget();
  const request=currentRequest();
  if(!request){showMessage('Solicitação não encontrada.',true);return;}
  const status={approve:'Aprovado', correct:'Pendente de Documento',reject:'Recusado'}[action];
  const reasonField=get('decision-text');
  const reason=(reasonField ? reasonField.value : '').trim();
  if((action==='correct'||action==='reject') && !reason){
    showMessage('Informe a justificativa antes de solicitar correção ou recusar.',true);
    if(reasonField) reasonField.focus();
    return;
  }
  if(!window.confirm('Confirmar a alteração para "'+status+'" nesta solicitação?')) return;
  const saved=saveRequestDecision(target.id,target.kind,status,reason);
  if(!saved){showMessage('Não foi possível salvar a decisão no navegador.',true);return;}
  if(reasonField) reasonField.value='';
  updateDecisionDetails(currentRequest());
  const feedback=get('decision-result');
  if(feedback){feedback.textContent='Solicitação atualizada: '+status+'.';feedback.hidden=false;}
  showMessage('Status salvo com sucesso.',false);
}
function initLocalDocuments() {
  const panel=get('saved-request');
  if(!panel) return;
  const target=currentDecisionTarget();
  const request=currentRequest();
  if(!request) {
    showMessage('Solicitação não encontrada.',true);
    document.querySelector('.auditor-card').hidden=true;
    return;
  }
  if(profile==='patient' && request.cpf!==PATIENT_TEST_CPF){
    window.location.replace('solicitacoes.html');return;
  }
  updateDecisionDetails(request);
  if(target.kind==='local') {
    document.body.classList.add('has-local-request');
    const originalDocument=get('medical-document');if(originalDocument) originalDocument.hidden=true;
    const zoomButtons=document.querySelector('.document-heading > div');if(zoomButtons)zoomButtons.hidden=true;
  }
  panel.hidden=false;
  get('saved-request-title').textContent='Solicitação '+request.id;
  get('saved-request-patient').textContent=request.name;
  get('saved-request-medicine').textContent=request.med;
  get('saved-request-date').textContent=formatLocalDate(request.date);
  renderLocalDocuments(request.id);
  const form=get('add-local-document');
  form.addEventListener('submit',function(event){
    event.preventDefault();
    const input=get('add-document-file');
    const file=input.files[0];
    readLocalFile(file,request.id,function(doc,error){
      const result=get('saved-document-feedback');
      if(error){result.textContent=error;result.hidden=false;result.classList.add('error');return;}
      if(!saveLocalDocument(doc)){
        result.textContent='Sem espaço no navegador para armazenar o documento.';
        result.classList.add('error');
      } else {
        let msg='Documento salvo no navegador.';
        if(currentRequest().status==='Pendente de Documento'){
          if(resubmitRequest(request.id,target.kind)){
            msg='Documento salvo. Solicitação retornou para Em Análise.';
            updateDecisionDetails(currentRequest());
          }
        }
        result.textContent=msg;result.classList.remove('error');
        input.value='';renderLocalDocuments(request.id);
      }
      result.hidden=false;
    });
  });
}

if (page === 'solicitacoes.html') {renderExampleDecisions(); renderLocalRequests();}
if (page === 'painel.html') {renderExampleOrders();renderLocalOrders();}
if (page === 'documentos.html') initLocalDocuments();


/* Aulas 12–14: atualização no mesmo navegador sem Back-End.
   O evento storage é disparado nas OUTRAS abas da mesma origem. */
function refreshRequestScreens() {
  updateTopBar();
  if (page==='solicitacoes.html') {
    renderExampleDecisions();
    renderLocalRequests();
  }
  if (page==='painel.html') {
    renderExampleOrders();
    renderLocalOrders();
  }
  if (page==='documentos.html') {
    const target=currentDecisionTarget();
    const request=currentRequest();
    if (request && (profile==='doctor' || request.cpf===PATIENT_TEST_CPF)) {
      updateDecisionDetails(request);
      renderLocalDocuments(request.id);
    }
  }
}
document.addEventListener('altoacesso-requests-updated', refreshRequestScreens);
window.addEventListener('storage', function (event) {
  if ([REQUESTS_KEY,DOCUMENTS_KEY,EXAMPLE_DECISIONS_KEY].includes(event.key) || event.key===null) {
    refreshRequestScreens();
  }
});
window.addEventListener('pageshow', function (event) {
  if (event.persisted) refreshRequestScreens();
});

/* Ao retornar a uma aba, sincronize os status salvos em outra aba. */
window.addEventListener('focus', refreshRequestScreens);
