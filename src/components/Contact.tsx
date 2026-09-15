import { useEffect, useRef, useState } from "react";
import { FaGithub, FaLinkedin, FaInstagram, FaPhoneAlt } from "react-icons/fa";
import { MdEmail, MdLocationOn } from "react-icons/md";
import { motion } from "framer-motion";

type Toast = { id: number; type: "success" | "error"; message: string };

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  function pushToast(type: Toast["type"], message: string) {
    const id = Date.now();
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 4500);
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Please enter your name.";
    if (!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/))
      e.email = "Enter a valid email.";
    if (!subject.trim()) e.subject = "Please add a subject.";
    if (!message.trim() || message.trim().length < 10)
      e.message = "Message must be at least 10 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) {
      pushToast("error", "Please fix validation errors.");
      return;
    }
    setLoading(true);
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_CONTACT_API_URL ||
        (process.env.NODE_ENV === "production"
          ? "https://backend.kiitnexus.in/api/contact"
          : "http://localhost:4000/api/contact");
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Submission failed");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      pushToast("success", "Message sent — we will get back to you soon.");
    } catch (err: any) {
      console.error(err);
      pushToast("error", err.message || "Something went wrong");
    } finally {
      if (mounted.current) setLoading(false);
    }
  }

  return (
    <section id="contact" className="relative mt-20 border-t border-white/8">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            Get in <span className="text-[#FFC20E]">Touch</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mt-3">
            Have an idea, project or collaboration? Fill the form or reach us
            directly via the contact details.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left: Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-white/4 to-white/2/8 backdrop-blur-sm border border-white/6 rounded-2xl p-6 md:p-10 shadow-xl"
          >
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex flex-col">
                  <span className="text-sm text-gray-300 mb-2">Full Name</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`rounded-lg bg-neutral-900/60 border border-white/6 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFC20E]/40 transition ${errors.name ? "ring-2 ring-red-500/40" : ""}`}
                    placeholder="Your full name"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && (
                    <span id="name-error" className="mt-1 text-xs text-red-400">
                      {errors.name}
                    </span>
                  )}
                </label>

                <label className="flex flex-col">
                  <span className="text-sm text-gray-300 mb-2">Email</span>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`rounded-lg bg-neutral-900/60 border border-white/6 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFC20E]/40 transition ${errors.email ? "ring-2 ring-red-500/40" : ""}`}
                    placeholder="you@company.com"
                    type="email"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && (
                    <span
                      id="email-error"
                      className="mt-1 text-xs text-red-400"
                    >
                      {errors.email}
                    </span>
                  )}
                </label>
              </div>

              <label className="flex flex-col">
                <span className="text-sm text-gray-300 mb-2">Subject</span>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className={`rounded-lg bg-neutral-900/60 border border-white/6 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFC20E]/40 transition ${errors.subject ? "ring-2 ring-red-500/40" : ""}`}
                  placeholder="Brief subject"
                  aria-invalid={!!errors.subject}
                  aria-describedby={
                    errors.subject ? "subject-error" : undefined
                  }
                />
                {errors.subject && (
                  <span
                    id="subject-error"
                    className="mt-1 text-xs text-red-400"
                  >
                    {errors.subject}
                  </span>
                )}
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-gray-300 mb-2">Message</span>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  className={`rounded-lg bg-neutral-900/60 border border-white/6 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFC20E]/40 transition resize-none ${errors.message ? "ring-2 ring-red-500/40" : ""}`}
                  placeholder="How can we help? Provide a few details..."
                  aria-invalid={!!errors.message}
                  aria-describedby={
                    errors.message ? "message-error" : undefined
                  }
                />
                {errors.message && (
                  <span
                    id="message-error"
                    className="mt-1 text-xs text-red-400"
                  >
                    {errors.message}
                  </span>
                )}
              </label>

              <div className="flex items-center gap-4 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-[#FFC20E] via-[#FFB000] to-[#FF9A00] text-black font-semibold px-5 py-3 rounded-lg shadow hover:scale-[1.01] active:scale-[0.995] transition-transform disabled:opacity-60"
                >
                  {loading ? (
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                  ) : (
                    "Send Message"
                  )}
                </button>

                <span className="text-sm text-gray-400">
                  We reply within 1-3 business days.
                </span>
              </div>
            </form>
          </motion.div>

          {/* Right: Info */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl p-6 md:p-8 bg-neutral-900/40 border border-white/6 shadow-lg"
          >
            <h3 className="text-lg font-bold text-white mb-4">Contact Info</h3>
            <div className="flex flex-col gap-4 text-sm text-gray-300">
              <div className="flex items-start gap-3">
                <MdEmail className="mt-1 text-xl text-[#FFC20E]" aria-hidden />
                <div>
                  <div className="font-medium text-white">Email</div>
                  <a
                    href="mailto:kiitnexus.cse@kiit.ac.in"
                    className="text-gray-300 hover:text-white transition"
                  >
                    kiitnexus.cse@kiit.ac.in
                  </a>
                </div>
              </div>


              <div className="pt-2">
                <div className="font-medium text-white">Follow Us</div>
                <div className="flex items-center gap-4 mt-3 text-2xl text-gray-300">
                  <a
                    href="https://github.com/KiitNexus"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition"
                  >
                    <FaGithub />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/kiitnexus/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#0A66C2] transition"
                  >
                    <FaLinkedin />
                  </a>
                  <a
                    href="https://www.instagram.com/kiitnexus"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-pink-500 transition"
                  >
                    <FaInstagram />
                  </a>
                </div>
              </div>

              <div className="pt-4">
                <div className="font-medium text-white">Location (map)</div>
                <div className="mt-3 rounded-lg overflow-hidden border border-white/6">
                  <iframe
                    title="KIIT Nexus location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15498023.50315466!2d68.75088366184515!3d18.497372554029937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1909213063b06b%3A0x1b6cbd82edb1e908!2sKIIT%20School%20of%20Computer%20Science%20and%20Engineering%20(New%20Block)%20Campus%20-25!5e0!3m2!1sen!2sin!4v1779129227452!5m2!1sen!2sin"
                    className="w-full h-40 md:h-48"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </motion.aside>
        </div>

        {/* Toasts */}
        <div
          aria-live="polite"
          className="fixed z-50 right-6 bottom-6 flex flex-col gap-2"
        >
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`min-w-[220px] px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${t.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}
            >
              {t.message}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
