(() => {
  const container = document.getElementById('questionsContainer');
  const addQ = document.getElementById('addQuestion');
  const downloadBtn = document.getElementById('downloadBtn');
  const previewArea = document.getElementById('preview');
  let qCount = 0;

  function makeQuestionCard(data = {}) {
    qCount++;
    const card = document.createElement('div');
    card.className = 'question open';
    card.innerHTML = `
      <div class="question-header">
        <strong>Вопрос ${qCount}</strong>
        <button class="btn-remove" type="button">🗑</button>
      </div>
      <div class="question-body">
        <label>თქვენი კითხვა</label>
        <input class="q-title" type="text" placeholder="Введите текст вопроса" value="${data.title || ''}">

        <label>img:</label>
        <input class="q-img" type="text" placeholder="ლოკალური ან გარე მისამართი" value="${data.img || ''}">

        <label>audio:</label>
        <input class="q-audio" type="text" placeholder="audio.mp3" value="${data.audio || ''}">

        <label>video:</label>
        <input class="q-video" type="text" placeholder="video.mp4" value="${data.video || ''}">

        <label><input type="checkbox" class="q-printanswer" ${data.printAnswer ? 'checked' : ''}> პასუხის გაცემის საშუალება (PrintAnswer)</label>

        <div class="answers-block">
          <label>პასუხის ვარიანტები</label>
          <div class="answers-list"></div>
          <button type="button" class="btn-add add-option">➕ დაამატეთ პასუხი</button>
        </div>
      </div>
    `;
    container.appendChild(card);

    const header = card.querySelector('.question-header');
    header.addEventListener('click', (e) => {
      if (!e.target.classList.contains('btn-remove')) card.classList.toggle('open');
    });

    card.querySelector('.btn-remove').addEventListener('click', () => {
      card.remove();
      rebuildPreview();
    });

    const answersList = card.querySelector('.answers-list');
    const addOptionBtn = card.querySelector('.add-option');
    const printAnswerCheck = card.querySelector('.q-printanswer');

    addOptionBtn.addEventListener('click', () => {
      addAnswerOption(answersList);
      rebuildPreview();
    });

    printAnswerCheck.addEventListener('change', () => {
      const answersBlock = card.querySelector('.answers-block');
      answersBlock.style.display = printAnswerCheck.checked ? 'none' : 'block';
      rebuildPreview();
    });

    card.querySelectorAll('input').forEach(inp => inp.addEventListener('input', rebuildPreview));


  }

  function addAnswerOption(list, data = {}) {
    const item = document.createElement('div');
    item.className = 'answer-item';
    item.innerHTML = `
      <input type="checkbox" class="a-correct" ${data.correct ? 'checked' : ''}>
      <input type="text" class="a-text" placeholder="პასუხის ვარიანტი" value="${data.text || ''}">
      <button type="button" class="btn-remove remove-option">🗑</button>
    `;
    list.appendChild(item);
    item.querySelector('.a-correct').addEventListener('change', rebuildPreview);
    item.querySelector('.a-text').addEventListener('input', rebuildPreview);
    item.querySelector('.remove-option').addEventListener('click', () => {
      item.remove();
      rebuildPreview();
    });
  }

  function gatherData() {
    const meta = {
      filename: document.getElementById('filename').value.trim() || 'quiz',
      duration: document.getElementById('duration').value.trim(),
      randomisation: document.getElementById('randomisation').value.trim(),
      cover: document.getElementById('cover').value.trim(),
      cattype: document.getElementById('cattype').value.trim(),
      quizposition: document.getElementById('quizposition').value.trim()
    };
    const questions = [];
    container.querySelectorAll('.question').forEach(node => {
      const q = {
        title: node.querySelector('.q-title').value.trim(),
        img: node.querySelector('.q-img').value.trim(),
        audio: node.querySelector('.q-audio').value.trim(),
        video: node.querySelector('.q-video').value.trim(),
        printAnswer: node.querySelector('.q-printanswer').checked,
        options: []
      };
      node.querySelectorAll('.answer-item').forEach(opt => {
        const text = opt.querySelector('.a-text').value.trim();
        const correct = opt.querySelector('.a-correct').checked;
        if (text) q.options.push({text, correct});
      });
      questions.push(q);
    });
    return {meta, questions};
  }

  function buildFileText({meta, questions}) {
    const lines = [];
    lines.push('---');
    lines.push(`Duration: ${meta.duration}`);
    lines.push(`Randomisation: ${meta.randomisation}`);
    lines.push(`Cover: ${meta.cover}`);
    lines.push(`CatType: ${meta.cattype}`);
    lines.push(`QuizPosition: ${meta.quizposition}`);
    lines.push('---\n');

    questions.forEach((q, i) => {
      lines.push(`# ${q.title || 'კითხვა ' + (i+1)}`);
      if (q.img) lines.push(`img: ${q.img}`);
      if (q.audio) lines.push(`audio: ${q.audio}`);
      if (q.video) lines.push(`video: ${q.video}`);

      lines.push(`PrintAnswer: ${q.printAnswer ? 'true' : 'false'}`);

      if (!q.printAnswer) {
        q.options.forEach(o => lines.push(`[] ${o.text}`));
      }

      const correct = q.options.filter(o => o.correct).map(o => o.text);
      if (correct.length === 1) lines.push(`ReadAnswer: ${correct[0]}`);
      else if (correct.length > 1) lines.push(`ReadAnswers: ${correct.join(', ')}`);
      lines.push('');
    });

    return lines.join('\n');
  }

  function rebuildPreview() {
    const data = gatherData();
    const text = buildFileText(data);
    previewArea.textContent = text;
  }

  function downloadFile(name, text) {
    const blob = new Blob([text], {type:'text/plain;charset=utf-8'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name.replace(/[^a-zA-Z0-9_\-а-яА-ЯёЁ]/g,'_') + '.md';
    document.body.appendChild(a);
    a.click();
    setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500);
  }

  downloadBtn.addEventListener('click', () => {
    const data = gatherData();
    const text = buildFileText(data);
    downloadFile(data.meta.filename, text);
  });

  addQ.addEventListener('click', () => { makeQuestionCard(); rebuildPreview(); });

  makeQuestionCard({title:'დასვით კითხვა'});
})();

