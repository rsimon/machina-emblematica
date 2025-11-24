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

`* __Emblem Meanings__: For example, what does the emblem of the crane 
  teach us about the dangers of rushing into actions without 
  proper consideration?`,

`* __Natural Phenomena__: What does the emblem _Ad Motum Lunae_
  reveal about the relationship between the moon's phases and human 
  behavior?`,

`* __Comparative Insights__: How do the emblems of the hermit crab 
  and the crane offer contrasting views on adaptability and haste?`,

`* __Literary & Philosophical Themes__: What can we learn from 
  the emblem of the peacock about pride, vanity and the pursuit 
  of beauty?`,

`* __Moral Lessons__: Consider fables such as the tale of the crow 
  and the fox, which warns against arrogance and deceit.`,

`* __Textual Meanings__: How does the image of a rose and a beetle 
  relate to the line _"Cantharidum rosamors. Sic luxus deliciaque 
  Enervant animos eripiuntque virum"_? `,

`* __Classical Sources__: Explore how classical authors like Horace, 
  Pliny, and Cicero are referenced and reinterpreted throughout the
  Symbola.`,

`* __Animals & Allegory__: For example, why is the Pelican depicted 
  as a symbol of self-sacrifice and parental love?`,

`* __Virtues & Vices__: Ask about emblems portraying humility, courage, 
  greed, or patience — how do these images express moral character?`
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