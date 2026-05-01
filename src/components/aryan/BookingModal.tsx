import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBooking } from "@/context/BookingContext";
import { gsap } from "gsap";

const steps = [
  { id: 1, title: "Select Room" },
  { id: 2, title: "Visit Date" },
  { id: 3, title: "Details" },
  { id: 4, title: "Confirmed" }
];

const rooms = [
  { id: "twin", name: "Twin Sharing", price: "₹9,500", tag: "Social" },
  { id: "single", name: "Single AC", price: "₹16,500", tag: "Private" },
  { id: "suite", name: "Premium Suite", price: "₹22,000", tag: "Luxury" }
];

export const BookingModal = () => {
  const { isOpen, closeBooking, selectedRoom } = useBooking();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    roomType: selectedRoom || "",
    date: "",
    name: "",
    phone: "",
    hometown: ""
  });

  useEffect(() => {
    if (selectedRoom) {
      setFormData(prev => ({ ...prev, roomType: selectedRoom }));
      setStep(2);
    }
  }, [selectedRoom, isOpen]);

  if (!isOpen) return null;

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleNext();
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", damping: 25, stiffness: 200 } },
    exit: { y: "100%", opacity: 0, transition: { ease: "easeInOut", duration: 0.4 } }
  };

  const contentVariants = {
    initial: { x: 20, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { x: -20, opacity: 0, transition: { duration: 0.3, ease: "easeIn" } }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6">
          <motion.div 
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={overlayVariants}
            onClick={closeBooking}
            className="absolute inset-0 bg-background/60 backdrop-blur-md"
          />

          <motion.div 
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-2xl bg-surface border-t md:border border-hairline rounded-t-[2rem] md:rounded-[2rem] overflow-hidden shadow-2xl z-10"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-hairline flex items-center justify-between">
              <div>
                <span className="eyebrow text-maroon text-[0.6rem] mb-1 block">Step 0{step} / 04</span>
                <h2 className="font-display text-2xl tracking-tight">{steps[step-1].title}</h2>
              </div>
              <button 
                onClick={closeBooking}
                className="w-10 h-10 rounded-full border border-hairline flex items-center justify-center hover:bg-background transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-hairline w-full">
              <motion.div 
                className="h-full bg-maroon"
                initial={{ width: 0 }}
                animate={{ width: `${(step / steps.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Body */}
            <div className="p-8 min-h-[400px]">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="step1" variants={contentVariants} initial="initial" animate="animate" exit="exit" className="space-y-4">
                    <p className="text-foreground/60 text-sm mb-6">Choose the living experience that fits your ambition.</p>
                    <div className="grid gap-4">
                      {rooms.map(room => (
                        <button
                          key={room.id}
                          onClick={() => {
                            setFormData({ ...formData, roomType: room.id });
                            handleNext();
                          }}
                          className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 ${
                            formData.roomType === room.id 
                            ? "border-maroon bg-maroon/5" 
                            : "border-hairline hover:border-foreground/20 bg-background/50"
                          }`}
                        >
                          <div className="text-left">
                            <span className="eyebrow text-[0.55rem] text-foreground/40 mb-1 block">{room.tag}</span>
                            <h3 className="font-display text-lg">{room.name}</h3>
                          </div>
                          <div className="text-right">
                            <div className="font-display text-lg">{room.price}</div>
                            <div className="text-[0.6rem] eyebrow opacity-40">per month</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="step2" variants={contentVariants} initial="initial" animate="animate" exit="exit">
                    <p className="text-foreground/60 text-sm mb-6">When should we expect you for the walkthrough?</p>
                    <input 
                      type="date" 
                      className="w-full bg-background border border-hairline rounded-xl p-4 focus:outline-none focus:border-maroon transition-colors text-foreground"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <div className="grid grid-cols-2 gap-4 mt-8">
                      <button onClick={handleBack} className="btn-ghost rounded-full py-3 text-[0.7rem]">Back</button>
                      <button 
                        onClick={handleNext} 
                        disabled={!formData.date}
                        className="btn-arrow rounded-full py-3 text-[0.7rem] disabled:opacity-30"
                      >
                        Continue
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="step3" variants={contentVariants} initial="initial" animate="animate" exit="exit">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <p className="text-foreground/60 text-sm mb-6">Tell us a bit about yourself (or your son).</p>
                      <input 
                        required
                        placeholder="Full Name"
                        className="w-full bg-background border border-hairline rounded-xl p-4 focus:outline-none focus:border-maroon transition-colors text-foreground"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                      <input 
                        required
                        type="tel"
                        placeholder="WhatsApp Number"
                        className="w-full bg-background border border-hairline rounded-xl p-4 focus:outline-none focus:border-maroon transition-colors text-foreground"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                      <input 
                        required
                        placeholder="Hometown (e.g. Jaipur, Bihar)"
                        className="w-full bg-background border border-hairline rounded-xl p-4 focus:outline-none focus:border-maroon transition-colors text-foreground"
                        value={formData.hometown}
                        onChange={(e) => setFormData({...formData, hometown: e.target.value})}
                      />
                      <div className="grid grid-cols-2 gap-4 mt-8">
                        <button type="button" onClick={handleBack} className="btn-ghost rounded-full py-3 text-[0.7rem]">Back</button>
                        <button 
                          type="submit"
                          className="btn-arrow rounded-full py-3 text-[0.7rem]"
                        >
                          Confirm Visit
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div key="step4" variants={contentVariants} initial="initial" animate="animate" exit="exit" className="text-center py-10">
                    <div className="w-20 h-20 bg-maroon/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <motion.svg 
                        width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-maroon"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </motion.svg>
                    </div>
                    <h3 className="font-display text-3xl mb-3 tracking-tight">Spot Reserved.</h3>
                    <p className="text-foreground/60 text-sm max-w-xs mx-auto leading-relaxed">
                      We've sent a confirmation to your WhatsApp. Our warden will call you shortly to guide you to the premises.
                    </p>
                    <button 
                      onClick={closeBooking}
                      className="mt-10 btn-pill text-[0.7rem] px-10"
                    >
                      Return to Site
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
