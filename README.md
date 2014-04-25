Splitter
===

[Demo](http://andrienko.github.io/splitter/)

Splitter is a small (~3KB minifyed) JS script with **no dependencies** to create containers splitted horizontally or vertically
with moveable splitter bar. It is **not a library**! Just in case.

It should work in modern browsers and even in **IE8+** *(According to [this site](http://www.netmarketshare.com/browser-market-share.aspx?qprid=2&qpcustomd=0), when the code of
this script was written in April of 2014 the market share of IE8 was 20% amongst ALL browsers, which means that 1/5 of
mankind still used it, so I sacrificed some performance for sake of its support)*

Usage
---

Add css and js files to your project:

    <script type="text/javascript" src="splitter.js"></script>
    <link rel="stylesheet" type="text/css" href="splitter.css"/>

Then add horizontally_divided or vertically_divided class to the element you want splitted

    <div class="vertically_divided">
        <div>Left</div>
        <div>Right</div>
    </div>

The element you are adding the class to must have two first-level div elements in it, which will become left
and right parts of split container

Changing appearance
---

The splitter appearance is defined in splitter.css file (which source is style.less). You can add whatever style
you wish to anything.

.divider_vertical and .divider_horizontal are classes of the div that splits areas vertically and horizontally respectively.
It also gets .dragged class when the splitter is being dragged.

Minified version
---
..is built with closure compiler.

Plans for future
---
 - Possibility to create containers without moveable splitter and toggle moveable
 - Add min and max sizes for panes
 - Possibility to set initial values in px and/or percent