from pathlib import Path
import tempfile
import shutil

from app.engine.denoise import Denoiser


class MasteringEngine:

    def __init__(self):

        self.denoiser = Denoiser()

    def master(

        self,

        input_file: str,

        output_file: str,

    ):

        temp_dir = Path(
            tempfile.mkdtemp()
        )

        denoised = temp_dir / "denoised.wav"

        self.denoiser.process(

            input_file,

            str(denoised),

        )

        shutil.copy2(

            denoised,

            output_file,

        )

        shutil.rmtree(

            temp_dir,

            ignore_errors=True,

        )

        return output_file