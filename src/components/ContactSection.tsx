"use client"

import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "react-toastify"
import {
  Mail,
  Send,
  MessageSquare,
  Globe,
  Clock,
  Sparkles,
  Headphones,
  CheckCircle2,
  MapPin,
} from "lucide-react"

// --- Validation Schema ---
const contactSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

type ContactFormValues = z.infer<typeof contactSchema>

interface ContactInfoCardProps {
  icon: React.ReactNode
  title: string
  value: string
  subtitle: string
  delay?: number
}

/**
 * ContactSection Component
 * A premium contact section with form validation, scroll animations, and decorative elements.
 */
export function ContactSection() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  })

  // Animation intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsInView(true)
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const onSubmit = async (data: ContactFormValues) => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log("Contact Form Submitted:", data)
      toast.success("Message sent successfully! Our team will contact you soon.")
      reset()
    } catch (error) {
      toast.error("Failed to send message. Please try again later.")
    }
  }

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-24 relative overflow-hidden bg-background"
    >
      {/* --- Premium Background Elements --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/2 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/2 blur-[120px] rounded-full animate-pulse delay-700"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto space-y-20">
          
          {/* --- Header Section --- */}
          <div className={`text-center max-w-3xl mx-auto space-y-6 transition-all duration-1000 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-primary/20">
               <Sparkles className="w-3.5 h-3.5 fill-primary/20 animate-spin-slow" /> {t("contact.badge") || "Get in Touch"}
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-[0.95]">
               {t("contact.title") || "Let's start a conversation."}
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
               {t("contact.subtitle") || "Have a question about our courses or need a custom solution for your team? We're here to help."}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
            
            {/* --- Contact Form Section (Left) --- */}
            <div className={`bg-card/40 backdrop-blur-xl border border-primary/10 rounded-[3rem] p-8 md:p-14 shadow-2xl shadow-primary/5 relative overflow-hidden transition-all duration-1000 delay-300 ${isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}>
              
              <div className="space-y-10">
                <div className="space-y-2">
                  <h2 className="text-3xl font-black tracking-tight text-foreground">{t("extra.send_message") || "Send a Message"}</h2>
                  <p className="text-muted-foreground text-sm font-medium">
                    Expected response time: <span className="text-primary font-bold">{t("extra.expected_response") || "under 2 hours"}</span>
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t("extra.full_name") || "Full Name"}</label>
                      <input 
                        {...register("fullName")}
                        type="text" 
                        placeholder={t("extra.placeholder_name") || "John Doe"} 
                        className={`w-full h-14 px-6 bg-background/50 border rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary/40 outline-none transition-all font-bold placeholder:opacity-30 text-foreground ${errors.fullName ? "border-red-500/50" : "border-border"}`} 
                      />
                      {errors.fullName && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.fullName.message}</p>}
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t("extra.email_address") || "Email Address"}</label>
                      <input 
                        {...register("email")}
                        type="email" 
                        placeholder={t("extra.placeholder_email") || "john@example.com"} 
                        className={`w-full h-14 px-6 bg-background/50 border rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary/40 outline-none transition-all font-bold placeholder:opacity-30 text-foreground ${errors.email ? "border-red-500/50" : "border-border"}`} 
                      />
                      {errors.email && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t("extra.subject") || "Subject"}</label>
                    <input 
                      {...register("subject")}
                      type="text" 
                      placeholder={t("extra.placeholder_subject") || "What is this regarding?"} 
                      className={`w-full h-14 px-6 bg-background/50 border rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary/40 outline-none transition-all font-bold placeholder:opacity-30 text-foreground ${errors.subject ? "border-red-500/50" : "border-border"}`} 
                    />
                    {errors.subject && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.subject.message}</p>}
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t("extra.your_message") || "Your Message"}</label>
                    <textarea 
                      {...register("message")}
                      rows={4} 
                      placeholder={t("extra.placeholder_message") || "Tell us how we can help..."} 
                      className={`w-full px-6 py-5 bg-background/50 border rounded-[2rem] focus:ring-2 focus:ring-primary/20 focus:border-primary/40 outline-none transition-all font-bold placeholder:opacity-30 text-foreground resize-none ${errors.message ? "border-red-500/50" : "border-border"}`}
                    ></textarea>
                    {errors.message && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.message.message}</p>}
                  </div>

                  <button 
                    disabled={isSubmitting}
                    type="submit" 
                    className="w-full h-16 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group"
                  >
                    {isSubmitting ? (
                      <Clock className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> 
                        {t("extra.submit") || "Send Message"}
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* --- Contact Info & Cards (Right) --- */}
            <div className={`flex flex-col justify-between py-2 space-y-12 transition-all duration-1000 delay-500 ${isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}>
              
              <div className="space-y-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <ContactInfoCard 
                    icon={<Mail className="w-5 h-5" />}
                    title={t("contact.email_us") || "Email Us"}
                    value="hello@yourbrand.com"
                    subtitle="Official Support"
                  />
                  <ContactInfoCard 
                    icon={<Headphones className="w-5 h-5" />}
                    title={t("contact.live_support") || "Live Support"}
                    value="+1 (800) 123-4567"
                    subtitle="Mon - Fri, 10am - 5pm"
                  />
                  <ContactInfoCard 
                    icon={<MapPin className="w-5 h-5" />}
                    title={t("contact.our_studio") || "Our Studio"}
                    value="Dhaka, Bangladesh"
                    subtitle="Gulshan-2, Road 45"
                  />
                  <ContactInfoCard 
                    icon={<Globe className="w-5 h-5" />}
                    title={t("contact.socials") || "Socials"}
                    value="@YourBrandHQ"
                    subtitle="Twitter / Instagram"
                  />
                </div>
              </div>

              {/* --- SLA / Trust Card --- */}
              <div className="bg-card/40 backdrop-blur-sm border border-primary/10 rounded-[2.5rem] p-10 relative overflow-hidden group hover:border-primary/30 transition-all duration-500">
                  <div className="relative z-10 space-y-6">
                    <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/5 group-hover:bg-primary group-hover:text-primary-foreground group-hover:rotate-6 transition-all duration-500">
                        <Clock className="w-7 h-7 text-primary group-hover:text-inherit transition-colors" />
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-xl font-black tracking-tight text-foreground italic">{t("contact.rapid_response") || "Rapid Response Team"}</h4>
                        <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                          {t("contact.sla_desc") || "Our global team ensures that no message goes unanswered. We typically respond faster than you can brew a cup of coffee."}
                        </p>
                    </div>
                    <div className="flex items-center gap-8">
                        <div className="space-y-0.5">
                            <span className="text-[10px] uppercase font-black tracking-widest text-primary">{t("contact.avg_wait") || "Avg. Wait"}</span>
                            <p className="font-black text-xl text-foreground">42m</p>
                        </div>
                        <div className="w-px h-10 bg-border"></div>
                        <div className="space-y-0.5">
                            <span className="text-[10px] uppercase font-black tracking-widest text-primary">{t("contact.satisfaction") || "Satisfaction"}</span>
                            <div className="flex items-center gap-1.5">
                                <p className="font-black text-xl text-foreground">99.9%</p>
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                            </div>
                        </div>
                    </div>
                  </div>
                  <MessageSquare className="absolute bottom-[-40px] right-[-40px] w-56 h-56 text-primary opacity-[0.03] group-hover:rotate-12 transition-transform duration-1000" />
              </div>

            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
      `}</style>
    </section>
  )
}

function ContactInfoCard({ icon, title, value, subtitle }: ContactInfoCardProps) {
  return (
    <div className="p-7 bg-card/40 backdrop-blur-xl border border-primary/10 rounded-[2rem] hover:border-primary/30 transition-all duration-500 group relative overflow-hidden hover:shadow-2xl hover:shadow-primary/5">
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="flex flex-col gap-5 relative z-10">
        <div className="w-14 h-14 bg-primary/10 border border-primary/20 text-primary rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-sm group-hover:shadow-lg group-hover:shadow-primary/20">
          <div className="group-hover:scale-110 transition-transform duration-500">
            {icon}
          </div>
        </div>
        <div className="space-y-1">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-primary/70">{title}</h4>
          <p className="text-base font-black text-foreground tracking-tight break-words">{value}</p>
          <p className="text-[10px] font-bold text-muted-foreground/60">{subtitle}</p>
        </div>
      </div>
    </div>
  )
}