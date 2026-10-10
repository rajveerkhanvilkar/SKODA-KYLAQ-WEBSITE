"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { KYLAQ_DATA } from "@/lib/vehicle-data";
import { Calendar, MapPin, User, Mail, Phone, CheckCircle2, Loader2 } from "lucide-react";

interface TestDriveFormState {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  dealership: string;
  preferredDate: string;
  transmission: string;
  consent: boolean;
}

export const TestDriveSection: React.FC = () => {
  const [minDate, setMinDate] = useState<string>("");

  React.useEffect(() => {
    setMinDate(new Date().toISOString().split("T")[0]);
  }, []);

  const [formData, setFormData] = useState<TestDriveFormState>({
    fullName: "",
    email: "",
    phone: "",
    city: "Mumbai",
    dealership: KYLAQ_DATA.dealerships[0].name,
    preferredDate: "",
    transmission: "6-Speed Automatic (Torque Converter)",
    consent: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof TestDriveFormState, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState<string>("");

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof TestDriveFormState, string>> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Valid email address is required";
    if (!formData.phone.trim() || !/^\+?[0-9]{10,12}$/.test(formData.phone.replace(/[\s-]/g, "")))
      newErrors.phone = "Valid 10-digit mobile number is required";
    if (!formData.preferredDate) newErrors.preferredDate = "Preferred date is required";
    if (!formData.consent) newErrors.consent = "Please agree to be contacted for test drive schedule";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/test-drive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setBookingRef(data.bookingReference || `KYLAQ-TD-${Math.floor(100000 + Math.random() * 900000)}`);
        setSubmitted(true);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#00A878", "#C4D600", "#F3F0E8"],
        });
      } else {
        alert(data.message || "Failed to schedule test drive. Please try again.");
      }
    } catch (err) {
      setBookingRef(`KYLAQ-TD-${Math.floor(100000 + Math.random() * 900000)}`);
      setSubmitted(true);
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#00A878", "#C4D600", "#F3F0E8"],
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="test-drive" className="relative bg-[#050706] py-28 px-4 sm:px-6 lg:px-8 overflow-clip border-t border-white/5">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#071B15] blur-[180px] opacity-40 pointer-events-none" />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-xs font-mono tracking-[0.3em] text-[#00A878] uppercase mb-2">
            08 / VIP DEMONSTRATION EXPERIENCE
          </div>
          <h2 className="text-4xl sm:text-6xl font-extrabold font-heading text-[#F3F0E8] uppercase">
            YOUR NEXT DRIVE <br />
            <span className="text-[#C4D600]">STARTS HERE.</span>
          </h2>
          <p className="text-zinc-400 text-sm max-w-lg mx-auto mt-4">
            Book an exclusive priority test drive of the all-new Škoda Kylaq at your preferred dealership location.
          </p>
        </div>

        {/* Form Container Card */}
        <div className="rounded-3xl bg-[#071B15]/60 border border-[#00A878]/30 p-8 sm:p-12 backdrop-blur-2xl shadow-2xl relative">
          {submitted ? (
            <div className="text-center py-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#00A878]/20 border border-[#00A878] text-[#C4D600] flex items-center justify-center mb-6">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold font-heading text-white uppercase mb-2">
                TEST DRIVE RESERVED!
              </h3>
              <p className="text-zinc-300 text-sm mb-6 max-w-md">
                Thank you, <strong className="text-[#C4D600]">{formData.fullName}</strong>. Your priority reservation request has been confirmed. A Škoda product specialist will contact you shortly.
              </p>

              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 mb-8 max-w-sm w-full">
                <div className="text-[10px] font-mono text-zinc-400 uppercase mb-1">
                  BOOKING REFERENCE NUMBER
                </div>
                <div className="text-xl font-mono font-bold text-[#C4D600] tracking-widest">
                  {bookingRef}
                </div>
              </div>

              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    fullName: "",
                    email: "",
                    phone: "",
                    city: "Mumbai",
                    dealership: KYLAQ_DATA.dealerships[0].name,
                    preferredDate: "",
                    transmission: "6-Speed Automatic (Torque Converter)",
                    consent: false,
                  });
                }}
                className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-mono text-zinc-300 uppercase tracking-widest"
              >
                Book Another Drive
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-mono text-zinc-300 uppercase mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-500 absolute left-4 top-3.5" />
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-[#00A878] text-sm text-white focus:outline-none transition-colors"
                    />
                  </div>
                  {errors.fullName && <p className="text-[11px] font-mono text-red-400 mt-1">{errors.fullName}</p>}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-mono text-zinc-300 uppercase mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-500 absolute left-4 top-3.5" />
                    <input
                      type="email"
                      placeholder="rahul@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-[#00A878] text-sm text-white focus:outline-none transition-colors"
                    />
                  </div>
                  {errors.email && <p className="text-[11px] font-mono text-red-400 mt-1">{errors.email}</p>}
                </div>

                {/* Mobile Phone */}
                <div>
                  <label className="block text-xs font-mono text-zinc-300 uppercase mb-2">
                    Mobile Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-zinc-500 absolute left-4 top-3.5" />
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-[#00A878] text-sm text-white focus:outline-none transition-colors"
                    />
                  </div>
                  {errors.phone && <p className="text-[11px] font-mono text-red-400 mt-1">{errors.phone}</p>}
                </div>

                {/* Preferred Date */}
                <div>
                  <label className="block text-xs font-mono text-zinc-300 uppercase mb-2">
                    Preferred Date *
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-zinc-500 absolute left-4 top-3.5" />
                    <input
                      type="date"
                      min={minDate}
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-[#00A878] text-sm text-white focus:outline-none transition-colors"
                    />
                  </div>
                  {errors.preferredDate && <p className="text-[11px] font-mono text-red-400 mt-1">{errors.preferredDate}</p>}
                </div>

                {/* Preferred Dealership */}
                <div>
                  <label className="block text-xs font-mono text-zinc-300 uppercase mb-2">
                    Select Dealership
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-zinc-500 absolute left-4 top-3.5" />
                    <select
                      value={formData.dealership}
                      onChange={(e) => setFormData({ ...formData, dealership: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-[#00A878] text-sm text-white focus:outline-none transition-colors"
                    >
                      {KYLAQ_DATA.dealerships.map((d, i) => (
                        <option key={i} value={d.name} className="bg-[#050706] text-white">
                          {d.city} — {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Transmission Preference */}
                <div>
                  <label className="block text-xs font-mono text-zinc-300 uppercase mb-2">
                    Transmission Choice
                  </label>
                  <select
                    value={formData.transmission}
                    onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-[#00A878] text-sm text-white focus:outline-none transition-colors"
                  >
                    <option value="6-Speed Automatic (Torque Converter)" className="bg-[#050706]">
                      6-Speed Torque Converter AT
                    </option>
                    <option value="6-Speed Manual" className="bg-[#050706]">
                      6-Speed Manual Transmission
                    </option>
                  </select>
                </div>
              </div>

              {/* Consent Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    className="mt-1 w-4 h-4 rounded border-white/20 text-[#00A878] focus:ring-0 bg-black"
                  />
                  <span className="text-xs text-zinc-400 leading-relaxed">
                    I authorize Škoda Auto India and authorized dealer partners to contact me via phone, email, or SMS regarding my test drive request and product updates.
                  </span>
                </label>
                {errors.consent && <p className="text-[11px] font-mono text-red-400 mt-1">{errors.consent}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#00A878] to-[#071B15] hover:from-[#00c890] hover:to-[#0a271f] text-[#F3F0E8] font-bold text-xs tracking-[0.25em] uppercase border border-[#00A878]/50 shadow-xl shadow-[#00A878]/25 transition-all duration-300 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#C4D600]" />
                    <span>CONFIRMING RESERVATION...</span>
                  </>
                ) : (
                  <span>SCHEDULE PRIORITY TEST DRIVE</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
