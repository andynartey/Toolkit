/*
 * This code is mostly copied from https://github.com/vpegado/Modernizr/blob/master/feature-detects/css/checked.js
 * It is included as a custom test until Modernizr v3 is released
 */

Modernizr.addTest('checked', function(){
 return Modernizr.testStyles('#modernizr input {width:100px} #modernizr :checked {width:200px;display:block}', function(elem, rule){
    var cb = document.createElement('input');
    cb.setAttribute("type", "checkbox");
    cb.setAttribute("checked", "checked");
    elem.appendChild(cb);
    return cb.offsetWidth == 200;
  });
});
