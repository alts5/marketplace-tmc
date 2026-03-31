import os


def get_token_lifetime():
    return int(os.getenv("JWT_TOKEN_LIFETIME") or "60")

def get_token_algorithm():
    return os.getenv("JWT_TOKEN_ALG") or "HS256"

def get_jwt_secret():
    return os.getenv("JWT_SECRET_KEY") or "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"