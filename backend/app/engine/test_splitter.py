from app.engine.splitter import EpisodeSplitter

EpisodeSplitter().split(
    audio_file=r"C:\Users\tynek\Downloads\The cost of _I am Fine . X space.mp3",
    job_id="test",
    trim_start=283.93,
    episode_minutes=30,
)