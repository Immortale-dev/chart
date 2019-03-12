import EVN from "./evn.js";

function Ev(type, ...params){
    this.type = type;
    this.data = params;
}

function DrawerDrawEv(pt, ind, data){
    this.type = EVN.DRAWERDRAW;
    this.point = pt;
    this.index = ind;
    this.data = data;
}

var EV = {
    Ev,
    DrawerDrawEv,
};

export default EV;