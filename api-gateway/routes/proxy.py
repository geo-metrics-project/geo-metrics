from typing import Optional, Dict, Any
from fastapi import Request, Response
import httpx
import logging

logger = logging.getLogger(__name__)

async def proxy_request(
    request: Request,
    target_base_url: str,
    target_path: str = "",
    timeout: float = 30.0
) -> Response:
    """
    Proxy a request to a target service
    
    Args:
        request: The incoming FastAPI request
        target_base_url: Base URL of the target service (e.g., "http://report-service:8080")
        target_path: Path to append to base URL (e.g., "/api/reports")
        timeout: Request timeout in seconds
    
    Returns:
        Response from the target service
    """
    # Build target URL
    target_url = f"{target_base_url}{target_path}"
    
    # Get request body
    body = await request.body()
    
    # Prepare headers - filter out problematic headers
    headers = {}
    excluded_headers = {
        "host",
        "content-length",
        "transfer-encoding",
        "connection",
    }
    
    for key, value in request.headers.items():
        if key.lower() not in excluded_headers:
            headers[key] = value
    
    logger.info(f"Proxying {request.method} request to {target_url}")
    
    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await client.request(
                method=request.method,
                url=target_url,
                headers=headers,
                content=body,
                params=request.query_params,
            )
            
            # Return response
            return Response(
                content=response.content,
                status_code=response.status_code,
                headers=dict(response.headers),
            )
    except httpx.TimeoutException as e:
        logger.error(f"Timeout proxying to {target_url}: {str(e)}")
        return Response(
            content=f'{{"error": "Gateway timeout", "detail": "Request to {target_base_url} timed out"}}',
            status_code=504,
            media_type="application/json"
        )
    except httpx.RequestError as e:
        logger.error(f"Error proxying to {target_url}: {str(e)}")
        return Response(
            content=f'{{"error": "Bad gateway", "detail": "Failed to connect to {target_base_url}"}}',
            status_code=502,
            media_type="application/json"
        )
    except Exception as e:
        logger.error(f"Unexpected error proxying to {target_url}: {str(e)}")
        return Response(
            content=f'{{"error": "Internal server error", "detail": "{str(e)}"}}',
            status_code=500,
            media_type="application/json"
        )