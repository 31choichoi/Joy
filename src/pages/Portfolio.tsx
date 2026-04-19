import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PROJECTS } from '../constants';
import { ProjectCategory } from '../types';
import { Filter, Search, ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';

const Portfolio = () => {
  const [filter, setFilter] = useState<ProjectCategory | 'All'>('All');

  const categoryMap: Record<string, string> = {
    'All': '전체',
    'Residential': '주거공간',
    'Commercial': '상업공간',
    'Remodeling': '리모델링'
  };

  const categories: (ProjectCategory | 'All')[] = ['All', 'Residential', 'Commercial', 'Remodeling'];

  const filteredProjects = PROJECTS.filter(project => {
    return filter === 'All' || project.category === filter;
  });

  return (
    <div className="pt-32 pb-40">
      {/* Header */}
      <section className="px-6 md:px-12 mb-20 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-brand-gold mb-6 block">Our Expertise</span>
          <h2 className="text-3xl md:text-7xl font-bold mb-8">Selected Projects</h2>
          <p className="text-slate-500 font-light text-base md:text-lg leading-relaxed">
            MID는 공간의 목적과 사용자의 니즈를 깊게 이해하여 <br className="hidden md:block" />
            가장 완성도 높은 건축 및 인테리어 솔루션을 제공합니다.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="px-6 md:px-12 mb-12">
        <div className="max-w-7xl mx-auto flex justify-center border-y border-slate-100 py-6 md:py-10">
          <div className="grid grid-cols-2 md:flex items-center justify-center gap-0 w-full md:w-auto">
            {categories.map((cat, index) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={cn(
                  "px-4 md:px-12 py-4 text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold transition-all duration-300 relative border border-slate-200 -ml-[1px] -mt-[1px] md:mt-0",
                  filter === cat 
                    ? "bg-brand-navy text-white border-brand-navy z-10" 
                    : "bg-white text-slate-400 hover:text-brand-gold hover:bg-slate-50"
                )}
              >
                <span className="relative z-10 whitespace-nowrap">
                  {categoryMap[cat]}
                </span>
                
                {filter === cat && (
                  <motion.div 
                    layoutId="activeFilterBg"
                    className="absolute inset-0 bg-brand-navy"
                    transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[4/5] overflow-hidden mb-6">
                  <img 
                    src={project.imageUrl} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {project.isTeumsae && (
                    <div className="absolute top-4 right-4 bg-brand-navy text-white px-3 py-1 text-[8px] uppercase tracking-widest font-bold">
                      Franchise Master
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs uppercase tracking-widest text-brand-gold font-bold">{categoryMap[project.category]}</span>
                    <span className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">{project.location}</span>
                  </div>
                  <h3 className="text-xl font-serif font-bold group-hover:text-brand-gold transition-colors">{project.title}</h3>
                  <p className="text-sm text-slate-500 font-light mt-2 line-clamp-2">{project.description}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 font-light">No projects found matching your criteria.</p>
          </div>
        )}
      </section>

      {/* Teumsae Highlight */}
      <section className="mt-32 px-6 md:px-12 bg-slate-900 py-32 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="relative z-10">
            <span className="text-brand-gold uppercase tracking-[0.4em] text-[10px] font-bold mb-6 block">Case Study</span>
            <h2 className="text-2xl md:text-6xl font-bold mb-8 italic leading-tight">틈새라면 전국구 시공 능력</h2>
            <p className="text-white/60 font-light text-base md:text-lg leading-relaxed mb-12">
              단순한 인테리어를 넘어 브랜드의 아이덴티티를 전국적으로 복제하고 유지하는 매뉴얼화된 시스템. 
              MID는 '틈새라면'의 역사를 공간으로 함께 써내려가고 있습니다.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <span className="text-4xl font-serif font-bold text-white mb-2 block">100+</span>
                <span className="text-[10px] uppercase tracking-widest text-white/40">Stores Built</span>
              </div>
              <div>
                <span className="text-4xl font-serif font-bold text-white mb-2 block">100%</span>
                <span className="text-[10px] uppercase tracking-widest text-white/40">Identity Sync</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-brand-gold/10 blur-3xl rounded-full" />
            <img 
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200" 
              className="relative rounded-2xl grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl"
              alt="Franchise Work"
            />
          </div>
        </div>
      </section>

      {/* Blog CTA */}
      <section className="py-32 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-50 rounded-3xl p-12 md:p-24 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-gold/10 transition-colors duration-700" />
            <div className="relative z-10 max-w-2xl text-center md:text-left">
              <span className="text-brand-gold uppercase tracking-[0.4em] text-[10px] font-bold mb-6 block">Our Stories</span>
              <h2 className="text-2xl md:text-3xl font-bold mb-6 leading-tight">
                더 많은 시공 사례와 <br />
                리모델링 팁을 <br />
                공식 블로그에서 <br />
                확인하세요.
              </h2>
              <p className="text-slate-500 font-light text-base md:text-lg mb-0 leading-relaxed">
                공간의 변화를 만드는 생생한 현장 이야기부터 인테리어 가이드까지, <br className="hidden md:block" />
                MID 디자인 스튜디오 블로그에 기록하고 있습니다.
              </p>
            </div>
            <a 
              href="https://blog.naver.com/mid_designstudio"
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 px-12 py-6 bg-orange-600 text-white text-xs uppercase tracking-[0.2em] font-bold hover:bg-orange-500 transition-all shadow-2xl flex items-center group/btn"
            >
              Visit Blog <ExternalLink size={16} className="ml-3 group-hover/btn:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
