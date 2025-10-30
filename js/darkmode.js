/* darkmode.js - support toggles on index and dashboard */
document.addEventListener('DOMContentLoaded', ()=>{
  document.querySelectorAll('#toggleDark, #toggleDarkDash').forEach(btn=>{
    if(!btn) return;
    btn.addEventListener('click', ()=>{
      document.body.classList.toggle('dark');
      localStorage.setItem('pc_dark', document.body.classList.contains('dark'));
    });
  });
  if(localStorage.getItem('pc_dark')==='true') document.body.classList.add('dark');
});