// JavaScript Example: Reading Entities
// Filterable fields: usuarioId, conteudo, imagem, tipo, tags, likes, visualizacoes
async function fetchPostEntities() {
    // AREA DE MOCK DESCONTINUADO
    // const response = await fetch(`https://app.base44.com/api/apps/690777d6acbffd890a4e5b35/entities/Post`, {
    //     headers: {
    //         api_key: import.meta.env.VITE_BASE44_API_KEY, // ou use await User.me() para obter a chave API
    //         'Content-Type': 'application/json'
    //     }
    // });
    const response = await apiPost("/Post/Postar", data);
    const data = await response.json();
    console.log(data);
}

// JavaScript Example: Updating an Entity
// Filterable fields: usuarioId, conteudo, imagem, tipo, tags, likes, visualizacoes
async function updatePostEntity(entityId, updateData) {
    // AREA DE MOCK DESCONTINUADO
    // const response = await fetch(`https://app.base44.com/api/apps/690777d6acbffd890a4e5b35/entities/Post/${entityId}`, {
    //     method: 'PUT',
    //     headers: {
    //         api_key: import.meta.env.VITE_BASE44_API_KEY, // ou use await User.me() para obter a chave API
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(updateData)
    // });
    const response = await apiPut(`/Post/${entityId}`, updateData);
    const data = await response.json();
    console.log(data);
}
