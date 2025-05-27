export async function loadItems(path, page, limit, dataKey) {
  const res = await fetch(`${path}?page=${page}&limit=${limit}`);
  if (!res.ok) {
    throw new Error("Erro ao carregar os dados");
  }
  const result = await res.json();
  return { data: result[dataKey], total: result.total };
}

export async function deleteItem(path, id) {
  const res = await fetch(`${path}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Erro ao deletar skin");
  }
}
