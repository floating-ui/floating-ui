#!/bin/sh

git add dist/**/*
git tag -a v${version} -m "chore(automatic): v${version}"
git rm dist/**/*
git commit -m "chore(automatic): Clean dist after v${version}"
