import { motion } from 'motion/react';
import type { ReactNode } from 'react';

interface AnimatedParagraphProps {

  html: string[];

  children?: ReactNode;

}

const PARAGRAPH_VARIANTS = {
  hidden: { 
    filter: 'blur(8px)',
  },
  visible: {
    filter: 'blur(0px)',
    transition: {
      duration: 3,
      ease: 'easeInOut',
      staggerChildren: 0.15
    }
  },
  exit: {
    filter: 'blur(8px)',
    opacity: 0,
    transition: {
      duration: 1.25,
      ease: 'easeIn'
    }
  }
};

const CHILDREN_VARIANTS = (delay: number) => ({
  hidden: { 
    opacity: 0,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 2,
      ease: 'easeInOut',
      delay
    }
  },
  exit: {
    opacity: 0,
    filter: 'blur(8px)',
    transition: {
      duration: 1.25,
      ease: 'easeIn'
    }
  }
});

const TOKEN_VARIANTS = {
  hidden: { opacity: 0, scale: 0.97, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: 'easeInOut'
    }
  }
};

export const AnimatedParagraph = (props: AnimatedParagraphProps) => {
  
  return props.children ? (
    <motion.div
      className="motion-safe:transition-transform" 
      variants={PARAGRAPH_VARIANTS}
      initial="hidden"
      whileInView="visible">
      <p>
        {props.html.map((html, idx) => (
          <motion.span
            className="inline-block origin-center"
            key={`token-${idx}`}
            variants={TOKEN_VARIANTS}
            dangerouslySetInnerHTML={{ __html: `${html}\u00A0`}}>
          </motion.span>
        ))}
      </p>

      <motion.div
        className="motion-safe:transition-transform"
        variants={CHILDREN_VARIANTS((props.html.length + 1) * 0.15)}>
        {props.children}
      </motion.div>
    </motion.div>
  ) : (
    <motion.p 
      className="motion-safe:transition-transform" 
      variants={PARAGRAPH_VARIANTS}
      initial="hidden"
      whileInView="visible">
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