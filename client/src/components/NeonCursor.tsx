
// import React, { useEffect } from 'react';
// import '../styles/cursor.css';

// const NeonCursor: React.FC = () => {
//   useEffect(() => {
//     const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
//     if (isTouchDevice) return;

//     const cursor = document.createElement('div');
//     cursor.classList.add('neon-cursor');
//     document.body.appendChild(cursor);

//     let lastTrailTime = 0;
//     const trailInterval = 30;

//     const handleMouseMove = (e: MouseEvent) => {
//       const now = Date.now();
//       if (now - lastTrailTime < trailInterval) return;
//       lastTrailTime = now;

//       cursor.style.left = `${e.clientX}px`;
//       cursor.style.top = `${e.clientY}px`;

//       const trail = document.createElement('div');
//       trail.classList.add('cursor-trail');
//       trail.style.left = `${e.clientX}px`;
//       trail.style.top = `${e.clientY}px`;
//       document.body.appendChild(trail);

//       setTimeout(() => {
//         trail.remove();
//       }, 1000); 
//     };

//     const handleMouseDown = () => {
//       cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
//       setTimeout(() => {
//         cursor.style.transform = 'translate(-50%, -50%) scale(1)';
//       }, 200);
//     };

//     document.addEventListener('mousemove', handleMouseMove);
//     document.addEventListener('mousedown', handleMouseDown);

//     return () => {
//       document.removeEventListener('mousemove', handleMouseMove);
//       document.removeEventListener('mousedown', handleMouseDown);
//       cursor.remove();
//       document.querySelectorAll('.cursor-trail').forEach((trail) => trail.remove());
//     };
//   }, []);

//   return null; 
// };

// export default NeonCursor;