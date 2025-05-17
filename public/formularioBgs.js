document.addEventListener("DOMContentLoaded", async () => {
  const form =
    document.getElementById("form-background") ||
    document.getElementById("form-background-editar");
  if (!form) return;

  const id = new URLSearchParams(window.location.search).get("id");
  const isEdit = Boolean(id);

  const inputs = {
    nome: document.getElementById("nome-bg"),
    spriteInput: document.getElementById("sprite-bg"),
    preview: document.getElementById("preview-bg"),
  };

  if (isEdit) {
    try {
      const res = await fetch(`/background/${id}`);
      if (!res.ok) throw new Error("Erro ao carregar background");
      const data = await res.json();

      inputs.nome.value = data.nome;
      inputs.preview.src = data.caminho;
      inputs.preview.style.display = "block";
    } catch (err) {
      alert(err.message);
      return;
    }
  }

  inputs.spriteInput?.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      inputs.preview.src = URL.createObjectURL(file);
      inputs.preview.style.display = "block";
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    disableForm(true);

    const loadingText = document.createElement("p");
    loadingText.textContent = "Carregando...";
    form.appendChild(loadingText);

    try {
      const res = await fetch(isEdit ? `/background/${id}` : "/backgrounds", {
        method: isEdit ? "PUT" : "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Erro ao salvar");
      }

      alert(`Background ${isEdit ? "atualizado" : "criado"} com sucesso!`);
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
