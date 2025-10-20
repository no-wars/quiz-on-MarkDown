function trim(s){ return s==null ? '' : String(s).trim(); }
function eq(a,b){ return String(a||'').trim().toLowerCase() === String(b||'').trim().toLowerCase(); }
function parseDurationToSeconds(str) {
  if (!str) return 0;
  const v = String(str).trim().toLowerCase();
  if (v === "0" || v === "0m" || v === "0h" || v === "0s") return 0;
  const hMatch = v.match(/(\d+)\s*h/);
  const mMatch = v.match(/(\d+)\s*m/);
  const sMatch = v.match(/(\d+)\s*s/);
  const hours = hMatch ? parseInt(hMatch[1], 10) : 0;
  const minutes = mMatch ? parseInt(mMatch[1], 10) : 0;
  const seconds = sMatch ? parseInt(sMatch[1], 10) : 0;
  const total = hours * 3600 + minutes * 60 + seconds;
  if (total > 0) return total;
  if (!isNaN(Number(v))) return Math.round(Number(v) * 60);
  return 0;
}

function parseQuizMd(text){
  const lines = text.replace(/\r\n/g,'\n').split('\n');
  const result = {meta:{}, questions:[]};
  let i = 0;
  if(lines[i] && lines[i].trim() === '---'){
    i++;
    while(i < lines.length && lines[i].trim() !== '---'){
      const line = lines[i];
      const m = line.match(/^(\w+):\s*(.*)$/);
      if(m) result.meta[m[1]] = m[2];
      i++;
    }
    if(i < lines.length && lines[i].trim() === '---') i++;
  }
  let current = null;
  for(; i < lines.length; i++){
    const raw = lines[i];
    const line = raw.trim();
    if(!line) continue;
    if(/^#+\s*/.test(line)){
      if(current) result.questions.push(current);
      current = { title: line.replace(/^#+\s*/,'').trim(), img:'', audio:'', video:'', options:[], correct:[], printAnswer:false };
      continue;
    }
    if(!current) continue;
    if(line.startsWith('img:')) current.img = trim(line.slice(4));
    else if(line.startsWith('audio:')) current.audio = trim(line.slice(6));
    else if(line.startsWith('video:')) current.video = trim(line.slice(6));
    else if(line.startsWith('PrintAnswer:')) current.printAnswer = /true/i.test(line.split(':').slice(1).join(':'));
    else if(line.startsWith('[]')) current.options.push(trim(line.slice(2)));
    else if(line.startsWith('ReadAnswer:')) {
      const val = trim(line.split(':').slice(1).join(':')); if(val) current.correct = [val];
    }
    else if(line.startsWith('ReadAnswers:')) {
      const val = line.split(':').slice(1).join(':'); current.correct = val.split(',').map(s=>trim(s)).filter(Boolean);
    }
  }
  if(current) result.questions.push(current);
  result.questions.forEach(q=>{
    q.correctNormalized = (q.correct || []).map(s=>trim(s));
    q.multiple = (q.correctNormalized.length > 1);
  });
  return result;
}

const listEl = document.getElementById('list');
const lobby = document.getElementById('lobby');
const runner = document.getElementById('runner');
const quizMetaEl = document.getElementById('quizMeta');
const qTitleEl = document.getElementById('qTitle');
const mediaEl = document.getElementById('media');
const optionsEl = document.getElementById('options');
const timerEl = document.getElementById('timer');
const printHintEl = document.getElementById('printHint');
const feedbackEl = document.getElementById('feedback');
const finalEl = document.getElementById('final');
const scoreSummaryEl = document.getElementById('scoreSummary');
const nextBtn = document.getElementById('nextBtn');
const quitBtn = document.getElementById('quitBtn');
const retakeBtn = document.getElementById('retakeBtn');
const backToListBtn = document.getElementById('backToListBtn');

let quizData = null;
let questions = [];
let currentIndex = 0;
let userAnswers = [];
let score = 0;
let timerSeconds = 0;
let timerInterval = null;

/* ======= Рендер списка квизов ======= */
function renderList(){
  listEl.innerHTML = '';
  if(!window.quizList || !Array.isArray(window.quizList)){ listEl.innerHTML = '<div class="small">Нет квизов (quizlist.js не найден или пуст).</div>'; return;}
  window.quizList.sort((a,b)=> (a.position||0)-(b.position||0)).forEach(q=>{
    const card = document.createElement('div'); card.className='card';
    card.innerHTML = `<img src="${q.cover||''}" alt=""><div><h4>${q.title}</h4><div class="small">${q.description||''}</div></div>`;
    card.addEventListener('click', ()=> startLoadQuiz(q.file));
    listEl.appendChild(card);
  });
}

/* ======= Загрузка и запуск квиза ======= */
async function startLoadQuiz(path){
  try{
    // Сброс старого состояния
    if(timerInterval){ clearInterval(timerInterval); timerInterval = null; }
    timerEl.textContent = '—';
    currentIndex = 0;
    userAnswers = [];
    score = 0;
    optionsEl.innerHTML = '';
    mediaEl.innerHTML = '';
    feedbackEl.classList.add('hidden'); feedbackEl.innerHTML = '';
    document.getElementById('final').classList.add('hidden');
    document.getElementById('questionPanel').classList.remove('hidden');

    const res = await fetch(path);
    if(!res.ok) throw new Error('Не удалось загрузить файл: ' + path);
    const text = await res.text();
    quizData = parseQuizMd(text);
    prepareAndStart();
  }catch(err){
    alert(err.message);
    console.error(err);
  }
}

/* ======= Подготовка вопросов и запуск ======= */
function prepareAndStart(){
  quizMetaEl.innerHTML = ''; // скрываем Duration/Randomisation/CatType
  questions = (quizData.questions || []).map(q=> JSON.parse(JSON.stringify(q)));
  const meta = quizData.meta || {};
  if((meta.Randomisation||'').toLowerCase() === 'on'){
    for(let i=questions.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [questions[i],questions[j]] = [questions[j],questions[i]];
    }
  }

  timerSeconds = parseDurationToSeconds(meta.Duration||'0');
  if(timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  if(timerSeconds > 0){
    timerEl.textContent = formatTime(timerSeconds);
    timerInterval = setInterval(()=> {
      timerSeconds--;
      timerEl.textContent = formatTime(timerSeconds);
      if(timerSeconds <= 0){ clearInterval(timerInterval); timerInterval=null; finishQuizDueToTimeout(); }
    },1000);
  } else { timerEl.textContent = '—'; }

  lobby.classList.add('hidden');
  runner.classList.remove('hidden');
  finalEl.classList.add('hidden');
  renderQuestion(currentIndex);
}

/* ======= Рендер одного вопроса ======= */
function renderQuestion(idx){
  feedbackEl.classList.add('hidden'); feedbackEl.innerHTML = '';
  const q = questions[idx];
  qTitleEl.textContent = `კითხვა ${idx+1} / ${questions.length}: ${q.title || ''}`;
  mediaEl.innerHTML = '';
  if(q.img) mediaEl.appendChild(createEl('img',{src:q.img}));
  if(q.audio) mediaEl.appendChild(createEl('audio',{controls:true, src:q.audio}));
  if(q.video){
    // проверяем youtube
    const ytMatch = q.video.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([\w-]+)/);
    if(ytMatch){
      const iframe = createEl('iframe',{src:`https://www.youtube.com/embed/${ytMatch[1]}`, width:'480', height:'270', frameborder:'0', allow:'autoplay; encrypted-media', allowfullscreen:true});
      mediaEl.appendChild(iframe);
    } else {
      mediaEl.appendChild(createEl('video',{controls:true, src:q.video}));
    }
  }

  optionsEl.innerHTML = '';
  printHintEl.textContent = '';
  if(q.printAnswer){
    printHintEl.textContent = 'შეიყვანეთ თქვენი პასუხი';
    const input = createEl('input',{type:'text', style:'padding:8px;width:97%'});
    input.value = userAnswers[idx] || '';
    input.addEventListener('input', ()=> userAnswers[idx] = input.value);
    optionsEl.appendChild(input);
    if(q.options && q.options.length){
      const note = createEl('div',{className:'small', style:'margin-top:8px'}, 'Варианты (только для справки):');
      optionsEl.appendChild(note);
      q.options.forEach((opt,i)=>{
        optionsEl.appendChild(createEl('div',{className:'opt'}, opt));
      });
    }
  } else {
    const multiple = q.multiple;
    q.options.forEach((opt,i)=>{
      const row = createEl('label',{className:'opt'});
      const input = createEl('input',{type: multiple ? 'checkbox' : 'radio', name:'opt', style:'margin-right:8px'});
      if(multiple){
        if(userAnswers[idx] && userAnswers[idx] instanceof Set && userAnswers[idx].has(i)) input.checked = true;
      } else {
        if(typeof userAnswers[idx]==='number' && userAnswers[idx]===i) input.checked=true;
      }
      input.addEventListener('change', (e)=>{
        if(multiple){
          if(!userAnswers[idx] || !(userAnswers[idx] instanceof Set)) userAnswers[idx]=new Set();
          if(e.target.checked) userAnswers[idx].add(i); else userAnswers[idx].delete(i);
        } else {
          userAnswers[idx]=i;
        }
      });
      row.appendChild(input);
      row.appendChild(document.createTextNode(opt));
      optionsEl.appendChild(row);
    });
  }
}

/* ======= Create element helper ======= */
function createEl(tag, attrs={}, text){
  const el=document.createElement(tag);
  for(const k in attrs){
    if(k==='className') el.className=attrs[k];
    else if(k==='style') el.style.cssText=attrs[k];
    else el.setAttribute(k, attrs[k]);
  }
  if(text) el.appendChild(document.createTextNode(text));
  return el;
}

/* ======= Проверка ответа и переход далее ======= */
nextBtn.addEventListener('click', ()=>{
  const q = questions[currentIndex];
  let ok=false;

  if(q.printAnswer){
    const ua = trim(userAnswers[currentIndex]||'');
    if(!ua){ feedbackEl.classList.remove('hidden'); feedbackEl.textContent='შეიყვანეთ პასუხი !'; return; }
    ok = q.correctNormalized.some(c=>eq(c,ua));
    feedbackEl.classList.remove('hidden');
    feedbackEl.innerHTML=`<div style="font-weight:700;color:${ok?'var(--ok)':'var(--err)'}">${ok?'✓ Правильно':'✕ Неверно'}</div>
                          <div style="margin-top:6px">${ok? '':'Ожидается: '+q.correctNormalized.join(', ')}</div>`;
  } else {
    if(q.multiple){
      const ua = userAnswers[currentIndex] instanceof Set ? Array.from(userAnswers[currentIndex]).map(i=>trim(q.options[i]||'')) : [];
      const selNorm=ua.map(s=>s.toLowerCase()).sort();
      const corrNorm=q.correctNormalized.map(s=>s.toLowerCase()).sort();
      ok=JSON.stringify(selNorm)===JSON.stringify(corrNorm);
    } else {
      const uaIndex=userAnswers[currentIndex];
      if(typeof uaIndex==='number') ok=eq(trim(q.options[uaIndex]||''),q.correctNormalized[0]);
    }
    feedbackEl.classList.remove('hidden');
    feedbackEl.innerHTML=`<div style="font-weight:700;color:${ok?'var(--ok)':'var(--err)'}">${ok?'✓ Правильно':'✕ Неверно'}</div>`;
  }

  if(ok) score++;
  markOptions(currentIndex);

  currentIndex++;
  if(currentIndex>=questions.length){ finishQuiz(); }
  else renderQuestion(currentIndex);
});

/* ======= Пометка вариантов ======= */
function markOptions(idx){
  const q = questions[idx];
  const rows = optionsEl.querySelectorAll('.opt');
  rows.forEach((r,i)=>{
    r.classList.remove('correct','wrong');
    const optText = trim(q.options[i]||'');
    const isCorrect = q.correctNormalized.some(c=>eq(c,optText));
    if(isCorrect) r.classList.add('correct');
    else if(q.multiple){
      if(userAnswers[idx] && userAnswers[idx] instanceof Set && userAnswers[idx].has(i)) r.classList.add('wrong');
    } else {
      if(typeof userAnswers[idx]==='number' && userAnswers[idx]===i && !isCorrect) r.classList.add('wrong');
    }
  });
}

/* ======= Завершение теста ======= */
function finishQuizDueToTimeout(){ feedbackEl.classList.remove('hidden'); feedbackEl.textContent='Время истекло — тест завершён автоматически.'; finishQuiz(); }
function finishQuiz(){
  if(timerInterval){ clearInterval(timerInterval); timerInterval=null; }
  document.getElementById('final').classList.remove('hidden');
  document.getElementById('questionPanel').classList.add('hidden');
  const total = questions.length;
  const percent = total ? Math.round((score/total)*100) : 0;
  scoreSummaryEl.innerHTML=`<div>სწორი: <strong>${score}</strong> / ${total}</div>
                             <div style="margin-top:6px">პროცენტულად: <strong>${percent}%</strong></div>`;
}

/* ======= Кнопки повторного запуска и возврата ======= */
retakeBtn.addEventListener('click', ()=>{
  score=0; userAnswers=new Array(questions.length).fill(null); currentIndex=0;
  document.getElementById('final').classList.add('hidden');
  document.getElementById('questionPanel').classList.remove('hidden');
  timerSeconds=parseDurationToSeconds(quizData.meta.Duration||'0');
  if(timerInterval){ clearInterval(timerInterval); timerInterval=null; }
  if(timerSeconds>0){
    timerEl.textContent=formatTime(timerSeconds);
    timerInterval=setInterval(()=>{timerSeconds--; timerEl.textContent=formatTime(timerSeconds); if(timerSeconds<=0){ clearInterval(timerInterval); timerInterval=null; finishQuizDueToTimeout(); } },1000);
  } else timerEl.textContent='—';
  renderQuestion(0);
});

backToListBtn.addEventListener('click', ()=>{
  if(timerInterval){ clearInterval(timerInterval); timerInterval=null; }
  runner.classList.add('hidden');
  lobby.classList.remove('hidden');
  document.getElementById('questionPanel').classList.remove('hidden');
});

quitBtn.addEventListener('click', ()=>{
  if(timerInterval){ clearInterval(timerInterval); timerInterval=null; }
  runner.classList.add('hidden');
  lobby.classList.remove('hidden');
  document.getElementById('questionPanel').classList.remove('hidden');
});

/* ======= Вспомогательные функции ======= */
function formatTime(sec){
  if(sec<=0) return '00:00';
  const h=Math.floor(sec/3600), m=Math.floor((sec%3600)/60), s=sec%60;
  if(h>0) return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

renderList();
