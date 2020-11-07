(function() {
    let DB;

    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');

    document.addEventListener('DOMContentLoaded', () => {
        conectarBD();
        //Verificar el ID de la url
        const parametrosURL = new URLSearchParams(window.location.search);
        
        const idCliente = parametrosURL.get('id');

        if(idCliente){
            setTimeout(() => {
                obtenerCliente(idCliente);
            }, 1000);
        }
    });

    function obtenerCliente(id){
        const transaction = DB.transaction(['crm'], 'readwrite');

        const objectStore = transaction.objectStore('crm');

        const cliente = objectStore.openCursor();
        cliente.onsuccess = function(e){
            const cursor = e.target.result;

            if(cursor){
                if(cursor.value.id === Number(id)){
                    llenarFormulario(cursor.value);
                }
                cursor.continue();
            }
        }
    }

    function llenarFormulario(datosCliente){
        const {nombre, telefono, empresa, email} = datosCliente;
        nombreInput.value = nombre;
        emailInput.value = email;
        telefonoInput.value = telefono;
        empresaInput.value = empresa;
    }

    function conectarBD(){
        //Abrir conexión
        const abrirConexion = window.indexedDB.open('crm', 1);

        abrirConexion.onerror = function(){
            console.log('Ha ocurrido un error');
        };

        abrirConexion.onsuccess = function(){
            DB = abrirConexion.result;
        };
    }
})();