from typing import Annotated, Literal, cast

from autopdfparse import (
    AnthropicParser,
    GeminiParser,
    OpenAIParser,
    ParsedPDFResult,
    PDFParser,
)
from fastapi import FastAPI, File, Form, HTTPException, UploadFile

app = FastAPI(root_path="/api", openapi_prefix="/api")

Providers = Literal["openai", "anthropic", "gemini"]


@app.post("/{provider}/parse")
async def parse(
    file: Annotated[UploadFile, File()],
    layout_model: Annotated[str, Form()],
    description_model: Annotated[str, Form()],
    api_key: Annotated[str, Form()],
    provider: Providers,
) -> ParsedPDFResult:
    """
    Parse a PDF file using the specified model.
    """

    if provider == "openai":
        parser = OpenAIParser.get_parser(
            api_key=api_key,
            description_model=description_model,
            visual_model=layout_model,
        )
    elif provider == "anthropic":
        parser = AnthropicParser.get_parser(
            api_key=api_key,
            description_model=description_model,
            visual_model=layout_model,
        )
    elif provider == "gemini":
        parser = GeminiParser.get_parser(
            api_key=api_key,
            description_model=description_model,
            visual_model=layout_model,
        )
    else:
        raise HTTPException(
            status_code=400,
            detail="Invalid layout model. Supported models are: openai, anthropic, gemini.",
        )
    parser = cast(PDFParser, parser)
    try:
        result = await parser.parse_bytes(file.file.read())

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error parsing PDF: {e}",
        )

    return result
