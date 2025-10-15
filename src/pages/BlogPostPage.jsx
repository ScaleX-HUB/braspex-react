import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, Tag, ArrowLeft, Share } from 'phosphor-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getPostBySlug, getRelatedPosts } from '../data/blogData';

const BlogPostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = getPostBySlug(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-32 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Artigo não encontrado</h1>
          <button
            onClick={() => navigate('/blog')}
            className="text-[#005563] hover:underline flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar para o blog
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const relatedPosts = getRelatedPosts(post.id, post.category);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#005563] to-[#003840] text-white pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <button
            onClick={() => navigate('/blog')}
            className="flex items-center gap-2 text-gray-200 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar para o blog
          </button>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block bg-[#FFD027] text-[#005563] px-4 py-2 rounded-full text-sm font-bold mb-4">
              {post.category}
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">{post.title}</h1>
            
            <div className="flex flex-wrap items-center gap-6 text-gray-200">
              <span className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {post.date}
              </span>
              <span className="flex items-center gap-2">
                <User className="w-5 h-5" />
                {post.author}
              </span>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Share className="w-5 h-5" />
                Compartilhar
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-8 lg:p-12"
          >
            {/* Excerpt */}
            <div className="text-xl text-gray-700 mb-8 pb-8 border-b border-gray-200 italic">
              {post.excerpt}
            </div>

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none
                prose-headings:text-[#005563] prose-headings:font-bold
                prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
                prose-ul:my-6 prose-ul:ml-6
                prose-li:text-gray-700 prose-li:mb-2
                prose-strong:text-[#005563] prose-strong:font-semibold
                prose-a:text-[#005563] prose-a:underline hover:prose-a:text-[#FFD027]"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Keywords */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-500 mb-3">Palavras-chave:</h3>
              <div className="flex flex-wrap gap-2">
                {post.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-12 p-6 bg-gradient-to-r from-[#005563] to-[#003840] rounded-xl text-white">
              <h3 className="text-2xl font-bold mb-3">Precisa de uma solução personalizada?</h3>
              <p className="text-gray-200 mb-4">
                Entre em contato com a Braspex e receba uma cotação gratuita para seu projeto.
              </p>
              <a
                href="/#contato"
                className="inline-block bg-[#FFD027] text-[#005563] px-6 py-3 rounded-lg font-semibold hover:bg-[#ffd942] transition-all"
              >
                Solicitar Cotação
              </a>
            </div>
          </motion.article>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-16"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Artigos Relacionados</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <a
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.slug}`}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <div className="relative h-32 bg-gradient-to-br from-[#005563] to-[#003840] flex items-center justify-center text-white text-4xl">
                      {relatedPost.icon}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPostPage;
