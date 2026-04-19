import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Award, Ruler, Home as HomeIcon, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PROJECTS } from '../constants';

const Home = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-white">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=2670" 
            className="w-full h-full object-cover brightness-[0.4]"
            alt="Hero Background"
          />
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs md:text-sm uppercase tracking-[0.4em] font-semibold mb-6 text-brand-gold"
          >
            Since 1999 • 27 Years of Craftsmanship
          </motion.p>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium mb-8 leading-tight"
          >
            분당인테리어 추천 전문,<br />
            호텔식 판교 아파트 리모델링 MID 디자인
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-base md:text-xl font-light text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            분당·판교 하이엔드 주거 설계부터 <br />
            전국 프랜차이즈 시공까지, <br />
            MID 디자인 스튜디오의 타협 없는 고집.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col md:flex-row items-center justify-center gap-6"
          >
            <Link 
              to="/portfolio" 
              className="px-10 py-4 bg-brand-gold text-white uppercase tracking-widest text-xs font-bold hover:bg-opacity-90 transition-all flex items-center"
            >
              Our Projects <ChevronRight size={14} className="ml-2" />
            </Link>
            <Link 
              to="/booking" 
              className="px-10 py-4 border border-white text-white uppercase tracking-widest text-xs font-bold hover:bg-white hover:text-slate-900 transition-all"
            >
              Book a Consultation
            </Link>
          </motion.div>
        </div>
        
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce opacity-50">
          <span className="text-[10px] uppercase tracking-widest mb-2 font-semibold">Scroll</span>
          <div className="w-[1px] h-12 bg-white" />
        </div>
      </section>

      {/* Core Competitiveness */}
      <section className="py-32 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              {
                icon: <Award className="text-brand-gold mb-6" size={48} strokeWidth={1} />,
                title: "27년 노하우",
                desc: "1999년부터 쌓아온 독보적인 시공 빅데이터와 트렌드 해석 능력."
              },
              {
                icon: <Ruler className="text-brand-gold mb-6" size={48} strokeWidth={1} />,
                title: "프랜차이즈 인테리어",
                desc: "틈새라면 전국 프랜차이즈 전담 시공, 시스템화된 매뉴얼 공정 관리."
              },
              {
                icon: <HomeIcon className="text-brand-gold mb-6" size={48} strokeWidth={1} />,
                title: "하이엔드 맞춤 설계",
                desc: "분당/판교 지역 아파트 및 상업 공간을 위한 프리미엄 자재와 감각적인 디테일."
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="group"
              >
                {item.icon}
                <h3 className="text-2xl font-serif font-bold mb-4 group-hover:text-brand-gold transition-colors">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed font-light">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="py-32 px-6 md:px-12 bg-slate-50">
        <div className="max-w-7xl mx-auto mb-20 text-center">
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-brand-gold mb-4 block">Selection</span>
          <h2 className="text-3xl md:text-6xl font-bold mb-6">분당인테리어 시공 사례</h2>
          <p className="text-slate-400 font-light max-w-xl mx-auto">
            판교 아파트 리모델링부터 하이엔드 상업 공간까지, MID의 철학이 담긴 대표 프로젝트를 확인하세요.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {PROJECTS.slice(0, 3).map((project, i) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative h-[500px] overflow-hidden cursor-pointer"
            >
              <img 
                src={project.imageUrl} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt={project.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="absolute bottom-0 p-8">
                <span className="text-[10px] uppercase tracking-widest text-brand-gold font-bold mb-2 block">{project.category}</span>
                <h4 className="text-2xl font-serif text-white font-bold mb-2">{project.title}</h4>
                <p className="text-white/60 text-xs uppercase tracking-widest">{project.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center">
          <Link 
            to="/portfolio" 
            className="inline-flex items-center text-xs uppercase tracking-widest font-bold group"
          >
            View Full Portfolio 
            <ChevronRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Trust Quote */}
      <section className="py-40 bg-slate-950 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <h2 className="text-[300px] font-bold absolute -top-40 -left-20 leading-none">TRUST</h2>
        </div>
        
        <div className="relative z-10 px-6">
          <p className="text-brand-gold uppercase tracking-[0.5em] text-[10px] font-bold mb-8">Philosophy</p>
          <blockquote className="text-2xl md:text-5xl font-serif font-light leading-relaxed max-w-4xl mx-auto italic mb-12">
            "유행은 변해도 <br className="md:hidden" /> 기본은 변하지 않습니다."
          </blockquote>
          <p className="text-sm md:text-lg text-white/50 font-light max-w-2xl mx-auto leading-relaxed">
            27년 동안 흔들림 없이 지켜온 MID의 약속은 <br />
            단순히 화려한 디자인이 아닌, <br />
            보이지 않는 곳의 탄탄한 기초와 <br />
            철저한 사후 관리입니다.
          </p>
        </div>
      </section>

      {/* Quick Booking CTA */}
      <section className="py-32 px-6 md:px-12 bg-white">
        <div className="max-w-5xl mx-auto bg-slate-900 p-12 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 blur-[100px] -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div>
              <h2 className="text-2xl md:text-5xl font-bold text-white mb-6 leading-tight whitespace-nowrap">분당인테리어 상담하기</h2>
              <p className="text-white/60 font-light max-w-md">
                지금 바로 판교 아파트 리모델링 방문 상담을 예약하세요. <br />
                27년 경력의 디렉터가 직접 공간의 해법을 제시합니다.
              </p>
            </div>
            <Link 
              to="/booking" 
              className="whitespace-nowrap px-12 py-5 bg-white text-slate-900 text-xs uppercase tracking-[0.2em] font-bold hover:bg-brand-gold hover:text-white transition-all shadow-2xl"
            >
              Start Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
