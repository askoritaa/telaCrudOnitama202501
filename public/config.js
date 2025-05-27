export const types = {
    pecas: {
        apiPath: "/skins",
        singlePath: "/skin",
        title: "Peças",
        columns: ["Id", "Nome do Conjunto", "Preço", "Skin Peão", "Skin Rei", "Ação"],
        render: "renderPecas",
        dataKey: "skins",
    },
    backgrounds: {
        apiPath: "/backgrounds",
        singlePath: "/background",
        title: "Backgrounds",
        columns: ["Id", "Nome do Background", "Prévia", "Ação"],
        render: "renderBackgrounds",
        dataKey: "backgrounds",
    },
    emojis: {
        apiPath: "/emojis",
        singlePath: "/emoji",
        title: "Emojis",
        columns: ["Id", "Nome do Emojis", "Preço", "Prévia imagem", "Ação"],
        render: "renderEmojis",
        dataKey: "emojis",
    }
}
