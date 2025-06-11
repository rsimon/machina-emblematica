import { motion } from 'motion/react';

const PARAGRAPHS = [
  'In the year 1590, Joachim Camerarius the Younger — botanist, zoologist, and humanist scholar from Nuremberg — published the Symbola et Emblemata.',
  'The Symbola et Emblemata were part of the popular genre of emblem books. Descendants of medieval bestiaries, emblem books paired allegorical illustrations — <em>emblems</em> — with reflections on animals, proverbs, fables, morals, or poems, often drawing from Greek and Roman sources.',
  'Written in Latin and Greek, the Symbola et Emblemata were an early encyclopedia. But unlike today\'s encyclopedias, they sought to teach through metaphor — blending natural history, moral reflection, and poetic form.',
  'I am the Machina Emblematica</strong>, built to preserve Camerarius\' knowledge — and to guide those who seek it. Follow me, and let us together  turn the pages of the Symbola et Emblemata once more.'
];

export const SplashPage = () => {

  const split = (str: string, n: number) =>
    str.match(new RegExp(`(?:\\S+\\s*){1,${n}}`, 'g'))!.map(s => s.trim());

  const containerVariants = {
    hidden: { filter: 'blur(8px)' },
    visible: {
      filter: 'blur(0px)',
      transition: {
        duration: 2.5,
        ease: 'easeOut',
        staggerChildren: 0.25
      }
    }
  };

  const wordVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.25,
        ease: 'easeOut'
      }
    }
  };

  return (
    <section id="introduction" className="mt-32 space-y-32">
      {PARAGRAPHS.map((line, lineIdx) => (
        <motion.p
          className="motion-safe:transition-transform"
          key={`line-${lineIdx}`}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}>
          {split(line, 6).map((word, wordIdx) => (
            <motion.span
              style={{ display: 'inline-block', transformOrigin: 'center' }}
              key={`word-${wordIdx}`}
              variants={wordVariants}>
              {`${word}\u00A0`}
            </motion.span>
          ))}
        </motion.p>
      ))}
    </section>
  )

}