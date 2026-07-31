from fastapi import FastAPI

app = FastAPI(
    title="TrustLoop API",
    description="Edge AI Customer Reputation Platform",
    version="0.1.0"
)


@app.get("/")
def root():
    return {
        "platform": "TrustLoop",
        "status": "running",
        "version": "0.1.0"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }