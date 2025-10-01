// Configuração do Baserow
// Para usar o Baserow, você precisa preencher as informações abaixo

export const baserowConfig = {
  // URL da API do Baserow (para instância hospedada use https://api.baserow.io/api)
  // Para instância self-hosted, use sua URL + /api
  apiUrl: 'https://api.baserow.io/api',
  
  // Token de API do Baserow (você vai gerar esse token na sua conta)
  token: '',
  
  // ID do seu database no Baserow
  databaseId: '',
  
  // IDs das tabelas (você vai criar essas tabelas no Baserow)
  tables: {
    content: '', // Tabela para armazenar o conteúdo do site
    analytics: '', // Tabela para armazenar analytics
    users: '' // Tabela para usuários do admin
  }
};

// Estrutura das tabelas para criar no Baserow:

/*
TABELA: content (Conteúdo do Site)
Campos:
- section (Text) - Ex: "hero", "vantagens", "contato"
- field (Text) - Ex: "title", "subtitle", "description"
- value (Long Text) - O valor do campo
- created_at (Date)
- updated_at (Date)

TABELA: analytics (Analytics do Site)
Campos:
- date (Date) 
- user_agent (Long Text)
- ip_address (Text)
- page (Text)
- created_at (Date)

TABELA: users (Usuários Admin)
Campos:
- username (Text)
- password (Text) - Em produção, use hash de senha
- role (Text) - Ex: "admin"
- active (Boolean)
- created_at (Date)
- last_login (Date)
*/