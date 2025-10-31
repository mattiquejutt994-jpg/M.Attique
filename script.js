// --- 3D Particle Background (Three.js) Variables ---
let scene, camera, renderer, particles, particleCount;
let mouseX = 0, mouseY = 0;

function initParticles() {
    const container = document.getElementById('hero-canvas-container');
    if (!container) return; // Exit if container not found

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // Handle Resize
    window.addEventListener('resize', () => {
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        if (renderer) {
            renderer.setSize(newWidth, newHeight);
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
        }
    });

    // Particles Geometry and Material
    particleCount = 1500; // Increased particle count for full screen
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const colors = [];
    const color1 = new THREE.Color(0x8b5cf6); // Violet
    const color2 = new THREE.Color(0x38bdf8); // Cyan

    for (let i = 0; i < particleCount; i++) {
        // Position (randomly in a box)
        positions[i * 3 + 0] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

        // Size
        sizes[i] = Math.random() * 0.1 + 0.05;

        // Color (mix between violet and cyan)
        const color = new THREE.Color();
        color.lerpColors(color1, color2, Math.random());
        colors.push(color.r, color.g, color.b);
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));

    // Material
    const material = new THREE.PointsMaterial({
        size: 0.1,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.8,
        vertexColors: true,
        blending: THREE.AdditiveBlending // Gives the glowing effect
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Add simple ambient light for subtle glow
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
}

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

function animateParticles() {
    if (!renderer || !particles) {
        requestAnimationFrame(animateParticles);
        return;
    }

    requestAnimationFrame(animateParticles);

    const time = Date.now() * 0.00005;

    // Subtle rotation of the particle system
    particles.rotation.x += 0.0005;
    particles.rotation.y += 0.001;

    // Camera movement based on mouse for interactive 3D feel
    camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    // Animate particle positions (subtle movement)
    const positions = particles.geometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
        // Simple sine/cosine movement based on time
        positions[i * 3 + 0] += Math.sin(time * i * 0.1) * 0.0005;
        positions[i * 3 + 1] += Math.cos(time * i * 0.1) * 0.0005;
    }
    particles.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}


function setupPortfolio() {
    // --- Theme Toggle Logic ---
    const html = document.documentElement;
    const toggleButton = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');

    // Default to dark mode if preferred, otherwise light
    const isDarkMode = localStorage.getItem('theme') === 'dark' ||
                    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDarkMode) {
        html.classList.add('dark');
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    } else {
        html.classList.remove('dark');
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    }

    toggleButton.addEventListener('click', () => {
        html.classList.toggle('dark');
        const newTheme = html.classList.contains('dark') ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        sunIcon.classList.toggle('hidden');
        moonIcon.classList.toggle('hidden');
    });


    // --- Mobile Menu Logic ---
    const menuButton = document.getElementById('menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuLines = document.querySelectorAll('.line');
    const navLinks = document.querySelectorAll('#mobile-menu a');

    function toggleMobileMenu() {
        mobileMenu.classList.toggle('hidden');
        menuLines.forEach(line => line.classList.toggle('active'));
    }

    menuButton.addEventListener('click', toggleMobileMenu);

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (!mobileMenu.classList.contains('hidden')) {
                toggleMobileMenu();
            }
        });
    });


    // --- Dynamic Copyright Year ---
    const currentYear = new Date().getFullYear();
    const copyrightElement = document.getElementById('copyright');
    copyrightElement.innerHTML = `&copy; ${currentYear} Muhammad Attique | All Rights Reserved`;


    // --- Toggle More/Less Skills ---
    const toggleSkillsBtn = document.getElementById('toggle-skills-btn');
    const toggleSkillsText = document.getElementById('toggle-skills-text');
    const toggleSkillsIcon = document.getElementById('toggle-skills-icon');
    const moreSkills = document.querySelectorAll('.more-skills');

    if (toggleSkillsBtn) {
        let skillsVisible = false;
        toggleSkillsBtn.addEventListener('click', () => {
            skillsVisible = !skillsVisible;
            moreSkills.forEach(skill => {
                skill.classList.toggle('hidden');
            });

            if (skillsVisible) {
                toggleSkillsText.textContent = 'See Less';
                toggleSkillsIcon.style.transform = 'rotate(180deg)';
            } else {
                toggleSkillsText.textContent = 'See More';
                toggleSkillsIcon.style.transform = 'rotate(0deg)';
            }
            // Re-create the Lucide icon if its 'data-lucide' attribute changes
            lucide.createIcons();
        });
    }

    // --- Toggle More/Less Projects ---
    const toggleProjectsBtn = document.getElementById('toggle-projects-btn');
    const toggleProjectsText = document.getElementById('toggle-projects-text');
    const toggleProjectsIcon = document.getElementById('toggle-projects-icon');
    const moreProjects = document.querySelectorAll('.more-projects');

    if (toggleProjectsBtn) {
        let projectsVisible = false;
        toggleProjectsBtn.addEventListener('click', () => {
            projectsVisible = !projectsVisible;
            moreProjects.forEach(project => {
                project.classList.toggle('hidden');
            });

            if (projectsVisible) {
                toggleProjectsText.textContent = 'See Less';
                toggleProjectsIcon.style.transform = 'rotate(180deg)';
            } else {
                toggleProjectsText.textContent = 'See More';
                toggleProjectsIcon.style.transform = 'rotate(0deg)';
            }
        });
    }

    // --- Contact Form Submission with Formspree ---
    const form = document.getElementById('contact-form');
    const statusDiv = document.getElementById('form-status');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Show "Sending..." status
        statusDiv.classList.remove('hidden', 'bg-red-100', 'text-red-700', 'bg-green-100', 'text-green-700');
        statusDiv.classList.add('bg-violet-100', 'text-violet-700', 'animate-pulse');
        statusDiv.innerHTML = '<i data-lucide="loader-circle" class="w-4 h-4 inline mr-2 animate-spin"></i> Sending message...';
        lucide.createIcons();

        const formData = new FormData(form);
        
        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            statusDiv.classList.remove('bg-violet-100', 'text-violet-700', 'animate-pulse');
            if (response.ok) {
                statusDiv.classList.add('bg-green-100', 'text-green-700');
                statusDiv.innerHTML = '<i data-lucide="check-circle" class="w-4 h-4 inline mr-2"></i> Message sent successfully! I will get back to you shortly.';
                form.reset();
            } else {
                statusDiv.classList.add('bg-red-100', 'text-red-700');
                statusDiv.innerHTML = '<i data-lucide="x-circle" class="w-4 h-4 inline mr-2"></i> Oops! There was a problem sending your message.';
            }
            lucide.createIcons(); // Re-create icons for the status message
        });
    });
}

// --- Main Initialization ---
window.onload = function() {
    // Initialize AOS
    AOS.init({
        duration: 800,
        once: true, // Only trigger once when scrolling down
        offset: 50, // Start animation earlier
    });
    // Replace lucide icons with SVG elements
    lucide.createIcons();

    // Only initialize particles if the container exists
    if (document.getElementById('hero-canvas-container')) {
        initParticles();
    }
    // Start the 3D animation loop
    animateParticles();
    // Run all startup scripts
    setupPortfolio();
};


// --- Skills Progress Bar Animation ---

// Har skill ke liye data (ID aur target percentage)
// Yahan 'id' wahi dein jo aapne HTML mein 'progress-' aur 'label-' ke baad likha hai.
const skillData = [ // Updated to match unique IDs in HTML
    { id: 'html', target: 95 },
    { id: 'css', target: 90 },
    { id: 'javascript', target: 85 },
    // Add Bootstrap skill data here if you want its progress bar to animate
    { id: 'bootstrap', target: 90 } 
    // Aap yahan mazeed skills add kar sakte hain
];

// IntersectionObserver banayein jo check karega ke element screen par nazar aa raha hai ya nahi
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        // Agar element screen par hai
        if (entry.isIntersecting) {
            skillData.forEach(skill => {
                const progressBar = document.getElementById(`progress-${skill.id}`);
                const label = document.getElementById(`label-${skill.id}`);
                
                // Check karein ke animation pehle chal chuka hai ya nahi
                if (progressBar && label && (progressBar.style.width === '0%' || progressBar.style.width === '')) {
                    // Progress bar ka width set karein
                    progressBar.style.width = `${skill.target}%`;
                    
                    // Percentage label ke liye counter animation
                    let current = 0;
                    const interval = setInterval(() => {
                        if (current >= skill.target) {
                            clearInterval(interval);
                            label.textContent = `${skill.target}%`;
                        } else {
                            current++;
                            label.textContent = `${current}%`;
                        }
                    }, 15); // Animation ki speed adjust karein
                }
            });
            // Animation ke baad is element ko observe karna band kar dein
            observer.unobserve(entry.target); 
        }
    });
}, { threshold: 0.5 }); // Jab 50% section nazar aye tab animation start ho

// Jis section mein skills hain, usko target karein
// Is code ke liye zaroori hai ke aapke skills wala section <section id="skills">...</section> ke andar ho.
const skillsSection = document.getElementById('skills'); 
if (skillsSection) {
    observer.observe(skillsSection);
};

