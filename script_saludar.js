/* OK
// TODO: Funcion Saludar
function mostrarSaludo() {
  const saludo = "¡Bienvenido a: <br> Tu Conversor de Monedas!";

  // Opción A: Mensaje de éxito (Verde, más amigable)
  alertify.success(saludo);

  // Opción B: Mensaje estándar (Gris, igual al alert original)
  // alertify.alert(saludo);
}
mostrarSaludo();
*/

// TODO: Funcion Saludar - 
/* OK
function mostrarSaludo() {
  const saludo = "¡Bienvenido a:<br><strong>Tu Conversor de Monedas!</strong>";

  // Estilo Novedoso con SweetAlert2
  Swal.fire({
    title: '¡Hola!',
    html: saludo,
    icon: 'success', // O 'info', 'question', 'warning'
    confirmButtonText: 'Empezar a convertir',
    confirmButtonColor: '#10b981', // Color verde moderno
  });
}
mostrarSaludo();
*/


/*
// TODO: Funcion Saludar
function mostrarSaludo() {
  const saludo = "¡Bienvenido a:<br><span style='color:#fff'>Tu Conversor de Monedas</span>!";

  Toastify({
    text: saludo,
    duration: 5000, // Dura 5 segundos
    close: true,
    gravity: "top", // "top" o "bottom"
    position: "right", // "left", "center" o "right"
    stopOnFocus: true, // Evita que desaparezca si pasas el mouse
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)", // Degradado moderno
      borderRadius: "10px",
      padding: "15px 20px",
      fontSize: "16px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
    }
  }).showToast();
}
*/

// TODO: Funcion Saludar - "Glassmorphism" (Sin librerías externas) - modal con CSS moderno. Este estilo imita el efecto de "vidrio esmerilado" que usan Apple y Windows 11.
 function mostrarSaludo() {
    document.getElementById('modalSaludo').classList.add('active');
  }

  function cerrarSaludo() {
    document.getElementById('modalSaludo').classList.remove('active');
  }
  
  // Ejecutar al cargar
  mostrarSaludo();
