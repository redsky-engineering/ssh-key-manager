#!/bin/sh
# gets called with 3 args: filename, line, column
filename=$1
line=$2
column=$3

# Escape parentheses using sed (works in sh)
escaped_filename=$(printf '%s' "$filename" | sed 's/(/\\(/g; s/)/\\)/g')

# Cursor needs to both be quoted and escaped
cursor -g "${escaped_filename}:${line}:${column}"