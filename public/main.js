import { types } from "./config.js";
import { loadItems, deleteItem } from "./api.js";
import {
  renderPecas,
  renderBackgrounds,
  renderEmojis,
} from "./render/renderItems.js";

const render = { renderPecas, renderBackgrounds, renderEmojis };

document.addEventListener("DOMContentLoaded", async function () {
  const select = document.getElementById("component-select");
  const addButton = document.getElementById("add-button");
  const title = document.getElementById("component-title");
  const table = document.getElementById("dynamic-table");
  const tBody = table.querySelector("tbody");
  const thead = table.querySelector("thead tr");
  //para paginação
  const paginationNumbers = document.getElementById("pagination-numbers");
  const buttons = {
    next: document.getElementById("next-button"),
    prev: document.getElementById("prev-button"),
  };
  const paginationLimit = 7;
  let currentPage = 1;
  let pageCount;

  const appendPageNumber = (index) => {
    const pageNumber = document.createElement("button");
    pageNumber.className = "pagination-number";
    pageNumber.innerHTML = index;
    pageNumber.setAttribute("page-index", index);
    pageNumber.setAttribute("aria-label", "Page " + index);

    pageNumber.addEventListener("click", () => {
      setCurrentPage(index);
    });
    paginationNumbers.appendChild(pageNumber);
  };

  const getPaginationNumbers = () => {
    paginationNumbers.innerHTML = "";
    for (let i = 1; i <= pageCount; i++) {
      appendPageNumber(i);
    }
  };

  const setCurrentPage = (pageNum) => {
    currentPage = pageNum;

    handleActivePageNumber();
    handlePageButtonsStatus();

    loadAndRenderComponent(select.value);
  };

  const handleActivePageNumber = () => {
    document.querySelectorAll(".pagination-number").forEach((button) => {
      button.classList.remove("active");

      const pageIndex = Number(button.getAttribute("page-index"));
      if (pageIndex == currentPage) {
        button.classList.add("active");
      }
    });
  };

  buttons.next.addEventListener("click", () => {
    if (currentPage < pageCount) {
      setCurrentPage(currentPage + 1);
    }
  });

  buttons.prev.addEventListener("click", () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  });

  const disableButton = (button) => {
    button.classList.add("disabled");
    button.setAttribute("disabled", true);
  };
  const enableButton = (button) => {
    button.classList.remove("disabled");
    button.removeAttribute("disabled");
  };
  const handlePageButtonsStatus = () => {
    if (currentPage === 1) {
      disableButton(buttons.prev);
    } else {
      enableButton(buttons.prev);
    }
    if (pageCount === currentPage) {
      disableButton(buttons.next);
    } else {
      enableButton(buttons.next);
    }
  };

  async function loadAndRenderComponent(componentKey) {
    const config = types[componentKey];
    if (!config) return;

    title.textContent = config.title;

    thead.innerHTML = config.columns.map((col) => `<th>${col}</th>`).join("");

    try {
      const { data, total } = await loadItems(
        config.apiPath,
        currentPage,
        paginationLimit,
        config.dataKey
      );

      pageCount = Math.ceil(total / paginationLimit);
      getPaginationNumbers();
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
    } else if (key === "emojis") {
      window.location.href = "formularioEmoji.html";
    } else {
      alert("Selecione um componente válido.");
    }
  });

  select?.addEventListener("change", () => {
    loadAndRenderComponent(select.value);
  });

  setCurrentPage(1);
});
