from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.search import search


router = APIRouter(

    prefix="/search",

    tags=["Semantic Search"],

)


class SearchRequest(BaseModel):

    project_id: str

    query: str

    limit: int = 10


@router.post("/")

def semantic_search(

    request: SearchRequest,

):

    try:

        results = search.search(

            project_id=request.project_id,

            query=request.query,

            limit=request.limit,

        )

        return {

            "success": True,

            "count": len(results),

            "results": [

                {

                    "project_id": r.project_id,

                    "score": r.score,

                    "title": r.title,

                    "snippet": r.snippet,

                    "timestamp": r.timestamp,

                }

                for r in results

            ],

        }

    except Exception as e:

        raise HTTPException(

            status_code=500,

            detail=str(e),

        )