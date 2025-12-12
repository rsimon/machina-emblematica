# Machina Emblematica
This repository contains the source code of Machina Emblematica. The Machina is a simple state of the art Retrieval Augmented Generation (RAG) system prototype that makes the digital 1668 edition of Joachim Camerarius’ [Symbola et Emblemata](https://www.digitale-sammlungen.de/en/details/bsb10575861) more accessible and explorable. The goal was to create an innovative, user-friendly chatbot prototype that enables users to ask questions about the emblems and search for related contents in the Symbola et Emblemata. Machina Emblematica innovates access and exploration of the 17th century Latin emblems by providing an assistant that generates user query responses in English based on the most relevant multimodal content retrieved. The prototype advances existing solutions from projects enhancing accessibility and exploration of historical images and texts.

Let the Machina guide you through the world of Symbola et Emblemata. The prototype can be tested here: [https://machina.rainersimon.io](https://machina.rainersimon.io).

## Disclaimer
This tool uses artificial intelligence (AI) to search, analyse, and retrieve images and texts. While we strive for accuracy and reliability, users should be aware of the tool's limitations and their responsibilities when using it.

This artificial intelligence system is classified under the [EU AI Act (Regulation 2024/432)](https://artificialintelligenceact.eu/the-act/) as a minimal risk system. We are committed to full compliance with all applicable requirements of the EU AI Act and related regulations.

## Transparency Information
In accordance with Articles 13 and 52 of the EU AI Act:
- Provider Name: [https://rainersimon.io](https://rainersimon.io)
- Model Version: Open-CLIP ViT-B-32 pre-trained on the LAION-2B English subset of LAION-5B
- Last Update: see [HuggingFace repository](https://huggingface.co/laion/CLIP-ViT-B-32-laion2B-s34B-b79K)
- Purpose and Intended Use: Exploration and retrieval of historical image content. The tool was developed for research purposes and is still under development.

## AI Technology Limitations
- Results are based on AI interpretation and may not always be accurate
- Image and text recognition capabilities may vary depending on media quality and content
- Search results are generated through automated processes and may contain unexpected or irrelevant items

## Accuracy and Reliability
- The tool provides approximate matches based on available data
- Results should be treated as suggestions rather than definitive answers
- Manual verification is recommended for critical applications

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
