import { types } from "./config.js";
import { loadItems, deleteItem } from "./api.js";
import { renderPecas, renderBackgrounds, renderEmojis } from "./render/renderItems.js";

const render = { renderPecas, renderBackgrounds, renderEmojis };

document.addEventListener("DOMContentLoaded", async function () {
  const select = document.getElementById("component-select");
  const addButton = document.getElementById("add-button");
  const title = document.getElementById("component-title");
  const table = document.getElementById("dynamic-table");
  const tBody = table.querySelector("tbody");
  const thead = table.querySelector("thead tr");

  async function loadAndRenderComponent(componentKey) {
    const config = types[componentKey];
    if (!config) return;

    title.textContent = config.title;

    thead.innerHTML = config.columns.map((col) => `<th>${col}</th>`).join("");

    try {
      const data = await loadItems(config.apiPath);
      render[config.render](data, tBody);
      attachRowEvents(componentKey, config.singlePath);
    } catch (err) {
      alert(err.message);
    }
  }

  function attachRowEvents(componentKey, path) {
    const alterButtons = document.querySelectorAll(".alter-button");
    alterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn
          .closest("tr")
          .querySelector("td:first-child").textContent;
        if (componentKey === "pecas") {
          window.location.href = `formularioPecasEditar.html?id=${id}`;
        } else if (componentKey === "backgrounds") {
          window.location.href = `formularioBackgroundEditar.html?id=${id}`;
        } else if (componentKey === "emojis") {
          window.location.href = `formularioEmojiEditar.html?id=${id}`;
        }
      });
    });

    const deleteButtons = document.querySelectorAll(".delete-button");
    deleteButtons.forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn
          .closest("tr")
          .querySelector("td:first-child").textContent;
        if (confirm("Tem certeza que deseja excluir?")) {
          try {
            await deleteItem(path, id);
            alert("Item excluído com sucesso.");
            loadAndRenderComponent(select.value);
          } catch (err) {
            alert("Erro ao deletar: " + err.message);
          }
        }
      });
    });
  }

 addButton?.addEventListener("click", () => {
    const key = select.value;
    if (key === "pecas") {
      window.location.href = "formularioPecas.html";
    } else if (key === "backgrounds") {
      window.location.href = "formularioBackground.html";
    } else if (key === "emojis"){
      window.location.href = "formularioEmoji.html";
    } else {
      alert("Selecione um componente válido.");
    }
  });

   select?.addEventListener("change", () => {
    loadAndRenderComponent(select.value);
  });

  loadAndRenderComponent(select.value || "pecas");

});
