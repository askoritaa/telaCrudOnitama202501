export async function loadItems(path) {
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error("Erro ao carregar os dados");
  }
  return await res.json();
}

export async function deleteItem(path, id) {
  const res = await fetch(`${path}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Erro ao deletar skin");
  }
}
