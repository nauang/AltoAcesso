/* Formulários e telas: manipulação do DOM + addEventListener, eventos, validação. */
function setFeedback(id, message, error) {
  const el = get(id); if (!el) return;
  el.textContent = message;
  el.classList.toggle('error', Boolean(error));
  el.classList.add('inline-feedback');
  el.hidden = false;
}
function formFieldsValid(container) {
  const fields = container.querySelectorAll('input, select, textarea');
  for (const input of fields) {
    if (!input.checkValidity()) {
      input.classList.add('invalid');
      if (input.matches('select[data-uf-select]')) {
        const trigger = input.closest('.uf-picker').querySelector('.uf-picker-trigger');
        input.dataset.touched = 'true';
        trigger.classList.add('invalid');
        trigger.setAttribute('aria-invalid', 'true');
        trigger.focus();
      } else {
        input.reportValidity();
        input.focus();
      }
      return false;
    }
    input.classList.remove('invalid');
  }
  return true;
}
function initLogin() {
  const form = get('login-form'); if (!form) return;
  let selected = 'patient';
  const patientField = document.querySelector('[data-login-patient-fields]');
  const doctorField = document.querySelector('[data-doctor-fields]');
  const cpf = get('login-cpf');
  const crm = get('login-crm');
  const password = get('login-password');

  function updateProfile() {
    const isDoctor = selected === 'doctor';
    patientField.hidden = isDoctor;
    doctorField.hidden = !isDoctor;
    cpf.required = !isDoctor;
    crm.required = isDoctor;
    // Um campo não visível não participa da validação.
    cpf.disabled = isDoctor;
    crm.disabled = !isDoctor;
    document.querySelectorAll('[data-profile]').forEach(function (button) {
      const isSelected = button.dataset.profile === selected;
      button.classList.toggle('selected', isSelected);
      button.setAttribute('aria-pressed', String(isSelected));
    });
    get('login-submit').textContent = 'Entrar como ' + (isDoctor ? 'Médico' : 'Cidadão');
  }

  document.querySelectorAll('[data-profile]').forEach(function (button) {
    button.addEventListener('click', function () {
      selected = button.dataset.profile;
      updateProfile();
    });
  });

  updateProfile();
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!formFieldsValid(form)) return;
    // Senha obrigatória para os dois perfis, sem armazenamento no navegador.
    password.value = '';
    // No login médico, solicitar somente os dígitos do CRM. A UF permanece no cadastro.
    // Sem serviço de autenticação não ocorre verificação real de credenciais.
    sessionStorage.removeItem('altoacesso-doctor-name');
    if (selected === 'doctor') {
      sessionStorage.setItem('altoacesso-doctor-crm', crm.value.trim());
    } else {
      sessionStorage.removeItem('altoacesso-doctor-crm');
    }
    enterDemo(selected);
  });
}
function initRegistration() {
  const choose = get('choose-profile'), form = get('register-form');
  if (!form || !choose) return;
  let role = 'patient', step = 1;
  const stages = {1:'Seus Dados Pessoais',2:'Endereço & Contato',3:'Identificação Profissional'};
  form.noValidate = true;
  function renderStep() {
    document.querySelectorAll('[data-step]').forEach(function (panel) { panel.hidden = Number(panel.dataset.step) !== step; });
    get('register-title').textContent = stages[step];
    document.querySelectorAll('.step').forEach(function (indicator) {
      const number = Number(indicator.id.replace('step-ind-', ''));
      indicator.classList.toggle('active', number === step);
      indicator.classList.toggle('done', number < step);
    });
    get('register-next').textContent = step === (role === 'doctor' ? 3 : 2) ? 'Concluir Cadastro' : 'Prosseguir para Passo ' + (step + 1);
    get('register-feedback').hidden = true;
  }
  document.querySelectorAll('[data-register-role]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      role = btn.dataset.registerRole;
      choose.closest('main').hidden = true;
      get('registration-main').hidden = false;
      // O terceiro passo é exclusivo do médico; mantém a estrutura estática.
      get('step-ind-3').hidden = role !== 'doctor';
      document.querySelector('.step-line[data-show="doctor"]').hidden = role !== 'doctor';
      step = 1; renderStep();
    });
  });
  get('register-back').addEventListener('click', function () {
    if (step > 1) {step--; renderStep();}
    else {get('registration-main').hidden = true; choose.closest('main').hidden = false;}
  });
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const panel = document.querySelector('[data-step="' + step + '"]');
    if (!formFieldsValid(panel)) {setFeedback('register-feedback','Preencha corretamente os campos obrigatórios.',true);return;}
    if (step < (role === 'doctor' ? 3 : 2)) { step++; renderStep(); }
    else {
      // Não salvar dados pessoais, senha ou credenciais profissionais.
      // Um cadastro local não criaria conta válida sem um Back-End.
      form.reset();
      form.hidden = true;
      const stepper = get('registration-main').querySelector('.stepper');
      if (stepper) stepper.hidden = true;
      const success = get('registration-success');
      success.hidden = false;
      success.querySelector('[data-register-outcome]').textContent =
        'Cadastro realizado com sucesso!';

    }
  });
}
function initRecovery() {
  const form = get('recover-form'); if (!form) return;
  const radios = form.querySelectorAll('input[name="method"]');
  radios.forEach(function (radio) {
    radio.addEventListener('change', function () {
      radios.forEach(function (r) {r.closest('label').classList.toggle('selected', r.checked);});
    });
  });
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!formFieldsValid(form)) return;
    const method = form.querySelector('[name="method"]:checked').value;
    get('recovery-feedback').textContent = 'Opção de recuperação por ' + (method === 'sms' ? 'SMS' : 'e-mail') + ' selecionada. O envio de mensagens está indisponível.';
  });
}
function initPrescription() {
  const form = get('prescription-form');
  if (!form) return;
  const cpfInput = get('prescription-cpf');
  const search = document.querySelector('[data-action="find-prescription-patient"]');
  const fileInput = get('doctor-signature-file');
  const submit = get('prescription-submit');
  const confirm = get('prescription-confirm');
  const doctorName = get('prescription-doctor-name');
  const doctorCrm = get('prescription-doctor-crm');
  doctorName.value = sessionStorage.getItem('altoacesso-doctor-name') || 'Marcus Vinícius';
  doctorCrm.value = sessionStorage.getItem('altoacesso-doctor-crm') || 'CRM-SP 12345';
  const error = get('signature-error');
  const result = get('prescription-result');
  let found = false;
  let signature = null;

  function showFileError(message) {
    error.textContent = message;
    error.hidden = !message;
    fileInput.classList.toggle('invalid', Boolean(message));
  }
  function updateSubmit() {
    submit.disabled = !found || !confirm.checked || !signature;
  }
  function updateImagePreview() {
    const preview = get('signature-preview');
    preview.hidden = !signature;
    if (signature) {
      get('signature-image').src = signature.data;
      get('signature-name').textContent = signature.name;
    } else {
      get('signature-image').removeAttribute('src');
      get('signature-name').textContent = '';
    }
    updateSubmit();
  }
  function renderSavedDraft() {
    const saved = loadPrescriptionDraft();
    const panel = get('prescription-saved');
    panel.hidden = !saved;
    if (!saved) {
      get('saved-signature-image').removeAttribute('src');
      return;
    }
    get('saved-prescription-patient').textContent = saved.patient;
    get('saved-prescription-cpf').textContent = saved.cpf;
    get('saved-prescription-med').textContent = saved.medicine;
    get('saved-prescription-frequency').textContent = saved.frequency;
    get('saved-prescription-duration').textContent = saved.duration;
    get('saved-prescription-date').textContent = new Date(saved.savedAt).toLocaleDateString('pt-BR');
    get('saved-prescription-doctor').textContent = saved.doctorName || 'Não informado';
    get('saved-prescription-crm').textContent = saved.doctorCrm || 'Não informado';
    get('saved-signature-image').src = saved.signature.data;
  }

  search.addEventListener('click', function () {
    found = cpfInput.value.trim() === '987.654.321-11';
    get('prescription-patient').textContent = found
      ? 'Paciente encontrado na listagem: Antônio Carlos Souza.'
      : 'Paciente não encontrado. Confira o CPF informado.';
    get('prescription-patient').classList.toggle('error', !found);
    updateSubmit();
  });
  cpfInput.addEventListener('input', function () {
    found = false;
    get('prescription-patient').textContent = 'Clique em Buscar Registro para localizar o paciente.';
    get('prescription-patient').classList.remove('error');
    updateSubmit();
  });
  confirm.addEventListener('change', updateSubmit);

  fileInput.addEventListener('change', function () {
    signature = null;
    updateImagePreview();
    showFileError('');
    const file = fileInput.files[0];
    if (!file) return;
    const typeAndExtensionValid = ['image/png', 'image/jpeg'].includes(file.type) && /\.(png|jpe?g)$/i.test(file.name);
    if (!typeAndExtensionValid) {
      fileInput.value = '';
      showFileError('Selecione uma imagem PNG ou JPG.');
      return;
    }
    if (!file.size || file.size > 300 * 1024) {
      fileInput.value = '';
      showFileError('A imagem deve ter até 300 KB.');
      return;
    }
    const reader = new FileReader();
    reader.addEventListener('load', function () {
      if (fileInput.files[0] !== file) return;
      if (typeof reader.result !== 'string' || !/^data:image\/(png|jpeg);base64,/i.test(reader.result)) {
        showFileError('Não foi possível ler a imagem.');
        return;
      }
      signature = {name:file.name, type:file.type, data:reader.result};
      showFileError('');
      updateImagePreview();
    });
    reader.addEventListener('error', function () {showFileError('Não foi possível abrir o arquivo.');});
    reader.readAsDataURL(file);
  });
  get('signature-remove').addEventListener('click', function () {
    fileInput.value = '';
    signature = null;
    showFileError('');
    updateImagePreview();
  });
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!found || !signature || !confirm.checked || !formFieldsValid(form)) return;
    const draft = {
      patient: 'Antônio Carlos Souza',
      cpf: cpfInput.value.trim(),
      medicine: get('prescription-med').value,
      frequency: get('prescription-frequency').value.trim(),
      duration: get('prescription-duration').value,
      doctorName: doctorName.value.trim(),
      doctorCrm: doctorCrm.value.trim(),
      signature: signature,
      savedAt: new Date().toISOString()
    };
    const ok = savePrescriptionDraft(draft);
    result.textContent = ok
      ? 'Rascunho salvo com a imagem da assinatura anexada.'
      : 'Não foi possível salvar o rascunho. Confira o espaço disponível no navegador.';
    result.classList.toggle('error', !ok);
    result.hidden = false;
    if (ok) renderSavedDraft();
  });
  get('prescription-delete').addEventListener('click', function () {
    if (deletePrescriptionDraft()) {
      renderSavedDraft();
      result.textContent = 'Rascunho excluído deste navegador.';
      result.classList.remove('error');
      result.hidden = false;
    } else {
      result.textContent = 'Não foi possível excluir o rascunho.';
      result.classList.add('error');
      result.hidden = false;
    }
  });
  renderSavedDraft();
}

const demoPatients = [
  {name:'Antônio Carlos Souza',cpf:'987.654.321-11',birth:'14/08/1957',med:'Espironolactona 100mg',next:'28/03/2026'},
  {name:'Maria das Dores Silva',cpf:'123.456.789-00',birth:'02/11/1962',med:'Adalimumabe 40mg',next:'12/04/2026'},
  {name:'Francisca Neves Lima',cpf:'456.789.123-22',birth:'19/05/1954',med:'Rituximabe 500mg',next:'15/04/2026'},
  {name:'José Ribamar Ferreira',cpf:'321.654.987-33',birth:'23/01/1949',med:'Etanercepte 50mg',next:'19/04/2026'}
];
function initRenewal() {
  const form = get('renewal-form'); if (!form) return;
  let selected = profile === 'doctor' ? null : demoPatients[0];
  const finder = document.querySelector('[data-action="find-renewal"]');
  if (finder) finder.addEventListener('click', function () {
    const query = get('renewal-query').value.toLowerCase().trim();
    selected = query ? demoPatients.find(function (p) { return p.name.toLowerCase().includes(query) || p.cpf.includes(query); }) : null;
    const holder = get('renewal-summary-holder');
    holder.hidden = !selected;
    get('renewal-not-found').hidden = Boolean(selected);
    get('renewal-submit').disabled = !selected;
    if (!selected) return;
    const data = [selected.name,selected.cpf,selected.birth,selected.med,'Dr. Marcus Vinícius',selected.next];
    holder.querySelectorAll('strong').forEach(function (el,i) {el.textContent=data[i];});
  });
  const code = get('doctor-code');
  code.addEventListener('input', function () { this.value = this.value.toUpperCase(); });

  form.addEventListener('submit', function(event) {
    event.preventDefault();
    if (!selected) { showMessage('Selecione um paciente antes de continuar.', true); return; }
    if (!formFieldsValid(form)) return;
    const upload = get('renewal-document');
    const file = upload && upload.files.length ? upload.files[0] : null;
    const enteredCode = code.value.trim();
    const error = get('renewal-source-error');
    if (!enteredCode && !file) {
      error.hidden = false;
      code.focus();
      return;
    }
    error.hidden = true;
    if (file) {
      const invalid = localFileError(file);
      if (invalid) { showMessage(invalid, true); return; }
    }
    const request = {
      id: newLocalId(),
      name: selected.name,
      cpf: selected.cpf,
      med: selected.med,
      date: new Date().toISOString(),
      status: 'Salva no navegador',
      kind: 'Renovação',
      hasCode: Boolean(enteredCode)
    };
    const button = get('renewal-submit');
    button.disabled = true;
    saveLocalRequestAndDocument(request, file, function(success, message) {
      button.disabled = false;
      const result = get('renewal-result');
      result.textContent = message;
      result.hidden = false;
      result.classList.toggle('error', !success);
      if (success) {
        code.value = '';
        if (upload) upload.value = '';
        get('renewal-confirm').checked = false;
        const link = document.createElement('a');
        link.href = 'solicitacoes.html';
        link.className = 'button button-secondary';
        link.textContent = 'Ver minhas solicitações';
        result.appendChild(document.createTextNode(' '));
        result.appendChild(link);
      }
    });
  });
}
function initAlerts() {
  const field = get('patient-search'); if (!field) return;
  field.addEventListener('input', function () {
    const q = field.value.toLowerCase().trim(); let count=0;
    document.querySelectorAll('#patients-tbody tr').forEach(function(row) {
      row.hidden = !(row.dataset.patientName.includes(q) || row.dataset.patientCpf.includes(q));
      if (!row.hidden) count++;
    });
    get('patients-empty').hidden = count>0;
  });
  document.querySelectorAll('[data-action="view-patient"]').forEach(function (button) {
    button.addEventListener('click', function () {
      get('patients-list').hidden = true;
      document.querySelector('[data-patient-detail="'+button.dataset.patient+'"]').hidden = false;
    });
  });
  document.querySelectorAll('[data-action="back-patients"]').forEach(function (button) {
    button.addEventListener('click', function () {
      document.querySelectorAll('[data-patient-detail]').forEach(function (section) {section.hidden = true;});
      get('patients-list').hidden = false;
    });
  });
}
initLogin();
initRegistration();
initRecovery();
initPrescription();
initRenewal();
initAlerts();
