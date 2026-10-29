/* Combobox de Estados/CRM com lista rolável (DOM e eventos, sem bibliotecas).
   O <select> original permanece como fonte dos valores e validações. */
(function () {
  const widgets = [];
  function close(widget) {
    widget.menu.hidden = true;
    widget.trigger.setAttribute('aria-expanded', 'false');
  }
  function closeAll(except) {
    widgets.forEach(function (widget) {
      if (widget !== except) close(widget);
    });
  }
  function getItems(widget) {
    return Array.from(widget.menu.querySelectorAll('.uf-picker-option'));
  }
  function refresh(widget) {
    const current = Array.from(widget.select.options).find(function (option) {
      return option.value === widget.select.value;
    });
    const label = current ? current.textContent : widget.select.options[0].textContent;
    widget.trigger.querySelector('.uf-picker-value').textContent = label;
    widget.trigger.setAttribute('aria-label', widget.name + ': ' + label);
    widget.trigger.classList.toggle('invalid', !widget.select.checkValidity() && widget.select.dataset.touched === 'true');
    if (widget.select.checkValidity()) widget.trigger.removeAttribute('aria-invalid');
    getItems(widget).forEach(function (item) {
      item.setAttribute('aria-selected', String(item.dataset.value === widget.select.value));
    });
  }
  function open(widget) {
    closeAll(widget);
    widget.menu.hidden = false;
    widget.trigger.setAttribute('aria-expanded', 'true');
    const bounds = widget.trigger.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;
    const availableBelow = vh - bounds.bottom - 12;
    const availableAbove = bounds.top - 12;
    const placeAbove = availableBelow < 190 && availableAbove > availableBelow;
    const available = placeAbove ? availableAbove : availableBelow;
    const height = Math.min(260, Math.max(65, available - 8));
    const width = Math.min(Math.max(bounds.width, 240), Math.max(180, vw - 20));
    const left = Math.max(10, Math.min(bounds.left, vw - width - 10));
    widget.menu.style.width = width + 'px';
    widget.menu.style.maxHeight = height + 'px';
    widget.menu.style.left = left + 'px';
    widget.menu.style.top = (placeAbove ? Math.max(8, bounds.top - height - 6) : bounds.bottom + 6) + 'px';
    const selected = getItems(widget).find(function (item) { return item.dataset.value === widget.select.value; });
    if (selected) selected.scrollIntoView({ block: 'nearest' });
  }
  function choose(widget, value) {
    widget.select.value = value;
    widget.select.dataset.touched = 'true';
    widget.select.dispatchEvent(new Event('input', { bubbles: true }));
    widget.select.dispatchEvent(new Event('change', { bubbles: true }));
    refresh(widget);
    close(widget);
    widget.trigger.focus();
  }
  document.querySelectorAll('select[data-uf-select]').forEach(function (select) {
    const picker = select.closest('.uf-picker');
    const trigger = picker.querySelector('.uf-picker-trigger');
    const menu = picker.querySelector('.uf-picker-list');
    const name = picker.parentElement.querySelector('span').textContent.trim();
    const widget = { select: select, trigger: trigger, menu: menu, name: name };
    widgets.push(widget);
    Array.from(select.options).forEach(function (option) {
      if (!option.value) return;
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'uf-picker-option';
      item.setAttribute('role', 'option');
      item.tabIndex = -1;
      item.dataset.value = option.value;
      item.textContent = option.textContent;
      item.addEventListener('click', function () { choose(widget, item.dataset.value); });
      menu.appendChild(item);
    });
    trigger.addEventListener('click', function () {
      if (menu.hidden) open(widget);
      else close(widget);
    });
    trigger.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') { close(widget); return; }
      if (['ArrowDown','ArrowUp','Home','End'].includes(event.key)) {
        event.preventDefault();
        if (menu.hidden) open(widget);
        const items = getItems(widget);
        const idx = items.findIndex(function (item) { return item.dataset.value === select.value; });
        let next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 :
          Math.max(0, Math.min(items.length - 1, (idx < 0 ? (event.key === 'ArrowDown' ? -1 : 1) : idx) + (event.key === 'ArrowDown' ? 1 : -1)));
        items[next].focus();
        items[next].scrollIntoView({block:'nearest'});
      }
    });
    menu.addEventListener('keydown', function (event) {
      const items = getItems(widget);
      const idx = items.indexOf(document.activeElement);
      if (event.key === 'Escape') { event.preventDefault(); close(widget); trigger.focus(); }
      if (event.key === 'Tab') close(widget);
      if (['ArrowDown','ArrowUp','Home','End'].includes(event.key)) {
        event.preventDefault();
        let next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 :
          Math.max(0, Math.min(items.length-1, idx + (event.key === 'ArrowDown' ? 1 : -1)));
        items[next].focus();
        items[next].scrollIntoView({block:'nearest'});
      }
    });
    select.addEventListener('change', function () { refresh(widget); });
    const form = select.closest('form');
    if (form) form.addEventListener('reset', function () {
      // Executa após o navegador restaurar as opções dos selects.
      setTimeout(function () { refresh(widget); close(widget); }, 0);
    });
    refresh(widget);
  });
  document.addEventListener('pointerdown', function (event) {
    widgets.forEach(function (widget) {
      if (!widget.menu.contains(event.target) && !widget.trigger.contains(event.target)) close(widget);
    });
  });
  document.addEventListener('focusin', function (event) {
    widgets.forEach(function (widget) {
      if (!widget.menu.contains(event.target) && !widget.trigger.contains(event.target)) close(widget);
    });
  });
  window.addEventListener('resize', function () { closeAll(); });
  window.addEventListener('scroll', function (event) {
    if (widgets.some(function (widget) { return widget.menu === event.target; })) return;
    closeAll();
  }, true);
})();
