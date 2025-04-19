// Load the FBX chili model with texture
function createChiliModel() {
  const group = new THREE.Group();
  console.log('Starting to load chili model and texture...');

  // Create a loading manager to handle all asset loading
  const loadingManager = new THREE.LoadingManager();

  // Set up error handling for the loading manager
  loadingManager.onError = function(url) {
    console.error('Error loading asset:', url);
    createFallbackChiliModel(group);
  };

  // Create a simple red material instead of using a texture
  const material = new THREE.MeshPhongMaterial({
    color: 0xff0000, // Bright red
    specular: 0xffffff,
    shininess: 30,
    emissive: 0x330000,
    emissiveIntensity: 0.2,
    side: THREE.DoubleSide // Render both sides of faces
  });

  // Now load the FBX model
  const fbxLoader = new THREE.FBXLoader(loadingManager);
  fbxLoader.load('chili/Low_poly_red_chili_0419125345_texture.fbx',
    // Success callback
    function(fbx) {
      console.log('FBX model loaded successfully');
      console.log('FBX model children:', fbx.children.length);

      // Scale the model to fit the scene
      fbx.scale.set(0.01, 0.01, 0.01);

      // Center and position the model
      fbx.position.set(0, 0.5, 0);

      // Try a different rotation to fix the shrimp-like appearance
      fbx.rotation.set(0, 0, 0); // First reset rotation

      // Rotate around Y axis instead
      fbx.rotateY(Math.PI); // 180 degrees around Y

      // Then slight tilt for better perspective
      fbx.rotateX(Math.PI / 12); // 15 degrees tilt

      // Log detailed information about the loaded model
      console.log('FBX model structure:', fbx);

      // Check if the model has any meshes
      let meshCount = 0;
      fbx.traverse(function(child) {
        if (child.isMesh) {
          meshCount++;
          console.log('Found mesh in FBX model:', child.name);
          console.log('Original material:', child.material);

          // Apply our red material to all meshes
          console.log('Applying red material to mesh');
          child.material = material.clone();
          child.material.needsUpdate = true;

          // Enable shadows
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      if (meshCount === 0) {
        console.error('No meshes found in FBX model, falling back to primitive');
        createFallbackChiliModel(group);
        return;
      }

      // Add the model to the group
      group.add(fbx);
      console.log('FBX model added to group');

      // Add glow effect
      addGlowEffect(null, 0xff2200, group);
    },
    // Progress callback
    function(xhr) {
      if (xhr.lengthComputable) {
        const percentComplete = xhr.loaded / xhr.total * 100;
        console.log(Math.round(percentComplete) + '% of FBX model loaded');
      }
    },
    // Error callback
    function(error) {
      console.error('Error loading FBX model:', error);
      createFallbackChiliModel(group);
    }
  );

  return group;
}

// Create a fallback chili model using primitives if FBX loading fails
function createFallbackChiliModel(group) {
  console.log('Creating fallback chili model');

  // Clear any existing children from the group
  while(group.children.length > 0) {
    group.remove(group.children[0]);
  }

  // Create the main body of the chili (elongated capsule shape)
  try {
    // Check if CapsuleGeometry is available (it's not in older three.js versions)
    let bodyGeometry;
    if (typeof THREE.CapsuleGeometry !== 'undefined') {
      bodyGeometry = new THREE.CapsuleGeometry(0.5, 1.5, 8, 16);
    } else {
      // Fallback to cylinder if capsule is not available
      bodyGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 16, 1, true);
    }

    const bodyMaterial = new THREE.MeshPhongMaterial({
      color: 0xff0000,
      emissive: 0x440000,
      specular: 0xffffff,
      shininess: 30
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.rotation.x = Math.PI / 2; // Rotate to point upward
    body.position.y = 0.2;
    group.add(body);

    // Create the stem of the chili
    const stemGeometry = new THREE.CylinderGeometry(0.1, 0.15, 0.5, 8);
    const stemMaterial = new THREE.MeshPhongMaterial({
      color: 0x00aa00,
      emissive: 0x003300,
      specular: 0x88ff88,
      shininess: 30
    });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = 1.2;
    stem.rotation.x = Math.PI / 12; // Slight tilt
    group.add(stem);

    // Add some highlights to the chili
    addHighlights(body, group);

    // Add glow effect
    addGlowEffect(body, 0xff2200, group);

    console.log('Fallback chili model created successfully');
  } catch (error) {
    console.error('Error creating fallback chili model:', error);

    // Ultimate fallback - just a simple sphere
    try {
      const sphereGeometry = new THREE.SphereGeometry(0.7, 32, 32);
      const sphereMaterial = new THREE.MeshPhongMaterial({
        color: 0xff0000,
        emissive: 0x440000,
        specular: 0xffffff,
        shininess: 30
      });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      group.add(sphere);
      console.log('Ultimate fallback sphere created');
    } catch (sphereError) {
      console.error('Failed to create even the fallback sphere:', sphereError);
    }
  }
}

// Create cyberpunk grid background
function createCyberpunkGrid(scene) {
  // Floor grid - enhanced version
  const gridSize = 100;
  const gridDivisions = 100;
  const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, 0x0088ff, 0x0044aa);
  gridHelper.position.y = -1.5;
  scene.add(gridHelper);

  // Create a floor plane with a glowing grid texture
  const floorGeometry = new THREE.PlaneGeometry(100, 100);
  const floorMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      color1: { value: new THREE.Color(0x000833) },
      color2: { value: new THREE.Color(0x0066ff) }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 color1;
      uniform vec3 color2;
      varying vec2 vUv;

      float grid(vec2 uv, float res) {
        vec2 grid = fract(uv * res);
        return (step(0.97, grid.x) + step(0.97, grid.y)) * 0.5;
      }

      void main() {
        // Calculate distance from center for radial effect
        vec2 center = vUv - 0.5;
        float dist = length(center);

        // Calculate the grid with moving scan lines
        float gridVal = grid(vUv, 50.0);

        // Add horizontal scan line
        float scanLine = smoothstep(0.0, 0.1, sin(vUv.y * 100.0 - time * 2.0) * 0.5 + 0.5);

        // Create a glow effect from center
        float glow = smoothstep(1.0, 0.0, dist * 1.5);

        vec3 color = mix(color1, color2, glow * 0.5);
        color = mix(color * 0.1, color, gridVal + scanLine * 0.2);
        color *= glow * 1.5;

        gl_FragColor = vec4(color, 0.8);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide
  });

  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2; // Rotate to be horizontal
  floor.position.y = -1.5;
  scene.add(floor);

  // Add some atmospheric fog (lighter than before)
  scene.fog = new THREE.FogExp2(0x000520, 0.01);

  return { floorMaterial };
}

// Create glowing neon material with pulse effect
function createNeonMaterial(baseColor, glowColor) {
  return new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      baseColor: { value: new THREE.Color(baseColor) },
      glowColor: { value: new THREE.Color(glowColor) },
      intensity: { value: 1.5 }
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewPosition;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 baseColor;
      uniform vec3 glowColor;
      uniform float intensity;

      varying vec3 vNormal;
      varying vec3 vViewPosition;

      void main() {
        // Calculate a pulsing factor
        float pulse = sin(time * 2.0) * 0.15 + 0.85;

        // Calculate fresnel factor for edge glow
        vec3 viewDirection = normalize(vViewPosition);
        float fresnel = pow(1.0 + dot(viewDirection, vNormal), 3.0);
        fresnel = mix(0.5, 1.0, fresnel) * pulse;

        // Create electric noise pattern
        float noise = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) + time) * 43758.5453);
        noise = noise * 0.15 + 0.85;

        vec3 finalColor = mix(baseColor, glowColor, fresnel) * intensity * noise;
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `,
    side: THREE.DoubleSide
  });
}

// Add electric highlights to make it look more detailed
function addHighlights(_, group) { // First parameter not used but kept for compatibility
  // Create small highlight points
  const highlightGeometry = new THREE.SphereGeometry(0.03, 8, 8);
  const highlightMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.8
  });

  // Add random highlights
  for (let i = 0; i < 12; i++) {
    const highlight = new THREE.Mesh(highlightGeometry, highlightMaterial);
    const angle = Math.random() * Math.PI * 2;
    const radius = 0.3 + Math.random() * 0.3;
    const height = -1.0 + Math.random() * 2.5;

    highlight.position.set(
      Math.cos(angle) * radius,
      height,
      Math.sin(angle) * radius
    );

    group.add(highlight);
  }
}

// Add volumetric glow using sprite
function addGlowEffect(_, color, group) { // First parameter not used but kept for compatibility
  const glowMaterial = new THREE.SpriteMaterial({
    map: createGlowTexture(),
    color: color,
    transparent: true,
    blending: THREE.AdditiveBlending,
    opacity: 0.7,
  });

  const glow = new THREE.Sprite(glowMaterial);
  glow.scale.set(3, 5, 1);
  group.add(glow);

  return glow;
}

// Create a glow texture
function createGlowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext('2d');

  const gradient = context.createRadialGradient(
    canvas.width / 2, canvas.height / 2, 0,
    canvas.width / 2, canvas.height / 2, canvas.width / 2
  );

  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.5)');
  gradient.addColorStop(0.7, 'rgba(255, 64, 64, 0.2)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Add dynamic lighting
function addLighting(scene) {
  // Ambient light - brighter for better visibility
  const ambient = new THREE.AmbientLight(0x333344, 0.4);
  scene.add(ambient);

  // Main highlight light - warm light from front-right
  const mainLight = new THREE.PointLight(0xff6644, 1.2, 20);
  mainLight.position.set(3, 2, 3);
  scene.add(mainLight);

  // Blue rim light - cool light from back-left
  const rimLight = new THREE.PointLight(0x0088ff, 1, 15);
  rimLight.position.set(-3, 1, -2);
  scene.add(rimLight);

  // Top light - for overall illumination
  const topLight = new THREE.PointLight(0xffffff, 0.7, 20);
  topLight.position.set(0, 5, 0);
  scene.add(topLight);

  // Add a directional light for better shadows and definition
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(1, 3, 2);
  scene.add(dirLight);

  // Add electric arcs around the chili for effect
  createElectricArcs(scene);

  return { mainLight, rimLight, topLight, dirLight };
}

// Create electric arc particles
function createElectricArcs(scene) {
  const particleCount = 300;
  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  const color1 = new THREE.Color(0x00ffff);
  const color2 = new THREE.Color(0xff00ff);

  for (let i = 0; i < particleCount; i++) {
    // Create particle positions in a torus shape around the chili
    const angle = Math.random() * Math.PI * 2;
    const radius = 1.5 + Math.random() * 0.5;
    const height = -1.5 + Math.random() * 3;

    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = height;
    positions[i * 3 + 2] = Math.sin(angle) * radius;

    // Mix colors
    const mixFactor = Math.random();
    const mixedColor = color1.clone().lerp(color2, mixFactor);

    colors[i * 3] = mixedColor.r;
    colors[i * 3 + 1] = mixedColor.g;
    colors[i * 3 + 2] = mixedColor.b;

    // Random sizes
    sizes[i] = Math.random() * 0.1 + 0.02;
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const particleMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      pointTexture: { value: createGlowTexture() }
    },
    vertexShader: `
      attribute float size;
      attribute vec3 color;
      varying vec3 vColor;
      uniform float time;

      void main() {
        vColor = color;

        // Animate particle position
        vec3 pos = position;
        float noise = sin(position.x * 10.0 + time * 3.0) * cos(position.y * 8.0 + time * 2.0) * 0.1;
        pos.x += noise;
        pos.z += noise;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      uniform sampler2D pointTexture;

      void main() {
        gl_FragColor = vec4(vColor, 1.0) * texture2D(pointTexture, gl_PointCoord);
      }
    `,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true,
    vertexColors: true
  });

  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  return particles;
}

// Function to update effects every frame
function updateEffects(time, lights, scene, hoverIntensity = 1.0, controls = null) {
  // Find and update all shader materials
  if (scene) {
    scene.traverse((object) => {
      if (object.material && object.material.uniforms && object.material.uniforms.time) {
        object.material.uniforms.time.value = time;

        // If the material has intensity uniform, apply hover effect
        if (object.material.uniforms.intensity) {
          const baseIntensity = object.material.uniforms.intensity.value || 1.5;
          object.material.uniforms.intensity.value = baseIntensity * hoverIntensity;
        }

        // If this is the floor material, add some extra effects based on controls
        if (object.material.uniforms.color1 && object.material.uniforms.color2 &&
            object instanceof THREE.Mesh && object.rotation.x === -Math.PI / 2) {
          // This is likely our floor
          if (controls && controls.getAzimuthalAngle) {
            // Get the current rotation angle from controls
            const angle = controls.getAzimuthalAngle();
            // Subtly shift the floor colors based on the viewing angle
            const hue = (Math.sin(angle) * 0.1) + 0.6; // Blue-cyan range
            object.material.uniforms.color2.value.setHSL(hue, 1.0, 0.5);
          }
        }
      }

      // Pulse the emissive intensity for regular materials
      if (object.material && object.material.emissive) {
        const pulseIntensity = (Math.sin(time * 3) * 0.2 + 0.8) * hoverIntensity;
        object.material.emissiveIntensity = pulseIntensity;
      }
    });
  }

  // Animate lights if they exist
  if (lights) {
    // Note: Main lights are now handled in the animation loop to apply hover effect
    if (lights.topLight) {
      lights.topLight.intensity = (0.7 + Math.sin(time * 2.5 + 2) * 0.2) * hoverIntensity;
    }
  }
}

// Create a simple fallback content when three.js fails
function createFallbackContent(container) {
  console.log('Creating fallback content');
  // Clear the container
  container.innerHTML = '';

  // Create a simple colored div with text
  container.style.backgroundColor = '#ff3300';
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';
  container.style.color = 'white';
  container.style.fontWeight = 'bold';
  container.style.fontSize = '16px';
  container.style.textAlign = 'center';
  container.style.padding = '10px';
  container.innerHTML = '🌶️<br>HexMex';
}

function initChiliAvatar() {
  console.log('Initializing chili avatar...');
  let scene, camera, renderer, lights;

  try {
    const container = document.getElementById('chiliAvatar');
    if (!container) {
      console.log('Chili avatar container not found');
      return;
    }
    console.log('Container found, setting up three.js');

    // Check if THREE is available
    if (typeof THREE === 'undefined') {
      console.error('THREE.js not loaded');
      createFallbackContent(container);
      return;
    }

    // Setup scene, camera, and renderer
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    camera.position.set(2, 2, 2); // Position camera at an angle for better view
    camera.lookAt(0, 0, 0); // Look at the center

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(200, 200);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Create grid background
    createCyberpunkGrid(scene);

    // Add lights
    lights = addLighting(scene);

    // Create and animate chili model
    console.log('Creating chili model...');
    try {
      // Create the chili model (this returns a group that will be populated asynchronously)
      const chiliGroup = createChiliModel();
      scene.add(chiliGroup);
      console.log('Chili group container added to scene');

      // Set up OrbitControls
      const controls = new THREE.OrbitControls(camera, renderer.domElement);

      // Configure controls for optimal interaction
      controls.enableDamping = true; // Add inertia
      controls.dampingFactor = 0.05; // Adjust inertia amount (lower = more inertia)
      controls.rotateSpeed = 0.8; // Adjust rotation speed
      controls.enableZoom = false; // Disable zooming for simplicity
      controls.enablePan = false; // Disable panning for simplicity
      controls.autoRotate = true; // Auto-rotate when not interacting
      controls.autoRotateSpeed = 1.0; // Speed of auto-rotation

      // Make controls work only within the container
      controls.domElement.addEventListener('mousedown', function(e) {
        e.stopPropagation();
      });

      // Add touch event listeners for mobile
      controls.domElement.addEventListener('touchstart', function(e) {
        e.stopPropagation();
      }, { passive: true });

      // Add hover effect to indicate interactivity
      let isHovering = false;
      let hoverIntensity = 1.0;

      // Add cursor style and hover effect
      renderer.domElement.style.cursor = 'grab';

      renderer.domElement.addEventListener('mouseenter', function() {
        isHovering = true;
        renderer.domElement.style.cursor = 'grab';
      });

      renderer.domElement.addEventListener('mouseleave', function() {
        isHovering = false;
        renderer.domElement.style.cursor = 'auto';
      });

      renderer.domElement.addEventListener('mousedown', function() {
        renderer.domElement.style.cursor = 'grabbing';
      });

      renderer.domElement.addEventListener('mouseup', function() {
        renderer.domElement.style.cursor = 'grab';
      });

      // Start the animation loop
      const clock = new THREE.Clock();

      function animate() {
        requestAnimationFrame(animate);
        const time = clock.getElapsedTime();

        // Update controls (needed for damping/inertia)
        controls.update();

        // Gentle floating motion on Y axis
        chiliGroup.position.y = Math.sin(time * 0.8) * 0.1;

        // Update hover effect intensity
        if (isHovering) {
          // Pulse the intensity when hovering
          hoverIntensity = 1.5 + Math.sin(time * 5) * 0.3;
        } else {
          // Gradually return to normal intensity
          hoverIntensity = Math.max(1.0, hoverIntensity - 0.05);
        }

        // Apply hover intensity to lights
        if (lights.mainLight) {
          lights.mainLight.intensity = (1 + Math.sin(time * 2) * 0.3) * hoverIntensity;
        }
        if (lights.rimLight) {
          lights.rimLight.intensity = (1 + Math.sin(time * 3 + 1) * 0.3) * hoverIntensity;
        }

        // Animate lights and materials
        updateEffects(time, lights, scene, hoverIntensity, controls);

        renderer.render(scene, camera);
      }

      animate();
      console.log('Animation started');
    } catch (error) {
      console.error('Error in chili model creation or animation:', error);

      // Create a simple colored sphere as ultimate fallback
      const fallbackGroup = new THREE.Group();
      const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
      const sphereMaterial = new THREE.MeshPhongMaterial({
        color: 0xff0000,
        emissive: 0x440000,
        specular: 0xffffff,
        shininess: 30
      });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      fallbackGroup.add(sphere);
      scene.add(fallbackGroup);
      console.log('Ultimate fallback sphere added to scene');

      // Set up OrbitControls for the fallback
      const fallbackControls = new THREE.OrbitControls(camera, renderer.domElement);

      // Configure controls for optimal interaction
      fallbackControls.enableDamping = true; // Add inertia
      fallbackControls.dampingFactor = 0.05; // Adjust inertia amount
      fallbackControls.rotateSpeed = 0.8; // Adjust rotation speed
      fallbackControls.enableZoom = false; // Disable zooming
      fallbackControls.enablePan = false; // Disable panning
      fallbackControls.autoRotate = true; // Auto-rotate when not interacting
      fallbackControls.autoRotateSpeed = 1.0; // Speed of auto-rotation

      // Make controls work only within the container
      fallbackControls.domElement.addEventListener('mousedown', function(e) {
        e.stopPropagation();
      });

      // Add touch event listeners for mobile
      fallbackControls.domElement.addEventListener('touchstart', function(e) {
        e.stopPropagation();
      }, { passive: true });

      // Add hover effect to indicate interactivity
      let isHovering = false;
      let hoverIntensity = 1.0;

      // Add cursor style and hover effect
      renderer.domElement.style.cursor = 'grab';

      renderer.domElement.addEventListener('mouseenter', function() {
        isHovering = true;
        renderer.domElement.style.cursor = 'grab';
      });

      renderer.domElement.addEventListener('mouseleave', function() {
        isHovering = false;
        renderer.domElement.style.cursor = 'auto';
      });

      renderer.domElement.addEventListener('mousedown', function() {
        renderer.domElement.style.cursor = 'grabbing';
      });

      renderer.domElement.addEventListener('mouseup', function() {
        renderer.domElement.style.cursor = 'grab';
      });

      // Start a simple animation for the fallback
      const clock = new THREE.Clock();

      function animateFallback() {
        requestAnimationFrame(animateFallback);
        const time = clock.getElapsedTime();

        // Update controls (needed for damping/inertia)
        fallbackControls.update();

        // Gentle floating motion
        fallbackGroup.position.y = Math.sin(time * 0.8) * 0.1;

        // Update hover effect intensity
        if (isHovering) {
          // Pulse the intensity when hovering
          hoverIntensity = 1.5 + Math.sin(time * 5) * 0.3;
        } else {
          // Gradually return to normal intensity
          hoverIntensity = Math.max(1.0, hoverIntensity - 0.05);
        }

        // Apply hover intensity to materials
        fallbackGroup.traverse((object) => {
          if (object.material && object.material.emissive) {
            const pulseIntensity = (Math.sin(time * 3) * 0.2 + 0.8) * hoverIntensity;
            object.material.emissiveIntensity = pulseIntensity;
          }
        });

        renderer.render(scene, camera);
      }

      animateFallback();
    }
  } catch (error) {
    console.error('Error in three.js initialization:', error);
    const container = document.getElementById('chiliAvatar');
    if (container) {
      createFallbackContent(container);
    }
  }
}

// Add this to your existing script.js or in a separate <script> tag
document.addEventListener('DOMContentLoaded', () => {
  // Initialize chili avatar when the About tab is opened
  const aboutTab = document.querySelector('button.tab[onclick="openTab(event, \'aboutTab\')"]');
  if (aboutTab) {
    aboutTab.addEventListener('click', () => {
      setTimeout(initChiliAvatar, 100); // Small delay to ensure container is visible
    });
  }
});