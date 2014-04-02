Splitter
===

[Demo](http://andrienko.github.io/splitter/)

Splitter is a small JS script with no dependencies to create containers splitted horizontally or vertically
with moveable splitter bar.

It should work in modern browsers (Including IE9+)

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

Modifying
---

The splitter appearance is defined in splitter.css file (which source is style.less). You can add whatever style
you wish to anything.