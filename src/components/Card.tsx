"use client"
import React, { useEffect, useRef, useState } from 'react';
import { useUserStore } from '@/store/store';
function ImageEditor() {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [text, setText] = useState("");
  const [selectedColor, setSelectedColor] = useState("#000000");
  const currentTool = useUserStore((state:any) => state.currentTool);
  const [currentShape, setCurrentShape] = useState('rectangle');
  const [brushStroke, setBrushStroke] = useState(0);

  const [textPosition, setTextPosition] = useState({ x: 100, y: 100 }); // Initial text position
 
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [image, setImage] = useState<string | null>(null);
  const [savedImage, setSavedImage] = useState<string | null>(null);


  const handleFileChange = (e:any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
    // document.getElementById("loadCanvasBtn")?.click();
  };

  const drawShape = (
    ctx: CanvasRenderingContext2D,
    tool: string,
    startX: number,
    startY: number,
    currentX: number,
    currentY: number
  ) => {
    const width = currentX - startX;
    const height = currentY - startY;

    switch (tool) {
      case 'rectangle':
        ctx.strokeStyle = selectedColor;
        ctx.lineWidth = brushStroke;
        ctx.strokeRect(startX, startY, width, height);
        break;

      case 'circle':
        ctx.strokeStyle = selectedColor;
        ctx.lineWidth = brushStroke;
        const radius = Math.sqrt(width * width + height * height);
        ctx.beginPath();
        ctx.arc(startX, startY, radius, 0, Math.PI * 2);
        ctx.stroke();
        break;

      case 'ellipse':
        ctx.strokeStyle = selectedColor;
        ctx.lineWidth = brushStroke;
        ctx.beginPath();
        ctx.ellipse(
          startX,
          startY,
          Math.abs(width),
          Math.abs(height),
          0,
          0,
          2 * Math.PI
        );
        ctx.stroke();
        break;

      case 'line':
        ctx.strokeStyle = selectedColor;
        ctx.lineWidth = brushStroke;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();
        break;

      default:
        break;
    }
  };


  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setDrawing(true);
    const ctx = canvasRef.current?.getContext('2d');
    const { offsetX, offsetY } = e.nativeEvent;
    setStartPosition({ x: offsetX, y: offsetY });

    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    const ctx = canvasRef.current?.getContext('2d');
    const { offsetX, offsetY } = e.nativeEvent;

    if (ctx && currentTool === 'Shape') {
      // Save the canvas state (including previously drawn image)
      if (savedImage) {
        const img = new Image();
        img.src = savedImage;
        img.onload = () => {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); // Clear canvas
          ctx.drawImage(img, 0, 0); // Restore the saved image
          
      
          drawShape(ctx, currentShape, startPosition.x, startPosition.y, offsetX, offsetY);
     
        };
      }
    } else if (ctx && currentTool === 'Brush') {
      // Freehand drawing mode
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = brushStroke;
      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setDrawing(false);
    const ctx = canvasRef.current?.getContext('2d');

    if (ctx) {
      // Save the current state of the canvas (including image and any shapes)
      const savedData = canvasRef.current.toDataURL();
      setSavedImage(savedData);
    }
  };

  const loadImageToCanvas = () => {
    const ctx = canvasRef.current?.getContext('2d');
    const img = new Image();
    if (image && ctx && canvasRef.current) {
      img.src = image;
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
        setSavedImage(canvasRef.current.toDataURL()); // Save the initial image
      };
    }
  };
  // Add text to the canvas
  const addTextToCanvas = () => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.font = '20px Arial';
    ctx.fillStyle = 'red';
    ctx.fillText(text, textPosition.x, textPosition.y);
  };


  
  
  const brushSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Brush stroke change: ", e.target.value)
    setBrushStroke(Number(e.target.value)); // Update state with new value
  };

  const clearCanvas = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = 'canvas-image.png';
      link.click();
    }
  };



  return (
    <div className='flex justify-between w-full p-10'>
    <div className='p-10'>
      <h1 className='my-5 font-bold text-2xl text-center'>Current Tool: {currentTool}</h1>
      <div className='flex justify-between items-center'>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button id='loadCanvasBtn' className='btn btn-primary' onClick={()=>{
        const ctx = canvasRef.current.getContext('2d');
        const img = new Image();
        img.src = image;
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
        };
      }}>
        Load Image to canvas
      
      </button>
      </div>
      <br />
      {image && (
        <div>
          <canvas
            ref={canvasRef}
            width={500}
            height={500}
            style={{ border: '1px solid black' }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </div>
      )}
    
    
    </div>

    <div className="card bg-base-100 w-96 shadow-xl">
  
  <div className="card-body">
    <h2 className="card-title">Tool Properties!</h2>
    {
      currentTool=="Text"?(
        <>
        <input
        type="text"
        placeholder="Enter text to add"
        value={text}
        className='input input-bordered w-full max-w-xs'
        onChange={(e) => setText(e.target.value)}
        />
      <button className='btn btn-primary' onClick={addTextToCanvas}>Add Text</button>
        </>
      ):null
    }
    {
      currentTool=="Shape"?(
        <>
        <div className='my-10 flex justify-center items-center'> 
        <div className='flex justify-center items-center'>
          <span>Stroke Color: </span>
         <input 
    type="color" 
    value={selectedColor} 
    onChange={(e) => setSelectedColor(e.target.value)} 
  />
        </div>
        <div className='ml-5 flex justify-center items-center'>
          <span>Stroke Size: </span>
          <input type="range"  onChange={brushSizeChange} min={0} max="100" value={brushStroke} className="range range-sm" />
        </div>


        </div>
        <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">Pick shape: </span>
        </div>
        <select value={currentShape} onChange={e=>setCurrentShape(e.target.value)} className="select select-bordered">
          <option value={"rectangle"}>Rectangle</option>
          <option value={"circle"}>Circle</option>
          <option value={"ellipse"}>Ellipse</option>
          <option value={"line"}>Line</option>
        </select>
     
      </label>
      </>
      ):null
    }
    {
        currentTool=="Brush"?(
          <div className='my-10 flex justify-center items-center'> 
            <div className='flex justify-center items-center'>
              <span>Brush Color: </span>
             <input 
        type="color" 
        value={selectedColor} 
        onChange={(e) => setSelectedColor(e.target.value)} 
      />
            </div>
            <div className='ml-5 flex justify-center items-center'>
              <span>Brush Size: </span>
              <input type="range"  onChange={brushSizeChange} min={0} max="100" value={brushStroke} className="range range-sm" />
            </div>


            </div>
        ):null
      }
     
    <div className="card-actions justify-end">
    <button className='btn btn-primary my-5' onClick={clearCanvas}>Clear Canvas</button>
      <button className='mx-3 btn btn-primary my-5' onClick={downloadCanvas}>Download Image</button>
     
    </div>
  </div>
</div>
    </div>
    
  );
}

export default ImageEditor;
