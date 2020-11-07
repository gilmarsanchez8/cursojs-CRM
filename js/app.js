(function(){
    let DB;

    document.addEventListener('DOMContentLoaded', () => {
        crearDB(); 
    });

    //Crear la BD de indexedDB
    function crearDB(){
        //Abrir conexión
        const crearDB = window.indexedDB.open('crm', 1);

        crearDB.onerror = function(){
            console.log('Ha ocurrido un error');
        };

        crearDB.onsuccess = function(){
            DB = crearDB.result;
        };

        //Crear tablas
        crearDB.onupgradeneeded = function(e){
            const db = e.target.result;

            const objectStrore = db.createObjectStore('crm', 
            {
                keyPath: 'id',
                autoincrement: true
            });

            objectStrore.createIndex('nombre', 'nombre', {unique: false});
            objectStrore.createIndex('email', 'email', {unique: true});
            objectStrore.createIndex('telefono', 'telefono', {unique: false});
            objectStrore.createIndex('empresa', 'empresa', {unique: false});
            objectStrore.createIndex('id', 'id', {unique: true});

            console.log('DB creada con éxito');
        }
    }
})();