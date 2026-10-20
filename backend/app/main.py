import logging
import time

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.config import get_settings
from app.routes import admin, participant, public

settings = get_settings()
logging.basicConfig(
    level=settings.log_level.upper(),
    format='{"time":"%(asctime)s","level":"%(levelname)s","logger":"%(name)s","msg":"%(message)s"}',
)
log = logging.getLogger("pocketthon")

app = FastAPI(title="Pocket Thon API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)


@app.middleware("http")
async def access_log(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    log.info("%s %s -> %s (%.0fms)", request.method, request.url.path, response.status_code,
             (time.perf_counter() - start) * 1000)
    return response


@app.exception_handler(StarletteHTTPException)
async def http_exc(_: Request, exc: StarletteHTTPException):
    return JSONResponse({"detail": exc.detail}, status_code=exc.status_code)


@app.exception_handler(RequestValidationError)
async def validation_exc(_: Request, exc: RequestValidationError):
    fields: dict[str, str] = {}
    for err in exc.errors():
        loc = [str(p) for p in err["loc"] if p not in ("body", "query")]
        fields[".".join(loc) or "request"] = err["msg"].removeprefix("Value error, ")
    return JSONResponse({"detail": "Validation failed", "fields": fields}, status_code=422)


@app.exception_handler(Exception)
async def unhandled(request: Request, exc: Exception):
    log.exception("unhandled error on %s", request.url.path)
    return JSONResponse({"detail": "Internal server error"}, status_code=500)


app.include_router(public.router)
app.include_router(participant.router)
app.include_router(admin.router)
