//div.mensaje.classlist "px-4 py-3 rounded max-w-lg mx-auto mt-6 text-center border"
// para eeror bg-red-100 border-red-400 text-red-700 if not todo green
// el alerta solo se ejecute una vez en pantalla
// Para ir a otra locacion window.location.href = "index.html"
// ejecutar el listado en casod e que exista window.indexDB.open
//cuando se le da al boton de editar el id ya viene en el url
//Para encontrar parametros en la URL

/* const parametrosURL = new URLSearchParams(window.location.search)

const idCliente = parametrosURL.get("id"); */ // esta variable viene en el url con un ?

//usar if idcliente porque puede que haya un id que no exista

// confirm(valor) para confirmar

// agregar sweet alert

(function () {
  //Variables

  const indexedDB = window.indexedDB;
  const formulario = document.querySelector('#formulario');
  let DB;
  const clienteGlobal = {
    nombre: '',
    email: '',
    telefono: '',
    empresa: '',
    id: '',
  };

  //Classes

  class UI {
    mostrarMensaje(mensaje, tipo) {
      const alerta = document.querySelector('.alerta');

      if (!alerta) {
        const divMensaje = document.createElement('div');
        divMensaje.className =
          'px-4 py-3 rounded max-w-lg mx-auto mt-6 text-center border alerta';
        const rowMsg = document.createElement('p');
        rowMsg.innerHTML = mensaje;
        if (tipo === 'error') {
          divMensaje.classList.add(
            'bg-red-100',
            'border-red-400',
            'text-red-700'
          );
        } else {
          divMensaje.classList.add(
            'bg-green-100',
            'border-green-400',
            'text-green-700'
          );
        }

        divMensaje.appendChild(rowMsg);

        formulario.appendChild(divMensaje);

        setTimeout(() => {
          divMensaje.remove();
        }, 3500);
      }
    }
  }

  // Instancias

  const ui = new UI();

  //addEventListeners

  addEventListener();

  function addEventListener() {
    document.addEventListener('DOMContentLoaded', () => {
      conectarDB();
    });
    formulario.addEventListener('submit', agregarCliente);
    formulario.addEventListener('input', rellenarCliente);
  }

  //Conectar a la base de Datos

  function rellenarCliente(e) {
    if (e.target.id === 'nombre') {
      clienteGlobal.nombre = e.target.value;
    } else if (e.target.id === 'email') {
      clienteGlobal.email = e.target.value;
    } else if (e.target.id === 'telefono') {
      clienteGlobal.telefono = e.target.value;
    } else if (e.target.id === 'empresa') {
      clienteGlobal.empresa = e.target.value;
    }
  }

  function conectarDB() {
    const request = indexedDB.open('ClienteDB', 1);

    request.onerror = function () {
      console.error('Error Conectando la base de datos');
    };

    request.onsuccess = function () {
      console.log('DB conectada satisfactioriamente');
      DB = request.result;
    };
  }

  function agregarCliente(e) {
    e.preventDefault();
    const { nombre, email, telefono, empresa } = clienteGlobal;

    if (nombre === '' || email === '' || telefono === '' || empresa === '') {
      ui.mostrarMensaje('Rellene todos los campos', 'error');
      return;
    }

    clienteGlobal.id = Date.now();

    agregarClienteDB(clienteGlobal);

    formulario.reset();

    limpiarObjetoGlobal();
  }

  function agregarClienteDB(clienteAAgregar) {
    const transaction = DB.transaction('clientes', 'readwrite');
    const store = transaction.objectStore('clientes');

    store.add(clienteAAgregar);

    transaction.onerror = () => {
      ui.mostrarMensaje('Error Agregando Cliente', 'error');
    };

    transaction.oncomplete = () => {
      ui.mostrarMensaje('Cliente Agregado Correctamente');

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    };
  }

  function limpiarObjetoGlobal() {
    for (let propiedad in clienteGlobal) {
      clienteGlobal[propiedad] = '';
    }
  }
})();
