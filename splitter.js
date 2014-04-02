HTMLCollection.prototype.filterByTagName = function(tagname){

    var filtered = [];
    tagname=tagname.toLowerCase();

    for(var i=0;i<this.length;i++)
        if(this.item(i).tagName.toLowerCase() == tagname)
            filtered.push(this.item(i));

    return filtered;
};

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
        if(splitMe.currentElement) {
            splitMe.currentElement.splitter.className = splitMe.currentElement.vertical ? 'divider_vertical' : 'divider_horizontal';
            splitMe.currentElement = null;
        }
    },
    move:function(event){
        if(splitMe.currentElement){

            var v = splitMe.currentElement.vertical;

            var offset = splitMe.currentElement.getBoundingClientRect()[v?'left':'top'];

            var ss = v?splitMe.currentElement.splitter.offsetWidth:splitMe.currentElement.splitter.offsetHeight;
            var es = v?splitMe.currentElement.clientWidth:splitMe.currentElement.clientHeight;

            var newPos = (v?event.clientX:event.clientY) - offset - ss / 2;
            if(newPos<0)newPos=0;
            if(newPos>es - ss)newPos = es - ss;

            splitMe.currentElement.percent = newPos/es * 100;

            //splitMe.update(splitMe.currentElement);
            splitMe.triggerResizes();

            event.preventDefault();
        }

    },
    update : function(element){

        if(element.vertical){
            var ew = element.clientWidth;
            var sw = element.splitter.offsetWidth;
            var newPos = element.percent/100*ew;

            element.splitter.style.left=element.percent + '%';

            element.b.style.left=((newPos+sw)/ew * 100) + '%';
            element.a.style.right = ((ew - newPos)/ew * 100) + '%';

            element.b.style.right='0';
            element.a.style.left='0';
        }

        else{
            var eh = element.clientHeight;
            var sh = element.splitter.offsetHeight;
            var newPos = element.percent/100*eh;

            element.splitter.style.top=element.percent + '%';

            element.b.style.top=((newPos+sh)/eh * 100) + '%';
            element.a.style.bottom = ((eh - newPos)/eh * 100) + '%';

            element.b.style.bottom='0';
            element.a.style.top='0';

        }
    },
    init : function(){
        splitMe.resizes=Array.prototype.slice.call(document.getElementsByClassName('vertically_divided')).
            concat(Array.prototype.slice.call(document.getElementsByClassName('horizontally_divided')));

        splitMe.resizes.forEach(function(elem){

            elem.vertical = elem.hasClass('vertically_divided');
            var children = elem.children.filterByTagName('div');

            elem.a = children[0];
            elem.b = children[1];

            elem.a.style.position = 'absolute';
            elem.b.style.position = 'absolute';

            if(elem.style.position!='absolute')elem.style.position = 'relative';
            elem.style.overflow = 'hidden';

            elem.a.style.overflow = 'hidden';
            elem.b.style.overflow = 'hidden';

            if(elem.vertical == true){
                elem.a.style.top = '0';
                elem.a.style.left = '0';
                elem.a.style.bottom = '0';

                elem.b.style.top = '0';
                elem.b.style.right = '0';
                elem.b.style.bottom = '0';
            }
            else{                               //TODO: Get rid of chinese code
                elem.a.style.top = '0';
                elem.a.style.left = '0';
                elem.a.style.right = '0';

                elem.b.style.bottom = '0';
                elem.b.style.right = '0';
                elem.b.style.left = '0';
            }

            elem.percent = 50;


            var divider = document.createElement('div');
            divider.className = elem.vertical?'divider_vertical':'divider_horizontal';
            divider.style.cssText =elem.vertical?'top:0;bottom:0;position:absolute;':'left:0;right:0;position:absolute;';

            divider.onmousedown = function(event){
                elem.splitter.className += ' dragged';
                splitMe.currentElement = elem;
                event.preventDefault();
            };

            divider.addEventListener('touchstart',function(){
                arert('Fuck you!');
            });

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