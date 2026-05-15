import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { db } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { Post } from '../types';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';
import { format } from 'date-fns';

const Blog = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'posts'),
      where('published', '==', true),
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
      setPosts(data);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 font-serif italic text-slate-400">
        Loading MID Journal...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 md:px-12 bg-slate-50">
        <div className="max-w-7xl mx-auto text-center">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] uppercase tracking-[0.5em] font-bold text-slate-400 mb-6 block"
          >
            Insights & Inspiration
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif font-black tracking-tighter text-slate-950 mb-8"
          >
            MID Journal<span className="text-brand-gold">.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-slate-500 font-light leading-relaxed"
          >
            미드인테리어의 시공 철학, 트렌드 분석, 그리고 공간을 대하는 우리의 깊이 있는 이야기를 전합니다.
          </motion.p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-40">
              <p className="text-slate-400 font-serif italic">새로운 소식을 준비 중입니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {posts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <Link to={`/blog/${post.id}`} className="block">
                    <div className="aspect-[16/10] overflow-hidden mb-6 bg-slate-100 relative">
                      {post.thumbnailUrl ? (
                         <img 
                          src={post.thumbnailUrl} 
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          No Image
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest text-slate-900">
                          {post.category || 'Interior'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} /> {format(new Date(post.createdAt), 'yyyy.MM.dd')}
                        </span>
                        <span className="flex items-center gap-1">
                          <User size={12} /> Admin
                        </span>
                      </div>
                      
                      <h2 className="text-2xl font-serif font-black tracking-tight text-slate-900 group-hover:text-brand-gold transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      
                      <p className="text-sm text-slate-500 font-light leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                      
                      <div className="pt-4 flex items-center text-xs font-bold uppercase tracking-widest text-slate-950 group-hover:translate-x-2 transition-transform">
                        Read Story <ArrowRight size={14} className="ml-2" />
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
