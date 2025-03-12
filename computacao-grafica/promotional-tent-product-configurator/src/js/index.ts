import '../css/index.css'
import Alpine from 'alpinejs'
import ProductConfigurator from './configurator'

// let selectedObjectName = "";

Alpine.data('ProductConfigurator', ProductConfigurator)

Alpine.start()

/* window.addEventListener("alpine:init", () => {
    if (WebGL.isWebGL2Available()) {
        Start();
    } else {
        const warning = WebGL.getWebGL2ErrorMessage();
        document.getElementById('container')?.appendChild(warning);
    }
}) */



/* function Start() {
    const container = document.getElementById("configurator") as HTMLDivElement;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.01, 1000);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 10, 0);
    scene.add(directionalLight);

    new OrbitControls(camera, renderer.domElement);

    const gltfLoader = new GLTFLoader();
    gltfLoader.load("/assets/models/demo-tent/scene.gltf", (gltf) => {
        scene.add(gltf.scene);
    });

    renderer.domElement.addEventListener("mousemove", (event) => {
        const parentBoundings = container.getBoundingClientRect();
        const mouse = new THREE.Vector2(
            ((event.clientX - parentBoundings.left) / container.clientWidth) * 2 - 1,
            -((event.clientY - parentBoundings.top) / container.clientHeight) * 2 + 1,
        );

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(scene.children, true);
        if (intersects.length > 0) {
            const clickedObject = intersects[0].object;
            selectedObjectName = clickedObject.name;
        }
    })

    function animate() {
        renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(animate);
} */