// Mensajes para la tarjeta
const mensajes = [
  "Cuanto más tiempo estoy contigo, más te amo!",
  "Eres mi persona favorita en el mundo.",
  "Gracias por existir y estar a mi lado.",
  "Cada día contigo es un regalo.",
  "Te amo más de lo que las palabras pueden decir."
];
let idx = 0;
const tarjeta = document.getElementById('card');
const mensajeEl = document.getElementById('mensaje');

function cambiarMensaje() {
  idx = (idx + 1) % mensajes.length;
  // Añadimos un pequeño efecto de fundido para que se vea mejor
  mensajeEl.style.opacity = 0;
  setTimeout(() => {
    mensajeEl.textContent = mensajes[idx];
    mensajeEl.style.opacity = 1;
  }, 300); // Sincronizado con la transición en CSS
}

// Asignar el primer mensaje al cargar y hacer la tarjeta clickeable
mensajeEl.textContent = mensajes[idx];
tarjeta.addEventListener('click', cambiarMensaje);

// --- Three.js corazones 3D torbellino ---
const THREE_SCRIPT = "https://cdn.jsdelivr.net/npm/three@0.154.0/build/three.min.js";
function loadThreeJs(callback) {
  if (window.THREE) return callback();
  const script = document.createElement('script');
  script.src = THREE_SCRIPT;
  script.onload = callback;
  document.head.appendChild(script);
}

loadThreeJs(() => {
  const heartCount = 60;
  let hearts = [];
  let theta = [];

  // Crear escena
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.style.position = 'fixed';
  renderer.domElement.style.top = 0;
  renderer.domElement.style.left = 0;
  renderer.domElement.style.zIndex = -1; // <-- CAMBIO CLAVE: Poner el canvas detrás de todo
  document.body.appendChild(renderer.domElement);

  // Luz
  const light = new THREE.PointLight(0xffffff, 1, 0);
  light.position.set(0, 0, 50);
  scene.add(light);

  // Geometría de corazón
  function createHeartShape() {
    const x = 0, y = 0;
    const heartShape = new THREE.Shape();
    heartShape.moveTo(x + 0, y + 0);
    heartShape.bezierCurveTo(x + 0, y + 0, x - 5, y - 5, x - 10, y + 0);
    heartShape.bezierCurveTo(x - 15, y + 10, x + 0, y + 15, x + 0, y + 25);
    heartShape.bezierCurveTo(x + 0, y + 15, x + 15, y + 10, x + 10, y + 0);
    heartShape.bezierCurveTo(x + 5, y - 5, x + 0, y + 0, x + 0, y + 0);
    return heartShape;
  }

  const heartShape = createHeartShape();
  const geometry = new THREE.ExtrudeGeometry(heartShape, {
    depth: 2,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 2,
    bevelSize: 1,
    bevelThickness: 1
  });
  const material = new THREE.MeshPhongMaterial({ color: 0xe53935, shininess: 80 });

  // Crear corazones en espiral
  for (let i = 0; i < heartCount; i++) {
    const mesh = new THREE.Mesh(geometry, material.clone());
    mesh.scale.set(0.08, 0.08, 0.08);
    scene.add(mesh);
    hearts.push(mesh);
    theta.push(Math.random() * Math.PI * 2);
  }

  camera.position.z = 30;

  function animate() {
    requestAnimationFrame(animate);

    // Torbellino: corazones en espiral y girando
    const time = Date.now() * 0.001;
    for (let i = 0; i < heartCount; i++) {
      const angle = theta[i] + time * 0.4;
      const radius = 8 + 4 * Math.sin(time + i);
      const y = (i - heartCount / 2) * 0.5 + 2 * Math.sin(time + i);
      hearts[i].position.x = Math.cos(angle) * radius;
      hearts[i].position.z = Math.sin(angle) * radius;
      hearts[i].position.y = y;
      hearts[i].rotation.y += 0.04 + 0.01 * i;
      hearts[i].rotation.x += 0.02 + 0.01 * i;
    }

    renderer.render(scene, camera);
  }
  animate();

  // Ajustar tamaño al cambiar ventana
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });