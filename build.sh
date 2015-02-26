#!/bin/bash
# Get the Toolkit ready to rock & roll with the latest deps

set -e

if [ ! -f package.json ]; then
    echo "The script must be run in the root directory and have a package.json for NPM"
    exit 1
fi

if [ ! -f bower.json ]; then
    echo "The script must be run in the root directory and have a bower.json for Bower"
    exit 1
fi

if [ ! -f Gruntfile.js ]; then
    echo "The script must be run in the root directory and have a Gruntfile.js for Grunt"
    exit 1
fi

if [ "$1" = "-clean" ];then
    echo "Cleaning package directories"
    rm -rf node_modules || true
    rm -rf js/bower_components || true
fi

echo "Installing NPM packages..."
npm install --registry=http://goth.office.moo.com:4873/
echo "Installing Bower packages"
./node_modules/bower/bin/bower install --config.interactive=false

