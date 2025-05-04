#!/bin/bash
# Ensure venv exists
if [ ! -d "/opt/venv" ]; then
    python -m venv /opt/venv
    . /opt/venv/bin/activate
    pip install -r requirements.txt
fi
# Run your app
flask run