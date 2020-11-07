(function() {
    let DB;
    let idCliente;

    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');

    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();

        //Actualizar información del cliente
        formulario.addEventListener('submit', actualizarCliente);

        //Verificar el ID de la url
        const parametrosURL = new URLSearchParams(window.location.search);
        
        idCliente = parametrosURL.get('id');

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

    function actualizarCliente(e){
        e.preventDefault();

        if(nombreInput.value === '' || emailInput.value === '' || telefonoInput.value === '' || empresaInput.value === ''){
            imprimirAlerta('Todos los campos son obligatorios', 'error');

            return;
        }

        //Actualizar cliente
        const clienteActualizado = {
            nombre: nombreInput.value,
            email: emailInput.value,
            telefono: telefonoInput.value,
            empresa: empresaInput.value,
            id: Number(idCliente)
        };

        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        objectStore.put(clienteActualizado);

        transaction.oncomplete = function(){
            imprimirAlerta('Editado correctamente');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        };

        transaction.onerror = function(){
            imprimirAlerta('Ha ocurrido un error', 'error');
        };
    }

    function conectarDB(){
        //Abrir conexión
        let abrirConexion = window.indexedDB.open('crm', 1);
    
        abrirConexion.onerror = function(){
            console.log('Ha ocurrido un error');
        };
    
        abrirConexion.onsuccess = function(){
            DB = abrirConexion.result;
        };
    }
    
    function imprimirAlerta(mensaje, tipo){
        const alerta = document.querySelector('.alerta');
    
        if(!alerta){
            //Crear la alerta
            const divMensaje = document.createElement('div');
            divMensaje.classList.add('px-4', 'py-3', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'border', 'alerta');
    
            if(tipo === 'error'){
                divMensaje.classList.add('bg-red-100', 'border-red-400', 'text-red-700');
            } else{
                divMensaje.classList.add('bg-green-100', 'border-green-400', 'text-green-700');
            }
    
            divMensaje.textContent = mensaje;
    
            formulario.appendChild(divMensaje);
    
            setTimeout(() => {
                divMensaje.remove();
            }, 3000);
        }
    }

})();