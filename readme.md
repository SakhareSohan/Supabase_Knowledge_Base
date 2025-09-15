# RAG Pipeline with Google Gemini & Supabase

![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)
![AI/ML](https://img.shields.io/badge/AI%20%26%20ML-Google%20Gemini%20%7C%20RAG-blue.svg)
![Database](https://img.shields.io/badge/Database-Supabase%20%7C%20pgvector-purple.svg)
![Deployment](https://img.shields.io/badge/Deployment-Docker-blueviolet.svg)

This project is a powerful, production-ready blueprint for a **Retrieval-Augmented Generation (RAG)** system built with a modern Node.js backend. It demonstrates how to enable Large Language Models (LLMs) to reason about specific, private data by creating a complete pipeline to ingest documents, generate vector embeddings, and perform intelligent semantic searches.

The application allows users to "chat with their documents" by transforming unstructured PDF files into a queryable knowledge base.

---

## 💡 The RAG Pipeline

This application implements a complete, end-to-end RAG workflow.

```
[PDF File] -> Upload -> [Text Extraction & Chunking] -> [Gemini Embedding API] -> [Vector Storage (Supabase)]
                                                                                          ^
                                                                                          | (Cosine Similarity Search)
                                                                                          |
[User Query] -> [Gemini Embedding API] ----------------------------------------------------
```

1.  **Ingestion**: A user uploads a PDF file via a REST API endpoint.
2.  **Chunking**: The text is extracted and broken down into smaller, overlapping chunks to preserve context.
3.  **Embedding**: Each text chunk is converted into a vector embedding using Google's powerful `text-embedding-004` model.
4.  **Storage**: The text chunks and their corresponding vectors are stored in a **Supabase** Postgres database with the `pgvector` extension.
5.  **Retrieval**: A user's search query is also converted into a vector. A **cosine similarity** search is then performed in Supabase to find and return the most semantically relevant text chunks from the original documents.

---

## ✨ Key Features

-   📄 **PDF Ingestion Pipeline**: A robust API endpoint (`/api/upload`) for direct PDF document processing.
-   🧩 **Intelligent Text Chunking**: Implements a strategy of 250-token chunks with a 10% overlap to ensure contextual integrity between segments.
-   🧠 **State-of-the-Art Embeddings**: Uses Google's efficient and highly accurate `text-embedding-004` model for vector generation.
-   💾 **Scalable Vector Storage**: Leverages **Supabase** and `pgvector` for a powerful and easy-to-manage vector database solution.
-   🔍 **Semantic Search API**: A dedicated endpoint (`/api/search`) to perform vector similarity searches and retrieve the most relevant context for any query.
-   🐳 **Containerized Deployment**: Fully containerized with **Docker** for easy, reproducible, and isolated deployment in any environment.

---

## 🛠️ Key Skills & Concepts Demonstrated

-   **Backend Development**: Building a robust, asynchronous API with **Node.js**.
-   **AI/ML Integration**: Interfacing with a major AI API (Google Gemini) for core functionality.
-   **Vector Databases**: Implementing and managing a vector database pipeline using Supabase and `pgvector`.
-   **Data Engineering**: Creating an ETL-like (Extract, Transform, Load) pipeline for ingesting, chunking, and vectorizing unstructured document data.
-   **Containerization**: Using **Docker** for creating portable, scalable, and isolated application environments.
-   **Core RAG Concepts**: Demonstrating a deep understanding of Retrieval-Augmented Generation, semantic search, vector embeddings, and cosine similarity.

---

## 🚀 Setup and Installation

This project is designed to be run with Docker for maximum simplicity and reproducibility.

### Prerequisites

-   **Docker** and Docker Compose installed on your machine.

### 1. Clone the Repository

```bash
git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
cd your-repo-name
```

### 2. Configure Environment Variables

Create a `.env` file in the root of the project by copying the `sample.env` template.

```bash
cp sample.env .env
```
Open the `.env` file and populate it with your credentials for Supabase, your database, and the Google Gemini API.

```env
# Application Port
APP_PORT='3000'

# Supabase Configurations
NEXT_PUBLIC_SUPABASE_URL='<your-supabase-url>'
NEXT_PUBLIC_SUPABASE_ANON_KEY='<your-supabase-anon-key>'

# (Optional) Direct Database Connections if needed
DB_HOST='<your-db-host-from-supabase>'
DB_NAME='postgres'
DB_USER='postgres'
DB_PORT='<your-db-port-from-supabase>'
DB_PASSWORD='<your-db-password-from-supabase>'

# Google Gemini API Key
GEMINI_API_KEY='<your-gemini-api-key>'
```

### 3. Build and Run with Docker

Use the provided `Dockerfile` to build and run the application.

```bash
# Build the Docker image
docker build -t rag-gemini-supabase .

# Run the container, mapping the port and passing the .env file
docker run -p 3000:3000 --env-file .env rag-gemini-supabase
```
The application will now be running and accessible at `http://localhost:3000`.

---

## 🔌 API Endpoints

The application exposes the following endpoints based on its MVC architecture:

| Method | Endpoint                    | Description                                                                 |
| :----- | :-------------------------- | :-------------------------------------------------------------------------- |
| `POST` | `/api/upload`               | Upload a PDF file. Triggers the chunking and embedding generation pipeline. |
| `GET`  | `/api/embeddings`           | Retrieve all stored text chunks and their associated metadata.              |
| `POST` | `/api/embeddings`.          | Manually trigger the embedding process for already uploaded documents.      |
| `POST` | `/api/search`               | Submit a query in the request body to perform a vector similarity search.   |

**Example Search Request Body:**

```json
{
  "query": "What is the capital of France?"
}
```

---
