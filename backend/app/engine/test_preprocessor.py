from app.engine.preprocessor import AudioPreprocessor

audio = AudioPreprocessor().create_analysis_audio(

    r"C:\Users\tynek\Downloads\The cost of _I am Fine . X space.mp3"

)

print(audio)