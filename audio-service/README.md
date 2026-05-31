# U&M Music AI — Audio Service

AI-powered audio processing microservice for the U&M Music AI platform.

## Setup

```bash
cd audio-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Service info |
| GET | `/health` | Health check |
| POST | `/clean-vocal` | Remove noise from vocal |
| POST | `/mix-master` | Mix and master a track |
| POST | `/generate-instrumental` | Generate instrumental from prompt |
| POST | `/analyze-vocal` | Analyze vocal quality |
| POST | `/train-voice-model` | Start Voice DNA training |

## API Docs

When running, visit `http://localhost:8000/docs` for interactive Swagger UI.

## Future AI Models

Replace mock responses with real models:
- **Vocal Cleanup**: Demucs, RNNoise
- **Mixing/Mastering**: AI mastering engines
- **Music Generation**: MusicGen, Stable Audio
- **Vocal Analysis**: CREPE, librosa
- **Voice Cloning**: RVC, DDSP-SVC
