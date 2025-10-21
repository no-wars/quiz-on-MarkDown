const dirConfig = [
  {
    "name": "BSD",
    "color": "linear-gradient(45deg, #ff0000, #0BCE0B)",
    "icon": { "type": "img", "src": "https://vigneshwaranravichandran.wordpress.com/wp-content/uploads/2017/07/freebsd-logo-256x256.png" },
    "levels": [
      { "name": "დამწყები", "link": "math/beginner/" },
      { "name": "საშუალო", "link": "math/intermediate/" },
      { "name": "რთული", "link": "math/advanced/" }
    ],
    "position": 2, "status": "show"
  },
  {
    "name": "Linux",
    "color": "linear-gradient(45deg, #EDA242, #ffffff)",
    "icon": { "type": "img", "src": "https://cdn-icons-png.flaticon.com/512/518/518713.png" },
    "levels": [
      { "name": "დამწყები", "link": "../Quiz/Linux/დამწყები/" },
      { "name": "საშუალო", "link": "../Quiz/Linux/საშუალო/" },
      { "name": "რთული", "link": "../Quiz/Linux/რთული/" }
    ],
    "position": 1, "status": "show"
  },
  {
    "name": "Windows",
    "color": "#198754",
    "icon": { "type": "img", "src": "https://icons.iconarchive.com/icons/martz90/circle/256/windows-8-icon.png" },
    "levels": [
      { "name": "დამწყები", "link": "history/beginner/" },
      { "name": "საშუალო", "link": "history/intermediate/" },
      { "name": "რთული", "link": "history/advanced/" }
    ],
    "position": 3, "status": "show"
  },
  {
    "name": "Mac os",
    "color": "#c0bfbc",
    "icon": { "type": "img", "src": "https://cdn.jim-nielsen.com/macos/512/macos-catalina-2019-10-08.png?rf=1024" },
    "levels": [
      { "name": "დამწყები", "link": "" },
      { "name": "საშუალო", "link": "" },
      { "name": "რთული", "link": "" }
    ],
    "position": 4, "status": "show"
  },
  {
    "name": "raspberry pi",
    "color": "linear-gradient(45deg, #1D5B1D, #1D5B1D)",
    "icon": { "type": "img", "src": "https://e7.pngegg.com/pngimages/267/598/png-clipart-raspberry-pi-computer-icons-secure-digital-noobs-raspberry-computer-computer-program-thumbnail.png" },
    "levels": [
      { "name": "დამწყები", "link": "" },
      { "name": "საშუალო", "link": "" },
      { "name": "რთული", "link": "" }
    ],
    "position": 5, "status": "show"
  }
];

dirConfig.sort((a, b) => (a.position || 0) - (b.position || 0));

const container = document.getElementById('dirContainer');

function renderDirs(list) {
  container.innerHTML = '';
  list.forEach(dir => {
    if (!dir.name || !dir.icon) return;
    if (dir.status === "hidden") return; 

    const col = document.createElement('div');
    col.classList.add('col-6','col-md-4','col-lg-3');

    const iconHTML = `<img src="${dir.icon.src}" alt="${dir.name}">`;
    const levelsHTML = dir.levels.map(level => `<a href="${level.link}" class="btn-level">${level.name}</a>`).join(' ');

    col.innerHTML = `
      <div class="card" style="background:${dir.color}">
        <div class="icon-wrapper">${iconHTML}</div>
        <h5>${dir.name}</h5>
        <div>${levelsHTML}</div>
      </div>
    `;
    container.appendChild(col);
  });
}

renderDirs(dirConfig);

document.getElementById('searchInput').addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  const filtered = dirConfig.filter(dir => {
    if (dir.status === "hidden") return false; 
    const levelsMatch = dir.levels.some(lvl => lvl.name.toLowerCase().includes(query));
    return dir.name.toLowerCase().includes(query) || levelsMatch;
  });
  renderDirs(filtered);
});
