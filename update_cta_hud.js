const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'components', 'CTASection.tsx');
let content = fs.readFileSync(file, 'utf8');

// The file currently has:
// export function CTASection() {
// inside the "// NEW DESIGN COMPONENT (CYBERPUNK CIRCUIT CHIP)" block.

content = content.replace('export function CTASection()', 'export function CTASectionChip()');
content = content.replace('// NEW DESIGN COMPONENT (CYBERPUNK CIRCUIT CHIP)', '// ── OLD CTA Section Chip ───────────────────');

// Create the new Sci-Fi Geometric HUD component
const newDesign = `
// ============================================================================
// NEW DESIGN COMPONENT (GEOMETRIC SCI-FI HUD)
// ============================================================================
export function CTASection() {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      window.location.href = '/portfolio';
    }, 1500);
  };

  const Quadrant = ({ transform }: { transform: string }) => (
    <g transform={transform}>
      {/* Target Inner Corner */}
      <path d="M 50 30 L 50 40 L 40 40" stroke="#FF0000" strokeWidth="2" fill="none" />
      <circle cx="50" cy="50" r="2" fill="#FF0000" />
      
      {/* Target Bracket */}
      <path d="M 70 10 L 80 10 L 80 40 L 70 40" stroke="#FF0000" strokeWidth="3" fill="none" />
      <path d="M 90 25 L 95 25" stroke="#FF0000" strokeWidth="3" fill="none" />
      
      {/* Diagonal Main Arm */}
      <path d="M 100 40 L 120 40 L 150 70 L 450 370 L 480 370" stroke="#FF0000" strokeWidth="3" fill="none" opacity="0.8" />
      
      {/* Diagonal Secondary Arm */}
      <path d="M 90 60 L 110 60 L 140 90 L 380 330" stroke="#FF0000" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M 110 80 L 130 80 L 160 110 L 360 310" stroke="#FF0000" strokeWidth="1" strokeDasharray="5 5" fill="none" opacity="0.4" />
      
      {/* Inner Tech Details */}
      <path d="M 110 20 L 140 20 L 160 40" stroke="#FF0000" strokeWidth="2" fill="none" />
      <path d="M 180 40 L 250 40" stroke="#FF0000" strokeWidth="4" fill="none" opacity="0.9" />
      <path d="M 180 55 L 230 55" stroke="#FF0000" strokeWidth="2" strokeDasharray="4 4" fill="none" opacity="0.7" />
      
      {/* Vertical Block Accents */}
      <path d="M 15 120 L 15 280" stroke="#FF0000" strokeWidth="4" fill="none" opacity="0.9" />
      <path d="M 30 120 L 30 220" stroke="#FF0000" strokeWidth="2" strokeDasharray="4 4" fill="none" opacity="0.7" />
      <path d="M 45 120 L 45 150" stroke="#FF0000" strokeWidth="6" fill="none" opacity="0.5" />
      <circle cx="15" cy="100" r="3" fill="#FF0000" />
      <circle cx="15" cy="300" r="3" fill="#FF0000" />

      {/* Outer framing corners */}
      <path d="M 480 340 L 480 370 L 450 370" stroke="#FF0000" strokeWidth="2" fill="none" opacity="0.5" />
      
      {/* Dot Grid Accents */}
      <g fill="#FF0000" opacity="0.3">
         <circle cx="200" cy="150" r="1" />
         <circle cx="210" cy="150" r="1" />
         <circle cx="220" cy="150" r="1" />
         <circle cx="230" cy="150" r="1" />
         
         <circle cx="200" cy="160" r="1" />
         <circle cx="210" cy="160" r="1" />
         <circle cx="220" cy="160" r="1" />
         <circle cx="230" cy="160" r="1" />
      </g>

      {/* Animated Flowing Line */}
      <path 
        d="M 480 370 L 450 370 L 150 70 L 120 40 L 100 40" 
        stroke="#ffffff" strokeWidth="2" fill="none" 
        className={\`flowing-line \${isConnecting ? 'electric-surge' : ''}\`} 
      />
    </g>
  );

  return (
    <section className="relative w-full h-screen bg-[#020000] flex justify-center items-center font-mono overflow-hidden">
       
       <style>{\`
         .flowing-line {
           stroke-dasharray: 60 800;
           stroke-dashoffset: 860;
           animation: flowAnim 3s linear infinite;
           filter: drop-shadow(0 0 5px #ff0000);
         }
         @keyframes flowAnim {
           to { stroke-dashoffset: 0; }
         }

         /* Electric Surge Animation on Click */
         .electric-surge {
           stroke: #ffffff;
           stroke-width: 6;
           stroke-dasharray: 400 400 !important;
           filter: drop-shadow(0 0 15px #ffffff) drop-shadow(0 0 30px #ff0000) !important;
           animation: surgeShoot 0.8s ease-out forwards, flicker 0.1s infinite alternate !important;
         }
         @keyframes surgeShoot {
           0% { stroke-dashoffset: 800; }
           100% { stroke-dashoffset: 0; }
         }
         @keyframes flicker {
           0% { opacity: 0.8; stroke-width: 4; }
           100% { opacity: 1; stroke-width: 8; }
         }

         .hud-pulse {
           animation: slowPulse 4s ease-in-out infinite;
         }
         @keyframes slowPulse {
           0%, 100% { opacity: 0.8; }
           50% { opacity: 1; filter: drop-shadow(0 0 10px rgba(255,0,0,0.5)); }
         }

         .bg-microgrid {
           background-image: radial-gradient(rgba(255, 0, 0, 0.15) 1px, transparent 1px);
           background-size: 20px 20px;
         }
       \`}</style>

       {/* Very Subtle Microgrid Background (like the reference image) */}
       <div className="absolute inset-0 bg-microgrid pointer-events-none"></div>
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020000_70%)] pointer-events-none"></div>

       {/* Full Geometric SVG HUD */}
       <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none">
          <svg viewBox="-500 -400 1000 800" className="w-full h-full max-w-[1400px] hud-pulse">
            <defs>
              <filter id="hudGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur"/>
                <feMerge>
                  <feMergeNode in="blur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            <g filter="url(#hudGlow)">
              {/* Render 4 Symmetrical Quadrants */}
              <Quadrant transform="scale(1, 1)" />
              <Quadrant transform="scale(-1, 1)" />
              <Quadrant transform="scale(1, -1)" />
              <Quadrant transform="scale(-1, -1)" />

              {/* Central Crosshairs (Exact Center) */}
              <path d="M 0 -15 L 0 -5" stroke="#FF0000" strokeWidth="2" />
              <path d="M 0 5 L 0 15" stroke="#FF0000" strokeWidth="2" />
              <path d="M -15 0 L -5 0" stroke="#FF0000" strokeWidth="2" />
              <path d="M 5 0 L 15 0" stroke="#FF0000" strokeWidth="2" />
            </g>
          </svg>
       </div>

       {/* Interactive Center Button */}
       <div className="relative z-50">
          <button 
             onClick={handleConnect}
             disabled={isConnecting}
             className={\`group relative px-6 py-2 bg-transparent border border-[#FF0000]/50 transition-all duration-300 overflow-hidden cursor-pointer disabled:cursor-not-allowed \${isConnecting ? 'scale-110 shadow-[0_0_50px_rgba(255,255,255,0.8)] border-white bg-[#FF0000]' : 'hover:border-[#FF0000] hover:bg-[#FF0000]/10 hover:shadow-[0_0_20px_rgba(255,0,0,0.8)]'}\`}
          >
             {/* Center Button Text */}
             <span className={\`font-bold text-sm tracking-[0.4em] font-mono transition-colors duration-300 \${isConnecting ? 'text-white' : 'text-[#FF0000] group-hover:text-white drop-shadow-[0_0_5px_#FF0000]'}\`}>
                {isConnecting ? 'SYS_OVERRIDE' : 'ENTER'}
             </span>
             
             {/* Flash Overlay */}
             {isConnecting && (
               <div className="absolute inset-0 bg-white opacity-50 animate-ping"></div>
             )}
          </button>
       </div>

    </section>
  );
}
`;

fs.writeFileSync(file, content + '\n' + newDesign);
console.log("Updated CTASection.tsx with Geometric Sci-Fi HUD Component.");
