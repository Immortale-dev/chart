
function Scroller(opts = {}){
    
    this.borderColor = opts.borderColor;
    this.fadeColor = opts.fadeColor;
    this.top = opts.top;
    this.height = opts.height;
    this.minCoof = opts.minCoof;
    this.view = {min:0, max:1};
    this.draggerWidth = 8;
    
    this._init();
    
}

var proto = Scroller.prototype;

proto._init = function(){
    
    ///@TODO recode to work like Checkboxes class;
    
    let scrOuter = document.createElement('div');
    let scrInner = document.createElement('div');
    let scrLeft = document.createElement('div');
    let scrRight = document.createElement('div');
    
    let draggerLeft = document.createElement('div');
    let draggerRight = document.createElement('div');
    let dragger = document.createElement('div');
    
    let draggerWidth = this.draggerWidth;
    
    scrInner.appendChild(dragger);
    scrInner.appendChild(draggerLeft);
    scrInner.appendChild(draggerRight);
    
    scrOuter.appendChild(scrInner);
    scrOuter.appendChild(scrLeft);
    scrOuter.appendChild(scrRight);
    
    let outerStyles = {
        position: 'absolute',
        top: this.top+'px',
        height: this.height+'px',
        left: 0,
        right: 0,
    };
    let innerStyle = {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        boxSizing: 'border-box',
        borderTop: 'solid 1px '+this.borderColor,
        borderBottom: 'solid 1px '+this.borderColor,
    };
    let leftStyle = {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: 0,
        backgroundColor: this.fadeColor,
    };
    let rightStyle = {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        width: 0,
        backgroundColor: this.fadeColor,
    }
    let draggerSideStyles = {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: draggerWidth+'px',
        cursor: 'w-resize',
        backgroundColor: this.borderColor,
    };
    let draggerStyle = {
        position: 'absolute',
        left: draggerWidth+'px',
        right: draggerWidth+'px',
        top: 0,
        bottom: 0,
    };
    
    _applyStyles(scrOuter, outerStyles);
    _applyStyles(scrInner, innerStyle);
    _applyStyles(scrLeft, leftStyle);
    _applyStyles(scrRight, rightStyle);
    
    _applyStyles(dragger, draggerStyle);
    _applyStyles(draggerLeft, draggerSideStyles);
    _applyStyles(draggerRight, draggerSideStyles);
    
    draggerLeft.style.left = 0;
    draggerRight.style.right = 0;
    
    this.outer = scrOuter,
    this.inner = scrInner,
    this.left = scrLeft,
    this.right = scrRight
    this.dragger = dragger;
    this.draggerLeft = draggerLeft;
    this.draggerRight = draggerRight;
    
    this._initEvents();
    
    function _applyStyles(dom, styles){
        for(let i in styles){
            if(styles.hasOwnProperty(i))
            dom.style[i] = styles[i];
        }
    }
}

proto.setView = function(min,max){
    if(min === void(0) || max === void(0)){
        min = this.view.min;
        max = this.view.max;
    }
    this.view.min = min;
    this.view.max = max;
    this.inner.style.left = min*100+'%';
    this.inner.style.width = (max-min)*100+'%';
    this.left.style.width = min*100+'%';
    this.right.style.width = (1-max)*100+'%';
}

proto._initEvents = function(){
    this._addMoveEvent(this.dragger, (ch)=>{
        let plusCoof = this._pxToCoof(ch);
        this.view.min += plusCoof;
        this.view.max += plusCoof;
        this._fixView();
        this.setView();
        this._fireMove();
    });
    this._addMoveEvent(this.draggerLeft, (ch)=>{
        let plusCoof = this._pxToCoof(ch);
        this.view.min += plusCoof;
        if(this.view.max - this.view.min < this.minCoof)
            this.view.min -= this.minCoof - (this.view.max-this.view.min);        
        if(this.view.min < 0)
            this.view.min = 0;
        this.setView();
        this._fireMove();
    });
    this._addMoveEvent(this.draggerRight, (ch)=>{
        let plusCoof = this._pxToCoof(ch);
        this.view.max += plusCoof;
        if(this.view.max - this.view.min < this.minCoof)
            this.view.min += this.minCoof - (this.view.max-this.view.min);
        if(this.view.max > 1)
            this.view.max = 1;
        this.setView();
        this._fireMove();
    });
}

proto._fixView = function(){
    if(this.view.min < 0){
        let pl = -this.view.min;
        this.view.min += pl;
        this.view.max += pl;
    }
    if(this.view.max > 1){
        let pl = 1-this.view.max;
        this.view.min += pl;
        this.view.max += pl;
    }
}

proto._fireMove = function(){
    this._onmove && this._onmove({min:this.view.min, max:this.view.max});
}

proto._pxToCoof = function(px){
    ///@TODO recode to not use DOM width
    return px/this.outer.offsetWidth;
}

proto._addMoveEvent = function(el, callback){
    ///@TODO Add Touch Events
    
    el.addEventListener('mousedown', mouseDown, false);
    el.addEventListener('touchstart', mouseDown, false);
    
    let pos;
    
    function mouseDown(e){
        e.preventDefault();
        pos = getX(e);
        window.addEventListener('mousemove', mousemove, false);
        window.addEventListener('mouseup', mouseup, false);
        window.addEventListener('touchmove', mousemove, false);
        window.addEventListener('touchend', mouseup, false);
    }
    
    function mousemove(e){
        let np = getX(e);
        let ch = np-pos;
        pos = np;
        callback(ch);
    }
    
    function mouseup(e){
        window.removeEventListener('mousemove', mousemove, false);
        window.removeEventListener('mouseup', mouseup, false);
        window.removeEventListener('touchmove', mousemove, false);
        window.removeEventListener('touchend', mouseup, false);
    }
    
    function getX(e){
        return e.changedTouches ? e.changedTouches[0].pageX : e.pageX;
    }
}

proto.onmove = function(fn){
    this._onmove = fn;
}

export default Scroller;