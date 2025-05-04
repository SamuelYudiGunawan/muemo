#!/bin/bash

# Use a different directory for the virtual environment
export VENV_PATH="/tmp/venv"

# Create venv if it doesn't exist
if [ ! -d "$VENV_PATH" ]; then
    python -m venv "$VENV_PATH"
    . "$VENV_PATH/bin/activate"
    pip install -r requirements.txt
fi

# Run your Python app
flask run  # Replace with your actual entrypoint (e.g., `main.py`, `run.py`)