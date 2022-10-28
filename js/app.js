(function () {
  //Variables

  const listadoClientes = document.querySelector('#listado-clientes');

  //AddEventListeners

  callEventListeners();
  function callEventListeners() {
    document.addEventListener('DOMContentLoaded', () => {
      crearDB();
      listadoClientes.addEventListener('click', eliminarCliente);
    });
  }

  function eliminarCliente(e) {
    if (e.target.classList.contains('eliminar')) {
      const idAEliminar = Number(e.target.dataset.cliente);

      transaction = DB.transaction('clientes', 'readwrite');
      store = transaction.objectStore('clientes');

      store.delete(idAEliminar);

      transaction.onerror = () => console.log('Error al eliminar');

      transaction.oncomplete = () => {
        console.log('entro');
        e.target.parentElement.parentElement.remove();
      };
    }
  }

  function crearDB() {
    const request = indexedDB.open('ClienteDB', 1);

    request.onerror = function () {
      console.error('Error Creando la base de datos');
    };

    request.onsuccess = function () {
      console.log('DB creada satisfactioriamente');
      DB = request.result;
      mostrarClientes();
    };

    request.onupgradeneeded = function () {
      const db = request.result;
      const store = db.createObjectStore('clientes', {
        keyPath: 'id',
        autoIncrement: true,
      });
      store.createIndex('nombre', 'nombre', { unique: false });
      store.createIndex('email', 'email', { unique: true });
      store.createIndex('telefono', 'telefono', { unique: false });
      store.createIndex('empresa', 'empresa', { unique: false });
      store.createIndex('id', 'id', { unique: true });
    };
  }

  function mostrarClientes() {
    const transaction = DB.transaction('clientes');
    const store = transaction.objectStore('clientes');

    store.openCursor().onsuccess = (e) => {
      const cursor = e.target.result;

      if (cursor) {
        const { nombre, email, telefono, empresa, id } = cursor.value;

        listadoClientes.innerHTML += ` <tr>
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
                <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
            </td>
        </tr>
    `;

        cursor.continue();
      }
    };
  }
})();
