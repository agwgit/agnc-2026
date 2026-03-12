"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { splitChars } from "@/utils/split";

gsap.registerPlugin(ScrollTrigger);

const PHASES = [
    {
        id: 0,
        title: "Chaos",
        body: "Most ideas start as raw matter. Powerful, but scattered across docs, voice notes, decks, screenshots, and half-finished logic."
    },
    {
        id: 1,
        title: "Form",
        body: "The idea condenses. A loopable, working demo that proves the system has shape and the product has a pulse."
    },
    {
        id: 2,
        title: "Flow",
        body: "Structure meets taste. UX, story, and interface lock into a surface built to win trust quickly."
    },
    {
        id: 3,
        title: "Ship",
        body: "Momentum as a service. We wrap the demo in the surfaces needed to carry it into the wild."
    },
    {
        id: 4,
        title: "Orbit",
        body: "The command layer. A professional environment for teams to repeat, supervise, and scale what they’ve built."
    }
];

function RevealHeader({ text, isActive }: { text: string; isActive: boolean }) {
    const elRef = useRef<HTMLHeadingElement>(null);
    const tlRef = useRef<gsap.core.Timeline | null>(null);

    useEffect(() => {
        if (!elRef.current) return;
        const el = elRef.current;

        if (isActive) {
            // Restore text before splitting
            el.innerHTML = text + ".";
            el.style.opacity = "1";

            const { chars, revert } = splitChars(el);

            tlRef.current?.kill();
            const tl = gsap.timeline();
            tlRef.current = tl;

            tl.to(chars, {
                y: 0,
                opacity: 1,
                color: "#f26625", // accent-orange
                filter: "blur(0px)",
                startAt: { y: 24, opacity: 0, color: "#f26625", filter: "blur(6px)" },
                stagger: 0.03,
                duration: 0.6,
                ease: "power2.out",
            });

            tl.to(chars, {
                color: "#FFFFFF",
                overwrite: "auto",
                stagger: 0.025,
                duration: 0.3,
                ease: "power3.in",
            }, "<0.45");

            return () => {
                tl.kill();
                revert();
            };
        } else {
            // reset when inactive
            el.innerHTML = text + ".";
            el.style.opacity = "0";
        }
    }, [isActive, text]);

    return (
        <h3 ref={elRef} className="font-display text-[clamp(2.5rem,4.5vw,4.5rem)] font-black leading-[0.9] text-white mb-8 uppercase" style={{ opacity: 0 }}>
            {text}.
        </h3>
    );
}

export default function ProcessSection() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const [currentStep, setCurrentStep] = useState(0);

    // ThreeJS state refs to keep values updated in animation loop
    const stepRef = useRef(0);

    useGSAP(() => {
        if (typeof window === "undefined") return;
        gsap.registerPlugin(ScrollTrigger);

        const scroller = document.querySelector('#main-scroller');
        if (!sectionRef.current || !scroller) return;

        ScrollTrigger.create({
            trigger: sectionRef.current,
            scroller: scroller,
            start: "top top",
            end: "bottom bottom",
            onUpdate: (self) => {
                const progress = self.progress;
                const newStep = Math.min(PHASES.length - 1, Math.floor(progress * PHASES.length));
                setCurrentStep(newStep);
            }
        });

        // Ensure ScrollTrigger is aware of the layout
        ScrollTrigger.refresh();
    }, { scope: sectionRef });

    // Swipe/Drag State
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
        setTouchEnd(null);
        if ("touches" in e) {
            setTouchStart(e.touches[0].clientX);
        } else {
            setTouchStart((e as React.MouseEvent).clientX);
        }
    };

    const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
        if ("touches" in e) {
            setTouchEnd(e.touches[0].clientX);
        } else {
            if (touchStart !== null) {
                setTouchEnd((e as React.MouseEvent).clientX);
            }
        }
    };

    const handleDragEnd = () => {
        if (touchStart === null || touchEnd === null) {
            setTouchStart(null);
            return;
        }
        const distance = touchStart - touchEnd;
        const minSwipeDistance = 50;
        if (distance > minSwipeDistance) {
            const next = Math.min(PHASES.length - 1, currentStep + 1);
            const section = sectionRef.current;
            const scroller = document.getElementById('main-scroller');
            if (section && scroller) {
                const scrubDistance = section.offsetHeight - scroller.offsetHeight;
                const target = section.offsetTop + ((next + 0.5) / PHASES.length) * scrubDistance;
                scroller.scrollTo({ top: target, behavior: 'smooth' });
            }
        } else if (distance < -minSwipeDistance) {
            const next = Math.max(0, currentStep - 1);
            const section = sectionRef.current;
            const scroller = document.getElementById('main-scroller');
            if (section && scroller) {
                const scrubDistance = section.offsetHeight - scroller.offsetHeight;
                const target = section.offsetTop + ((next + 0.5) / PHASES.length) * scrubDistance;
                scroller.scrollTo({ top: target, behavior: 'smooth' });
            }
        }
        setTouchStart(null);
        setTouchEnd(null);
    };

    useEffect(() => {
        stepRef.current = currentStep;
    }, [currentStep]);

    useEffect(() => {
        if (!canvasRef.current) return;

        let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer;
        let mainGroup: THREE.Group;
        let particles: THREE.Points, lines: THREE.LineSegments, thrusterStreaks: THREE.LineSegments, thrusterRings: THREE.Group, satellites: THREE.Group, orbitTrack: THREE.Mesh;
        let particlePositions: Float32Array, originalPositions: Float32Array, chaosPositions: Float32Array;
        let mouse = new THREE.Vector2(-100, -100);
        let raycaster = new THREE.Raycaster();
        let animationId: number;

        const sphereRadius = 2.2;
        const clock = new THREE.Clock();

        // Energy trace heads that orbit the planet to light up the wireframe
        let traceHeads = [
            { angleX: 0, angleY: 0, speedX: 0.02, speedY: 0.015 },
            { angleX: Math.PI, angleY: Math.PI / 2, speedX: -0.015, speedY: 0.025 },
            { angleX: Math.PI / 2, angleY: Math.PI, speedX: 0.025, speedY: -0.015 }
        ];

        function createSoftGlowTexture() {
            const canvas = document.createElement('canvas');
            canvas.width = 64;
            canvas.height = 64;
            const ctx = canvas.getContext('2d');
            if (!ctx) return new THREE.Texture();
            const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
            gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
            gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(32, 32, 32, 0, Math.PI * 2);
            ctx.fill();
            return new THREE.CanvasTexture(canvas);
        }

        function createCore() {
            const count = 140;
            particlePositions = new Float32Array(count * 3);
            originalPositions = new Float32Array(count * 3);
            chaosPositions = new Float32Array(count * 3);
            const colors = new Float32Array(count * 3);

            for (let i = 0; i < count; i++) {
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(Math.random() * 2 - 1);

                originalPositions[i * 3] = sphereRadius * Math.sin(phi) * Math.cos(theta);
                originalPositions[i * 3 + 1] = sphereRadius * Math.sin(phi) * Math.sin(theta);
                originalPositions[i * 3 + 2] = sphereRadius * Math.cos(phi);

                const rChaos = 3 + Math.random() * 6;
                const tChaos = Math.random() * Math.PI * 2;
                const pChaos = Math.acos(Math.random() * 2 - 1);

                chaosPositions[i * 3] = rChaos * Math.sin(pChaos) * Math.cos(tChaos);
                chaosPositions[i * 3 + 1] = rChaos * Math.sin(pChaos) * Math.sin(tChaos);
                chaosPositions[i * 3 + 2] = rChaos * Math.cos(pChaos);

                particlePositions[i * 3] = chaosPositions[i * 3];
                particlePositions[i * 3 + 1] = chaosPositions[i * 3 + 1];
                particlePositions[i * 3 + 2] = chaosPositions[i * 3 + 2];

                colors[i * 3] = 0.478;
                colors[i * 3 + 1] = 0.631;
                colors[i * 3 + 2] = 0.859;
            }

            const geo = new THREE.BufferGeometry();
            geo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
            geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            const mat = new THREE.PointsMaterial({
                size: 0.18,
                vertexColors: true,
                transparent: true,
                opacity: 0.0,
                map: createSoftGlowTexture(),
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            particles = new THREE.Points(geo, mat);
            mainGroup.add(particles);

            const wireGeo = new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(sphereRadius, 2));
            const lineCount = wireGeo.attributes.position.count;
            const lineColors = new Float32Array(lineCount * 3);

            for (let i = 0; i < lineCount; i++) {
                lineColors[i * 3] = 0.478;     // Lightblue R
                lineColors[i * 3 + 1] = 0.631;   // Lightblue G
                lineColors[i * 3 + 2] = 0.859;   // Lightblue B
            }
            wireGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

            const lineMat = new THREE.LineBasicMaterial({
                vertexColors: true,
                transparent: true,
                opacity: 0,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            lines = new THREE.LineSegments(wireGeo, lineMat);
            mainGroup.add(lines);
        }

        function createThruster() {
            const streakCount = 40;
            const streakGeo = new THREE.BufferGeometry();
            const streakPos = new Float32Array(streakCount * 2 * 3);

            for (let i = 0; i < streakCount; i++) {
                const angle = Math.random() * Math.PI * 2;
                const r = Math.random() * 0.8;
                const x = Math.cos(angle) * r;
                const z = Math.sin(angle) * r;
                const y1 = -sphereRadius + 0.2;
                const y2 = y1 - (0.5 + Math.random() * 1.5);

                streakPos[i * 6] = x; streakPos[i * 6 + 1] = y1; streakPos[i * 6 + 2] = z;
                streakPos[i * 6 + 3] = x; streakPos[i * 6 + 4] = y2; streakPos[i * 6 + 5] = z;
            }
            streakGeo.setAttribute('position', new THREE.BufferAttribute(streakPos, 3));
            const streakMat = new THREE.LineBasicMaterial({
                color: 0xf26625,
                transparent: true,
                opacity: 0,
                blending: THREE.AdditiveBlending
            });
            thrusterStreaks = new THREE.LineSegments(streakGeo, streakMat);
            mainGroup.add(thrusterStreaks);

            thrusterRings = new THREE.Group();
            for (let i = 0; i < 3; i++) {
                const ringGeo = new THREE.TorusGeometry(0.8, 0.015, 8, 32);
                const ringMat = new THREE.MeshBasicMaterial({
                    color: 0xf26625,
                    transparent: true,
                    opacity: 0,
                    blending: THREE.AdditiveBlending
                });
                const ring = new THREE.Mesh(ringGeo, ringMat);
                ring.rotation.x = Math.PI / 2;
                ring.userData = { offset: i * 0.33, life: i * 0.33 };
                thrusterRings.add(ring);
            }
            mainGroup.add(thrusterRings);
        }

        function createOrbitSystem() {
            satellites = new THREE.Group();

            const trackGeo = new THREE.TorusGeometry(4.2, 0.008, 16, 100);
            const trackMat = new THREE.MeshBasicMaterial({
                color: 0x7aa1db,
                transparent: true,
                opacity: 0,
                blending: THREE.AdditiveBlending
            });
            orbitTrack = new THREE.Mesh(trackGeo, trackMat);
            orbitTrack.rotation.x = Math.PI / 2.5;
            orbitTrack.rotation.y = Math.PI / 8;
            satellites.add(orbitTrack);

            const colors = [0x7aa1db, 0xf26625, 0xffffff];
            for (let i = 0; i < 8; i++) {
                const satGeo = new THREE.SphereGeometry(0.06, 16, 16);
                const satMat = new THREE.MeshBasicMaterial({
                    color: colors[i % colors.length],
                    transparent: true,
                    opacity: 0,
                    blending: THREE.AdditiveBlending
                });
                const sat = new THREE.Mesh(satGeo, satMat);

                const angle = (Math.PI * 2 / 8) * i + Math.random();
                sat.userData = { angle: angle, speed: 0.005 + Math.random() * 0.005 };
                orbitTrack.add(sat);
            }

            mainGroup.add(satellites);
        }

        // Init
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x030303, 0.08);

        camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 6.5;
        // Move camera left to push object right (allow clipping)
        if (window.innerWidth > 768) {
            camera.position.x = -2.8;
        }

        renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current!, antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        mainGroup = new THREE.Group();
        scene.add(mainGroup);

        createCore();
        createThruster();
        createOrbitSystem();

        const onMouseMove = (event: MouseEvent) => {
            const rect = canvasRef.current?.getBoundingClientRect();
            if (!rect) return;
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        };

        const onWindowResize = () => {
            if (!canvasRef.current) return;
            const rect = canvasRef.current.parentElement!.getBoundingClientRect();
            camera.aspect = rect.width / rect.height;
            camera.updateProjectionMatrix();
            renderer.setSize(rect.width, rect.height);
        };

        // Setup resize once
        const rect = canvasRef.current.parentElement!.getBoundingClientRect();
        camera.aspect = rect.width / rect.height;
        camera.updateProjectionMatrix();
        renderer.setSize(rect.width, rect.height);

        window.addEventListener('resize', onWindowResize, false);
        window.addEventListener('mousemove', onMouseMove, false);

        function animate() {
            animationId = requestAnimationFrame(animate);
            const time = clock.getElapsedTime();
            const activeStep = stepRef.current;

            if ((particles.material as THREE.Material).opacity < 0.8) {
                (particles.material as THREE.Material).opacity += (0.8 - (particles.material as THREE.Material).opacity) * 0.015;
            }

            mainGroup.position.y = Math.sin(time * 0.8) * 0.15;

            const rotSpeed = activeStep >= 3 ? 0.015 : 0.003;
            particles.rotation.y += activeStep === 0 ? 0.001 : rotSpeed;

            lines.rotation.y += rotSpeed * 1.2;
            lines.rotation.z = Math.sin(time * 0.2) * 0.1;
            lines.rotation.x = Math.cos(time * 0.2) * 0.1;

            if (activeStep >= 2) {
                const pulse = 1 + Math.sin(time * 1.5) * 0.015;
                lines.scale.set(pulse, pulse, pulse);
            } else {
                lines.scale.set(1, 1, 1);
            }

            // Update abstract trace heads (used for wireframe coloring)
            traceHeads.forEach(head => {
                head.angleX += head.speedX;
                head.angleY += head.speedY;
            });

            // Animate Wireframe Colors (Real path tracing logic)
            const lPos = lines.geometry.attributes.position.array as Float32Array;
            const lCol = lines.geometry.attributes.color.array as Float32Array;

            for (let i = 0; i < lPos.length / 3; i++) {
                const x = lPos[i * 3];
                const y = lPos[i * 3 + 1];
                const z = lPos[i * 3 + 2];

                let hotFactor = 0;

                if (activeStep === 2) {
                    // FLOW PHASE: Energy travels along the wireframe vertices
                    for (let t = 0; t < traceHeads.length; t++) {
                        const head = traceHeads[t];
                        // Convert spherical to cartesian for the trace head
                        const hx = sphereRadius * Math.sin(head.angleX) * Math.cos(head.angleY);
                        const hy = sphereRadius * Math.sin(head.angleX) * Math.sin(head.angleY);
                        const hz = sphereRadius * Math.cos(head.angleX);

                        // Distance squared (faster than Math.sqrt)
                        const distSq = (x - hx) * (x - hx) + (y - hy) * (y - hy) + (z - hz) * (z - hz);
                        const threshold = 1.0; // Proximity threshold

                        if (distSq < threshold * threshold) {
                            const localHot = 1.0 - (Math.sqrt(distSq) / threshold);
                            hotFactor = Math.max(hotFactor, Math.pow(localHot, 1.5)); // Exponent for sharper falloff
                        }
                    }
                } else if (activeStep >= 3) {
                    // SHIP & ORBIT PHASES: The entire wireframe pulses with hot momentum
                    hotFactor = 0.7 + Math.sin(time * 4.0 + y * 2.0) * 0.3;
                }

                // Target Colors (Lerp between Lightblue and Orange)
                const targetR = 0.478 + (0.949 - 0.478) * hotFactor;
                const targetG = 0.631 + (0.400 - 0.631) * hotFactor;
                const targetB = 0.859 + (0.145 - 0.859) * hotFactor;

                // Smoothly interpolate to the target color
                lCol[i * 3] += (targetR - lCol[i * 3]) * 0.15;
                lCol[i * 3 + 1] += (targetG - lCol[i * 3 + 1]) * 0.15;
                lCol[i * 3 + 2] += (targetB - lCol[i * 3 + 2]) * 0.15;
            }
            lines.geometry.attributes.color.needsUpdate = true;

            raycaster.setFromCamera(mouse, camera);
            const positions = particles.geometry.attributes.position.array as Float32Array;
            const colors = particles.geometry.attributes.color.array as Float32Array;

            for (let i = 0; i < positions.length / 3; i++) {
                let px = positions[i * 3];
                let py = positions[i * 3 + 1];
                let pz = positions[i * 3 + 2];
                const ox = originalPositions[i * 3];
                const oy = originalPositions[i * 3 + 1];
                const oz = originalPositions[i * 3 + 2];

                const v = new THREE.Vector3(px, py, pz).applyMatrix4(particles.matrixWorld);
                const mouseWorld = raycaster.ray.origin.clone().add(raycaster.ray.direction.clone().multiplyScalar(v.distanceTo(camera.position)));
                const dist = v.distanceTo(mouseWorld);

                const hoverRadius = 1.4;
                if (dist < hoverRadius) {
                    if (activeStep >= 1) {
                        const force = (hoverRadius - dist) * 0.03;
                        const dir = v.clone().sub(mouseWorld).normalize();

                        v.add(dir.multiplyScalar(force));
                        v.normalize().multiplyScalar(sphereRadius);

                        const localV = v.applyMatrix4(particles.matrixWorld.clone().invert());
                        positions[i * 3] = localV.x;
                        positions[i * 3 + 1] = localV.y;
                        positions[i * 3 + 2] = localV.z;
                    } else {
                        const force = (hoverRadius - dist) * 0.015;
                        const dir = v.clone().sub(mouseWorld).normalize();
                        v.add(dir.multiplyScalar(force));

                        const localV = v.applyMatrix4(particles.matrixWorld.clone().invert());
                        positions[i * 3] = localV.x;
                        positions[i * 3 + 1] = localV.y;
                        positions[i * 3 + 2] = localV.z;
                    }

                    const colorShift = (hoverRadius - dist) / hoverRadius;
                    colors[i * 3] += (0.949 - colors[i * 3]) * colorShift * 0.15;
                    colors[i * 3 + 1] += (0.400 - colors[i * 3 + 1]) * colorShift * 0.15;
                    colors[i * 3 + 2] += (0.145 - colors[i * 3 + 2]) * colorShift * 0.15;

                } else {
                    if (activeStep === 0) {
                        const cx = chaosPositions[i * 3];
                        const cy = chaosPositions[i * 3 + 1];
                        const cz = chaosPositions[i * 3 + 2];

                        const tx = cx + Math.sin(time * 0.4 + i) * 1.5;
                        const ty = cy + Math.cos(time * 0.3 + i) * 1.5;
                        const tz = cz + Math.sin(time * 0.5 + i) * 1.5;

                        positions[i * 3] += (tx - px) * 0.01;
                        positions[i * 3 + 1] += (ty - py) * 0.01;
                        positions[i * 3 + 2] += (tz - pz) * 0.01;
                    } else {
                        positions[i * 3] += (ox - px) * 0.03;
                        positions[i * 3 + 1] += (oy - py) * 0.03;
                        positions[i * 3 + 2] += (oz - pz) * 0.03;

                        const returnV = new THREE.Vector3(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
                        const currentRadius = returnV.length();
                        const newRadius = currentRadius + (sphereRadius - currentRadius) * 0.08;
                        returnV.normalize().multiplyScalar(newRadius);

                        positions[i * 3] = returnV.x;
                        positions[i * 3 + 1] = returnV.y;
                        positions[i * 3 + 2] = returnV.z;
                    }

                    colors[i * 3] += (0.478 - colors[i * 3]) * 0.05;
                    colors[i * 3 + 1] += (0.631 - colors[i * 3 + 1]) * 0.05;
                    colors[i * 3 + 2] += (0.859 - colors[i * 3 + 2]) * 0.05;
                }
            }
            particles.geometry.attributes.position.needsUpdate = true;
            particles.geometry.attributes.color.needsUpdate = true;
            // Opacity & State Transitions
            const lineTargetOpacity = activeStep >= 2 ? (activeStep >= 3 ? 0.4 : 0.6) : 0;
            (lines.material as THREE.Material).opacity += (lineTargetOpacity - (lines.material as THREE.Material).opacity) * 0.05;

            const thrustTarget = activeStep === 3 ? 0.7 : 0;
            (thrusterStreaks.material as THREE.Material).opacity += (thrustTarget - (thrusterStreaks.material as THREE.Material).opacity) * 0.05;

            if (activeStep === 3 || (thrusterStreaks.material as THREE.Material).opacity > 0.01) {
                const sPos = thrusterStreaks.geometry.attributes.position.array as Float32Array;
                for (let i = 0; i < sPos.length / 6; i++) {
                    const speed = 0.15 + (i % 3) * 0.05;
                    sPos[i * 6 + 1] -= speed;
                    sPos[i * 6 + 4] -= speed;

                    if (sPos[i * 6 + 4] < -6) {
                        const angle = Math.random() * Math.PI * 2;
                        const r = Math.random() * 0.8;
                        sPos[i * 6] = Math.cos(angle) * r;
                        sPos[i * 6 + 2] = Math.sin(angle) * r;
                        sPos[i * 6 + 3] = sPos[i * 6];
                        sPos[i * 6 + 5] = sPos[i * 6 + 2];
                        sPos[i * 6 + 1] = -sphereRadius + 0.2;
                        sPos[i * 6 + 4] = sPos[i * 6 + 1] - (0.5 + Math.random() * 1.5);
                    }
                }
                thrusterStreaks.geometry.attributes.position.needsUpdate = true;

                thrusterRings.children.forEach(ring => {
                    ring.userData.life += 0.015;
                    if (ring.userData.life > 1) ring.userData.life = 0;

                    const life = ring.userData.life;
                    ring.position.y = -sphereRadius - (life * 2);
                    const scale = 1 - (life * 0.5);
                    ring.scale.set(scale, scale, scale);

                    const opacity = Math.sin(life * Math.PI) * thrustTarget;
                    ((ring as THREE.Mesh).material as THREE.Material).opacity = opacity;
                });
            }

            const camTargetZ = activeStep === 4 ? 9 : 6.5;
            camera.position.z += (camTargetZ - camera.position.z) * 0.03;

            const orbitTarget = activeStep === 4 ? 0.4 : 0;
            const orbitMat = orbitTrack.material as THREE.Material;
            orbitMat.opacity += (orbitTarget - orbitMat.opacity) * 0.05;

            orbitTrack.children.forEach((sat: any) => {
                const targetSatOpacity = activeStep === 4 ? 1 : 0;
                sat.material.opacity += (targetSatOpacity - sat.material.opacity) * 0.05;

                if (activeStep === 4) {
                    sat.userData.angle += sat.userData.speed;
                    sat.position.x = Math.cos(sat.userData.angle) * 4.2;
                    sat.position.y = Math.sin(sat.userData.angle) * 4.2;
                }
            });

            if (activeStep === 4) {
                orbitTrack.rotation.z -= 0.002;
            }

            renderer.render(scene, camera);
        }

        animate();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', onWindowResize);
            window.removeEventListener('mousemove', onMouseMove);
            renderer.dispose();
        };
    }, []);

    return (
        <section ref={sectionRef} className="relative w-full h-[600vh] snap-start bg-black isolation-auto" id="process">
            {/* Visuals Container (Sticky background, but positioned to the right) */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="sticky top-0 w-full h-screen">
                    <canvas ref={canvasRef} className="absolute top-0 right-0 w-full md:w-[60%] h-full pointer-events-auto" />
                    {/* Subtle mask to fade the 3D visual into the left text area */}
                    <div className="absolute top-0 left-0 w-[40%] h-full bg-gradient-to-r from-black via-black/60 to-transparent pointer-events-none hidden md:block" />
                </div>
            </div>

            {/* Content Layer */}
            <div className="relative z-10 w-full h-full flex flex-col md:flex-row max-w-7xl mx-auto px-8 py-24 pointer-events-none">

                {/* Left side info */}
                <div className="md:w-[50%] flex flex-col justify-center h-screen sticky top-0 pl-0 md:pl-4">

                    <div
                        className="relative min-h-[300px] w-full max-w-md pointer-events-auto cursor-grab active:cursor-grabbing pb-12 select-none"
                        data-cursor-text="DRAG"
                        onMouseDown={handleDragStart}
                        onMouseMove={handleDragMove}
                        onMouseUp={handleDragEnd}
                        onMouseLeave={handleDragEnd}
                        onTouchStart={handleDragStart}
                        onTouchMove={handleDragMove}
                        onTouchEnd={handleDragEnd}
                    >
                        {/* Carousel Arrows */}
                        <div className="absolute -left-12 lg:-left-20 top-1/2 -translate-y-1/2 z-20 pointer-events-auto hidden md:block">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const next = Math.max(0, currentStep - 1);
                                    const section = sectionRef.current;
                                    const scroller = document.getElementById('main-scroller');
                                    if (section && scroller) {
                                        const scrubDistance = section.offsetHeight - scroller.offsetHeight;
                                        const target = section.offsetTop + ((next + 0.5) / PHASES.length) * scrubDistance;
                                        scroller.scrollTo({ top: target, behavior: 'smooth' });
                                    }
                                }}
                                className={`text-white transition-opacity ${currentStep === 0 ? "opacity-20 pointer-events-none" : "opacity-60 hover:opacity-100"}`}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                            </button>
                        </div>
                        <div className="absolute right-0 lg:-right-4 top-1/2 -translate-y-1/2 z-20 pointer-events-auto hidden md:block">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const next = Math.min(PHASES.length - 1, currentStep + 1);
                                    const section = sectionRef.current;
                                    const scroller = document.getElementById('main-scroller');
                                    if (section && scroller) {
                                        const scrubDistance = section.offsetHeight - scroller.offsetHeight;
                                        const target = section.offsetTop + ((next + 0.5) / PHASES.length) * scrubDistance;
                                        scroller.scrollTo({ top: target, behavior: 'smooth' });
                                    }
                                }}
                                className={`text-white transition-opacity ${currentStep === PHASES.length - 1 ? "opacity-20 pointer-events-none" : "opacity-60 hover:opacity-100"}`}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                            </button>
                        </div>

                        {PHASES.map((phase, idx) => (
                            <div
                                key={phase.id}
                                className={`absolute top-0 left-0 w-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${currentStep === idx ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10 pointer-events-none"
                                    }`}
                            >
                                <div className="text-accent-lightblue font-mono text-[10px] uppercase tracking-[0.3em] mb-4">
                                    0{idx} // YOUR LAUNCH MAP
                                </div>

                                <RevealHeader text={phase.title} isActive={currentStep === idx} />

                                <p className="font-body text-gray-400 text-[clamp(1rem,1.5vw,1.25rem)] leading-relaxed">
                                    {phase.body}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Controls */}
                    <div className="flex flex-wrap gap-2 mt-16 pointer-events-auto">
                        {PHASES.map((phase, idx) => (
                            <button
                                key={phase.id}
                                onClick={() => {
                                    const section = sectionRef.current;
                                    const scroller = document.getElementById('main-scroller');
                                    if (section && scroller) {
                                        const scrubDistance = section.offsetHeight - scroller.offsetHeight;
                                        const target = section.offsetTop + ((idx + 0.5) / PHASES.length) * scrubDistance;
                                        scroller.scrollTo({ top: target, behavior: 'smooth' });
                                    }
                                }}
                                className={`px-4 py-2 border font-mono text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${currentStep === idx
                                    ? "bg-accent-blue/10 border-accent-blue text-accent-blue shadow-[0_0_20px_rgba(0,114,206,0.15)]"
                                    : "bg-white/5 border-white/10 text-white/30 hover:text-white hover:border-white/30"
                                    }`}
                            >
                                {idx < 10 ? `0${idx}` : idx} {phase.title}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
