import { useMemo } from 'react';
import Markdown from 'react-markdown';

const EXAMPLES = [
`* __Mythological Interpretations__: Let us explore ancient tales 
  like the story of Hercules and the Hesperides and discuss 
  how the golden apples might represent knowledge or divine favor.`,

`* __Mythical Beast__: Learn about the Simivulpem, a creature 
  half-fox and half-monkey that carries its young in a pouch.`,

`* __Symbolic Analysis__: Ask about symbols like the dragon, 
  which often represents vigilance and the guarding of treasures.`,

`* __Emblem Details__: Ask for a specific emblem by number and title, 
  for example emblem XIV, titled "PRETIOSUM QUOD UTILE".`,

`* __Natural Phenomena__: What do the symbola say about the relationship 
  between the moon's phases and human behavior?`,

`* __Moral Lessons__: What does the story of the frog teach us about
  empty rethoric, arrogance and deceit?`,

`* __Textual Meanings__: How does the image of a rose and a beetle 
  relate to the line _"Cantharidum rosamors. Sic luxus deliciaque 
  Enervant animos eripiuntque virum"_? `,

`* __Classical Sources__: Explore how classical authors like Horace, 
  Pliny, and Cicero are referenced and reinterpreted throughout the
  Symbola.`,

`* __Animals & Allegory__: What moral lessons can we learn from the 
  crocodile?`,

  `* __Virtues & Vices__: Ask about emblems portraying humility, courage, 
    greed, innocence or patience — how do these images express moral character?`
];

const WELCOME_MESSAGE =
`Welcome! 

I am the Machina Emblematica, your guide through the world of 
_Symbola et Emblemata_ – a treasure trove of wisdom, myth, and metaphor.

Here are a few examples of questions you might ask:

{{EXAMPLES}}

So – what mysteries of the Symbola shall we unravel today? Let us 
embark on this adventure together!`;

const getRandomExamples = (n = 3) => {
  const shuffled = [...EXAMPLES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

export const WelcomeMessage = () => {

  const message = useMemo(() => {
    const examples = getRandomExamples().join('\n\n');
    return WELCOME_MESSAGE.replace('{{EXAMPLES}}', examples);
  }, []);

  return (
    <div className="llm-response">
      <Markdown>{message}</Markdown>
    </div>
  )

}