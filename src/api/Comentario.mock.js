// JavaScript Exemplo: Reading Entities
// Filterable fields: postId, usuarioId, conteudo, likes
async function fetchComentarioEntities() {
    const response = await fetch(`https://app.base44.com/api/apps/690777d6acbffd890a4e5b35/entities/Comentario`, {
        headers: {
            'api_key': '787992f803f64c51b836b4d586c65d34', // ou use await User.me() para obter a chave API
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data);
}

// JavaScript Exemplo: Atualizando uma Entidade
// Filterable fields: postId, usuarioId, conteudo, likes
async function updateComentarioEntity(entityId, updateData) {
    const response = await fetch(`https://app.base44.com/api/apps/690777d6acbffd890a4e5b35/entities/Comentario/${entityId}`, {
        method: 'PUT',
        headers: {
            'api_key': '787992f803f64c51b836b4d586c65d34', // ou use await User.me() para obter a chave API
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
    });
    const data = await response.json();
    console.log(data);
}