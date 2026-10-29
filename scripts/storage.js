/* Persistência local de solicitações e anexos, usando a Web Storage API (Aula 14).
   Os registros só existem neste navegador e não são enviados a um servidor. */
const PATIENT_TEST_CPF = '987.654.321-11';
const REQUESTS_KEY = 'altoacesso-solicitacoes-v1';
const DOCUMENTS_KEY = 'altoacesso-documentos-v1';
const MAX_DOCUMENT_BYTES = 750 * 1024;
const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

function storedList(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(value) ? value : [];
  } catch (error) { return []; }
}
function localRequests() { return storedList(REQUESTS_KEY); }
function localDocuments() { return storedList(DOCUMENTS_KEY); }
/* Em outras abas da mesma origem, o navegador emite 'storage'.
   Para a aba atual, o sistema emite um evento simples após gravar. */
function notifyRequestChange() {
  document.dispatchEvent(new Event('altoacesso-requests-updated'));
}

function localRequestById(id) {
  return localRequests().find(function (request) { return request.id === id; });
}
function saveLocalRequest(request) {
  try {
    const all = localRequests();
    all.unshift(request);
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(all));
    notifyRequestChange();
    return true;
  } catch (error) { return false; }
}
function saveLocalDocument(documentRecord) {
  try {
    const all = localDocuments();
    all.unshift(documentRecord);
    localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(all));
    notifyRequestChange();
    return true;
  } catch (error) { return false; }
}
function deleteLocalDocument(id) {
  try {
    localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(localDocuments().filter(function (doc) { return doc.id !== id; })));
    notifyRequestChange();
    return true;
  } catch (error) { return false; }
}
function deleteLocalRequest(id) {
  const oldRequests = localStorage.getItem(REQUESTS_KEY);
  const oldDocuments = localStorage.getItem(DOCUMENTS_KEY);
  try {
    localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(localDocuments().filter(function (doc) { return doc.requestId !== id; })));
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(localRequests().filter(function (req) { return req.id !== id; })));
    notifyRequestChange();
    return true;
  } catch (error) {
    try { if (oldRequests !== null) localStorage.setItem(REQUESTS_KEY, oldRequests); if (oldDocuments !== null) localStorage.setItem(DOCUMENTS_KEY, oldDocuments); } catch (ignored) {}
    return false;
  }
}
function newLocalId() { return 'LOCAL-' + Date.now().toString(36) + '-' + Math.floor(Math.random() * 100000).toString(36); }
function localFileError(file) {
  if (!file) return 'Selecione um arquivo.';
  if (!ALLOWED_DOCUMENT_TYPES.includes(file.type) || !/\.(pdf|png|jpe?g)$/i.test(file.name)) return 'Selecione um arquivo PDF, JPG ou PNG.';
  if (!file.size || file.size > MAX_DOCUMENT_BYTES) return 'O arquivo deve ter até 750 KB.';
  return '';
}
function readLocalFile(file, requestId, done) {
  const invalid = localFileError(file);
  if (invalid) { done(null, invalid); return; }
  const reader = new FileReader();
  reader.addEventListener('load', function () {
    if (typeof reader.result !== 'string' || !/^data:(application\/pdf|image\/png|image\/jpeg);base64,/i.test(reader.result)) {
      done(null, 'Não foi possível ler o arquivo selecionado.'); return;
    }
    done({id:newLocalId(), requestId:requestId, name:file.name, type:file.type, size:file.size, data:reader.result, createdAt:new Date().toISOString()}, null);
  });
  reader.addEventListener('error', function () { done(null, 'O arquivo não pôde ser lido.'); });
  reader.readAsDataURL(file);
}
function saveLocalRequestAndDocument(request, file, done) {
  function finish(documentRecord) {
    if (documentRecord && !saveLocalDocument(documentRecord)) {
      done(false, 'Não há espaço suficiente no navegador para armazenar o documento.'); return;
    }
    if (!saveLocalRequest(request)) {
      if (documentRecord) deleteLocalDocument(documentRecord.id);
      done(false, 'Não foi possível salvar a solicitação. Verifique o espaço disponível.'); return;
    }
    done(true, 'Solicitação salva com sucesso neste navegador.');
  }
  if (!file) { finish(null); return; }
  readLocalFile(file, request.id, function (doc, error) {
    if (error) { done(false, error); return; }
    finish(doc);
  });
}


/* Decisões de aprovação, correção e recusa são persistidas somente neste navegador.
   Não são decisões oficiais nem fornecem controle de acesso seguro. */
const EXAMPLE_DECISIONS_KEY = 'altoacesso-decisoes-exemplo-v1';
const EXAMPLE_REQUESTS = [
  {id:'EX-1', name:'Maria das Dores Silva', cpf:'123.456.789-00', med:'Adalimumabe 40mg', date:'2026-03-24', status:'Em Análise'},
  {id:'EX-2', name:'Antônio Carlos Souza', cpf:'987.654.321-11', med:'Espironolactona 100mg', date:'2026-03-22', status:'Aprovado'},
  {id:'EX-3', name:'Francisca Neves Lima', cpf:'456.789.123-22', med:'Rituximabe 500mg', date:'2026-03-20', status:'Pendente de Documento'},
  {id:'EX-4', name:'José Ribamar Ferreira', cpf:'321.654.987-33', med:'Etanercepte 50mg', date:'2026-03-19', status:'Aprovado'},
  {id:'EX-5', name:'Geraldo Alencar Melo', cpf:'789.123.456-44', med:'Metotrexato 25mg', date:'2026-03-18', status:'Em Análise'},
  {id:'EX-6', name:'Tereza Costa Mendes', cpf:'654.321.789-55', med:'Insulina Glargina 100 UI/ml', date:'2026-03-15', status:'Aprovado'}
];
function exampleDecisions() {
  try {
    const value = JSON.parse(localStorage.getItem(EXAMPLE_DECISIONS_KEY) || '{}');
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  } catch (error) { return {}; }
}
function exampleRequestById(id) {
  const original = EXAMPLE_REQUESTS.find(function (request) { return request.id === id; });
  if (!original) return null;
  const decision = exampleDecisions()[id];
  return Object.assign({}, original, decision || {});
}
function requestForDecision(id, kind) {
  return kind === 'sample' ? exampleRequestById(id) : localRequestById(id);
}
function saveRequestDecision(id, kind, status, reason) {
  if (!['Aprovado','Pendente de Documento','Recusado'].includes(status)) return false;
  const request = requestForDecision(id,kind);
  if (!request) return false;
  const review = {status:status,reason:reason,reviewedAt:new Date().toISOString()};
  try {
    if (kind === 'sample') {
      const updated = exampleDecisions();
      updated[id] = {status:status, review:review};
      localStorage.setItem(EXAMPLE_DECISIONS_KEY, JSON.stringify(updated));
    } else {
      const all = localRequests();
      const index = all.findIndex(function (value) { return value.id === id; });
      if (index < 0) return false;
      all[index].status = status;
      all[index].review = review;
      localStorage.setItem(REQUESTS_KEY, JSON.stringify(all));
    }
    notifyRequestChange();
    return true;
  } catch (error) {return false;}
}
/* Reenvio após correção: vale para pedidos novos e para registros de exemplo. */
function resubmitRequest(id, kind) {
  const request=requestForDecision(id,kind);
  if (!request || request.status !== 'Pendente de Documento') return false;
  const review={status:'Em Análise',reason:'Documento complementar recebido.',reviewedAt:new Date().toISOString()};
  try {
    if (kind==='sample') {
      const updated=exampleDecisions();
      updated[id]={status:'Em Análise',review:review};
      localStorage.setItem(EXAMPLE_DECISIONS_KEY,JSON.stringify(updated));
    } else {
      const all=localRequests();
      const index=all.findIndex(function (entry){return entry.id===id;});
      if(index<0)return false;
      all[index].status='Em Análise';
      all[index].review=review;
      localStorage.setItem(REQUESTS_KEY,JSON.stringify(all));
    }
    notifyRequestChange();
    return true;
  } catch(error){return false;}
}
function resubmitLocalRequest(id) { return resubmitRequest(id,'local'); }


/* Rascunho de prescrição com imagem de assinatura anexada (não é assinatura
   digital verificada). Limitado ao navegador atual e a dados fictícios. */
const PRESCRIPTION_DRAFT_KEY = 'altoacesso-rascunho-prescricao-v1';
function loadPrescriptionDraft() {
  try {
    const draft = JSON.parse(localStorage.getItem(PRESCRIPTION_DRAFT_KEY) || 'null');
    if (!draft || !draft.signature || typeof draft.signature.data !== 'string') return null;
    if (!/^data:image\/(png|jpeg);base64,/i.test(draft.signature.data)) return null;
    return draft;
  } catch (error) { return null; }
}
function savePrescriptionDraft(draft) {
  try {
    localStorage.setItem(PRESCRIPTION_DRAFT_KEY, JSON.stringify(draft));
    return true;
  } catch (error) { return false; }
}
function deletePrescriptionDraft() {
  try {
    localStorage.removeItem(PRESCRIPTION_DRAFT_KEY);
    return true;
  } catch (error) { return false; }
}
