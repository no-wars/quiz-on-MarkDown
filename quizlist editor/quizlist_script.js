let quizList = [];

// Рендер редактора
function renderEditor(openIndex = null) {
  const container = document.getElementById('editorContainer');
  container.innerHTML = '';

  quizList.forEach((quiz, index) => {
    const col = document.createElement('div');
    col.classList.add('col-md-6');

    const card = document.createElement('div');
    card.classList.add('card', 'shadow-sm');

    const header = document.createElement('div');
    header.classList.add('card-header', 'd-flex', 'justify-content-between', 'align-items-center');
    header.innerHTML = `<strong>${quiz.title || 'Без названия'}</strong>
                        <button class="btn btn-sm btn-outline-secondary toggle-btn">▼</button>`;

    const body = document.createElement('div');
    body.classList.add('card-body');
    body.style.display = (openIndex === index) ? 'block' : 'none';
    body.innerHTML = `
      <div class="mb-2"><label>ID:</label>
        <input type="text" class="form-control" value="${quiz.id || ''}">
      </div>
      <div class="mb-2"><label>Название:</label>
        <input type="text" class="form-control" value="${quiz.title || ''}">
      </div>
      <div class="mb-2"><label>Файл:</label>
        <input type="text" class="form-control" value="${quiz.file || ''}">
      </div>
      <div class="mb-2"><label>Описание:</label>
        <textarea class="form-control" rows="2">${quiz.description || ''}</textarea>
      </div>
      <div class="mb-2"><label>Обложка (URL):</label>
        <input type="text" class="form-control" value="${quiz.cover || ''}">
        ${quiz.cover ? `<img src="${quiz.cover}" class="img-preview">` : ''}
      </div>
      <div class="mb-2"><label>Позиция:</label>
        <input type="number" class="form-control" value="${quiz.position || 1}">
      </div>
      <button class="btn btn-danger w-100 mt-2 delete-btn">🗑 Удалить тест</button>
    `;

    // Сворачивание
    header.querySelector('.toggle-btn').addEventListener('click', () => {
      body.style.display = body.style.display === 'none' ? 'block' : 'none';
    });

    // Удаление
    body.querySelector('.delete-btn').addEventListener('click', () => {
      if (confirm("Удалить этот тест?")) {
        quizList.splice(index, 1);
        renderEditor();
      }
    });

    // Привязка input
    const inputs = body.querySelectorAll('input, textarea');
    inputs[0].addEventListener('input', e => { quiz.id = e.target.value; updatePreview(); });
    inputs[1].addEventListener('input', e => { quiz.title = e.target.value; updatePreview(); });
    inputs[2].addEventListener('input', e => { quiz.file = e.target.value; updatePreview(); });
    inputs[3].addEventListener('input', e => { quiz.description = e.target.value; updatePreview(); });
    inputs[4].addEventListener('input', e => { quiz.cover = e.target.value; updatePreview(); renderEditor(openIndex); });
    inputs[5].addEventListener('input', e => { quiz.position = parseInt(e.target.value) || 1; updatePreview(); });

    card.appendChild(header);
    card.appendChild(body);
    col.appendChild(card);
    container.appendChild(col);
  });

  updatePreview();
}

// Добавить новый тест
function addQuiz() {
  quizList.push({
    id: "quiz" + (quizList.length + 1),
    title: "Новый тест",
    file: "",
    description: "",
    cover: "",
    position: quizList.length + 1
  });
  renderEditor(quizList.length - 1);
}

// Копировать preview
function copyPreview() {
  navigator.clipboard.writeText(document.getElementById('previewBox').textContent);
  alert("Скопировано в буфер!");
}

// Экспорт файла
function exportFile() {
  updatePreview();
  const blob = new Blob([document.getElementById('previewBox').textContent], { type: 'application/javascript' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'quizlist.js';
  link.click();
}

// Удалить тест
function removeQuiz(index) {
  if (confirm("Удалить этот тест?")) {
    quizList.splice(index, 1);
    renderEditor();
  }
}

// Обновить preview
function updatePreview() {
  // Сортировка по позиции перед выводом
  quizList.sort((a,b) => (a.position||0) - (b.position||0));
  const js = "window.quizList = " + JSON.stringify(quizList, null, 2) + ";";
  document.getElementById('previewBox').textContent = js;
}

// Импорт файла
document.getElementById('importFile').addEventListener('change', function(e){
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      const code = evt.target.result;
      // Исполняем файл как JS, чтобы достать массив
      const func = new Function(code + "\nreturn window.quizList;");
      const imported = func();
      if (!Array.isArray(imported)) throw new Error("quizList не является массивом");
      quizList = imported;
      renderEditor();
    } catch(err) {
      alert("Ошибка при разборе файла: " + err.message);
    }
  };
  reader.readAsText(file);
});

// Изначальный рендер пустой
renderEditor();
