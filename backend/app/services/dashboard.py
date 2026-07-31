from app.services.projects import projects
from app.services.library import library
from app.services.analytics import analytics


class DashboardService:

    """
    MCAIE Dashboard Service

    Aggregates all homepage data into
    a single response.
    """

    def home(self):

        latest = library.latest(10)

        return {

            "projects": projects.all(),

            "continue_listening": latest,

            "recently_published": latest,

            "library": library.all(),

            "analytics": analytics.dashboard().__dict__,

        }


dashboard = DashboardService()