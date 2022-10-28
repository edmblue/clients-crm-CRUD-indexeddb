(function () {
  //Variables

  let DB;
  let idCliente;
  const nombreInput = document.querySelector('#nombre');
  const emailInput = document.querySelector('#email');
  const telInput = document.querySelector('#telefono');
  const empresaInput = document.querySelector('#empresa');
  const formulario = document.querySelector('#formulario');

  //addEventListeners

  addEventListeners();

  function addEventListeners() {
    document.addEventListener('DOMContentLoaded', () => {
      conectarDB();
    });
    formulario.addEventListener('submit', editarCliente);
  }

  function funcionesEditar() {
    //Obteniendo el parametro

    const parametrosURL = new URLSearchParams(window.location.search);

    idCliente = Number(parametrosURL.get('id'));

    if (idCliente) {
      recolectarInfo(idCliente);
    }

    function recolectarInfo(idCliente) {
      console.log(idCliente);
      const transaction = DB.transaction('clientes', 'readwrite');
      const store = transaction.objectStore('clientes');

      store.openCursor().onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor) {
          const { nombre, email, telefono, empresa, id } = cursor.value;
          if (id === idCliente) {
            nombreInput.value = nombre;
            emailInput.value = email;
            telInput.value = telefono;
            empresaInput.value = empresa;
          }
          cursor.continue();
        }
      };
    }
  }

  function editarCliente(e) {
    e.preventDefault();

    const transaction = DB.transaction('clientes', 'readwrite');
    const store = transaction.objectStore('clientes');

    const clienteAEditar = {
      nombre: nombreInput.value,
      email: emailInput.value,
      telefono: telInput.value,
      empresa: empresaInput.value,
      id: idCliente,
    };

    store.put(clienteAEditar);

    transaction.onerror = () => {
      console.error('Error Editando');
    };

    transaction.oncomplete = () => {
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 500);
    };

    formulario.reset();
  }

  function conectarDB() {
    const request = indexedDB.open('ClienteDB', 1);

    request.onerror = function () {
      console.error('Error Conectando la base de datos');
    };

    request.onsuccess = function () {
      console.log('DB conectada satisfactioriamente');
      DB = request.result;
      funcionesEditar();
    };
  }
})();
