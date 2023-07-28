#!/bin/bash

cd ./packages

# Duplicate .d.ts to .d.mts
find . -name "*.d.ts" -exec sh -c 'cp "$1" "${1%.d.ts}.d.mts"' _ {} \;
