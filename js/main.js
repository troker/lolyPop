var HollypopeCopulator = require('hollypope');
var lotar = new HollypopeCopulator();

var lotarObj = {};
var dataMap;
var tableHead;

document.getElementById('start').addEventListener('click', initHollyPope);
document.getElementById('stop').addEventListener('click', lotar.stop);
//----------------------------------------------------------------------------------------------------------------------
/**
 * Create a list with relations
 */
Object.prototype.createList = function() {
    if(this.length) return false;
    var targ = document.getElementById('relationList'), i, li, who_1, who_2, rel;
    for(i in this) {
        if(!this.hasOwnProperty(i)) continue;

        who_1 = i.split('||')[0];
        who_2 = i.split('||')[1];
        rel = this[i];

        li = document.createElement('li');
        li.className = "list-group-item";
        li.innerHTML = "concern: " + who_1 + " " + rel + " " + who_2;
        targ.appendChild(li);
    }
};
/**
 * Overwrite new data
 */
function refreshHollyPope() {
    $('#relationTable, #relationList').empty();
    lotarObj.createList();
    dataMap = createRelMap(lotarObj);
    tableHead = createTableHead(lotarObj);
    creatRelation(dataMap, tableHead);
}
/**
 * get data for init holly pope
 */
function initHollyPope() {
    lotar.onConcern(function(guelph, ghibellin, kindOfRelation) {
        var itemProp = guelph + "||" + ghibellin;
        lotarObj[itemProp] = kindOfRelation;
        refreshHollyPope()
    });
    lotar.onForget(function(guelph, ghibellin) {
        var itemProp = guelph + "||" + ghibellin;
        if(lotarObj.hasOwnProperty(itemProp)) delete lotarObj[itemProp];
        refreshHollyPope();
    });
    lotar.start();
}
/**
 * Create obj with Ghelphs obj
 *
 * @param obj {Object} relations list from event emitter;
 * @returns {Object} Ghelphs obj with relations
 */
function createRelMap(obj) {
    var i, who_1, who_2, napRel = {};
    for(i in obj) {
        if(!obj.hasOwnProperty(i)) continue;
        var map = {}; //Create new object to avoid links
        who_1 = i.split('||')[0];
        who_2 = i.split('||')[1];
        map[who_2] = obj[i];

        napRel.hasOwnProperty(who_1) ? napRel[who_1].push(map) : napRel[who_1] = [map];
    }
    return napRel;
}
/**
 * Create obj with Ghibellines list
 *
 * @param obj {Object} relations list from event emitter;
 * @returns {Object} Ghibellines list
 */
function createTableHead(obj) {
    var i, ress = {};
    for(i in obj) {
        if(!obj.hasOwnProperty(i)) continue;
        ress[i.split('||')[1]] = true;
    }
    return ress;
}
/**
 * Create a table relationship
 *
 * @param map {Object} Ghelphs obj with relations
 * @param head {Object} Ghibellines list
 */
function creatRelation(map, head) {
    var targ = $('#relationTable'), i, y, x, td, curEl,
        patternRow = $('<tr class="head">').append('<td></td>');
    //create header pattern;
    for (i in head) {
        if(!head.hasOwnProperty(i)) continue;
        td = $('<td>').attr('id', i).text(i);
        patternRow.append(td)
    }
    targ.append(patternRow); //add header to table
    //created other rows with relations
    for(y in map) {
        if(!map.hasOwnProperty(y)) continue;
        curEl = $('.head').first().clone();
        curEl.children().text('');
        curEl.children().first().text(y);
        //fill the signs + or -
        map[y].forEach(function(el) {
            for (x in el) {
                if(!el.hasOwnProperty(x)) continue;
                curEl.children().each(function(i, elem) {
                    if($(elem).attr('id') === x) {
                        if(el[x] === "+") $(elem).addClass('green');
                        else $(elem).addClass('red');
                        $(elem).text(el[x]);
                    }
                });
            }
        });
        targ.append(curEl); //Add the rest of the row
    }
}