import { motion, type HTMLMotionProps, type Variants } from 'motion/react';

const VARIANTS: Variants = {
  hidden: { 
    filter: 'blur(8px)',
    opacity: 0
  },
  visible: {
    filter: 'blur(0px)',
    opacity: 0.65,
    transition: {
      duration: 1.25,
      ease: 'easeInOut'
    }
  },
  exit: {
    filter: 'blur(8px)',
    opacity: 0,
    transition: {
      duration: 1.25,
      ease: 'easeInOut'
    }
  }
};

export const AnimatedImage = (props: HTMLMotionProps<"img">) => {
  
  return (
    <motion.img 
      className="motion-safe:transition-transform" 
      variants={VARIANTS}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      {...props} />
  )

}