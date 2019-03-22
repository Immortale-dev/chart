
function Scroller(opts = {}){
    
    this.borderColor = opts.borderColor;
    this.fadeColor = opts.fadeColor;
    this.top = opts.top;
    this.height = opts.height;
    
    this._init();
    
}

var proto = Scroller.prototype;

proto._init = function(){
    let scrOuter = document.createElement('div');
    let scrInner = document.createElement('div');
    let scrLeft = document.createElement('div');
    let scrRight = document.createElement('div');
    
    let draggerLeft = document.createElement('div');
    let draggerRight = document.createElement('div');
    let dragger = document.createElement('div');
    
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
        //borderTop: 'solid 4px '+this.mapBorderColor,
        //borderBottom: 'solid 4px '+this.mapBorderColor,
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
        width: 4+'px',
        cursor: 'w-resize',
        backgroundColor: this.borderColor,
    };
    let draggerStyle = {
        position: 'absolute',
        left: 4+'px',
        right: 4+'px',
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
    
    //this._block.appendChild(scrOuter);
    
    this.outer = scrOuter,
    this.inner = scrInner,
    this.left = scrLeft,
    this.right = scrRight
    
    function _applyStyles(dom, styles){
        for(let i in styles){
            if(styles.hasOwnProperty(i))
            dom.style[i] = styles[i];
        }
    }
}

export default Scroller;