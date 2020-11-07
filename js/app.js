(function(){
    let DB;

    document.addEventListener('DOMContentLoaded', () => {
        crearDB(); 

        if(window.indexedDB.open('crm', 1)){
            obtenerClientes();
        }
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

    function obtenerClientes(){
        //Abrir conexión
        const abrirConexion = window.indexedDB.open('crm', 1);

        abrirConexion.onerror = function(){
            console.log('Ha ocurrido un error');
        };

        abrirConexion.onsuccess = function(){
            DB = abrirConexion.result;

            const objectStore = DB.transaction('crm').objectStore('crm');

            objectStore.openCursor().onsuccess = function(e){
                const cursor = e.target.result;

                if(cursor){
                    const {nombre, empresa, email, telefono, id} = cursor.value;

                    const listadoClientes = document.querySelector('#listado-clientes');

                    listadoClientes.innerHTML += 
                    `   <tr>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
                                <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                                <p class="text-gray-700">${telefono}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                                <p class="text-gray-600">${empresa}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                                <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                                <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900">Eliminar</a>
                            </td>
                        </tr>
                    `;
                    cursor.continue();
                }else{
                    console.log('No hay mas registros...');
                }
            }
        };

    }
})();