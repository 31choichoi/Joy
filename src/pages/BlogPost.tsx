import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Post } from '../types';
import { Calendar, User, ArrowLeft, Tag, Share2, Facebook, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const SEO_KEYWORDS = `${Array(40).fill('분당').join(' ')} ${Array(50).fill('인테리어').join(' ')} ${Array(10).fill('분당인테리어').join(' ')}`;

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'posts', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() } as Post);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center font-serif italic text-slate-400">MID Journal Reading...</div>;
  if (!post) return <div className="h-screen flex flex-col items-center justify-center space-y-4">
    <p>포스트를 찾을 수 없습니다.</p>
    <Link to="/blog" className="text-brand-gold hover:underline">목록으로 돌아가기</Link>
  </div>;

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{post.title} | 분당인테리어 MID인테리어</title>
        <meta name="keywords" content={`${post.tags.join(', ')}, ${SEO_KEYWORDS}`} />
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={`${post.title} | MID인테리어`} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.thumbnailUrl} />
      </Helmet>
      {/* Article Header */}
      <header className="relative w-full h-[60vh] md:h-[70vh] bg-slate-900 overflow-hidden">
        {post.thumbnailUrl ? (
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ duration: 1.5 }}
            src={post.thumbnailUrl} 
            className="absolute inset-0 w-full h-full object-cover"
            alt={post.title}
          />
        ) : (
          <div className="absolute inset-0 bg-slate-800 opacity-50" />
        )}
        
        <div className="absolute inset-0 flex items-center justify-center px-6 md:px-12">
          <div className="max-w-4xl w-full text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <span className="px-4 py-1.5 bg-brand-gold text-white text-[10px] uppercase tracking-[0.3em] font-bold">
                {post.category}
              </span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl lg:text-7xl font-serif font-black tracking-tighter text-white mb-10 leading-tight"
            >
              {post.title}
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-8 text-[10px] uppercase tracking-widest text-white/70 font-semibold"
            >
              <span className="flex items-center gap-2"><Calendar size={14} className="text-brand-gold" /> {format(new Date(post.createdAt), 'MMMM dd, yyyy')}</span>
              <span className="flex items-center gap-2"><User size={14} className="text-brand-gold" /> Written by MID Admin</span>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto py-24 px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="prose prose-slate prose-lg max-w-none font-light leading-relaxed text-slate-700
            prose-headings:font-serif prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-slate-900
            prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
            prose-p:mb-8 prose-li:mb-2
            prose-img:rounded-sm prose-img:shadow-2xl
            prose-strong:font-bold prose-strong:text-slate-900
            prose-blockquote:border-l-4 prose-blockquote:border-brand-gold prose-blockquote:pl-8 prose-blockquote:italic prose-blockquote:text-2xl prose-blockquote:font-serif prose-blockquote:text-slate-500
          ">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>

          <div className="mt-20 pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="flex flex-wrap gap-2">
              {post.tags?.map(tag => (
                <span key={tag} className="px-3 py-1 bg-slate-50 text-[10px] uppercase tracking-widest font-bold text-slate-400 border border-slate-100 flex items-center gap-1.5 hover:bg-slate-100 transition-colors cursor-pointer">
                  <Tag size={10} /> {tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center space-x-6">
              <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Share this Story</span>
              <div className="flex space-x-4">
                <button className="text-slate-400 hover:text-brand-gold transition-colors"><MessageCircle size={18} /></button>
                <button className="text-slate-400 hover:text-brand-gold transition-colors"><Facebook size={18} /></button>
                <button className="text-slate-400 hover:text-brand-gold transition-colors"><Share2 size={18} /></button>
              </div>
            </div>
          </div>

          <div className="mt-24 text-center">
            <Link 
              to="/blog" 
              className="inline-flex items-center space-x-3 text-xs uppercase tracking-widest font-bold text-slate-950 group"
            >
              <div className="w-10 h-10 border border-slate-200 rounded-full flex items-center justify-center group-hover:bg-slate-950 group-hover:text-white transition-all">
                <ArrowLeft size={16} />
              </div>
              <span>Back to Journal</span>
            </Link>
          </div>
        </motion.div>
      </article>

      {/* Banner / CTA */}
      <section className="bg-slate-950 py-24 px-6 md:px-12 overflow-hidden relative">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-serif font-black tracking-tighter text-white mb-8">당신만의 특별한 공간을 <br className="md:hidden"/> 디자인합니다.</h2>
          <Link to="/booking" className="inline-block px-12 py-5 bg-white text-slate-950 text-xs uppercase tracking-widest font-black hover:bg-brand-gold transition-colors">
            Start Your Journey
          </Link>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-serif font-black text-white/5 whitespace-nowrap pointer-events-none">
          MID DESIGN STUDIO
        </div>
      </section>
    </div>
  );
};

export default BlogPost;
