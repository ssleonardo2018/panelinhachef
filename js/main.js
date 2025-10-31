/* main.js - initializes feed, handles auth modal and dark mode toggle */
document.addEventListener('DOMContentLoaded', ()=>{
  window.APP = window.APP || {};
  APP.users = JSON.parse(localStorage.getItem('pc_users')||'{}');
  APP.recipes = JSON.parse(localStorage.getItem('pc_recipes')||'[]'); // global recipes
  APP.logged = localStorage.getItem('pc_logged') || null;

  // sample data if empty
  if(APP.recipes.length===0){
    APP.recipes = [
      {id:1,title:'Bolo de Cenoura com farinha de arroz',desc:'Ddlicioso bolo de Cenoura',category:'Sobremesa',time:70,ingredients:['cenoura','farinha','açúcar'],img:'https://www.sabornamesa.com.br/media/k2/items/cache/919acbd93a09198eef55d141863c0dbb_XL.jpg',author:'admin',favorites:0},
      {id:2,title:'Lasanha à Bolonhesa',desc:'Massa caseira e queijo',category:'Prato Principal',time:50,ingredients:['massa','queijo','carne'],img:'https://static.itdg.com.br/images/360-240/ec2a5e38702c60bf1ace0b5f1c8e9415/shutterstock-739787011.jpg',author:'admin',favorites:0},
      {id:3,title:'Salada Tropical de Natal',desc:'Leve e refrescante',category:'Entrada',time:30,ingredients:['alface','manga','tomate'],img:'https://receitadaboa.com.br/wp-content/uploads/2024/03/salada_5-25522851.png',author:'chef',favorites:0}
    ];
    localStorage.setItem('pc_recipes', JSON.stringify(APP.recipes));
  }

  // elements
  const feed = document.getElementById('feed');
  const authModal = document.getElementById('authModal');
  const btnLogin = document.getElementById('btnLogin');
  const btnRegister = document.getElementById('btnRegister');
  const closeAuth = document.getElementById('closeAuth');
  const authTitle = document.getElementById('authTitle');
  const authSubmit = document.getElementById('authSubmit');
  const switchToRegister = document.getElementById('switchToRegister');
  const toggleDark = document.getElementById('toggleDark');

  // modal actions
  btnLogin.addEventListener('click', ()=> openAuth('login'));
  btnRegister.addEventListener('click', ()=> openAuth('register'));
  closeAuth.addEventListener('click', closeAuthModal);
  authModal.addEventListener('click', (e)=>{ if(e.target===authModal) closeAuthModal(); });

  function openAuth(mode){
    authModal.classList.remove('hidden');
    document.getElementById('name').style.display = mode==='register' ? 'block' : 'none';
    authTitle.textContent = mode==='register' ? 'Cadastrar' : 'Entrar';
    authSubmit.textContent = mode==='register' ? 'Cadastrar' : 'Entrar';
    document.getElementById('authSubmit').dataset.mode = mode;
  }
  function closeAuthModal(){ authModal.classList.add('hidden'); }

  // auth form submit handled in auth.js - just set default here
  // render feed
  function renderFeed(list){
    feed.innerHTML='';
    (list||APP.recipes).forEach(r=>{
      const card = document.createElement('article');
      card.className='card';
      card.innerHTML = `
        <img src="${r.img||'img/logo.png'}" alt="${r.title}">
        <div class="card-body">
          <div class="card-title"><span>${r.title}</span><button class="favorite-btn ${isFavorited(r.id)?'fav':''}" data-id="${r.id}">❤</button></div>
          <div class="meta"><span class="tag">${r.category}</span><span>${r.time} min</span></div>
          <p>${r.desc||''}</p>
          <div style="margin-top:auto;display:flex;gap:8px;">
            <button class="btn small" data-id="${r.id}" onclick="viewRecipe(${r.id})">Ver mais</button>
            <button class="btn outline small" onclick="openAuthorRecipes('${r.author}')">Mais do autor</button>
          </div>
        </div>
      `;
      feed.appendChild(card);
    });
    // bind fav buttons
    document.querySelectorAll('.favorite-btn').forEach(b=>{
      b.addEventListener('click',(e)=>{
        const id = +b.dataset.id;
        toggleFavorite(id,b);
      });
    });
  }

  // helper favorite check using localStorage per-user
  function isFavorited(rid){
    const favs = JSON.parse(localStorage.getItem('pc_favs_'+(APP.logged||'guest'))||'[]');
    return favs.includes(rid);
  }
  window.isFavorited=isFavorited;

  // toggle global favorite (per-user)
  function toggleFavorite(id,btn){
    if(!APP.logged){ openAuth('login'); return; }
    const key = 'pc_favs_'+APP.logged;
    const favs = JSON.parse(localStorage.getItem(key)||'[]');
    const idx = favs.indexOf(id);
    if(idx>-1){ favs.splice(idx,1); btn.classList.remove('fav'); }
    else { favs.push(id); btn.classList.add('fav'); }
    localStorage.setItem(key, JSON.stringify(favs));
  }
  window.toggleFavorite = toggleFavorite;

  // view recipe popup
  window.viewRecipe = function(id){
    const r = APP.recipes.find(x=>x.id===id);
    if(!r) return alert('Receita não encontrada');
    alert(r.title + "\n\nIngredientes:\n" + (r.ingredients||[]).join(', ') + "\n\n" + (r.desc||''));
  };

  // open author view
  window.openAuthorRecipes = function(author){
    const list = APP.recipes.filter(r=>r.author===author);
    renderFeed(list);
  };

  // search form
  document.getElementById('searchForm').addEventListener('submit', (e)=>{
    e.preventDefault();
    const q = document.getElementById('q').value.toLowerCase();
    const cat = document.getElementById('category').value;
    const maxTime = parseInt(document.getElementById('maxTime').value) || Infinity;
    const results = APP.recipes.filter(r=>{
      const matchQ = !q || (r.title+r.desc+(r.ingredients||[]).join(' ')).toLowerCase().includes(q);
      const matchCat = !cat || r.category===cat;
      const matchTime = r.time<=maxTime;
      return matchQ && matchCat && matchTime;
    });
    renderFeed(results);
  });

  // dark mode toggle
  toggleDark.addEventListener('click', ()=>{
    document.body.classList.toggle('dark');
    localStorage.setItem('pc_dark', document.body.classList.contains('dark'));
  });

  // restore dark
  if(localStorage.getItem('pc_dark')==='true') document.body.classList.add('dark');

  // initial render
  renderFeed();

  // expose for other modules
  window.APP = APP;
  window.renderFeed = renderFeed;
});
