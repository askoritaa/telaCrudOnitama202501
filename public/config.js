export const types = {
    pecas: {
        apiPath: "/skins",
        singlePath: "/skin",
        title: "Peças",
        columns: ["Id", "Nome do Conjunto", "Preço", "Skin Peão", "Skin Rei", "Ação"],
        render: "renderPecas",
    },
    backgrounds: {
        apiPath: "/backgrounds",
        singlePath: "/background",
        title: "Backgrounds",
        columns: ["Id", "Nome do Background", "Prévia", "Ação"],
        render: "renderBackgrounds",
    }
}