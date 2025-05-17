document.addEventListener("DOMContentLoaded", function () {
  // --- Elementos iniciais ---
  const select = document.getElementById("component-select");
  const addButton = document.getElementById("add-button");
  const skinsTbody = document.getElementById("skins-tbody");

  // --- Elementos iniciais ---
  if (addButton && select) {
    addButton.addEventListener("click", function (e) {
      e.preventDefault();
      const valor = select.value;
      if (valor === "pecas") {
        window.location.href = "formularioPecas.html";
      } else if (valor === "background") {
        window.location.href = "formularioBackground.html";
      } else {
        alert("Selecione um componente válido!");
      }
    });
  }

  // --- Funções utilitárias ---
  async function confirmAction(id) {
    if (confirm("Tem certeza que deseja deletar isso?")) {
      try {
        const response = await fetch(`/skin/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const error = response.json();
          console.log("Erro retornado pelo backend:", error);
          throw new Error(error.error || "Erro ao deletar skin");
        }

        alert("Skin deletada com sucesso!");
        window.location.href = "index.html";
      } catch (error) {
        alert(`Erro: ${error.message}`);
      }
    } else {
      alert("Ação cancelada.");
    }
  }

  function toggleInputState(form, disabled = true) {
    form
      .querySelectorAll("input, button")
      .forEach((el) => (el.disabled = disabled));
  }

  // --- Listagem de skins e eventos de ação ---
  if (skinsTbody) {
    fetch("/skins")
      .then((response) => {
        if (!response.ok) throw new Error("Erro ao carregar skins");
        return response.json();
      })
      .then((skins) => {
        skinsTbody.innerHTML = "";
        skins.forEach((skin) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${skin.id_Conjunto}</td>
            <td>${skin.nome_Conjunto}</td>
            <td>${skin.preco}</td>
            <td><img src="${skin.caminho_Pawn}" alt="Peão" style="width: 50px; height: 50px;"></td>
            <td><img src="${skin.caminho_King}" alt="Rei" style="width: 50px; height: 50px;"></td>
            <td>
              <button class="alter-button">Alterar</button>
              <button class="delete-button">Excluir</button>
            </td>
          `;
          skinsTbody.appendChild(row);
        });

        // Adicionar eventos aos botões Alterar
        const alterButtons = document.querySelectorAll(".alter-button");
        alterButtons.forEach((button) => {
          button.addEventListener("click", function () {
            const id = button
              .closest("tr")
              .querySelector("td:first-child").textContent;
            window.location.href = `formularioPecasEditar.html?id=${id}`;
          });
        });

        // Adicionar evento ao botão Excluir
        const deleteButtons = document.querySelectorAll(".delete-button");
        deleteButtons.forEach((button) => {
          button.addEventListener("click", function () {
            const id = button
              .closest("tr")
              .querySelector("td:first-child").textContent;
            confirmAction(id);
          });
        });
      })
      .catch((error) => alert(`Erro: ${error.message}`));
  }

  // --- Envio de formulário de cadastro de peças ---
  const formPecas = document.getElementById("form-pecas");
  if (formPecas) {
    formPecas.addEventListener("submit", async function (e) {
      e.preventDefault();
      const formData = new FormData(formPecas);
      // Travar inputs e botão
      toggleInputState(formPecas, true);

      // Adicionar texto de loading
      const loadingText = document.createElement("p");
      loadingText.textContent = "Carregando...";
      formPecas.appendChild(loadingText);

      try {
        const response = await fetch("/skins", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          console.log("Erro retornado pelo backend:", error);
          throw new Error(error.error || "Erro ao adicionar skin");
        }

        alert("Skin adicionada com sucesso!");
        window.location.href = "index.html";
      } catch (error) {
        alert(`Erro: ${error.message}`);
      } finally {
        toggleInputState(formPecas, false);
        loadingText.remove();
      }
    });
  }

  // --- Formulário de edição de peças ---
  const formPecasEditar = document.getElementById("form-pecas-editar");
  if (formPecasEditar) {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    if (id) {
      fetch(`/skin/${id}`)
        .then((response) => {
          if (!response.ok) throw new Error("Erro ao carregar skin");
          return response.json();
        })
        .then((skin) => {
          document.getElementById("conjunto").value = skin.nome_Conjunto;
          document.getElementById("preco").value = skin.preco;
          const previewPawn = document.getElementById("preview-pawn");
          const previewKing = document.getElementById("preview-king");
          previewPawn.src = skin.caminho_Pawn;
          previewKing.src = skin.caminho_King;
          previewPawn.style.display = "block";
          previewKing.style.display = "block";
        })
        .catch((error) => alert(`Erro: ${error.message}`));

      // Prévia para novos arquivos selecionados
      const spritePawnInput = document.getElementById("sprite-pawn");
      const spriteKingInput = document.getElementById("sprite-king");
      const previews = {
        pawn: document.getElementById("preview-pawn"),
        king: document.getElementById("preview-king"),
      };

      spritePawnInput.addEventListener("change", function (e) {
        const file = e.target.files[0];
        if (file) {
          previews.pawn.src = URL.createObjectURL(file);
          previews.pawn.style.display = "block";
        }
      });

      spriteKingInput.addEventListener("change", function (e) {
        const file = e.target.files[0];
        if (file) {
          previews.king.src = URL.createObjectURL(file);
          previews.king.style.display = "block";
        }
      });
    }

    formPecasEditar.addEventListener("submit", async function (e) {
      e.preventDefault();
      const formData = new FormData(formPecasEditar);

      toggleInputState(formPecasEditar, true);

      const loadingText = document.createElement("p");
      loadingText.textContent = "Carregando...";
      formPecasEditar.appendChild(loadingText);

      try {
        const response = await fetch(`/skin/${id}`, {
          method: "PUT",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          console.log("Erro retornado pelo backend:" + error);
          throw new Error(error.error || "Erro ao atualizar skin");
        }

        alert("Skin atualizada com sucesso!");
        window.location.href = "index.html";
      } catch (error) {
        alert(`Erro: ${error.message}`);
      } finally {
        toggleInputState(formPecasEditar, false);
        loadingText.remove();
      }
    });
  }
});
