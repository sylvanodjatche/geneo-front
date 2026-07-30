# 🧬 GENEo — Deep Learning-Powered Gene Ontology Prediction Platform

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://geneo-front.vercel.app)
[![API Status](https://img.shields.io/badge/API_Status-Hugging_Face-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black)](https://huggingface.co/spaces/sylvanod/geneo-inference)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Python](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)

> **GENEo** (*Gene Ontology Prediction*) is an end-to-end, production-ready AI web platform designed for automated protein function prediction. Built upon state-of-the-art **Protein Language Models (ESM-2)** and **Graph Convolutional Networks (GCN)**, GENEo resolves large-scale hierarchical multi-label classification challenges framed by the international **CAFA 6 (Critical Assessment of Functional Annotation)** challenge.

---

## 🌟 Executive Summary

Functional annotation of uncharacterized proteins remains a fundamental bottleneck in modern bioinformatics. **GENEo** bridges the gap between complex Deep Learning research and real-world biological applications by providing a lightweight, low-latency, and structure-aware inference pipeline.

### Key Performance Highlights
* **Dataset Scope:** Evaluated over **82,244 proteins** annotated with **537,027 GO terms**.
* **Target Vocabulary:** Predicts across **35,130+ Directed Acyclic Graph (DAG) terms** spanning all 3 Gene Ontology aspects:
  * **Biological Process (BP)**
  * **Molecular Function (MF)**
  * **Cellular Component (CC)**
* **Architecture Performance:** Achieves **$F_{max} = 0.4146$** on strict test sets, outperforming the non-graph baseline MLP by **+38%**.

---

## 🏗️ System Architecture (3-Tier Design)

GENEo is engineered as a decoupled, microservices-oriented **3-Tier Architecture**, ensuring modularity, scalable inference, and seamless deployment across cloud environments.

![GENEo 3-Tier Architecture](docs/architecture-3-tiers.jpg)

### 1. Presentation Tier (Frontend Web Client)
* **Framework:** React 18 + Vite + Tailwind CSS.
* **Hosting:** Vercel (`geneo-front.vercel.app`).
* **Capabilities:** 
  * Interactive FASTA & raw sequence input validation.
  * Real-time threshold adjustment ($0.01 \le \text{threshold} \le 0.99$) with dynamic probability filtering.
  * Visual distribution breakdown across BP, MF, and CC namespaces.
  * One-click direct redirection to external biological databases (**QuickGO** and **AmiGO**).

### 2. Business Logic Tier (Application Server API)
* **Framework:** FastAPI (Python).
* **Hosting:** Hugging Face Spaces (`sylvanod/geneo-inference`).
* **Capabilities:**
  * Strict request validation, sequence sanitization, and REST orchestration.
  * Feature extraction dispatch and tensor normalization.
  * Post-processing, threshold filtering, and structured JSON output rendering.

### 3. Inference Service Tier (Machine Learning Core)
* **Framework:** PyTorch & PyTorch Geometric (PyG).
* **Core Model:** `GOGraphPredictor` (~90M parameters).
* **Resource Optimization:** Pre-computed static GCN GO term embeddings computed once per inference epoch, dramatically reducing GPU/RAM footprint.

![GENEo 3D System View](docs/architecture-3d.jpg)

---

## 🤖 Machine Learning Pipeline & Innovations
