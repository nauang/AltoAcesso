/* Template A4 do rascunho: DOM, localStorage e impressão nativa do navegador. */
(function () {
  'use strict';
  const error = document.getElementById('document-error');
  const button = document.getElementById('print-prescription');
  const article = document.getElementById('prescription-document');

  function showError(message) {
    error.textContent = message;
    error.hidden = false;
    article.hidden = true;
    button.disabled = true;
  }
  // Esta rota apenas consulta o mesmo rascunho da tela de prescrição.
  if (sessionStorage.getItem('altoacesso-demo-role') !== 'doctor' || !localStorage.getItem('token')) {
    showError('Entre com o perfil médico para acessar este documento.');
    return;
  }
  const draft = loadPrescriptionDraft();
  if (!draft || !draft.patient || !draft.medicine || !draft.frequency ||
      !draft.signature || !draft.signature.data) {
    showError('Nenhum rascunho completo foi encontrado. Volte à prescrição e salve os dados.');
    return;
  }
  const saved = new Date(draft.savedAt);
  if (Number.isNaN(saved.getTime())) {
    showError('A data do rascunho está inválida. Salve novamente a prescrição.');
    return;
  }
  const values = {
    'pdf-saved-date': saved.toLocaleDateString('pt-BR'),
    'pdf-draft-reference': 'AA-RASC-' + saved.getTime().toString(36).toUpperCase(),
    'pdf-patient': draft.patient,
    'pdf-cpf': draft.cpf,
    'pdf-medicine': draft.medicine,
    'pdf-frequency': draft.frequency,
    'pdf-duration': draft.duration,
    'pdf-doctor-name': draft.doctorName || sessionStorage.getItem('altoacesso-doctor-name') || 'Não informado',
    'pdf-doctor-crm': draft.doctorCrm || sessionStorage.getItem('altoacesso-doctor-crm') || 'Não informado'
  };
  Object.keys(values).forEach(function (id) {
    document.getElementById(id).textContent = String(values[id] || '—');
  });
  document.getElementById('pdf-doctor-signature-name').textContent = values['pdf-doctor-name'] + ' · ' + values['pdf-doctor-crm'];
  const image = document.getElementById('pdf-signature');
  image.addEventListener('load', function () { button.disabled = false; });
  image.addEventListener('error', function () {showError('Não foi possível carregar a assinatura do rascunho.');});
  article.hidden = false;
  image.src = draft.signature.data;
  document.title = 'AltoAcesso_Rascunho_' + saved.getFullYear() +
    String(saved.getMonth() + 1).padStart(2, '0') + String(saved.getDate()).padStart(2, '0');
  button.addEventListener('click', function () {
    if (image.complete && image.naturalWidth > 0) window.print();
    else showError('A assinatura ainda não foi carregada. Volte ao rascunho e tente novamente.');
  });
})();
