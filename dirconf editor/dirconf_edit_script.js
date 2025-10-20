let dirConfig = [];

function renderEditor(openIndex = null) {
  const container = document.getElementById('editorContainer');
  container.innerHTML = '';

  dirConfig.forEach((dir, index) => {
    const col = document.createElement('div');
    const section = document.createElement('div');
    section.classList.add('category-block', 'mb-3');

    const header = document.createElement('div');
    header.classList.add('category-header');
    header.innerHTML = `
      <div class="d-flex justify-content-between align-items-center bg-light p-2 rounded">
        <strong>${dir.name || 'დაუსახელებელი'}</strong>
        <button class="btn btn-sm btn-outline-secondary toggle-btn">▼</button>
      </div>
    `;

    const body = document.createElement('div');
    body.classList.add('category-body');
    body.style.display = (openIndex === index) ? 'block' : 'none';
    body.innerHTML = `
      <div class="mb-2">
        <label>დასახელება:</label>
        <input type="text" class="form-control name-input" value="${dir.name || ''}">
      </div>
      <div class="mb-2">
        <label>icon-ის ბმული:</label>
        <input type="text" class="form-control icon-input" value="${dir.icon?.src || ''}">
      </div>
      <div class="mb-2">
        <label>ფერი / გრადიენტი:</label><br>
        <div id="color-start-${index}" class="gradient-box"></div>
        <div id="color-end-${index}" class="gradient-box"></div>
        <div class="mt-2"><small class="text-muted">აირჩიეთ ორი გრადიენტი</small></div>
      </div>
      <div class="mb-2">
        <label>პოზიცია:</label>
        <input type="number" class="form-control pos-input" value="${dir.position || 1}">
      </div>
      <div class="mb-2">
        <label>სტატუსი:</label>
        <select class="form-select status-input">
          <option value="show" ${dir.status === 'show' ? 'selected' : ''}>show</option>
          <option value="hidden" ${dir.status === 'hidden' ? 'selected' : ''}>hidden</option>
        </select>
      </div>
      <div class="mb-2">
        <label>საფეხური:</label>
        ${dir.levels.map((lvl, i) => `
          <div class="input-group mb-1">
            <input type="text" class="form-control level-name" value="${lvl.name}">
            <input type="text" class="form-control level-link" value="${lvl.link}">
          </div>`).join('')}
      </div>
      <div class="text-end">
        <button class="delete-btn">კატეგორიის წაშლა</button>
      </div>
    `;

    // Кнопка сворачивания
    header.querySelector('.toggle-btn').addEventListener('click', () => {
      body.style.display = body.style.display === 'none' ? 'block' : 'none';
    });

    // Кнопка удаления
    body.querySelector('.delete-btn').addEventListener('click', () => {
      if (confirm(`კატეგორიის წაშლა "${dir.name}"?`)) {
        dirConfig.splice(index, 1);
        renderEditor();
      }
    });

    col.appendChild(header);
    col.appendChild(body);
    container.appendChild(col);

    bindInputs(body, dir, index);
  });

  updatePreview();
}

function bindInputs(body, dir, index) {
  body.querySelector('.name-input').oninput = e => {
    dir.name = e.target.value;
    updatePreview();
  };
  body.querySelector('.icon-input').oninput = e => {
    dir.icon.src = e.target.value;
    updatePreview();
  };
  body.querySelector('.pos-input').oninput = e => {
    dir.position = parseInt(e.target.value) || 1;
    updatePreview();
  };
  body.querySelector('.status-input').onchange = e => {
    dir.status = e.target.value;
    updatePreview();
  };
  body.querySelectorAll('.level-name').forEach((input, i) => {
    input.oninput = e => {
      dir.levels[i].name = e.target.value;
      updatePreview();
    };
  });
  body.querySelectorAll('.level-link').forEach((input, i) => {
    input.oninput = e => {
      dir.levels[i].link = e.target.value;
      updatePreview();
    };
  });

  const startEl = body.querySelector(`#color-start-${index}`);
  const endEl = body.querySelector(`#color-end-${index}`);

  dir.colorStart = dir.colorStart || '#6f42c1';
  dir.colorEnd = dir.colorEnd || '#ffffff';

  const pickrStart = Pickr.create({
    el: startEl,
    theme: 'classic',
    default: dir.colorStart,
    components: { preview: true, hue: true, interaction: { input: true, save: true } }
  });
  const pickrEnd = Pickr.create({
    el: endEl,
    theme: 'classic',
    default: dir.colorEnd,
    components: { preview: true, hue: true, interaction: { input: true, save: true } }
  });

  pickrStart.on('change', c => {
    dir.colorStart = c.toHEXA().toString();
    dir.color = `linear-gradient(45deg, ${dir.colorStart}, ${dir.colorEnd})`;
    updatePreview();
  });

  pickrEnd.on('change', c => {
    dir.colorEnd = c.toHEXA().toString();
    dir.color = `linear-gradient(45deg, ${dir.colorStart}, ${dir.colorEnd})`;
    updatePreview();
  });
}

function updatePreview() {
  document.getElementById('previewBox').textContent =
    `const dirConfig = ${JSON.stringify(dirConfig, null, 2)};\n\ndirConfig.sort((a, b) => (a.position || 0) - (b.position || 0));`;
}

function addCategory() {
  dirConfig.push({
    name: "Новая категория",
    color: "#6c757d",
    icon: { type: "img", src: "" },
    levels: [
      { name: "დამწყები", link: "" },
      { name: "საშუალო", link: "" },
      { name: "რთული", link: "" }
    ],
    position: dirConfig.length + 1,
    status: "show",
    colorStart: "#6f42c1",
    colorEnd: "#ffffff"
  });
  renderEditor(dirConfig.length - 1); // новая открыта
}

function exportConfig() {
  const blob = new Blob(
    [document.getElementById('previewBox').textContent],
    { type: 'application/javascript' }
  );
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'dirconf.js';
  a.click();
}

function copyPreview() {
  const text = document.getElementById('previewBox').textContent;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector('.copy-btn');
    btn.textContent = 'Copied!';
    setTimeout(() => (btn.textContent = 'Copy'), 1200);
  });
}

document.getElementById('importFile').addEventListener('change', function(e){
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      let text = evt.target.result;
      const match = text.match(/const\s+dirConfig\s*=\s*(\[[\s\S]*?\])\s*;/);
      if (!match) throw new Error("Не найден массив категорий в файле");
      let imported = JSON.parse(match[1]);
      if (Array.isArray(imported)) {
        dirConfig = imported;
        renderEditor(); // всё свёрнуто после импорта
      } else alert("Ошибка: массив категорий не найден");
    } catch(err) {
      alert("Ошибка при разборе файла: "+err.message);
    }
  };
  reader.readAsText(file);
});
