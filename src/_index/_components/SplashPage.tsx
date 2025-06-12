import { Scrollama, Step } from 'react-scrollama';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

const PARAGRAPHS = [
  'In the year 1590, Joachim Camerarius the Younger — botanist, zoologist, and humanist scholar from Nuremberg — published the Symbola et Emblemata.',
  'The Symbola et Emblemata were part of the popular genre of emblem books. Descendants of medieval bestiaries, emblem books paired allegorical illustrations — emblems — with reflections on animals, proverbs, fables, morals, or poems, often drawing from Greek and Roman sources.',
  'Written in Latin and Greek, the Symbola et Emblemata were an early encyclopedia. But unlike today\'s encyclopedias, they sought to teach through metaphor — blending natural history, moral reflection, and poetic form.',
  'I am the Machina Emblematica, built to preserve Camerarius\' knowledge — and to guide those who seek it. Follow me, and let us together  turn the pages of the Symbola et Emblemata once more.'
];

export const SplashPage = () => {

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const split = (str: string, n: number) =>
    str.match(new RegExp(`(?:\\S+\\s*){1,${n}}`, 'g'))!.map(s => s.trim());

  const containerVariants = {
    hidden: { 
      filter: 'blur(8px)',
    },
    visible: {
      filter: 'blur(0px)',
      transition: {
        duration: 2,
        ease: 'easeOut',
        staggerChildren: 0.25
      }
    },
    exit: {
      filter: 'blur(8px)',
      opacity: 0,
      transition: {
        duration: 1.5,
        ease: 'easeOut'
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

  /*
  return (
    <section id="introduction" className="mt-32 space-y-32">
      <Scrollama onStepEnter={({ data }: { data: number}) => setCurrentStep(data)}>
        {PARAGRAPHS.map((line, lineIdx) => (
          <Step data={lineIdx} key={`line-${lineIdx}`}>
            <motion.p
              className="motion-safe:transition-transform"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
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
          </Step>
      ))}
      </Scrollama>
    </section>
  )
    */

  const onStepEnter = ({ data }: { data: number}) => {
    setCurrentStepIndex(data);
  };

  return (
    <>
      <AnimatePresence>
        <motion.div 
          layout
          key={currentStepIndex}
          className="motion-safe:transition-transform absolute"
          style={{ position: 'fixed', top: '50vh', transform: 'translateY(-50%)', maxWidth: '50%'}}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit">
          {split(PARAGRAPHS[currentStepIndex], 5).map((word, wordIdx) => (
            <motion.span
              style={{ display: 'inline-block', transformOrigin: 'center' }}
              key={`word-${wordIdx}`}
              variants={wordVariants}>
              {`${word}\u00A0`}
            </motion.span>
          ))}
        </motion.div>
      </AnimatePresence>

      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '10px',
      }}>
        <Scrollama offset={0.5} onStepEnter={onStepEnter}>
          {[1, 2, 3, 4].map((_, stepIndex) => (
            <Step data={stepIndex} key={stepIndex}>
              <div
                style={{
                  height: '100vh'
                }}
  
              >
              
              </div>
            </Step>
          ))}
        </Scrollama>
      </div>
    </>
  )

}