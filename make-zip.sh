#!/bin/sh
cd dist
zip -r ../zip/$(date +"%Y%m%d_%H%M%S").zip ./*