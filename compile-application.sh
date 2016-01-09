#!/bin/bash
utilities/png2tiles.py Levels/proto/ game/
utilities/compressJS.sh game/src/*.js game/package.js
