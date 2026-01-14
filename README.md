# Machina Emblematica

This repository contains the source code of [Machina Emblematica](https://machina.rainersimon.io).

Machina Emblematica is a prototype **multimodal Retrieval Augmented Generation (RAG) system** based on the digitized 1668 edition of Joachim Camerarius' [Symbola et Emblemata](https://www.digitale-sammlungen.de/en/details/bsb10575861). Its goal is to provide an innovative and user-friendly conversational interface that enables users to explore both the textual and the visual dimension of this emblem book through natural-language queries.

The system facilitates access to seventeenth-century Latin emblems by retrieving the most relevant content–text and images–and generating responses in English. By combining multimodal retrieval with generative AI, Machina Emblematica aims to advance existing approaches to the exploration and accessibility of historical texts and images. 

Let the Machina guide you through the world of _Symbola et Emblemata_. You can try the prototype here:

<https://machina.rainersimon.io>

## Disclaimer

Machina Emblematica uses generative AI to produce natural-language responses. It is an **experimental research prototype** and, as such, has inherent technical and methodological limitations.

AI-generated content may be inaccurate, incomplete, misleading, or biased. Users should **independently verify any important information**. This system is intended **solely for research and exploratory purposes** and must not be used for critical decision-making or professional applications.

**System Classification:** _Limited risk AI system_ under EU AI Act, Article 50.

## Transparency Information

You are interacting with an AI system that retrieves and generates content.
- **Provider / Imprint:** <https://rainersimon.io/imprint>
- **AI Models Used:**
  - Image Retrieval: [Open-CLIP ViT-B-32 (LAION-2B)](https://huggingface.co/laion/CLIP-ViT-B-32-laion2B-s34B-b79K ), v. ViT-B/32, updated 2025-01-22
  - Text Retrieval: [Flax-Sentence-Embeddings](https://huggingface.co/flax-sentence-embeddings/all_datasets_v4_mpnet-base ), v. 4, updated 2021-07-23
  - Text Generation: [Qwen2.5-VL-32B-Instruct](https://huggingface.co/Qwen/Qwen2.5-VL-32B-Instruct), v. 2.5, updated 2025-04-14
- **Purpose and Intended Use:** Research and exploratory access to historical textual and visual materials (**BETA**)

## Known Limitations
- AI-generated outputs may contain factual errors or misinterpretations.
- Results depend on underlying training data, which may reflect historical, cultural or systemic biases.
- The system is under active development and may change without notice.
- The system is **not suitable for critical decision-making**.

**User Responsibility:** Users are responsible for verifying information before relying on it.

# Instructions to run the code locally
1. `npm install` to install dependencies
2. Create a copy of the file `.env.example` named `.env` and edit according to your environment.
3. `npm start` to run in dev mode.

# Funding Acknowledgement
This project received funding from the BMFTR joint project [HERMES](https://hermes-hub.de/), the [Furman Humanities Center](https://www.furman.edu/humanities-center/) and [Durham University](https://www.durham.ac.uk/departments/academic/classics-ancient-history/).

# References
```
@misc{vignoli_2025_17909191,
  author       = {Vignoli, Michela and Simon, Rainer},
  title        = {Machina Emblematica: Multimodal Information Retrieval Prototype for CH and DH},
  month        = dec,
  year         = 2025,
  publisher    = {Zenodo},
  doi          = {10.5281/zenodo.17909191},
  url          = {https://doi.org/10.5281/zenodo.17909191},
}
```
