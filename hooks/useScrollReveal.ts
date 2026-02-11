"use client";

import { useEffect } from "react";

export function useScrollReveal() {
    useEffect(() => {
        const reveals = document.querySelectorAll(".reveal");
        if (reveals.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                    }
                });
            },
            { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
        );

        reveals.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);
}
