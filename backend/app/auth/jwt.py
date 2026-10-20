"""Verify Supabase Auth access tokens.

- Asymmetric signing keys (RS256/ES256): verified against the project's JWKS endpoint.
- Legacy shared secret (HS256): verified with SUPABASE_JWT_SECRET.
"""
from functools import lru_cache

import jwt
from jwt import PyJWKClient

from app.config import get_settings


class InvalidToken(Exception):
    pass


@lru_cache
def _jwks_client() -> PyJWKClient:
    url = get_settings().supabase_url.rstrip("/") + "/auth/v1/.well-known/jwks.json"
    return PyJWKClient(url, cache_keys=True)


def verify_token(token: str) -> dict:
    s = get_settings()
    try:
        alg = jwt.get_unverified_header(token).get("alg")
        if alg == "HS256":
            if not s.supabase_jwt_secret:
                raise InvalidToken("HS256 token but no JWT secret configured")
            key = s.supabase_jwt_secret
            algorithms = ["HS256"]
        elif alg in ("RS256", "ES256"):
            key = _jwks_client().get_signing_key_from_jwt(token).key
            algorithms = [alg]
        else:
            raise InvalidToken("unsupported token algorithm")
        claims = jwt.decode(
            token,
            key,
            algorithms=algorithms,
            audience="authenticated",
            options={"require": ["exp", "sub"]},
        )
    except InvalidToken:
        raise
    except jwt.PyJWTError as exc:
        raise InvalidToken(str(exc)) from exc
    return claims
