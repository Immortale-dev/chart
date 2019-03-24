function Checkboxes(opts){
    
    this._defaults();
    
    this.padding = opts.padding || this.padding;
    this.margin = opts.margin || this.margin;
    this.color = opts.color || this.color;
    this.display = opts.display || this.display;
    this.borderColor = opts.borderColor || this.borderColor;
    this._checkboxes = [];
    
    this._createBlock();
    
}
var proto = Checkboxes.prototype;


proto.get = function(index){
    return index === void(0) ? this._checkboxes : this._checkboxes[index];
}

proto.check = function(index,checked = true){
    this._checkboxes[index].checked = checked;
}

proto.remove = function(){
    ///@TODO;
}

proto.add = function(opts){
    let cb = {};
    if(opts.color)
        cb.color = opts.color || this.color;
    if(opts.checked)
        cb.checked = (opts.checked !== void(0) ? opts.checked : true);
    if(opts.title)
        cb.title = opts.title || '';
    cb.check = (ch)=>{
        cb.checked = ch !== void(0) ? ch : !cb.checked;
        cb._block.classList[cb.checked ? 'add' : 'remove']('active');
        this._onchange && this._onchange(cb, this._checkboxes.indexOf(cb));
    }
    this._checkboxes.push(cb);
    this._renderCheckbox(cb);
};

proto.onchange = function(fn){
    this._onchange = fn;
}

proto._createBlock = function(){
    let div = document.createElement('div');
    div.classList.add('telechart__checkboxes');
    this.block = div;
}

proto.generateStyles = function(){
    
    ///@TODO hmm... Anyway better than Scroller class styling :D
    
    let s = document.createElement('style');
    let st = `
        .telechart__checkboxes{
            padding-top: 15px;
        }
        .telechart__checkbox *, .telechart__checkbox *:before, .telechart__checkbox *:after{
            box-sizing: border-box;
        }
        .telechart__checkbox{
            padding: ${this.padding}px 14px ${this.padding}px 10px;
            margin-right: ${this.margin}px;
            margin-bottom: ${this.margin}px;
            display: ${this.display};
            border: solid 1px ${this.borderColor};
            border-radius: ${this._borderRadius}px;
            cursor: pointer;
        }
        .telechart__checkbox.active .telechart__checkbox_check:after{
            transform: scale(0);
            border-color: #fff;
        }
        .telechart__checkbox_check{
            position: relative;
            width: ${this._size}px;
            height: ${this._size}px;
            border-radius: 50%;
            vertical-align: ${this._verticalAlign};
            display: inline-flex;
            margin-right: ${this._checkMargin};
            cursor: pointer;
        }
        .telechart__checkbox_check:after{
            content: '';
            display: block;
            position: absolute;
            top: -1px;
            left: -1px;
            width: calc(100% + 2px);
            height: calc(100% + 2px);
            background-color: #fff;
            transform: scale(1);
            transition: transform ${this.animationSpeed}ms ease-out;
            border: solid 1px ${this.borderColor};
            border-radius: 50%;
        }
        .telechart__checkbox span{
            vertical-align: ${this._verticalAlign};
            font-size: ${this._fontSize};
            color: #43484b;
            font-family: "Open Sans";
        }
        .telechart__checkbox_check_inner{
            display: block;
            color: #fff;
            width: 100%;
            border-radius: 50%;
        }
        .telechart__checkbox_check_inner:before, .telechart__checkbox_check_inner:after{
            content: '';
            display: block;
            position: absolute;
            top: 50%;
            left: 50%;
            margin-top: 15%;
            margin-left: -10%;
            transform-origin: 1px 1px;
            width: ${Math.floor(this._size*0.5)}px;
            height: 2px;
            border-radius: 3px;
            transform: rotate(-45deg);
            background-color: currentColor;
        }
        .telechart__checkbox_check_inner:after{
            transform: rotate(-135deg);
            width: ${Math.floor(this._size*0.3)}px;
        }
    `;
    s.textContent = st;
    return s;
}

proto._renderCheckbox = function(cb,index){
    let replace = index !== void(0);
    
    let block = document.createElement('div');
    let check = document.createElement('div');
    let span = document.createElement('span');
    
    let checkInner = document.createElement('div');
    checkInner.classList.add('telechart__checkbox_check_inner');
    checkInner.style.backgroundColor = cb.color;
    
    block.classList.add('telechart__checkbox');
    check.classList.add('telechart__checkbox_check');
    span.innerText = cb.title;
    
    if(cb.checked)
        block.classList.add('active');
    
    cb._block = block;
    
    check.appendChild(checkInner);
    
    block.appendChild(check);
    block.appendChild(span);
    
    this._addCheckboxEvents(cb);
    
    if(!replace){
        this.block.appendChild(block);
    }
    else{
        let rb = this.block.children[index];
        this._checkboxes.splice(index,1,cb);
        this.block.insertBefore(block, rb);
        this.block.removeChild(rb);
    }
}

proto._addCheckboxEvents = function(cb){
    
    let block = cb._block;
    block.addEventListener('click', click, false);
    
    function click(){
        cb.check();
    }
}

proto._defaults = function(){
    this.padding = 7;
    this.margin = 14;
    this.color = '#000';
    this.display = 'inline-block';
    this.borderColor = '#000';
    this.animationSpeed = 250;
    this._borderRadius = 25;
    this._size = 20;
    this._checkColor = '#fff';
    this._checkMargin = 10;
    this._fontSize = 16;
    this._verticalAlign = 'middle';
    this._checkDisplay = 'inline-block';
}

export default Checkboxes;
