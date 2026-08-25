/* ============================================================
   ui.js — element helper, modals, toasts
   ============================================================ */

function el(tag, attrs, kids){
  const parts = tag.split(/(?=[.#])/);
  const node = document.createElement(parts[0] || 'div');
  parts.slice(1).forEach(p => {
    if(p[0] === '.') node.classList.add(p.slice(1));
    else node.id = p.slice(1);
  });
  if(attrs) for(const k in attrs){
    const v = attrs[k];
    if(v === null || v === undefined || v === false) continue;
    if(k === 'text') node.textContent = v;
    else if(k === 'html') node.innerHTML = v;
    else if(k === 'style' && typeof v === 'object') Object.assign(node.style, v);
    else if(k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
    else if(k === 'cls') node.className += ' ' + v;
    else node.setAttribute(k, v);
  }
  (kids || []).forEach(k => { if(k) node.appendChild(typeof k === 'string' ? document.createTextNode(k) : k); });
  return node;
}

function clear(node){ while(node.firstChild) node.removeChild(node.firstChild); return node; }

function toast(msg, bad){
  const t = el('div.toast', { text: msg, cls: bad ? 'bad' : '' });
  document.getElementById('toastRoot').appendChild(t);
  setTimeout(() => t.remove(), bad ? 4200 : 2400);
}

/* modal({title, body(HTMLElement), actions:[{label,cls,onClick(close)}], wide}) */
function modal(opts){
  const root = document.getElementById('modalRoot');
  const back = el('div.modal-back');
  const close = () => { back.remove(); document.removeEventListener('keydown', esc); };
  const esc = e => { if(e.key === 'Escape') close(); };
  document.addEventListener('keydown', esc);
  back.addEventListener('mousedown', e => { if(e.target === back) close(); });

  const box = el('div.modal' + (opts.wide ? '.wide' : ''), {}, [
    el('div.modal-h', {}, [
      el('h3', { text: opts.title || '' }),
      el('button.icon-btn', { text: '✕', title: 'Close', onclick: close })
    ]),
    el('div.modal-b', {}, [opts.body]),
    (opts.actions && opts.actions.length) ? el('div.modal-f', {}, opts.actions.map(a =>
      el('button.btn', { text: a.label, cls: a.cls || '', onclick: () => a.onClick(close) })
    )) : null
  ]);
  back.appendChild(box);
  root.appendChild(back);
  const first = box.querySelector('input,select,textarea');
  if(first) setTimeout(() => first.focus(), 30);
  return close;
}

function confirmDialog(title, message, danger, onYes){
  modal({
    title,
    body: el('p', { text: message, style: { margin: '0', color: 'var(--mist)' } }),
    actions: [
      { label: 'Cancel', onClick: c => c() },
      { label: danger || 'Confirm', cls: 'danger', onClick: c => { c(); onYes(); } }
    ]
  });
}

/* form field builders */
function field(label, input){
  return el('label.field', {}, [el('span', { text: label }), input]);
}
function textInput(value, ph){ return el('input', { type: 'text', value: value || '', placeholder: ph || '' }); }
function subjectSelect(value, allowNone){
  const s = el('select');
  if(allowNone !== false) s.appendChild(el('option', { value: '', text: '— no subject —' }));
  Store.state.subjects.forEach(sub => s.appendChild(el('option', { value: sub.id, text: sub.name })));
  s.value = value || '';
  return s;
}
