// Because IE8 has no forEach

if (typeof Array.prototype.forEach == 'undefined') {
    Array.prototype.forEach = function (callback) {
        for (var i = 0; i < this.length; i++) {
            callback.apply(this, [this[i], i, this]);
        }
    };
}

// Because IE8 has no nodelist but static nodelist and no applyable slice

function NodeListAsArray(nl){
    var arr=[];
    for(var i=-1,l=nl.length>>>0;++i!==l;arr[i]=nl[i]);
    return arr;
}

// Because IE8 event model is funny

function addEvent(element,event,handler){
    if(element.addEventListener)element.addEventListener(event,handler);
    else element.attachEvent('on'+event,handler);
}

// I use this to filter child nodes by tag name. Should i use queryselectorall? Thats the question.

HTMLCollection.prototype.filterByTagName = function(tagname){
    var filtered = [];
    tagname=tagname.toLowerCase();

    for(var i=0;i<this.length;i++)
        if(this.item(i).tagName.toLowerCase() == tagname)
            filtered.push(this.item(i));

    return filtered;
};

Element.prototype.hasClass = function(className){
    // TODO: Replace with brutal ternary for sake of bad readability.
    if (this.classList)return this.classList.contains(className);
    return new RegExp('(^| )' + className + '( |$)', 'gi').test(this.className);
}

Element.prototype.css = function(styles){
    if(typeof styles.css=='undefined'){
        var that = this;
        styles.css = function(styles){return that.css(styles);}
    }
    for(var name in styles)if(name!='css')this.style[name] = styles[name];
    return styles;
}


var splitMe = {
    currentElement : null,
    crutch:null,
    resizes:[],
    up:function(event){
        if(splitMe.currentElement) {
            splitMe.currentElement.splitter.className = splitMe.currentElement.vertical ? 'divider_vertical' : 'divider_horizontal';
            splitMe.currentElement = null;
        }
    },
    move:function(event){
        if(splitMe.currentElement){

            var v = splitMe.currentElement.vertical;

            var ss = v?splitMe.currentElement.splitter.offsetWidth:splitMe.currentElement.splitter.offsetHeight;
            var es = v?splitMe.currentElement.clientWidth:splitMe.currentElement.clientHeight;
            var newPos = (v?event.clientX:event.clientY) - splitMe.currentElement.getBoundingClientRect()[v?'left':'top'] - ss / 2;

            splitMe.currentElement.percent = (newPos<0?0:(newPos>es-ss?es-ss:newPos))/es * 100;
            splitMe.update(splitMe.currentElement);

            if(event)event.preventDefault();
            return false;
        }

    },
    update : function(element){
        var es = element.vertical?element.clientWidth:element.clientHeight;
        var newPos = element.percent/100*es;
        var sw = element.vertical?element.splitter.offsetWidth:element.splitter.offsetHeight;
        var bp = ((newPos+sw)/es * 100) + '%';
        console.log(newPos);
        var ap = ((es - newPos)/es * 100) + '%';
        element.splitter.style[element.vertical?'left':'top']=element.percent + '%';
        if(element.vertical){
            element.b.css({left:bp, right:0, top:0, bottom:0});
            element.a.css({right:ap,left:0, top:0, bottom:0});
        }
        else{
            element.b.css({top:bp,bottom:0, left:0, right:0});
            element.a.css({bottom:ap,top:0, left:0, right:0});
        }
    },
    init : function(){
        splitMe.resizes=NodeListAsArray(document.querySelectorAll('.vertically_divided')).
            concat(NodeListAsArray(document.querySelectorAll('.horizontally_divided')));

        splitMe.resizes.forEach(function(elem){

            var v = elem.hasClass('vertically_divided');
            elem.vertical = v;
            var children = elem.children.filterByTagName('div');

            var a = children[0];var b = children[1];

            b.css(a.css({position:'absolute',overflow:'hidden',top:0,bottom:0,left:0})).css({right:0});
            elem.css({overflow:'hidden',position:(elem.style.position=='absolute'?'absolute':'relative')});

            if(v){
                a.style.bottom = '0';
                b.style.top = '0';
            }
            else{
                a.style.right = '0';
                b.style.left = '0';
            }

            elem.a = a;elem.b = b;
            elem.percent = 50;

            var divider = document.createElement('div');
            divider.className = v?'divider_vertical':'divider_horizontal';
            divider.style.cssText =v?'top:0;bottom:0;position:absolute;':'left:0;right:0;position:absolute;';

            divider.onmousedown = function(event){
                elem.splitter.className += ' dragged';
                splitMe.currentElement = elem;
                if(event)event.preventDefault();
                return false;
            };

            elem.splitter = divider;
            elem.appendChild(divider);
            splitMe.update(elem);

        })

        addEvent(document,'mousemove',splitMe.move);
        addEvent(document,'mouseup',splitMe.up);

        addEvent(window,'resize',function(){
            setTimeout(function(){
                for(var index in splitMe.resizes)
                    splitMe.update(splitMe.resizes[index]);
            },20);
        });
        //TODO: Touch support
    }

};



addEvent(window,'load',function () {
    splitMe.init();
});