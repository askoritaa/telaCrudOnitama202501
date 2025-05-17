document.addEventListener("DOMContentLoaded", async () => {
  const form =
    document.getElementById("form-pecas") ||
    document.getElementById("form-pecas-editar");
  if (!form) return;

  const id = new URLSearchParams(window.location.search).get("id");
  const isEdit = Boolean(id);

  const inputs = {
    conjunto: document.getElementById("conjunto"),
    preco: document.getElementById("preco"),
    pawnInput: document.getElementById("sprite-pawn"),
    kingInput: document.getElementById("sprite-king"),
    previewPawn: document.getElementById("preview-pawn"),
    previewKing: document.getElementById("preview-king"),
  };

  if (isEdit) {
    try {
      const res = await fetch(`/skin/${id}`);
      if (!res.ok) throw new Error("Erro ao carregar skin");
      const data = await res.json();

      inputs.conjunto.value = data.nome_Conjunto;
      inputs.preco.value = data.preco;
      inputs.previewPawn.src = data.caminho_Pawn;
      inputs.previewKing.src = data.caminho_King;
      inputs.previewPawn.style.display = "block";
      inputs.previewKing.style.display = "block";
    } catch (err) {
      alert(err.message);
      return;
    }
  }

  // Previsão de imagem
  function setupImagePreview(input, preview) {
    input?.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        preview.src = URL.createObjectURL(file);
        preview.style.display = "block";
      }
    });
  }

  setupImagePreview(inputs.pawnInput, inputs.previewPawn);
  setupImagePreview(inputs.kingInput, inputs.previewKing);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    disableForm(true);

    const loadingText = document.createElement("p");
    loadingText.textContent = "Carregando...";
    form.appendChild(loadingText);

    try {
      const res = await fetch(isEdit ? `/skin/${id}` : "/skins", {
        method: isEdit ? "PUT" : "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Erro ao salvar");
      }

      alert(`Skin ${isEdit ? "atualizada" : "criada"} com sucesso!`);
      window.location.href = "index.html";
    } catch (err) {
      alert("Erro: " + err.message);
    } finally {
      loadingText.remove();
      disableForm(false);
    }
  });

  function disableForm(state) {
    form
      .querySelectorAll("input, button")
      .forEach((el) => (el.disabled = state));
  }
});
