/* Máscaras de entrada — JavaScript puro (DOM + evento input, Aulas 12 e 13).
   As máscaras formatam o texto e verificam a estrutura; não validam
   a existência/autenticidade de documentos ou registros profissionais. */
(function () {
  function digits(value, limit) {
    return String(value || '').replace(/\D/g, '').slice(0, limit);
  }
  function cpf(value) {
    const d = digits(value, 11);
    return d.slice(0, 3) + (d.length > 3 ? '.' + d.slice(3, 6) : '') +
      (d.length > 6 ? '.' + d.slice(6, 9) : '') +
      (d.length > 9 ? '-' + d.slice(9, 11) : '');
  }
  function cep(value) {
    const d = digits(value, 8);
    return d.slice(0, 5) + (d.length > 5 ? '-' + d.slice(5) : '');
  }
  function phone(value) {
    const d = digits(value, 11);
    if (!d) return '';
    if (d.length < 3) return '(' + d + (d.length === 2 ? ')' : '');
    const len = d.length > 10 ? 5 : 4;
    const local = d.slice(2);
    return '(' + d.slice(0, 2) + ') ' + local.slice(0, len) +
      (local.length > len ? '-' + local.slice(len) : '');
  }
  function crm(value) {
    const clean = String(value || '').toUpperCase().replace(/[^A-Z0-9\- ]/g, '').trimStart();
    if (!clean) return '';
    if (/^CRM(?:-| |$)/.test(clean)) {
      const rest = clean.slice(3).replace(/^[\s-]*/, '');
      const state = (rest.match(/^[A-Z]{0,2}/) || [''])[0];
      const number = digits(rest.slice(state.length), 8);
      return 'CRM' + (rest.length ? '-' : '') + state + (number ? ' ' + number : '');
    }
    const stateMatch = clean.match(/^([A-Z]{2})[\s-]*([0-9]{1,8})$/);
    if (stateMatch) return 'CRM-' + stateMatch[1] + ' ' + stateMatch[2];
    if (/^[0-9\s]+$/.test(clean)) return digits(clean, 8);
    return clean.slice(0, 20);
  }
  function cpfOrText(value) {
    const v = String(value || '');
    return /^[0-9.\-\s]*$/.test(v) ? cpf(v) : v;
  }
  function format(mask, value) {
    switch (mask) {
      case 'cpf': return cpf(value);
      case 'cep': return cep(value);
      case 'phone': return phone(value);
      case 'digits': return digits(value, 8);
      case 'uf': return String(value || '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2);
      case 'crm': return crm(value);
      case 'cpf-or-email':
        return /^[0-9.\-\s]*$/.test(value) ? cpf(value) : String(value || '');
      case 'cpf-or-name': return cpfOrText(value);
      default: return value;
    }
  }
  function setCursorByDigits(input, old, pos, next) {
    if (pos === old.length) {
      input.setSelectionRange(next.length, next.length);
      return;
    }
    const count = (old.slice(0, pos).match(/[0-9]/g) || []).length;
    if (!count) {
      input.setSelectionRange(0, 0);
      return;
    }
    let position = 0, found = 0;
    for (; position < next.length; position++) {
      if (/\d/.test(next[position])) found++;
      if (found >= count) { position++; break; }
    }
    input.setSelectionRange(position, position);
  }
  document.querySelectorAll('input[data-mask]').forEach(function (input) {
    const mask = input.dataset.mask;
    input.value = format(mask, input.value);
    input.addEventListener('input', function () {
      const before = input.value;
      const selection = input.selectionStart;
      const next = format(mask, before);
      if (next === before) return;
      input.value = next;
      if (selection === null) return;
      // Nos campos numéricos, manter o cursor próximo ao dígito editado.
      if (['cpf', 'cep', 'phone', 'digits'].includes(mask) ||
          (['cpf-or-email', 'cpf-or-name'].includes(mask) && /^[0-9.\-\s]*$/.test(before))) {
        setCursorByDigits(input, before, selection, next);
      } else input.setSelectionRange(next.length, next.length);
    });
    input.addEventListener('blur', function () {
      input.value = format(mask, input.value);
    });
  });
})();
