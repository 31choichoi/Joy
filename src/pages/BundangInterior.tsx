import { motion } from 'motion/react';
import { Mail, Phone, MapPin, ChevronRight, Star, Home as HomeIcon } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function BundangInterior() {
  const [filter, setFilter] = useState('all');

  const portfolioItems = [
    {
      id: 1,
      title: "분당 정자동 아이파크 32평 올수리",
      desc: "모던 호텔식 화이트 컨셉 리모델링",
      tags: ["분당인테리어", "정자동", "30평형대"],
      filters: ["bundang", "30py"],
      img: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800",
      badge: "HOT",
      price: "프리미엄 견적"
    },
    {
      id: 2,
      title: "분당 서현동 시범단지 27평 인테리어",
      desc: "따뜻한 우드 포인트 내추럴 스타일",
      tags: ["분당인테리어", "서현동", "20평형대"],
      filters: ["bundang", "20py"],
      img: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800",
      price: "맞춤 견적"
    },
    {
      id: 3,
      title: "판교 알파리움 43평 리모델링",
      desc: "하이엔드 고급 대리석 마감과 조명 설계",
      tags: ["판교인테리어", "성남인테리어", "40평형대"],
      filters: ["pangyo", "40py"],
      img: "https://mydrim.net/img/%ED%8C%90%EA%B5%90%EC%95%8C%ED%8C%8C%EB%A6%AC%EC%9B%8043%ED%8F%89.png",
      price: "고급형 견적"
    },
    {
      id: 4,
      title: "분당 이매동 31평 모던 리모델링",
      desc: "와이드 타일과 매립 수전 시스템 욕실",
      tags: ["분당인테리어", "이매동", "30평형대"],
      filters: ["bundang", "30py"],
      img: "https://mydrim.net/img/%EB%B6%84%EB%8B%B9%EC%9D%B4%EB%A7%A4%EB%8F%9931%ED%8F%89%EC%9D%B8%ED%85%8C%EB%A6%AC%EC%96%B4.png",
      price: "합리적 견적"
    },
    {
      id: 5,
      title: "분당 수내동 파크뷰 45평 하이엔드",
      desc: "프리미엄 원목 마루와 간접 조명 마감",
      tags: ["분당인테리어", "수내동", "40평형대"],
      filters: ["bundang", "40py"],
      img: "https://mydrim.net/img/%EB%B6%84%EB%8B%B9%ED%8C%8C%ED%81%AC%EB%B7%B045%ED%8F%89.png",
      price: "최고급 견적"
    },
    {
      id: 6,
      title: "판교 봇들마을 34평 맞춤 주방",
      desc: "공간 효율을 극대화한 대면형 주방 설계",
      tags: ["판교인테리어", "성남인테리어", "30py"],
      filters: ["pangyo", "30py"],
      img: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=800",
      price: "평당 견적 문의"
    }
  ];

  const filteredItems = filter === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.filters.includes(filter));

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative bg-slate-900 py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1400&q=80" 
            className="w-full h-full object-cover" 
            alt="Hero background"
          />
        </div>
        <div className="relative max-w-4xl mx-auto text-center z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 mb-8 rounded-full border border-brand-gold/30 bg-brand-gold/10 text-brand-gold text-xs font-medium tracking-widest uppercase"
          >
            분당·판교 하이엔드 인테리어 전문
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight"
          >
            <span className="text-brand-gold">분당인테리어</span> 전문<br />MID인테리어
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/70 font-light mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            27년 노하우가 담긴 호텔식 리모델링의 정수.<br />
            분당 성남 판교 정자동 아파트 시공 전문 업체입니다.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link to="/portfolio" className="px-8 py-4 bg-brand-gold text-white font-semibold rounded-lg hover:bg-brand-gold/90 transition-all">
              포트폴리오 보기
            </Link>
            <Link to="/booking" className="px-8 py-4 bg-white/10 text-white font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-all">
              무료 견적 문의
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-slate-100 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "분당 지역 시공 완료", val: "500+" },
            { label: "인테리어 전문 경력", val: "27년" },
            { label: "고객 만족도", val: "4.9★" },
            { label: "철저한 사후 관리", val: "100%" }
          ].map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="text-3xl font-serif font-bold text-brand-gold mb-1">{stat.val}</div>
              <div className="text-xs text-slate-500 font-light uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-24 px-6 md:px-12 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 font-serif">분당인테리어 포트폴리오</h2>
            <p className="text-slate-500 font-light max-w-2xl mx-auto">
              MID인테리어가 시공한 분당 성남 판교 지역 리모델링 사례입니다.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {[
              { id: 'all', label: '전체' },
              { id: '20py', label: '20평형대' },
              { id: '30py', label: '30평형대' },
              { id: '40py', label: '40평형대' },
              { id: 'bundang', label: '분당구' },
              { id: 'pangyo', label: '판교' }
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setFilter(btn.id)}
                className={`px-5 py-2 rounded-full text-xs transition-all border ${
                  filter === btn.id 
                    ? 'bg-brand-gold text-white border-brand-gold shadow-lg shadow-brand-gold/20' 
                    : 'bg-white text-slate-500 border-slate-200 hover:border-brand-gold hover:text-brand-gold'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <motion.div 
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={item.id} 
                className="bg-white rounded-xl overflow-hidden border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all group"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  {item.badge && (
                    <span className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded">
                      {item.badge}
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex gap-2 mb-3">
                    {item.tags.map((tag, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 bg-brand-gold/10 text-brand-gold font-medium rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 truncate">{item.title}</h3>
                  <p className="text-sm text-slate-500 font-light mb-4 line-clamp-2">{item.desc}</p>
                  <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-xs text-slate-400">{item.filters[1]} · {item.filters[0] === 'bundang' ? '분당구' : '판교'}</span>
                    <span className="text-sm font-semibold text-brand-gold">{item.price}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-6 md:px-12 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 font-serif text-brand-gold">분당인테리어 평당 견적 안내</h2>
            <p className="text-white/50 font-light max-w-2xl mx-auto">
              투명한 오픈 견적으로 믿음을 드립니다.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { range: "180~240만 원", type: "실속 리모델링", items: ["도배 · 장판 · 조명", "욕실 부분 시공", "기분 주방 교체"] },
              { range: "250~290만 원", type: "표준 올수리", items: ["전체 실크도배·강마루", "욕실 2개 전체 교체", "브랜드 주방 + 중문"] },
              { range: "300~340만 원", type: "프리미엄 호텔식", items: ["고급 마감재 선택", "구조 변경 및 시스템 조명", "드레스룸 라인 설계"] },
              { range: "350만 원+", type: "하이엔드 럭셔리", items: ["천연석 및 수입 자재", "맞춤 제작 가구 풀세트", "전담 디자이너 1:1 설계"] }
            ].map((plan, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-all">
                <div className="text-2xl font-serif text-brand-gold mb-2">{plan.range}</div>
                <div className="text-sm font-medium mb-6 text-white/80">{plan.type}</div>
                <ul className="text-xs text-white/40 space-y-2 font-light">
                  {plan.items.map((item, j) => <li key={j}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-slate-900 mb-8 text-center">분당인테리어, 왜 MID인테리어인가요?</h2>
          <div className="space-y-6 text-slate-600 font-light leading-relaxed text-lg">
            <p>
              “건축공학 전공자 대표가 직접 설계하고 시공하는 MID인테리어는 사용자의 생활 방식이 자연스럽게 녹아들고, 시간이 흐를수록 가치가 증명되는 ‘견고한’ 공간을 만드는 길을 27년 동안 걸어왔습니다.”
            </p>
            <p className="italic underline underline-offset-8 decoration-brand-gold/30">
              "인테리어는 단순히 보기 좋은 그림을 그리는 것이 아닙니다."
            </p>
            <p>
              “우리는 트렌드를 쫓기보다 공간의 본질에 집중합니다. 화려한 마감재 이전에 기초가 튼튼한 공사를, 겉모습 이전에 효율적인 동선과 디테일한 수납 설계를 우선시합니다. 건축적 완성도와 실용성을 함께 고려하는 이러한 철학이 지난 2002년부터 지금까지 수많은 고객들이 MID인테리어를 다시 찾는 이유입니다.”
            </p>
          </div>
          <div className="mt-12 text-center">
            <Link to="/booking" className="inline-block px-10 py-5 bg-brand-gold text-white font-bold rounded-xl shadow-xl shadow-brand-gold/30 hover:-translate-y-1 transition-all">
              무료 방문 상담 신청하기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
