import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as fabric from 'fabric';

let mouse = {
    position: new THREE.Vector2(),
    isDown: false
};
let raycaster = new THREE.Raycaster();

window.document.addEventListener('DOMContentLoaded', () => {
    class CustomCanvas extends fabric.Canvas {
        _onMouseMove(e) {
            if (mouse.isDown && e.isTrusted === true) { return }

            super.__onMouseMove(e)
        };
    }

    const fabricCanvas = new CustomCanvas('fabricjs');
    fabricCanvas.backgroundColor = "#FFBE9F";
    fabricCanvas.setDimensions({ width: 256, height: 256 })
    // fabricCanvas.on('mouse:down', (e) => {console.log(e)})

    const rect = new fabric.Rect({
        left: 100,
        top: 100,
        fill: 'red',
        width: 50,
        height: 50,
    });

    fabricCanvas.add(rect);
    // canvas.renderAll();

    /**
     * Renderer
     */
    const container = document.getElementById("renderer");
    if (!container) {
        throw new Error("Container not found");
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.01, 1000);
    camera.position.z = 2;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // new OrbitControls(camera, renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight();
    directionalLight.position.set(0, 10, 0);
    scene.add(directionalLight);

    const texture = new THREE.CanvasTexture(document.getElementById("fabricjs"));
    texture.minFilter = THREE.LinearFilter;

    const material = new THREE.MeshPhongMaterial({ map: texture });
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const cube = new THREE.Mesh(geometry, material);
    // cube.rotation.x = 0.5;
    // cube.rotation.y = 0.3;
    scene.add(cube);

    // Handle pointer events and translate UVs to Fabric coordinates
    function getUVfromEvent(event) {
        const rect = container.getBoundingClientRect();
        mouse.position.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.position.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse.position, camera);
        const intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length === 0) return null;

        const uv = intersects[0].uv;
        if (!uv) return null;
        return {
            x: uv.x * fabricCanvas.getWidth(),
            y: (1 - uv.y) * fabricCanvas.getHeight() // flip Y
        };
    }

    function forwardEventToFabric(type: string, e: PointerEvent) {
        // console.log(e)
        const coords = getUVfromEvent(e);
        if (!coords) return;

        const evt = new MouseEvent(type, {
            clientX: fabricCanvas._offset.left + coords.x,
            clientY: fabricCanvas._offset.top + coords.y,
            bubbles: true,
            cancelable: true,
            view: window,
        });

        fabricCanvas.upperCanvasEl.dispatchEvent(evt);
    }

    const btnAddText = document.getElementById('add-text') as HTMLButtonElement
    btnAddText?.addEventListener('click', (e) => {
        const text = (document.getElementById('text') as HTMLInputElement).value;
        if (!text) return;

        const textObj = new fabric.FabricText(text, {
            left: 100,
            top: 100,
            fontSize: 20,
            fill: 'black',
        });

        fabricCanvas.add(textObj);
        fabricCanvas.renderAll();
    })

    const btnSave = document.getElementById('save') as HTMLButtonElement
    btnSave?.addEventListener('click', (e) => {
        const svg = fabricCanvas.toSVG()
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'canvas.svg';
        a.click();
        URL.revokeObjectURL(url);
    })

    const fileInput = document.getElementById('file') as HTMLInputElement
    fileInput?.addEventListener('change', (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            fabric.FabricImage.fromURL(event.target?.result as string)
                .then((img) => {
                    img.scaleToWidth(100);
                    fabricCanvas.add(img);
                    fabricCanvas.renderAll();
                });
        };
        reader.readAsDataURL(file);
    })

    renderer.domElement.addEventListener('pointerdown', (e) => {
        mouse.isDown = true;
        forwardEventToFabric('mousedown', e);
    });
    renderer.domElement.addEventListener('pointermove', (e) => {
        if (mouse.isDown) forwardEventToFabric('mousemove', e);
    });
    renderer.domElement.addEventListener('pointerup', (e) => {
        forwardEventToFabric('mouseup', e);
        mouse.isDown = false;
    });

    fabricCanvas.on('after:render', () => {
        texture.needsUpdate = true;
    });

    renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
    })
})