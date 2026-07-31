class PermissionService:

    ROLE_PERMISSIONS = {

        "Host": {

            "broadcast": True,
            "share_screen": True,
            "camera": True,
            "microphone": True,
            "approve_speakers": True,
            "remove_speakers": True,
            "manage_polls": True,
            "manage_documents": True,
            "whiteboard": True,
            "record": True,

        },

        "CoHost": {

            "broadcast": True,
            "share_screen": True,
            "camera": True,
            "microphone": True,
            "approve_speakers": False,
            "remove_speakers": False,
            "manage_polls": True,
            "manage_documents": True,
            "whiteboard": True,
            "record": False,

        },

        "Speaker": {

            "broadcast": True,
            "share_screen": False,
            "camera": True,
            "microphone": True,
            "approve_speakers": False,
            "remove_speakers": False,
            "manage_polls": False,
            "manage_documents": False,
            "whiteboard": False,
            "record": False,

        },

        "Audience": {

            "broadcast": False,
            "share_screen": False,
            "camera": False,
            "microphone": False,
            "approve_speakers": False,
            "remove_speakers": False,
            "manage_polls": False,
            "manage_documents": False,
            "whiteboard": False,
            "record": False,

        },

    }

    def permissions(

        self,

        role: str,

    ):

        return self.ROLE_PERMISSIONS.get(

            role,

            {},

        )


permissions = PermissionService()