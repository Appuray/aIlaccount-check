const fs = require('fs');
let content = fs.readFileSync('original_landing.txt', 'utf8');

// 1. Fix the duplicate Landing issue and broken SVG
const fixRegex = /export const Landing: React\.FC = \(\) => \{[\s\S]*?export const Landing: React\.FC = \(\) => \{/;
content = content.replace(fixRegex, 'export const Landing: React.FC = () => {');

// 2. Remove isLoaded state to make it fast
content = content.replace(/const \[isLoaded, setIsLoaded\] = useState\(false\);\n/g, '');
content = content.replace(/import React, \{ useRef, useEffect, useState \} from 'react';/, "import React, { useRef, useEffect } from 'react';");
content = content.replace(/const tl = gsap\.timeline\(\{\s*onComplete: \(\) => setIsLoaded\(true\)\s*\}\);/, "const tl = gsap.timeline();");
content = content.replace(/<main className=\{cn\("transition-opacity duration-1500 pt-24", isLoaded \? "opacity-100" : "opacity-0"\)\}>/, '<main className={cn("pt-24")}>');

// 3. Keep the fast preloader times (optional but requested by user)
content = content.replace(/duration: 2,\s*ease: "power4\.inOut"/, 'duration: 0.3, ease: "power2.inOut"');
content = content.replace(/duration: 1\.4,\s*ease: "expo\.inOut"/, 'duration: 0.4, ease: "expo.inOut"');
content = content.replace(/duration: 1\.8,\s*stagger: 0\.15,\s*ease: "expo\.out",\s*\}, "-=0\.8"\)/, 'duration: 0.8, stagger: 0.1, ease: "power3.out" }, "-=0.2")');
content = content.replace(/duration: 2,\s*ease: "back\.out\(1\.2\)",\s*\}, "-=1\.4"\)/, 'duration: 1, ease: "back.out(1.2)" }, "-=0.6")');

fs.writeFileSync('src/pages/Landing.tsx', content);
console.log("Restored Landing.tsx from original");
