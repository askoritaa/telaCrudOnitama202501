export function renderPecas(data, tBody) {
  tBody.innerHTML = "";
  data.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${item.id_Conjunto}</td>
        <td>${item.nome_Conjunto}</td>
        <td>${item.preco}</td>
        <td><img src="${item.caminho_Pawn}" alt="Peão" class="imgPeca";"></td>
        <td><img src="${item.caminho_King}" alt="Rei" class="imgPeca";"></td>
        <td>
          <button class="alter-button">Alterar</button>
          <button class="delete-button">Excluir</button>
        </td>
        `;
        tBody.appendChild(row);
  });
}

export function renderBackgrounds(data, tBody) {
  tBody.innerHTML = "";
  data.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${item.id_Background}</td>
        <td>${item.nome}</td>
        <td><img src="${item.caminho}" alt="Background" class="imgBg"></td>
        <td>
          <button class="alter-button">Alterar</button>
          <button class="delete-button">Excluir</button>
        </td>
        `;
        tBody.appendChild(row);
  });
}
