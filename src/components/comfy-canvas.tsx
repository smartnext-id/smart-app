import Image from 'next/image';
import { Download, Image as ImageIcon, AlertCircle, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';


type SmartnextCanvasProps = {
  isGenerating: boolean;
  result: {
    imageUrl?: string;
    downloadUrl?: string;
    error?: string;
  };
  width: number;
  height: number;
};

export function SmartnextCanvas({ isGenerating, result, width, height }: SmartnextCanvasProps) {
  const [showInfo, setShowInfo] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev * 0.8, 0.2));
  const handleReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    e.currentTarget.style.cursor = 'grabbing';
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    setIsDragging(false);
     e.currentTarget.style.cursor = 'grab';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };
   const handleMouseLeave = (e: React.MouseEvent) => {
    if (isDragging) {
      setIsDragging(false);
      e.currentTarget.style.cursor = 'grab';
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  const handleImageClick = () => {
    if (result.imageUrl && zoom === 1 && position.x === 0 && position.y === 0) {
      setShowInfo(!showInfo);
    } else if (result.imageUrl) {
      // Prevent toggling info if zoomed/panned
      setShowInfo(false);
    }
  };


  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 bg-background relative overflow-hidden bg-pattern">
       <div 
        id="canvas-viewport" 
        className="w-full h-full flex items-center justify-center overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div 
            id="result-container" 
            className="relative transition-transform duration-200"
            style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})` }}
        >
          {isGenerating && (
            <div className="flex flex-col items-center justify-center gap-2">
              <Skeleton className="rounded-lg" style={{width: `${width}px`, height: `${height}px`}} />
              <p className="text-muted-foreground animate-pulse mt-2">Generating your masterpiece...</p>
            </div>
          )}
          {!isGenerating && result.error && (
            <div className="w-full max-w-2xl">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Generation Failed</AlertTitle>
                <AlertDescription>{result.error}</AlertDescription>
              </Alert>
            </div>
          )}
          {!isGenerating && result.imageUrl && (
              <div className="relative group" onClick={handleImageClick} style={{width: `${width}px`, height: `${height}px`}}>
                   <Image src={result.imageUrl} alt="Generated image" fill style={{ objectFit: 'contain' }} className="rounded-lg border shadow-lg" />
                  {showInfo && (
                       <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs rounded-full px-2 py-1">
                          {width} x {height}
                      </div>
                  )}
                   <a href={result.downloadUrl} download="smartnext-generated.png" onClick={(e) => e.stopPropagation()} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="secondary" size="icon" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                    </Button>
                  </a>
              </div>
          )}
          {!isGenerating && !result.imageUrl && !result.error && (
              <div className="flex flex-col items-center justify-center text-muted-foreground/50">
                  <ImageIcon size={64} />
                  <p className="mt-4">Your generated image will appear here</p>
              </div>
          )}
        </div>
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm p-1 rounded-lg border shadow-md flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={handleZoomOut} className="h-8 w-8">
            <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleReset} className="h-8 w-8 text-xs font-bold">
            {Math.round(zoom * 100)}%
        </Button>
        <Button variant="ghost" size="icon" onClick={handleZoomIn} className="h-8 w-8">
            <ZoomIn className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
