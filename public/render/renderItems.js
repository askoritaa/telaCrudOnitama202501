export function renderPecas(data, tBody) {
  tBody.innerHTML = "";
  data.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${item.id_Conjunto}</td>
        <td>${item.nome_Conjunto}</td>
        <td>${item.preco}</td>
        <td><img src="${item.caminho_Pawn}" alt="Peão" style="width: 50px; height: 50px;"></td>
        <td><img src="${item.caminho_King}" alt="Rei" style="width: 50px; height: 50px;"></td>
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
        <td><img src="${item.caminho}" alt="Background" style="width: 50px; height: 50px;"></td>
        <td>
          <button class="alter-button">Alterar</button>
          <button class="delete-button">Excluir</button>
        </td>
        `;
        tBody.appendChild(row);
  });
}
