# run with `sh dist-toolkit.sh 0.0.1`
# will allow Bower to pick up the latest version of the toolkit automatically (using * syntax)
if [ ! $1 ] ; then echo "Supply a version number akin to 0.0.1"; exit 1; fi
VERSION=$1
git add -f dist bower.json package.json
git commit -m "release v$VERSION"
git tag v$VERSION
git push --tag
git rm -rf dist
git commit -m "removing dist directory"
git push
