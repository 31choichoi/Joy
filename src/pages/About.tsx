import React from 'react';
import { motion } from 'motion/react';
import { HISTORY } from '../constants';
import { CheckCircle2, TrendingUp, ShieldCheck, Heart } from 'lucide-react';
import { cn } from '../lib/utils';

const About = () => {
  return (
    <div className="pt-32 pb-40">
      {/* CEO Section */}
      <section className="px-6 md:px-12 mb-32">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative inline-block mb-12">
                <img 
                  src="https://mydrim.net/img/midceo.png" 
                  className="w-full max-w-md aspect-[3/4] object-cover"
                  alt="MID White Minimalist Interior"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-8 -right-8 min-w-[320px] p-8 bg-brand-navy text-white shadow-2xl">
                  <span className="text-[10px] uppercase tracking-widest text-brand-gold font-bold block mb-2">Design Philosophy</span>
                  <p className="text-xl font-serif font-bold whitespace-nowrap">Director. Hwang Kyowan</p>
                </div>
            </div>
          </motion.div>
          
          <div>
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-brand-gold mb-6 block">Our Identity</span>
            <h1 className="text-4xl md:text-7xl font-bold mb-10 leading-tight">
              Design follows <br/> Craftsmanship.
            </h1>
            <p className="text-lg text-slate-600 font-light leading-relaxed mb-8">
              “건축공학 전공자 대표가 직접 설계하고 시공하는 MID인테리어는 사용자의 생활 방식이 자연스럽게 녹아들고, 시간이 흐를수록 가치가 증명되는 ‘견고한’ 공간을 만드는 길을 27년 동안 걸어왔습니다.”
            </p>
            <p className="text-slate-500 font-light leading-relaxed mb-4 italic">
              "인테리어는 단순히 보기 좋은 그림을 그리는 것이 아닙니다."
            </p>
            <p className="text-slate-500 font-light leading-relaxed mb-12">
              “우리는 트렌드를 쫓기보다 공간의 본질에 집중합니다. 화려한 마감재 이전에 기초가 튼튼한 공사를, 겉모습 이전에 효율적인 동선과 디테일한 수납 설계를 우선시합니다. 건축적 완성도와 실용성을 함께 고려하는 이러한 철학이 지난 2002년부터 지금까지 수많은 고객들이 MID인테리어를 다시 찾는 이유입니다.”
            </p>
            
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-100">
              <div className="flex items-center space-x-3">
                <CheckCircle2 size={20} className="text-brand-gold" />
                <span className="text-sm font-semibold text-slate-800">정통 시공 노하우</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle2 size={20} className="text-brand-gold" />
                <span className="text-sm font-semibold text-slate-800">체계적인 공정 지원</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle2 size={20} className="text-brand-gold" />
                <span className="text-sm font-semibold text-slate-800">프리미엄 자재 소싱</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle2 size={20} className="text-brand-gold" />
                <span className="text-sm font-semibold text-slate-800">철저한 A/S 시스템</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-slate-50 py-32 px-6 md:px-12 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Our Journey</h2>
            <p className="text-slate-400 font-light">27년의 신뢰가 만든 공간의 역사입니다.</p>
          </div>
          
          <div className="relative">
            {/* Desktop Center Line / Mobile Left Line */}
            <div className="absolute top-0 left-4 md:left-1/2 -translate-x-1/2 w-[1px] h-full bg-slate-200" />
            
            <div className="space-y-24">
              {HISTORY.map((item, i) => (
                <motion.div 
                  key={item.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative flex items-center justify-start md:justify-between"
                >
                  {/* Left Side (Desktop Only) */}
                  <div className="hidden md:flex w-1/2 flex-col items-end text-right px-8">
                    {i % 2 === 0 && (
                      <>
                        <span className="text-4xl md:text-5xl font-serif font-black text-slate-900/10 mb-2">{item.year}</span>
                        <p className="text-base md:text-lg font-bold text-slate-800">{item.event}</p>
                      </>
                    )}
                  </div>
                  
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-brand-gold border-4 border-white z-10" />
                  
                  {/* Right Side (Always on Mobile, Staggered on Desktop) */}
                  <div className="w-full md:w-1/2 pl-12 md:pl-8">
                    {(i % 2 !== 0) ? (
                      <div className="flex flex-col items-start">
                        <span className="text-4xl md:text-5xl font-serif font-black text-slate-900/10 mb-2">{item.year}</span>
                        <p className="text-base md:text-lg font-bold text-slate-800">{item.event}</p>
                      </div>
                    ) : (
                      /* Show on mobile even if index is even */
                      <div className="md:hidden flex flex-col items-start">
                        <span className="text-4xl md:text-5xl font-serif font-black text-slate-900/10 mb-2">{item.year}</span>
                        <p className="text-base md:text-lg font-bold text-slate-800">{item.event}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Icons */}
      <section className="py-32 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
          {[
            { icon: <TrendingUp size={40} className="mx-auto mb-6 text-brand-gold" strokeWidth={1} />, title: "Trend", desc: "시대를 앞서가는 감각과 유행을 타지 않는 클래식의 조화" },
            { icon: <ShieldCheck size={40} className="mx-auto mb-6 text-brand-gold" strokeWidth={1} />, title: "Trust", desc: "투명한 견적과 정직한 시공으로 쌓아가는 두터운 신뢰" },
            { icon: <Heart size={40} className="mx-auto mb-6 text-brand-gold" strokeWidth={1} />, title: "Care", desc: "고객의 삶의 패턴을 배려하는 주거 친화적 공간 설계" },
            { icon: <CheckCircle2 size={40} className="mx-auto mb-6 text-brand-gold" strokeWidth={1} />, title: "Quality", desc: "작은 마감 처리 하나에도 완벽을 기하는 장인 정신" },
          ].map((item, i) => (
            <div key={i}>
              {item.icon}
              <h3 className="text-xl font-bold mb-4">{item.title}</h3>
              <p className="text-sm text-slate-500 font-light leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
