import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'NOCTIS — Cinema After Dark',description:'Find the film that stays with you. Private Letterboxd Taste DNA, couples picks and streaming discovery.', applicationName:'NOCTIS', icons: {icon:'/favicon.svg'},manifest:'/manifest.webmanifest'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
