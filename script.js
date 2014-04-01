var daSplitter = {
    currentElement : null,

    resizes : [],
    triggerResizes : function(){
        for(index in this.resizes){
            this.resizes[index]();
        }
    },
    up:function(event){
        daSplitter.currentElement = null;
    },
    move:function(event){
        if(daSplitter.currentElement){

            var left = daSplitter.currentElement.getBoundingClientRect().left;
            var sw = daSplitter.currentElement.splitter.offsetWidth;
            var ew = daSplitter.currentElement.clientWidth;

            //currentElement.percent

            var newPos = event.clientX - left - sw / 2;
            if(newPos<0)newPos=0;
            if(newPos>ew - sw)newPos = ew - sw;


            daSplitter.currentElement.splitter.style.left=(newPos/ew * 100) + '%';
            daSplitter.currentElement.rightPart.style.left = ((newPos+sw)/ew * 100) + '%';
            daSplitter.currentElement.leftPart.style.right = ((ew - newPos)/ew * 100) + '%';

            daSplitter.triggerResizes();
        }
        event.preventDefault();
    },

}

window.addEventListener('load',function(){


    Array.prototype.slice.call(document.getElementsByClassName('divided_left')).forEach(function(elem){

        var children = Array.prototype.slice.call(elem.getElementsByTagName('div'));



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

        divider.onmousedown = function(event){
            daSplitter.currentElement = elem;
        };

        elem.splitter = divider;
        elem.appendChild(divider);


    })

    window.addEventListener('mousemove',daSplitter.move);
    window.addEventListener('mouseup',daSplitter.up);

    //TODO: Touch support

});