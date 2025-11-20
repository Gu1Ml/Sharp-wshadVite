// JavaScript Example: Reading Entities
// Filterable fields: usuarioId, titulo, descricao, linkGitHub, linkDemo, imagem, tecnologias, destaque, stars, status
async function fetchPortfolioEntities() {
    const response = await fetch(`https://app.base44.com/api/apps/690777d6acbffd890a4e5b35/entities/Portfolio`, {
        headers: {
            'api_key': '787992f803f64c51b836b4d586c65d34', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data);
}

// JavaScript Example: Updating an Entity
// Filterable fields: usuarioId, titulo, descricao, linkGitHub, linkDemo, imagem, tecnologias, destaque, stars, status
async function updatePortfolioEntity(entityId, updateData) {
    const response = await fetch(`https://app.base44.com/api/apps/690777d6acbffd890a4e5b35/entities/Portfolio/${entityId}`, {
        method: 'PUT',
        headers: {
            'api_key': '787992f803f64c51b836b4d586c65d34', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
    });
    const data = await response.json();
    console.log(data);
}