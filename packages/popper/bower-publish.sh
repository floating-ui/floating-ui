#!/bin/sh

version="$(cat package.json | jq -r '.version')"

cp -R dist ../../dist
cp bower.json ../../bower.json
git add -f ../../dist/*
git add ../../bower.json
git commit --no-verify -m "chore(automatic): v${version} (dist files)"
git tag -a v${version} -m "chore(automatic): v${version} (tag release)"
git rm ../../dist/**/*
git rm ../../dist/*
git rm ../../bower.json
git commit --no-verify -m "chore(automatic): v${version} (dist files cleanup)"
