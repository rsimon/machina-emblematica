import { AnimatePresence, motion } from 'motion/react';
import { CaretDownIcon } from "@phosphor-icons/react";

const SECTIONS = [{
  image: 'images/01-portrait-col.png',
  imageClass: 'w-[320px] pt-1',
  text: [
    'In the year 1590,',
    'Joachim Camerarius the Younger —',
    'botanist, zoologist, and humanist', 
    'scholar from Nuremberg',
    '— published the', 
    '<em>Symbola et Emblemata</em>.'
  ],
  textClass: 'pr-8 pt-16'
}, {
  image: 'images/02-title-page.png',
  imageClass: 'w-[320px] pb-24',
  text: [
    'The <em>Symbola</em> were part of',
    'the popular genre of emblem', 
    'books. Descendants of', 
    'medieval bestiaries,', 
    'they paired',
    'allegorical illustrations—emblems—with', 
    'reflections on',
    'animals, proverbs,', 
    'fables, morals, or poems, often',
    'drawing from', 
    'Greek and Roman sources.'
   ] ,
  textClass: 'text-right pt-10 pr-12'
},{
  image: 'images/03-emblem.png',
  imageClass: 'w-[380px]',
  text: [
    'Written in Latin and Greek,', 
    'the <em>Symbola</em>',
    'were an early encyclopedia.',
    'But unlike today\'s encyclopedias,',
    'they sought to teach through',
    'metaphor—blending',
    'natural history, moral',
    'reflection, and poetic form.'
  ],
  textClass: 'pt-32'
}];

const CTA = [
  'I am the Machina Emblematica, built to preserve Camerarius\' knowledge—and to guide those who seek it. Follow me, and let us together  turn the pages of the Symbola et Emblemata once more.'
];

const IMAGE_VARIANTS = {
  hidden: { 
    opacity: 0,
    scale: 0.97,
    filter: 'grayscale(1) blur(7px)'
  },
  visible: {
    opacity: 0.65,
    scale: 1,
    filter: 'grayscale(1) blur(0px)',
    transition: {
      duration: 1.25,
      ease: 'easeIn'
    }
  }
};

const PARAGRAPH_VARIANTS = {
  hidden: { 
    filter: 'blur(8px)',
  },
  visible: {
    filter: 'blur(0px)',
    transition: {
      duration: 1.25,
      ease: 'easeIn',
      staggerChildren: 0.1
    }
  },
  exit: {
    filter: 'blur(8px)',
    opacity: 0,
    transition: {
      duration: 1.5,
      ease: 'easeIn'
    }
  }
};

const TOKEN_VARIANTS = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1.25,
      ease: 'easeIn'
    }
  }
};

export const SplashPage = () => {

  const renderParagraph = (text: string[], textClass: string) => {
    return (
      <motion.p 
        className={`motion-safe:transition-transform ${textClass}`} 
        variants={PARAGRAPH_VARIANTS}
        initial="hidden"
        whileInView="visible"
        viewport={{
          amount: 0.4,
          once: true
        }}>
        {text.map((token, idx) => (
          <motion.span
            style={{ display: 'inline-block', transformOrigin: 'center' }}
            key={`token-${idx}`}
            variants={TOKEN_VARIANTS}
            dangerouslySetInnerHTML={{ __html: `${token}\u00A0`}}>
          </motion.span>
        ))}
      </motion.p>
    )
  }

  return (
    <div>
      <div className="absolute bg-white w-[60%] top-0 -translate-y-[30px] left-[20%] h-[30px] opacity-50" style={{
        filter: 'blur(90px)'
      }}/>

      <section id="hero" className="h-[100vh] flex flex-col items-center justify-center">
        <img src="/images/logo-dark-large-2.png" className="logo max-w-2xl p-2 mx-auto"></img>

        <div className="pt-8">
          Scroll
        </div>

        <CaretDownIcon size={24} className="scale-x-150" />
      </section>

      <section id="intro">
        <div className="max-w-4xl mx-auto pb-20">
          {SECTIONS.map(({ image, imageClass, text, textClass }, idx) => (
            <div className="flex">
              {idx % 2 === 0 ? (
                <AnimatePresence>
                  <motion.img 
                    src={image}
                    className={imageClass} 
                    variants={IMAGE_VARIANTS}
                    initial="hidden"
                    whileInView="visible" 
                    viewport={{
                      once: true,
                      amount: 0.5
                    }}/>
                  {renderParagraph(text, textClass)}
                </AnimatePresence>
              ) : (
                <AnimatePresence>
                  {renderParagraph(text, textClass)}
                  <motion.img 
                    src={image}
                    className={imageClass} 
                    variants={IMAGE_VARIANTS} 
                    initial="hidden"
                    whileInView="visible" 
                    viewport={{
                      once: true,
                      amount: 0.5
                    }}/>
                </AnimatePresence>
              )}
            </div>
          ))}
        </div>
      </section>

      <section id="cta" className="max-w-2xl text-lg leading-loose text-center mx-auto pt-20 pb-20">
        <AnimatePresence>
          <motion.p
            className="motion-safe:transition-transform" 
            variants={PARAGRAPH_VARIANTS}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.8
            }}>
            {CTA.map((token, idx) => (
              <motion.span
                style={{ display: 'inline-block', transformOrigin: 'center' }}
                key={`token-${idx}`}
                variants={TOKEN_VARIANTS}
                dangerouslySetInnerHTML={{ __html: `${token}\u00A0`}}>
              </motion.span>
            ))}
          </motion.p>

          <motion.p
            className="motion-safe:transition-transform py-48" 
            variants={PARAGRAPH_VARIANTS}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.8
            }}>
            Ad Emblema
          </motion.p>

        </AnimatePresence>
      </section>

      <section id="about" className="with-shadow bg-[#706456] pb-32 relative">
        <div className="max-w-xl mx-auto pt-24 pb-2 text-center">
          <img src="/images/neural-net.png" className="mix-blend-luminosity" />

          <h2 className="text-2xl mb-4 mt-12">About the Machine.</h2>

					<p>
						The Machina Emblematica is a retrieval-augmented generation (RAG) 
						system, an AI application that combines vector-based search with natural 
						language responses generated by a Large Language Model. It uses data 
						from the 1668 edition of Symbola et Emblemata provided by 
						the <a className="opacity-60 underline" href="https://www.digitale-sammlungen.de/en/details/bsb10575861" target="_blank">Münchener 
						Digitale Bibliothek</a>. When answering your questions, the Machina 
						draws information directly from the scanned images and transcribed pages.
					</p>

          <h2 className="text-2xl mb-6 mt-28">Custodes Machinae.</h2>

					<ul className="space-y-8 leading-relaxed">
						<li>
              <p className="opacity-60">Concept & Implementation</p>
              <strong>Michela Vignoli</strong>, <a className="hover:underline" href="https://www.ait.ac.at/" target="_blank">AIT Austrian Institute of Technology</a>
						</li>

						<li>
              <p className="opacity-60">Design</p>
							<strong>Rainer Simon</strong>, <a className="hover:underline" href="https://rainersimon.io" target="_blank">rainersimon.io</a>
						</li>

						<li>
              <p className="opacity-60">Project Management</p>
							<strong>Chiara Palladino</strong>, <a className="hover:underline" href="https://www.furman.edu/academics/classics/" target="_blank">Furman University Classics</a>
						</li>

						<li>
              <p className="opacity-60">Scientific Support</p>
							<strong>Kathryn Wilson</strong>, <a className="hover:underline" href="https://www.furman.edu/academics/classics/" target="_blank">Furman University Classics</a>
						</li>
					</ul>

          <p className="pt-28">
            A project of scholarly curiosity, digital alchemy, and emblematic wonder. Made possible by 
            open access resources and a love of the obscure. The project received funding from the 
            BMBF joint project <a className="opacity-60 underline" href="https://hermes-hub.de/" target="_blank">HERMES</a> and
            the <a className="opacity-60 underline" target="_blank" href="https://www.furman.edu/humanities-center/">Furman Humanities Center</a>.
          </p>
        </div>
      </section>

      <footer className="h-80">

      </footer>
    </div>
  )

}