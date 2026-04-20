import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  Calendar, 
  ChevronRight, 
  Phone, 
  MapPin, 
  Award, 
  ShieldCheck, 
  Users,
  Menu,
  X,
  Instagram,
  Facebook,
  Linkedin
} from 'lucide-react';

const languages = [
  { code: 'EN', name: 'English' },
  { code: 'AR', name: 'العربية' },
  { code: 'FR', name: 'Français' },
];

export default function App() {
  const [lang, setLang] = useState('EN');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen selection:bg-gold/20">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-10 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full accent-bg flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white rounded-full"></div>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 uppercase">Hair Istanbul</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            <div className="flex items-center gap-8 text-xs font-semibold uppercase tracking-widest text-slate-400">
              <span className={`pb-1 border-b-2 transition-all cursor-pointer ${lang === 'EN' ? 'text-slate-900 border-gold' : 'border-transparent hover:text-slate-600'}`} onClick={() => setLang('EN')}>EN</span>
              <span className={`pb-1 border-b-2 transition-all cursor-pointer ${lang === 'AR' ? 'text-slate-900 border-gold' : 'border-transparent hover:text-slate-600'}`} onClick={() => setLang('AR')}>AR</span>
              <span className={`pb-1 border-b-2 transition-all cursor-pointer ${lang === 'TR' ? 'text-slate-900 border-gold' : 'border-transparent hover:text-slate-600'}`} onClick={() => setLang('TR')}>TR</span>
            </div>
            
            <div className="h-4 w-px bg-slate-200" />
            
            <div className="text-sm font-medium text-slate-600 tracking-tight">
              +212 522 123 456
            </div>

            <button className="px-6 py-2.5 accent-bg text-white text-xs font-bold uppercase tracking-widest rounded-sm hover:opacity-90 transition-opacity">
              Book Consultation
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-slate-900" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[60] bg-white p-8 md:hidden flex flex-col"
          >
            <div className="flex justify-between items-center mb-16">
              <span className="text-xl font-bold tracking-tight text-slate-900 uppercase">Hair Istanbul</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2">
                <X className="w-8 h-8 text-slate-900" />
              </button>
            </div>
            <div className="flex flex-col gap-8 text-3xl font-light text-slate-900">
              <a href="#" onClick={() => setMobileMenuOpen(false)}>Method</a>
              <a href="#" onClick={() => setMobileMenuOpen(false)}>Results</a>
              <a href="#" onClick={() => setMobileMenuOpen(false)}>Our Doctors</a>
              <a href="#" onClick={() => setMobileMenuOpen(false)}>Contact</a>
            </div>
            <div className="mt-auto pt-10 border-t border-slate-100 flex flex-col gap-8">
              <div className="flex gap-4">
                {languages.map(l => (
                  <button 
                    key={l.code}
                    onClick={() => { setLang(l.code); setMobileMenuOpen(false); }}
                    className={`px-5 py-2 text-xs font-bold uppercase tracking-widest border transition-all ${lang === l.code ? 'accent-bg text-white border-accent-bg' : 'border-slate-200 text-slate-400'}`}
                  >
                    {l.code}
                  </button>
                ))}
              </div>
              <button className="w-full accent-bg text-white py-5 rounded-sm text-sm font-bold uppercase tracking-[0.2em]">
                Book Consultation
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center overflow-hidden bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-0 pt-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 flex flex-col justify-center py-20 pr-10"
            >
              <div className="mb-6 inline-block px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] rounded">
                Turkish Medical Excellence
              </div>
              <h1 className="text-6xl md:text-[80px] font-light text-slate-900 leading-[1.1] mb-8">
                Istanbul's Finest <br/>
                <span className="font-bold">Now in Casablanca.</span>
              </h1>
              <p className="text-slate-500 text-lg leading-loose mb-12 max-w-lg font-normal">
                Experience world-class hair restoration. Our clinic features a 100% Turkish board-certified surgical team, bringing the precision of Istanbul to the heart of Morocco.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 mb-16">
                <button className="accent-bg text-white px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] rounded-sm hover:opacity-90 transition-all flex items-center justify-center gap-3">
                  Start Your Journey
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button className="border border-slate-200 text-slate-900 px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-slate-50 transition-all">
                  View Case Studies
                </button>
              </div>

              <div className="flex items-center space-x-8 text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                <span className="text-slate-900">01 / Analysis</span>
                <span className="text-slate-200 opacity-50">→</span>
                <span>02 / Treatment</span>
                <span className="text-slate-200 opacity-50">→</span>
                <span>03 / Growth</span>
              </div>
            </motion.div>

            <div className="hidden lg:flex lg:col-span-5 bg-slate-soft p-12 flex-col justify-center items-center border-l border-slate-200 relative group">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <img 
                  src="https://picsum.photos/seed/clinic-sleek/1200/1600?grayscale" 
                  alt="Clinic"
                  className="w-full h-full object-cover opacity-20 filter saturate-0"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="w-full max-w-sm bg-white shadow-2xl rounded-xl p-10 border border-slate-100 relative z-10">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Secure Your Visit</h3>
                <p className="text-slate-400 text-xs mb-10 leading-relaxed font-medium">Choose a date for your free diagnostic session with our Turkish specialists.</p>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Full Name</label>
                    <div className="w-full p-4 bg-slate-50 border border-slate-100 rounded text-xs text-slate-300 font-medium tracking-wide">Enter your name</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Procedure</label>
                    <div className="w-full p-4 bg-slate-50 border border-slate-100 rounded text-xs text-slate-900 font-bold flex justify-between items-center">
                      FUE Hair Transplant
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Date</label>
                      <div className="w-full p-4 bg-slate-50 border border-slate-100 rounded text-[10px] text-slate-400 font-bold">Select Date</div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Time</label>
                      <div className="w-full p-4 bg-slate-50 border border-slate-100 rounded text-[10px] text-slate-400 font-bold">Select Time</div>
                    </div>
                  </div>
                  <button className="w-full py-4 accent-bg text-white text-xs font-bold uppercase tracking-[0.2em] rounded-lg mt-4 shadow-xl shadow-slate-200 transition-transform active:scale-[0.98]">
                    Request Appointment
                  </button>
                </div>
              </div>

              <div className="mt-12 flex items-center space-x-6 relative z-10">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200" />
                  ))}
                </div>
                <div className="text-[10px] uppercase tracking-widest leading-normal">
                  <p className="text-slate-900 font-bold">5,000+ Patients</p>
                  <p className="text-slate-400">Board Certified Doctors</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Turkish Edge - Sleek Style */}
        <section className="py-32 bg-white relative" id="about">
          <div className="max-w-7xl mx-auto px-10">
            <div className="mb-20">
              <span className="text-gold font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">Our Standard</span>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">The Turkish Expertise Advantage.</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12">
              {[
                { label: "01", title: "Global Leadership", desc: "Bringing Istanbul's decades of specialization to Casablanca." },
                { label: "02", title: "Precise Methods", desc: "Employing Micro-FUE and Sapphire DHI for total naturalness." },
                { label: "03", title: "Continuous Care", desc: "Direct coordination with our surgical center in Turkey." }
              ].map((item, i) => (
                <div key={i} className="group">
                  <div className="text-gold font-bold text-4xl mb-6 opacity-20 group-hover:opacity-100 transition-opacity">{item.label}</div>
                  <div className="h-px w-12 bg-gold mb-6" />
                  <h4 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h4>
                  <p className="text-slate-500 leading-relaxed text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Results Gallery - Sleek Style */}
        <section className="py-32 bg-slate-soft border-y border-slate-200 overflow-hidden" id="results">
          <div className="max-w-7xl mx-auto px-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-24">
              <div className="max-w-2xl">
                <span className="text-gold font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">Transformation Gallery</span>
                <h2 className="text-4xl md:text-6xl font-light text-slate-900 tracking-tight leading-tight italic">Documented <br/><span className="not-italic font-bold uppercase">Progress</span></h2>
              </div>
              <div className="flex space-x-4">
                <div className="w-12 h-12 border border-slate-300 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all cursor-pointer">
                  <ChevronRight className="w-6 h-6 rotate-180" />
                </div>
                <div className="w-12 h-12 border border-slate-900 rounded-full flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-all cursor-pointer">
                  <ChevronRight className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { tech: "FUE Technique", stage: "Before" },
                { tech: "DHI Method", stage: "6 Months" },
                { tech: "Final Result", stage: "12 Months" }
              ].map((i, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm"
                >
                  <div className="aspect-square bg-slate-100 flex items-center justify-center p-0.5">
                    <img 
                      src={`https://picsum.photos/seed/sleek-hair-${idx}/800/800?grayscale`} 
                      className="w-full h-full object-cover grayscale opacity-80" 
                      alt="Result"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-8 text-center bg-white">
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-3">{i.tech}</div>
                    <div className="h-px w-8 bg-gold mx-auto mb-3"></div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">{i.stage}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Global Footer - Sleek Style */}
        <footer className="pt-32 pb-16 px-10 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
              <div className="md:col-span-4">
                <div className="flex items-center gap-3 mb-10">
                  <div className="w-8 h-8 rounded-full accent-bg flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white rounded-full"></div>
                  </div>
                  <span className="text-xl font-bold tracking-tight text-slate-900 uppercase">Hair Istanbul</span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-10 max-w-sm font-medium">
                  The pioneers of Turkish hair transplant expertise in Morocco. Providing clinical excellence with a patient-first philosophy.
                </p>
                <div className="flex gap-8 text-slate-400">
                  <Instagram className="w-5 h-5 hover:text-slate-900 transition-colors cursor-pointer" />
                  <Facebook className="w-5 h-5 hover:text-slate-900 transition-colors cursor-pointer" />
                  <Linkedin className="w-5 h-5 hover:text-slate-900 transition-colors cursor-pointer" />
                </div>
              </div>
              
              <div className="md:col-span-2 md:col-start-7">
                <h5 className="font-bold uppercase tracking-[0.2em] text-[10px] text-slate-900 mb-8">Navigation</h5>
                <ul className="space-y-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <li><a href="#" className="hover:text-gold transition-colors">Our Method</a></li>
                  <li><a href="#" className="hover:text-gold transition-colors">Success Stories</a></li>
                  <li><a href="#" className="hover:text-gold transition-colors">Our Doctors</a></li>
                </ul>
              </div>

              <div className="md:col-span-2">
                <h5 className="font-bold uppercase tracking-[0.2em] text-[10px] text-slate-900 mb-8">Resources</h5>
                <ul className="space-y-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <li><a href="#" className="hover:text-gold transition-colors">Pricing Guide</a></li>
                  <li><a href="#" className="hover:text-gold transition-colors">FAQ</a></li>
                  <li><a href="#" className="hover:text-gold transition-colors">Contact</a></li>
                </ul>
              </div>

              <div className="md:col-span-2">
                <h5 className="font-bold uppercase tracking-[0.2em] text-[10px] text-slate-900 mb-8">Legal</h5>
                <ul className="space-y-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <li><a href="#" className="hover:text-gold transition-colors">Privacy</a></li>
                  <li><a href="#" className="hover:text-gold transition-colors">Terms</a></li>
                </ul>
              </div>
            </div>
            
            <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.3em]">
                © 2026 Hair Istanbul Clinic
              </p>
              <div className="flex space-x-8 text-[10px] text-slate-300 font-bold uppercase tracking-[0.3em]">
                <span>Morocco</span>
                <span>Turkey</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
