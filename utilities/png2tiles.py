#!/usr/bin/python

# in order to run this script, install PIL/Pillow module:
# $ pip install pillow
#
# This script generates Tiled JSON map data based on a PNG pixelart with pixel
# colors corresponding to different tiles on the tileset.
#
# usage:
# python png2tiles.py src_dir dest_dir
#
# src_dir - directory with pixelart and tileset
# dest_dir - directory where the json file will be saved

from PIL import Image
import json
import os
import sys

# global variables
TILE_SIZE = 40

source = sys.argv[1]
target = sys.argv[2]

print "Generating level from "+source+" to "+target

# put the input png file and tileset image in the same folder as this script
# provide the input/output data in the form of a list of tuples:
# (tileset scripting name, tileset filename)
input_data = [( "backgroundLayer","tileset"),
              ( "collisionLayer","tileset")]

for layer, tiles in input_data:

  bitmap = Image.open(os.path.join(source, layer+".png"))

  level_size_x = bitmap.size[0]
  level_size_y = bitmap.size[1]

  data = bitmap.load()

  formatted_data = []

  # edit this part with RGBA color code of tile, and corresponding tile number
  # on the tileset image (numbers starting with 1)
  tile_ids = {
    # white - ground
    (255,255,255,255): 1,
    # red - totem
    (255,0,0,255): 1,
    # green - tree
    (0,157,26,255): 5,
    # yellow - river
    (229, 226, 0,255): 4,
    # lblue - steps_horizontal
    (171, 255, 244, 255): 2,
    # lgreen - steps_vertical
    (171, 255, 181, 255): 3,
    # gray - rock
    (172, 165, 165, 255): 6
  }

  for i in range(level_size_y):
    for j in range (level_size_x):
      # compare pixel color with reference and output GID represented by that color
      if data[j, i] in tile_ids:
        formatted_data.extend([ tile_ids[data[j,i]] ])
      elif data[j, i][0] > 0 or data[j, i][1] > 0:
        formatted_data.extend([1])
      else:
        formatted_data.extend([0])

  tileset = Image.open(os.path.join(source, tiles+".png"))

  tileset_size_x = tileset.size[0]
  tileset_size_y = tileset.size[1]

  # output JSON format
  output_data = {
    "height": level_size_y,
    "layers":[{
      "data": formatted_data,
      "height": level_size_y,
      "name": layer,
      "opacity": 1,
      "type": "tilelayer",
      "visible": "true",
      "width": level_size_x,
      "x": 0,
      "y": 0,
    }],
    "orientation": "orthogonal",
    "properties": {},
    "tileheight": TILE_SIZE,
    "tilesets":[{
      "firstgid": 1,
      "image": tiles+".png",
      "imageheight": tileset_size_y,
      "imagewidth": tileset_size_x,
      "margin": 0,
      "name": tiles,
      "properties": {},
      "spacing": 0,
      "tileheight": TILE_SIZE,
      "tilewidth": TILE_SIZE
    }],
    "tilewidth": TILE_SIZE,
    "version": 1,
    "width": level_size_x
  }

  outfile = open(os.path.join(target, "data", source, layer+".json"), 'w')

  json_dump = json.dumps(output_data, sort_keys=True, indent=2)

  outfile.write(json_dump)

  outfile.close()
