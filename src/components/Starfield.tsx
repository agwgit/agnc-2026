"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Starfield() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        containerRef.current.appendChild(renderer.domElement);

        const starsGeometry = new THREE.BufferGeometry();
        const starsCount = 1500;
        const posArray = new Float32Array(starsCount * 3);

        for (let i = 0; i < starsCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 10;
        }

        starsGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3));

        const starsMaterial = new THREE.PointsMaterial({
            size: 0.005,
            color: 0xffffff,
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending,
        });

        const starsMesh = new THREE.Points(starsGeometry, starsMaterial);
        scene.add(starsMesh);

        camera.position.z = 2;

        const animate = () => {
            requestAnimationFrame(animate);
            starsMesh.rotation.y += 0.0005;
            starsMesh.rotation.x += 0.0002;
            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            renderer.dispose();
            if (containerRef.current) {
                containerRef.current.removeChild(renderer.domElement);
            }
        };
    }, []);

    return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0" />;
}
