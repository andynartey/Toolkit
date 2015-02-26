# Brewfile
install imagemagick
install graphicsmagick
install ttfautohint --with-python

# Extra deps to ensure fontforge works with SVGs etc
# (This is certainly excessive, but it will let fontforge use any filetype)
install python gettext libpng jpeg libtiff giflib cairo pango libspiro czmq fontconfig automake libtool pkg-config glib pango
install fontforge --with-python --with-cairo --with-czmq --with-gif --with-x --with-libspiro --with-pango --enable-pyextension --debug

install phantomjs
install casperjs --devel
