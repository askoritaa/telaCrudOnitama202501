document.addEventListener('DOMContentLoaded', function () {
  const select = document.getElementById('component-select');
  const addButton = document.getElementById('add-button');

  addButton.addEventListener('click', function (e) {
    e.preventDefault(); // Evita comportamento padrão

    const valor = select.value;

    if (valor === 'pecas') {
      window.location.href = 'formularioPecas.html';
    } else if (valor === 'background') {
      window.location.href = 'formularioBackground.html';
    } else {
      alert('Selecione um componente válido!');
    }
  });
});
