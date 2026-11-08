"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import Link from "next/link";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How long does it take to build a website?",
    answer:
      "It depends on the complexity of your project. A simple landing page can be done in 1-2 weeks, while a full e-commerce store or custom web application typically takes 4-8 weeks. We'll give you a clear timeline after understanding your requirements.",
  },
  {
    question: "How much does a website cost?",
    answer:
      "Every project is unique, so pricing depends on your specific needs and requirements. After our initial discussion, we'll provide you with a detailed quote that outlines exactly what you'll get and what it will cost. We offer flexible payment plans to make your project more manageable.",
  },
  {
    question: "Do I need to know anything technical?",
    answer:
      "Not at all! We handle all the technical aspects. You just need to share your vision, content, and feedback. We'll guide you through the entire process and explain everything in plain language, no tech jargon.",
  },
  {
    question: "Will the website work on mobile phones?",
    answer:
      "Absolutely! Every website we build is fully responsive and optimized for all devices: phones, tablets, and desktops. In fact, we design mobile-first to ensure the best experience for your visitors, no matter how they access your site.",
  },
  {
    question: "Can I update the website myself after it's built?",
    answer:
      "Yes! We can set up an easy-to-use content management system that lets you update text, images, and products without any coding knowledge. We'll also provide training and documentation so you feel confident making changes.",
  },
  {
    question: "What happens if something breaks on the website?",
    answer:
      "We offer ongoing maintenance and support packages to keep your website secure and running smoothly. If something breaks, I'm just an email away. For urgent issues, I typically respond within 24 hours.",
  },
  {
    question: "Do you help with website hosting and domain?",
    answer:
      "Yes, we can help you choose the best hosting solution for your needs and assist with domain registration. We recommend reliable providers that offer great performance and security at reasonable prices.",
  },
  {
    question: "Will the website show up on Google?",
    answer:
      "We build all websites with SEO best practices in mind: proper structure, fast loading speeds, mobile optimization, and clean code. For businesses wanting more visibility, we also offer additional SEO services to help you rank higher in search results.",
  },
];

function FAQItemComponent({
  item,
  isOpen,
  onToggle,
  index,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="border-b border-border last:border-b-0"
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 sm:py-6 text-left transition-colors hover:text-foreground group"
        aria-expanded={isOpen}
      >
        <span className="text-sm sm:text-base font-medium pr-4">
          {item.question}
        </span>
        <div className="shrink-0 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full border border-border bg-muted/50 transition-colors group-hover:bg-muted">
          {isOpen ? (
            <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          ) : (
            <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          )}
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-5 sm:pb-6 text-xs sm:text-sm text-muted-foreground leading-relaxed pr-8 sm:pr-12">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="relative w-full bg-background py-16 sm:py-24 md:py-32"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-16"
        >
          <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            FAQ
          </div>
          <h2 className="mb-4 sm:mb-6 text-3xl sm:text-4xl font-bold tracking-tight md:text-5xl text-emerald-600 dark:text-emerald-500">
            Common questions
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
            Everything you need to know about working with us. Can&apos;t find
            what you&apos;re looking for? Feel free to reach out!
          </p>
        </motion.div>

        {/* FAQ List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl border border-border bg-background/50 backdrop-blur-sm px-5 sm:px-8"
        >
          {faqs.map((faq, index) => (
            <FAQItemComponent
              key={index}
              item={faq}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              index={index}
            />
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 sm:mt-12 text-center"
        >
          <p className="text-sm sm:text-base text-muted-foreground mb-4">
            Still have questions?
          </p>
          <Link
            href="/#contact"
            className="inline-flex h-10 sm:h-11 items-center justify-center rounded-full bg-foreground px-5 sm:px-6 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Get in Touch
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
