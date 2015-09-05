
function log(msg, obj) { 
    console.info("[OBJ]>> " + msg);
    if (obj)
        console.info(JSON.stringify(obj));
}