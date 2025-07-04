import { motion, type HTMLMotionProps } from 'motion/react';

const VARIANTS = {
  hidden: { 
    filter: 'blur(8px)',
    opacity: 0
  },
  visible: {
    filter: 'blur(0px)',
    opacity: 0.65,
    transition: {
      duration: 2,
      ease: 'easeInOut'
    }
  },
  exit: {
    filter: 'blur(8px)',
    opacity: 0,
    transition: {
      duration: 2,
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
      viewport={{
        amount: 0.25
      }}
      {...props} />
  )

}