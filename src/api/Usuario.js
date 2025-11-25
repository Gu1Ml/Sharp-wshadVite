// Filterable fields: nome, username, email, bio, avatar, cargo, localizacao, githubUsername, linkedinUrl, portfolioUrl, tecnologias, seguidores, seguindo
async function fetchUsuarioEntities() {
    const response = await fetch(`https://app.base44.com/api/apps/690777d6acbffd890a4e5b35/entities/Usuario`, {
        headers: {
            'api_key': '787992f803f64c51b836b4d586c65d34', // ou use await User.me() para obter a chave API
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data);
}

// Filterable fields: nome, username, email, bio, avatar, cargo, localizacao, githubUsername, linkedinUrl, portfolioUrl, tecnologias, seguidores, seguindo
async function updateUsuarioEntity(entityId, updateData) {
    const response = await fetch(`https://app.base44.com/api/apps/690777d6acbffd890a4e5b35/entities/Usuario/${entityId}`, {
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