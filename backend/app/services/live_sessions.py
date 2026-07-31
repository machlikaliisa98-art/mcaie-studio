from uuid import uuid4


class LiveSessionService:

    def __init__(self):

        self.sessions = {}

    #
    # Session
    #

    def create(

        self,

        title: str,

        category: str,

        host: str,

    ):

        session_id = uuid4().hex[:10].upper()

        session = {

            "id": session_id,

            "title": title,

            "category": category,

            "host": host,

            "status": "waiting",

            "listeners": [],

            "speakers": [

                {

                    "id": uuid4().hex,

                    "name": host,

                    "role": "Host",

                    "muted": False,

                    "camera": False,

                    "screen": False,

                }

            ],

            "raised_hands": [],

            "chat": [],

            "polls": [],

            "documents": [],

            "whiteboard": [],

            "analytics": {

                "peak_listeners": 0,

                "messages": 0,

                "hands": 0,

                "screen_shares": 0,

            },

        }

        self.sessions[session_id] = session

        return session

    def all(self):

        return list(

            self.sessions.values()

        )

    def get(

        self,

        session_id: str,

    ):

        return self.sessions.get(

            session_id

        )

    #
    # Session State
    #

    def start(

        self,

        session_id: str,

    ):

        self.sessions[session_id][

            "status"

        ] = "live"

        return self.sessions[session_id]

    def end(

        self,

        session_id: str,

    ):

        self.sessions[session_id][

            "status"

        ] = "ended"

        return self.sessions[session_id]

    #
    # Audience
    #

    def join(

        self,

        session_id: str,

        name: str,

    ):

        self.sessions[session_id][

            "listeners"

        ].append(

            {

                "id": uuid4().hex,

                "name": name,

            }

        )

        listeners = self.sessions[

            session_id

        ]["listeners"]

        analytics = self.sessions[

            session_id

        ]["analytics"]

        analytics["peak_listeners"] = max(

            analytics["peak_listeners"],

            len(listeners),

        )

        return self.sessions[

            session_id

        ]

    #
    # Raised Hands
    #

    def raise_hand(

        self,

        session_id: str,

        name: str,

    ):

        self.sessions[session_id][

            "raised_hands"

        ].append(

            {

                "id": uuid4().hex,

                "name": name,

            }

        )

        self.sessions[session_id][

            "analytics"

        ]["hands"] += 1

        return self.sessions[

            session_id

        ]

    #
    # Speakers
    #

    def approve(

        self,

        session_id: str,

        name: str,

    ):

        self.sessions[session_id][

            "speakers"

        ].append(

            {

                "id": uuid4().hex,

                "name": name,

                "role": "Speaker",

                "muted": False,

                "camera": False,

                "screen": False,

            }

        )

        return self.sessions[

            session_id

        ]

    #
    # Chat
    #

    def message(

        self,

        session_id: str,

        name: str,

        text: str,

    ):

        self.sessions[session_id][

            "chat"

        ].append(

            {

                "id": uuid4().hex,

                "name": name,

                "text": text,

            }

        )

        self.sessions[session_id][

            "analytics"

        ]["messages"] += 1

        return self.sessions[

            session_id

        ]


live_sessions = LiveSessionService()