function abrirManual() {
  const w = 500, h = 900;
  const left = (screen.width / 2) - (w / 2);
  const top = (screen.height / 2) - (h / 2);

  window.open(
    'manual.html',
    '_blank',
    `width=${w},height=${h},left=${left},top=${top},resizable=yes,scrollbars=yes`
  );
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btnManual").addEventListener("click", abrirManual);
});


