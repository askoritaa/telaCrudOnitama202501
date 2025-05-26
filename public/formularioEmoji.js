document.addEventListener("DOMContentLoaded", async () => {
  const form =
    document.getElementById("form-emojis") ||
    document.getElementById("form-emojis-editar");
  if (!form) return;

  const id = new URLSearchParams(window.location.search).get("id");
  const isEdit = Boolean(id);

  const inputs = {
    nome: document.getElementById("emoji"),
    preco: document.getElementById("preco"),
    emojiInput: document.getElementById("sprite-emoji"),
    audioInput: document.getElementById("audio-emoji"),
    previewEmoji: document.getElementById("preview-emoji"),
    previewAudio: document.getElementById("preview-audio"),
  };

  if (isEdit) {
    try {
      const res = await fetch(`/emoji/${id}`);
      if (!res.ok) throw new Error("Erro ao carregar emoji");
      const data = await res.json();

      inputs.nome.value = data.nome;
      inputs.preco.value = data.preco;
      inputs.previewEmoji.src = data.caminho_imagem;
      inputs.previewAudio.src = data.caminho_audio;
      inputs.previewEmoji.style.display = "block";
      inputs.previewAudio.style.display = "block";
    } catch (err) {
      console.log("erro em formulario emoji" + err);
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

  function setupAudioPreview(input, preview) {
    input.addEventListener("change", (e) => {
      const file = e.target.files[0];

      if (file) {
        const url = URL.createObjectURL(file);
        preview.src = url;
        preview.style.display = "block";
        preview.play();
      }
    });
  }

  setupImagePreview(inputs.emojiInput, inputs.previewEmoji);
  setupAudioPreview(inputs.audioInput, inputs.previewAudio);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    disableForm(true);

    const loadingText = document.createElement("p");
    loadingText.textContent = "Carregando...";
    form.appendChild(loadingText);

    try {
      const res = await fetch(isEdit ? `/emoji/${id}` : "/emojis", {
        method: isEdit ? "PUT" : "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Erro ao salvar");
      }

      alert(`Emoji ${isEdit ? "atualizada" : "criada"} com sucesso!`);
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
