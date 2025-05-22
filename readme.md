# AutoPDFParse Demo

![AutoPDFParse Demo](/images/screenshot.png)


A demonstration web application for testing the [AutoPDFParse](https://github.com/ChidiRnweke/AutoPDFParse) library - an intelligent PDF parsing solution with multi-model AI support.


## Overview

This application provides an intuitive interface to test the capabilities of AutoPDFParse, allowing you to:

- Upload PDF documents and see how various AI models process them
- Compare the performance of different AI providers (OpenAI, Anthropic, Google Gemini)
- Visualize the extracted text alongside the original PDF
- Observe how the system intelligently handles layout-dependent and layout-independent content

## Features

### Intelligent Two-Step Processing

AutoPDFParse first determines if a page contains complex data structures (such as tables or images) and then processes accordingly:
- Simple text extraction for standard content
- Detailed AI-powered descriptions for complex layouts

### Multiple AI Provider Support

Test and compare results from three major AI providers:
- **OpenAI** (GPT-4.1, GPT-4.1 Mini, GPT-4.1 Nano)
- **Anthropic** (Claude 3.7 Sonnet, Claude 3 Haiku)
- **Google Gemini** (Gemini 2.5 Flash, Gemini 2.0 Flash Lite)

### Cost-Efficient Processing

The system intelligently utilizes:
- Smaller, more cost-effective models for layout detection
- More powerful models only when complex content description is required

### Modern UI Features

- Responsive design that works on both desktop and mobile
- Side-by-side and tabbed viewing modes
- Markdown rendering for formatted text output
- Clear visual indicators for layout-dependent content

## Getting Started

### Prerequisites

- Python 3.12 or higher
- Node.js 18 or higher
- API keys for the models you want to test (OpenAI, Anthropic, and/or Google Gemini)

### Installation

#### Backend Setup

```bash
cd backend
uv install
```

#### Frontend Setup

```bash
cd frontend
npm install
```

### Running the Application

#### Start the Backend

```bash
cd backend
uvicorn main:app --reload
```

#### Start the Frontend

```bash
cd frontend
npm run dev
```

The application should now be running at http://localhost:3000

## Usage

1. Upload a PDF document using the upload form
2. Enter your API key for the selected provider
3. Choose which models to use for layout detection and content description
4. Submit and view the results
5. Navigate through pages and toggle between viewing modes to explore the results

## Architecture

This demo consists of:

- **Frontend**: Next.js application with React components and Tailwind CSS
- **Backend**: FastAPI server that interfaces with the AutoPDFParse library
- **PDF Parsing**: Handled by AutoPDFParse, which intelligently selects the appropriate model for each task

### Key Components

- `upload-form.tsx`: Handles PDF upload and API configuration
- `pdf-viewer.tsx`: Displays the PDF and extracted text with side-by-side or tabbed layouts
- `main.py`: Backend API endpoints for processing PDFs with different model providers

## Contributing

Contributions to improve the demo are welcome! Feel free to submit issues or pull requests to the repository.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Based on the [AutoPDFParse](https://github.com/ChidiRnweke/AutoPDFParse) library by Chidi Nweke
- Built with Next.js, React, Tailwind CSS, and FastAPI