# Machina Emblematica
This repository contains the source code of Machina Emblematica. The Machina is a simple state of the art Retrieval Augmented Generation (RAG) system prototype that makes the digital 1668 edition of Joachim Camerarius’ [Symbola et Emblemata](https://www.digitale-sammlungen.de/en/details/bsb10575861) more accessible and explorable. The goal was to create an innovative, user-friendly chatbot prototype that enables users to ask questions about the emblems and search for related contents in the Symbola et Emblemata. Machina Emblematica innovates access and exploration of the 17th century Latin emblems by providing an assistant that generates user query responses in English based on the most relevant multimodal content retrieved. The prototype advances existing solutions from projects enhancing accessibility and exploration of historical images and texts.

Let the Machina guide you through the world of Symbola et Emblemata. The prototype can be tested here: [https://machina.rainersimon.io](https://machina.rainersimon.io).

## Disclaimer
This AI-powered tool retrieves images and texts and generates natural language responses. It is an experimental research system with inherent limitations.

AI-generated content may be inaccurate, incomplete, or biased. Always verify important information independently. Use this tool for research and exploration only — not for critical decisions or professional applications.

**System Classification:** Limited risk AI system under EU AI Act Article 50.

## Transparency Information
You are interacting with an AI system that retrieves and generates content.
- Provider: Simon Rainer Franz Dr.
- Location: Vienna, Austria
- Contact: [https://rainersimon.io/imprint](https://rainersimon.io/imprint)
- AI Models Used:
  - Image Retrieval: [Open-CLIP ViT-B-32 (LAION-2B)](https://huggingface.co/laion/CLIP-ViT-B-32-laion2B-s34B-b79K ), v. ViT-B/32, updated 2025-01-22
  - Text Retrieval: [Flax-Sentence-Embeddings](https://huggingface.co/flax-sentence-embeddings/all_datasets_v4_mpnet-base ), v. 4, updated 2021-07-23
  - Text Generation: [Qwen2.5-VL-32B-Instruct](https://huggingface.co/Qwen/Qwen2.5-VL-32B-Instruct), v. 2.5, updated 2025-04-14
- Purpose and Intended Use: Research tool for exploring historical image content [BETA]

## Limitations
- AI-generated content may contain inaccuracies
- Results depend on training data which may contain biases
- System is under active development
- Not suitable for critical decision-making

**User Responsibility:** Verify important information independently.

# Instructions to run the code locally
1. `npm install` to install dependencies
2. Create a copy of the file `.env.example` named `.env` and edit according to your environment.
3. `npm start` to run in dev mode.

# Funding Acknowledgement
This project received funding from the BMFTR joint project HERMES and the Furman Humanities Center.

# References
```
@misc{vignoli_2025_17909191,
  author       = {Vignoli, Michela and
                  Simon, Rainer},
  title        = {Machina Emblematica: Multimodal Information
                   Retrieval Prototype for CH and DH
                  },
  month        = dec,
  year         = 2025,
  publisher    = {Zenodo},
  doi          = {10.5281/zenodo.17909191},
  url          = {https://doi.org/10.5281/zenodo.17909191},
}
```
