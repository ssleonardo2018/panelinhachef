/* =========================================================
   auth.js - Autenticação simples usando localStorage
   Variáveis armazenadas:
   - pc_users  → lista de usuários { email: { name, pass } }
   - pc_logged → e-mail do usuário atualmente logado
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  const authForm = document.getElementById('authForm');
  const authSubmit = document.getElementById('authSubmit');
  const switchToRegister = document.getElementById('switchToRegister');
  const btnLogout = document.getElementById('btnLogout');
  const changePass = document.getElementById('changePass');

  /* =========================================================
     Alternar entre Login e Cadastro
  ========================================================= */
  if (switchToRegister) {
    switchToRegister.addEventListener('click', (e) => {
      e.preventDefault();
      const nameField = document.getElementById('name');
      const title = document.getElementById('authTitle');

      nameField.style.display = 'block';
      title.textContent = 'Cadastrar';
      authSubmit.textContent = 'Cadastrar';
      authSubmit.dataset.mode = 'register';
    });
  }

  /* =========================================================
     Envio do formulário de autenticação (login/cadastro)
  ========================================================= */
  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const mode = authSubmit.dataset.mode || 'login';
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim().toLowerCase();
      const pass = document.getElementById('password').value;

      if (!email || !pass) {
        alert('Preencha e-mail e senha');
        return;
      }

      const users = JSON.parse(localStorage.getItem('pc_users') || '{}');

      /* ----- Cadastro ----- */
      if (mode === 'register') {
        if (users[email]) {
          alert('Já existe usuário com esse e-mail');
          return;
        }

        users[email] = { name: name || email.split('@')[0], pass: pass };
        localStorage.setItem('pc_users', JSON.stringify(users));

        alert('Cadastro realizado com sucesso! Faça login.');
        authForm.reset();
        document.getElementById('name').style.display = 'none';
        document.getElementById('authTitle').textContent = 'Entrar';
        authSubmit.textContent = 'Entrar';
        authSubmit.dataset.mode = 'login';
        return;
      }

      /* ----- Login ----- */
      if (!users[email] || users[email].pass !== pass) {
        alert('E-mail ou senha inválidos');
        return;
      }

      // Guarda o e-mail do usuário logado
      localStorage.setItem('pc_logged', email);
      window.APP = window.APP || {};
      window.APP.logged = email;

      // alert('Bem-vindo, ' + users[email].name);

      // Fecha o modal de login, se existir
      const authModal = document.getElementById('authModal');
      if (authModal) authModal.classList.add('hidden');

      /* =========================================================
         Redireciona ou recarrega conforme o local atual
      ========================================================= */
      const path = window.location.pathname;

      // Se não estiver no dashboard, redireciona
      if (!path.endsWith('dashboard.html')) {
        window.location.href = 'dashboard.html';
      } else {
        // Se já estiver, apenas recarrega os dados
        window.location.reload();
      }
    });
  }

  /* =========================================================
     Botão de logout (disponível no dashboard)
  ========================================================= */
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      localStorage.removeItem('pc_logged');
      window.APP.logged = null;
      window.location.href = 'index.html';
    });
  }

  /* =========================================================
     Alteração de senha (somente no dashboard)
  ========================================================= */
  if (changePass) {
    changePass.addEventListener('click', () => {
      const newPass = document.getElementById('newPass').value;
      if (!newPass) {
        alert('Digite a nova senha');
        return;
      }

      const users = JSON.parse(localStorage.getItem('pc_users') || '{}');
      const logged = localStorage.getItem('pc_logged');

      if (!logged) {
        alert('Usuário não logado');
        return;
      }

      users[logged].pass = newPass;
      localStorage.setItem('pc_users', JSON.stringify(users));
      alert('Senha atualizada com sucesso!');
      document.getElementById('newPass').value = '';
    });
  }

  /* =========================================================
     Verificação automática de autenticação no dashboard
  ========================================================= */
  const logged = localStorage.getItem('pc_logged');
  if (window.location.pathname.endsWith('dashboard.html') && !logged) {
    // Se o usuário não estiver logado, volta para a página inicial
    window.location.href = 'index.html';
  }

});
