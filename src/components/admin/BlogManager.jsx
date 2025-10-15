import React, { useState, useEffect } from 'react';
import { Article, Plus, PencilSimple, Trash, Eye, CalendarBlank, User } from 'phosphor-react';
import { blogPosts } from '../../data/blogData';

const BlogManager = () => {
  const [posts, setPosts] = useState(blogPosts);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: 'Equipe BRASPEX',
    category: 'Dicas',
    image: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleNewPost = () => {
    setCurrentPost(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      author: 'Equipe BRASPEX',
      category: 'Dicas',
      image: '',
      date: new Date().toISOString().split('T')[0],
    });
    setIsEditing(true);
  };

  const handleEditPost = (post) => {
    setCurrentPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      category: post.category,
      image: post.image,
      date: post.date,
    });
    setIsEditing(true);
  };

  const handleDeletePost = (slug) => {
    if (window.confirm('Tem certeza que deseja excluir este post?')) {
      setPosts(posts.filter(p => p.slug !== slug));
      // Aqui você salvaria no Supabase
      alert('Post excluído com sucesso!');
    }
  };

  const handleSave = () => {
    if (!formData.title || !formData.slug || !formData.excerpt || !formData.content) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (currentPost) {
      // Editar post existente
      setPosts(posts.map(p => p.slug === currentPost.slug ? { ...formData } : p));
      alert('Post atualizado com sucesso!');
    } else {
      // Criar novo post
      setPosts([...posts, { ...formData, id: Date.now() }]);
      alert('Post criado com sucesso!');
    }
    
    setIsEditing(false);
    // Aqui você salvaria no Supabase
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentPost(null);
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title)
    });
  };

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            {currentPost ? 'Editar Post' : 'Novo Post'}
          </h2>
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#005563] text-white rounded-lg hover:bg-[#004450] transition-colors flex items-center gap-2"
            >
              <Plus size={20} weight="bold" />
              {currentPost ? 'Atualizar Post' : 'Criar Post'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título do Post *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
              placeholder="Digite o título do post"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug (URL) *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
              placeholder="slug-do-post"
            />
            <p className="text-sm text-gray-500 mt-1">
              URL: /blog/{formData.slug || 'slug-do-post'}
            </p>
          </div>

          {/* Autor e Categoria */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Autor *
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
              >
                <option value="Dicas">Dicas</option>
                <option value="Produtos">Produtos</option>
                <option value="Novidades">Novidades</option>
                <option value="Instalação">Instalação</option>
                <option value="Manutenção">Manutenção</option>
              </select>
            </div>
          </div>

          {/* Data e Imagem */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Publicação *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL da Imagem de Capa
              </label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Resumo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resumo (Excerpt) *
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent"
              placeholder="Breve descrição do post (aparece na listagem)"
            />
          </div>

          {/* Conteúdo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Conteúdo Completo *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={12}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005563] focus:border-transparent font-mono text-sm"
              placeholder="Escreva o conteúdo completo do post aqui..."
            />
            <p className="text-sm text-gray-500 mt-1">
              Dica: Use Markdown para formatação
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gerenciar Blog</h2>
          <p className="text-gray-600 mt-1">
            {posts.length} posts publicados
          </p>
        </div>
        <button
          onClick={handleNewPost}
          className="px-4 py-2 bg-[#005563] text-white rounded-lg hover:bg-[#004450] transition-colors flex items-center gap-2"
        >
          <Plus size={20} weight="bold" />
          Novo Post
        </button>
      </div>

      {/* Lista de Posts */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Post
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Autor
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post.slug} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      {post.image && (
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{post.title}</div>
                        <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {post.excerpt}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User size={16} />
                      {post.author}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CalendarBlank size={16} />
                      {new Date(post.date).toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Visualizar"
                      >
                        <Eye size={20} />
                      </a>
                      <button
                        onClick={() => handleEditPost(post)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                        title="Editar"
                      >
                        <PencilSimple size={20} />
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.slug)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Excluir"
                      >
                        <Trash size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BlogManager;
