if(typeof HTMLCollection.prototype.filterByTagName == 'undefined')
HTMLCollection.prototype.filterByTagName = function(tagname){

    var filtered = [];
    tagname=tagname.toLowerCase();

    for(var i=0;i<this.length;i++)
        if(this.item(i).tagName.toLowerCase() == tagname)
            filtered.push(this.item(i));

    return filtered;
};

if(typeof Element.prototype.hasClass == 'undefined')
Element.prototype.hasClass = function(className){
    // Replace with brutal ternary for sake of bad readability.
    if (this.classList)return this.classList.contains(className);
    return new RegExp('(^| )' + className + '( |$)', 'gi').test(this.className);
}

var splitMe = {
    currentElement : null,
    crutch:null,
    triggerResizes : function(){
        for(var index in this.resizes)
            splitMe.update(this.resizes[index]);

    },
    up:function(event){
        splitMe.currentElement = null;
    },
    click:function(elem){
        splitMe.currentElement = elem;
    },
    move:function(event){
        if(splitMe.currentElement){

            var left = splitMe.currentElement.getBoundingClientRect().left; //TODO: offsetLeft?
            var sw = splitMe.currentElement.splitter.offsetWidth;
            var ew = splitMe.currentElement.clientWidth;

            var newPos = event.clientX - left - sw / 2;
            if(newPos<0)newPos=0;
            if(newPos>ew - sw)newPos = ew - sw;

            splitMe.currentElement.percent = newPos/ew * 100;

            //splitMe.update(splitMe.currentElement);
            splitMe.triggerResizes();

        }
        event.preventDefault();
    },
    update : function(element){

        var ew = element.clientWidth;
        var sw = element.splitter.offsetWidth;
        var newPos = element.percent/100*ew;

        element.splitter.style.left=element.percent + '%';

        element.rightPart.style.left=((newPos+sw)/ew * 100) + '%';
        element.leftPart.style.right = ((ew - newPos)/ew * 100) + '%';

        element.rightPart.style.right='0';
        element.leftPart.style.left='0';
    },
    init : function(){
        splitMe.resizes=Array.prototype.slice.call(document.getElementsByClassName('vertically_divided')).
            concat(Array.prototype.slice.call(document.getElementsByClassName('horizontally_divided')));

        splitMe.resizes.forEach(function(elem){

            elem.vertical = elem.hasClass('vertically_divided');
            var children = elem.children.filterByTagName('div');

            elem.leftPart = children[0];
            elem.rightPart = children[1];

            elem.leftPart.style.position = 'absolute';
            elem.rightPart.style.position = 'absolute';

            elem.style.position = 'relative';
            elem.style.overflow = 'hidden';

            elem.leftPart.style.overflow = 'hidden';
            elem.rightPart.style.overflow = 'hidden';

            elem.leftPart.style.top = '0';
            elem.leftPart.style.left = '0';
            elem.leftPart.style.bottom = '0';

            elem.rightPart.style.top = '0';
            elem.rightPart.style.right = '0';
            elem.rightPart.style.bottom = '0';

            elem.percent = 50;


            var divider = document.createElement('div');
            divider.className = 'divider_vertical';
            divider.style.cssText ='top:0;bottom:0;position:absolute;';

            divider.addEventListener('mousedown',splitMe.click);

            elem.splitter = divider;
            elem.appendChild(divider);
            splitMe.update(elem);

        })

        window.addEventListener('mousemove',splitMe.move);
        window.addEventListener('mouseup',splitMe.up);

        window.addEventListener('resize',function(){
            setTimeout(function(){
                splitMe.triggerResizes();
            },20);
        });
        //TODO: Touch support
    }

};


window.addEventListener('load',function(){

    splitMe.init();

});