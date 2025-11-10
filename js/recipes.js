/* recipes.js - manage recipes: add, edit, delete (uses pc_recipes in localStorage) */
document.addEventListener('DOMContentLoaded', ()=>{
  // only run on dashboard
  if(!location.pathname.includes('dashboard')) return;
  const sideBtns = document.querySelectorAll('.side-btn');
  const views = document.querySelectorAll('.view');
  const allFeed = document.getElementById('allFeed');
  const favList = document.getElementById('favList');
  const recipeForm = document.getElementById('recipeForm');
  const profileName = document.getElementById('profileName');
  const profileEmail = document.getElementById('profileEmail');
  const changePass = document.getElementById('changePass');

  let editingId = null;

  const APP = window.APP || {};
  const logged = localStorage.getItem('pc_logged');
  if(!logged){ alert('Você precisa entrar para acessar o dashboard'); location.href='index.html'; return; }

  // load user info
  const users = JSON.parse(localStorage.getItem('pc_users')||'{}');
  const me = users[logged];
  profileName.textContent = me.name;
  profileEmail.textContent = logged;

  // display all recipes in dashboard feed
  function renderAll(){
    const recipes = JSON.parse(localStorage.getItem('pc_recipes')||'[]');
    allFeed.innerHTML='';
    recipes.forEach(r=>{
      const card = createCard(r, true);
      allFeed.appendChild(card);
    });
  }

  function renderFavs(){
    favList.innerHTML='';
    const recipes = JSON.parse(localStorage.getItem('pc_recipes')||'[]');
    const favs = JSON.parse(localStorage.getItem('pc_favs_'+logged)||'[]');
    const list = recipes.filter(r=>favs.includes(r.id));
    list.forEach(r=> favList.appendChild(createCard(r,false)));
    if(list.length===0) favList.innerHTML='<p>Nenhuma receita nos favoritos.</p>';
  }

  function createCard(r, showAuthor){
    const el = document.createElement('article');
    el.className='card';
    el.innerHTML = `
      <img src="${r.img||'img/logo.png'}" alt="${r.title}">
      <div class="card-body">
        <div class="card-title"><span>${r.title}</span><div style="display:flex;gap:8px"><button class="favorite-btn ${isFav(r.id)?'fav':''}" data-id="${r.id}">❤</button></div></div>
        <div class="meta"><span class="tag">${r.category}</span><span>${r.time} min</span></div>
        <p>${r.desc||''}</p>
        <div style="margin-top:auto;display:flex;gap:8px;">
          ${showAuthor?`<button class="btn small" onclick="editRecipe(${r.id})">✏️ Editar</button><button class="btn outline small" onclick="deleteRecipe(${r.id})">🗑️ Excluir</button>`:''}
        </div>
      </div>
    `;
    // favorite handler
    el.querySelectorAll('.favorite-btn').forEach(b=> b.addEventListener('click', ()=>{
      toggleFavorite(r.id,b);
      renderFavs();
    }));
    return el;
  }

  // helper functions
  function isFav(id){ const favs = JSON.parse(localStorage.getItem('pc_favs_'+logged)||'[]'); return favs.includes(id); }
  window.isFav = isFav;

  window.editRecipe = function(id){
    const recipes = JSON.parse(localStorage.getItem('pc_recipes')||'[]');
    const r = recipes.find(x=>x.id===id);
    if(!r) return alert('Receita não encontrada');
    editingId = id;
    document.getElementById('rTitle').value = r.title;
    document.getElementById('rCategory').value = r.category;
    document.getElementById('rTime').value = r.time;
    document.getElementById('rIngredients').value = (r.ingredients||[]).join('\n');
    document.getElementById('rSteps').value = r.steps||'';
    document.getElementById('rImage').value = r.img||'';
    // switch view to create
    document.querySelectorAll('.view').forEach(v=>v.classList.add('hidden'));
    document.getElementById('viewCreate').classList.remove('hidden');
  };

  window.deleteRecipe = function(id){
    if(!confirm('Excluir receita?')) return;
    let recipes = JSON.parse(localStorage.getItem('pc_recipes')||'[]');
    recipes = recipes.filter(r=>r.id!==id);
    localStorage.setItem('pc_recipes', JSON.stringify(recipes));
    renderAll(); renderFavs(); window.renderFeed(recipes);
  };

  // toggleFavorite (duplicates main.js implementation but works in dashboard too)
  function toggleFavorite(id, btn){
    const key = 'pc_favs_'+logged;
    const favs = JSON.parse(localStorage.getItem(key)||'[]');
    const idx = favs.indexOf(id);
    if(idx>-1){ favs.splice(idx,1); btn.classList.remove('fav'); }
    else { favs.push(id); btn.classList.add('fav'); }
    localStorage.setItem(key, JSON.stringify(favs));
  }
  window.toggleFavorite = toggleFavorite;

  // form submit - add or update recipe
  recipeForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const title = document.getElementById('rTitle').value.trim();
    const category = document.getElementById('rCategory').value.trim();
    const time = parseInt(document.getElementById('rTime').value,10);
    const ingredients = document.getElementById('rIngredients').value.split('\n').map(s=>s.trim()).filter(Boolean);
    const steps = document.getElementById('rSteps').value.trim();
    const img = document.getElementById('rImage').value.trim();

    if(!title||!category||!time||ingredients.length===0||!steps){ return alert('Preencha todos os campos'); }

    let recipes = JSON.parse(localStorage.getItem('pc_recipes')||'[]');
    if(editingId){
      recipes = recipes.map(r=> r.id===editingId? {...r,title,category,time,ingredients,steps,img,author:localStorage.getItem('pc_logged')} : r);
      editingId = null;
    } else {
      const id = Date.now();
      recipes.push({id,title,category,time,ingredients,steps,img,author:localStorage.getItem('pc_logged')});
    }
    localStorage.setItem('pc_recipes', JSON.stringify(recipes));
    recipeForm.reset();
    renderAll(); renderFavs(); window.renderFeed(recipes);
    alert('Receita salva com sucesso!');
  });

  // sidebar navigation
  sideBtns.forEach(b=> b.addEventListener('click', ()=>{
    const view = b.dataset.view;
    document.querySelectorAll('.view').forEach(v=>v.classList.add('hidden'));
    document.getElementById('view'+capitalize(view)).classList.remove('hidden');
    if(view==='feed') renderAll();
    if(view==='favorites') renderFavs();
  }));

  document.getElementById('cancelEdit').addEventListener('click', ()=>{
    recipeForm.reset(); editingId = null; document.querySelectorAll('.view').forEach(v=>v.classList.add('hidden')); document.getElementById('viewFeed').classList.remove('hidden');
  });

  // HTML da janela popup
  win.document.write(`
    <html lang="pt-BR">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${r.title}</title>
        <style>
          body {
            font-family: 'Segoe UI', Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: #fffaf5;
            color: #333;
            line-height: 1.6;
          }
          h1 {
            text-align: center;
            color: #d35400;
            font-size: 1.8em;
            margin-bottom: 10px;
          }
          img {
            display: block;
            margin: 15px auto;
            max-width: 100%;
            height: auto;
            border-radius: 10px;
          }
          .meta {
            text-align: center;
            font-size: 0.9em;
            margin-bottom: 15px;
            color: #666;
          }
          .section {
            margin-top: 20px;
          }
          h3 {
            color: #e67e22;
            font-size: 1.2em;
            border-bottom: 1px solid #f1c40f;
            padding-bottom: 4px;
            margin-bottom: 10px;
          }
          .ingredients {
            background: #fef0dc;
            padding: 10px 15px;
            border-radius: 8px;
            list-style: disc;
            margin-left: 20px;
          }
          p {
            text-align: justify;
          }
          button {
            display: block;
            margin: 30px auto;
            padding: 12px 24px;
            background: #e67e22;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1em;
            box-shadow: 0 3px 5px rgba(0,0,0,0.2);
          }
          button:hover {
            background: #cf711f;
          }

          /* Ajuste para telas pequenas */
          @media (max-width: 600px) {
            body {
              padding: 15px;
              font-size: 0.95em;
            }
           
            h1 {
              font-size: 1.5em;
            }
            h3 {
              font-size: 1.1em;
            }
            button {
              width: 100%;
              font-size: 1em;
              padding: 14px;
            }
          }

          /* Modo de impressão */
          @media print {
            button { display: none; }
            body {
              background: white;
              color: black;
              padding: 10px;
            }
            
           h1, h3 {
              color: black;
            }
          }
        </style>
      </head>
      <body>
        <h1>${r.title}</h1>
        <div class="meta">
          <strong>Categoria:</strong> ${r.category} |
          <strong>Tempo:</strong> ${r.time} min
        </div>
        <img src="${r.img}" alt="${r.title}">
        <div class="section">
          <h3>Ingredientes</h3>
          <ul class="ingredients">
            ${(r.ingredients || []).map(i => `<li>${i}</li>`).join('')}
          </ul>
        </div>
        <div class="section">
          <h3>Descrição</h3>
          <p>${r.desc || ''}</p>
        </div>
        <div class="buttons">
          <button onclick="window.print()">🖨️ Imprimir Receita</button>
          <button class="close-btn" onclick="window.close()">❌ Fechar Janela</button>
        </div>
      </body>
    </html>
  `);

  win.document.close();
};

  
  // initial renders
  renderAll(); renderFavs();
  // helper
  function capitalize(s){ return s.charAt(0).toUpperCase()+s.slice(1); }
});
