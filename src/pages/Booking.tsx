import React, { useState } from 'react';
import { motion } from 'motion/react';
import { format, addDays, startOfToday, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, isBefore } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, MapPin, Send } from 'lucide-react';
import { cn } from '../lib/utils';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { REGIONS, BUDGET_RANGES } from '../constants';
import { BookingStatus } from '../types';

const Calendar = ({ selectedDate, onSelectDate }: { selectedDate: Date, onSelectDate: (d: Date) => void }) => {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(selectedDate));
  
  const days = eachDayOfInterval({
    start: currentMonth,
    end: endOfMonth(currentMonth),
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const startDayIdx = currentMonth.getDay();

  return (
    <div className="p-8 bg-white shadow-xl border border-slate-100 rounded-2xl">
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-2xl font-serif font-bold">{format(currentMonth, 'MMMM yyyy')}</h3>
        <div className="flex space-x-4">
          <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-full transition-colors flex items-center">
            <ChevronLeft size={20} />
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-full transition-colors flex items-center">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {weekDays.map(d => (
          <div key={d} className="text-[10px] uppercase tracking-widest text-slate-400 font-bold text-center py-2">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: startDayIdx }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          const isPast = isBefore(day, startOfToday());
          
          return (
            <button
              key={day.toString()}
              disabled={isPast}
              onClick={() => onSelectDate(day)}
              className={cn(
                "h-12 w-full rounded-xl flex items-center justify-center text-sm font-medium transition-all relative group",
                isSelected ? "bg-slate-900 text-white shadow-lg" : "hover:bg-slate-50 text-slate-800",
                isPast ? "opacity-20 cursor-not-allowed" : "cursor-pointer"
              )}
            >
              {format(day, 'd')}
              {isSelected && (
                <motion.div 
                  layoutId="dot"
                  className="absolute bottom-2 w-1 h-1 bg-brand-gold rounded-full" 
                />
              )}
            </button>
          );
        })}
      </div>
      
      <div className="mt-8 flex items-center space-x-6 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-slate-900" />
          <span>Selected</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-slate-200" />
          <span>Unavailable</span>
        </div>
      </div>
    </div>
  );
};

const Booking = () => {
  const [selectedDate, setSelectedDate] = useState(addDays(startOfToday(), 1));
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [formData, setFormData] = useState({
    clientName: '',
    contact: '',
    address: '',
    size: '',
    budget: BUDGET_RANGES[0],
    details: '',
    region: REGIONS[0]
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const times = ['10:00', '14:00', '16:00', '19:00'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'bookings'), {
        ...formData,
        date: selectedDate.toISOString(),
        time: selectedTime,
        status: 'pending' as BookingStatus,
        createdAt: serverTimestamp()
      });
      setSubmitted(true);
      window.scrollTo(0, 0);
    } catch (err) {
      console.error(err);
      alert('예약 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="pt-40 pb-60 px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto bg-white p-20 shadow-2xl rounded-3xl border border-slate-50"
        >
          <div className="w-20 h-20 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center mx-auto mb-8">
            <Send size={40} />
          </div>
          <h2 className="text-4xl font-bold mb-6">예약이 접수되었습니다.</h2>
          <p className="text-slate-500 font-light text-lg mb-12">
            담당자가 확인 후 24시간 이내에 연락드리겠습니다. <br/>
            MID를 선택해주셔서 감사합니다.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-12 py-4 bg-slate-900 text-white text-xs uppercase tracking-widest font-bold hover:bg-brand-navy transition-all"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-40">
      <section className="px-6 md:px-12 mb-20 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-brand-gold mb-6 block">Reservation</span>
          <h1 className="text-5xl md:text-7xl font-bold mb-8">방문 상담 예약</h1>
          <div className="flex justify-center mb-10">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://m.booking.naver.com/booking/13/bizes/1180716/items/5971491?area=pll&lang=ko&service-target=map-pc&startDate=2026-04-20&theme=place"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center space-x-3 bg-[#e52528] text-white px-10 py-5 rounded-full font-bold text-lg shadow-[0_10px_30px_rgba(229,37,40,0.4)] hover:shadow-[0_15px_40px_rgba(229,37,40,0.5)] transition-all duration-300"
            >
              <span className="w-8 h-8 bg-white text-[#e52528] rounded-full flex items-center justify-center font-black text-xs group-hover:rotate-12 transition-transform">N</span>
              <span>네이버로 빠른 예약</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="ml-2"
              >
                →
              </motion.div>
              <div className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-white/20"></span>
              </div>
            </motion.a>
          </div>
          <p className="text-slate-500 font-light text-lg leading-relaxed">
            전문 인테리어 디렉터와의 1:1 방문 상담을 예약하세요. <br className="hidden md:block" />
            공간의 시작과 끝을 MID가 함께 고민합니다.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Calendar Side */}
          <div className="lg:col-span-12 xl:col-span-5">
             <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
             
             <div className="mt-12 p-8 bg-slate-900 text-white rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/20 blur-3xl" />
                <h4 className="text-xs uppercase tracking-[0.3em] font-bold text-brand-gold mb-4">Notification</h4>
                <p className="text-sm font-light leading-relaxed text-white/70">
                  • 주말 및 공휴일에도 방문상담이 가능합니다. <br/>
                  • 예약 완료 시 안내 문자가 발송됩니다. <br/>
                  • 시공 요청 지역에 따라 일정이 조율될 수 있습니다.
                </p>
             </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-12 xl:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="bg-slate-50/50 p-10 rounded-2xl border border-slate-100">
                <h3 className="text-xl font-serif font-bold mb-8 flex items-center">
                  <Clock className="mr-3 text-brand-gold" size={20} /> 
                  상담 시간 선택 (선택한 날짜: {format(selectedDate, 'yyyy-MM-dd')})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {times.map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedTime(t)}
                      className={cn(
                        "py-4 border text-sm font-bold transition-all",
                        selectedTime === t 
                          ? "bg-slate-900 border-slate-900 text-white shadow-lg" 
                          : "border-slate-200 bg-white text-slate-500 hover:border-slate-400"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 ml-1">이름</label>
                    <input 
                      required
                      type="text" 
                      placeholder="성함을 입력해주세요"
                      className="w-full px-6 py-4 border-b border-slate-200 focus:border-brand-gold focus:outline-none bg-transparent transition-all"
                      value={formData.clientName}
                      onChange={e => setFormData({...formData, clientName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 ml-1">연락처</label>
                    <input 
                      required
                      type="tel" 
                      placeholder="010-0000-0000"
                      className="w-full px-6 py-4 border-b border-slate-200 focus:border-brand-gold focus:outline-none bg-transparent transition-all"
                      value={formData.contact}
                      onChange={e => setFormData({...formData, contact: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 ml-1 block">지역</label>
                    <select 
                      className="w-full px-6 py-4 border-b border-slate-200 focus:border-brand-gold focus:outline-none bg-transparent transition-all appearance-none"
                      value={formData.region}
                      onChange={e => setFormData({...formData, region: e.target.value})}
                    >
                      {['분당', '판교', '서울', '기타'].map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 ml-1">평수</label>
                    <input 
                      type="text" 
                      placeholder="예: 34평"
                      className="w-full px-6 py-4 border-b border-slate-200 focus:border-brand-gold focus:outline-none bg-transparent transition-all"
                      value={formData.size}
                      onChange={e => setFormData({...formData, size: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 ml-1">아파트명</label>
                  <input 
                    type="text" 
                    placeholder="상세 정보를 입력해주세요"
                    className="w-full px-6 py-4 border-b border-slate-200 focus:border-brand-gold focus:outline-none bg-transparent transition-all"
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 ml-1">상담 내용</label>
                  <textarea 
                    rows={4}
                    placeholder="상담을 원하시는 구체적인 내용을 입력해주세요..."
                    className="w-full px-6 py-4 border border-slate-100 focus:border-brand-gold focus:outline-none bg-slate-50/30 transition-all rounded-xl"
                    value={formData.details}
                    onChange={e => setFormData({...formData, details: e.target.value})}
                  />
                </div>
              </div>

              <button 
                disabled={loading}
                type="submit"
                className="w-full py-6 bg-slate-900 text-white uppercase tracking-[0.3em] font-bold hover:bg-brand-navy transition-all flex items-center justify-center disabled:opacity-50"
              >
                {loading ? '처리 중...' : '예약 완료하기'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Booking;
