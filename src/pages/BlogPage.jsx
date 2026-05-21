import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, Tag, ArrowRight, Search } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { blogPosts } from '../data/blogData';
import { useSiteContent } from '../contexts/SiteContentContext';
import { safeJsonParse } from '../lib/safeJson';

const BlogPage = () => {
  const { content } = useSiteContent();
  const blogContent = content.blogPage;
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    document.title = 'Blog Braspex | Artigos sobre Hidráulica Industrial';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', 'Artigos técnicos sobre sistemas hidráulicos industrializados, manutenção, eficiência e instalações prediais. Blog da Braspex.');
  }, []);
  const categories = useMemo(() => {
    const parsed = safeJsonParse(blogContent?.categoriesJson, null);
    return Array.isArray(parsed) && parsed.length
      ? parsed
      : ['Todos', 'Chuveiros Industriais', 'Aquecedores', 'Ar-Condicionado', 'Chassis', 'Manutenção', 'Eficiência'];
  }, [blogContent?.categoriesJson]);

  const allCategory = categories[0] || 'Todos';
  const [selectedCategory, setSelectedCategory] = useState(allCategory);

  useEffect(() => {
    if (!categories.includes(selectedCategory)) {
      setSelectedCategory(allCategory);
    }
  }, [allCategory, categories, selectedCategory]);

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === allCategory || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#005563] to-[#003840] text-white pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold mb-4">{blogContent?.heroTitle || 'Blog Braspex'}</h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              {blogContent?.heroSubtitle || 'Conteúdos técnicos sobre tubulações industriais, manutenção e eficiência energética'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={blogContent?.searchPlaceholder || 'Buscar artigos...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005563]"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-[#005563] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <a href={`/blog/${post.slug}`} className="block">
                  <div className="relative h-48 bg-gradient-to-br from-[#005563] to-[#003840] overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-white text-6xl opacity-20">
                      {post.icon}
                    </div>
                    <div className="absolute top-4 right-4 bg-[#FFD027] text-[#005563] px-3 py-1 rounded-full text-xs font-bold">
                      {post.category}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-[#005563] transition-colors">
                      {post.title}
                    </h2>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {post.author}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-[#005563] font-semibold text-sm">
                      {blogContent?.readMore || 'Ler mais'}
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </a>
              </motion.article>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">{blogContent?.emptyText || 'Nenhum artigo encontrado com os filtros selecionados.'}</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPage;
