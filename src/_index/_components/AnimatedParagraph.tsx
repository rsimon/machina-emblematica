import { motion } from 'motion/react';

interface AnimatedParagraphProps {

  html: string[];

}

const PARAGRAPH_VARIANTS = {
  hidden: { 
    filter: 'blur(8px)',
  },
  visible: {
    filter: 'blur(0px)',
    transition: {
      duration: 3,
      ease: 'easeIn',
      staggerChildren: 0.15
    }
  },
  exit: {
    filter: 'blur(8px)',
    opacity: 0,
    transition: {
      duration: 2,
      ease: 'easeIn'
    }
  }
};

const TOKEN_VARIANTS = {
  hidden: { opacity: 0, scale: 0.97, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 1.75,
      ease: 'easeInOut'
    }
  }
};

export const AnimatedParagraph = (props: AnimatedParagraphProps) => {
  
  return (
    <motion.p 
      className="motion-safe:transition-transform" 
      variants={PARAGRAPH_VARIANTS}
      initial="hidden"
      whileInView="visible"
      viewport={{
        amount: 0.35
      }}>
      {props.html.map((html, idx) => (
        <motion.span
          className="inline-block origin-center"
          key={`token-${idx}`}
          variants={TOKEN_VARIANTS}
          dangerouslySetInnerHTML={{ __html: `${html}\u00A0`}}>
        </motion.span>
      ))}
    </motion.p>
  )

}