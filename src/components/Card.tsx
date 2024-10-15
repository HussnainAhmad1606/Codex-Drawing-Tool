"use client"
import React, { useRef, useState } from 'react';
import { useUserStore } from '@/store/store';
function ImageEditor() {
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [text, setText] = useState("");
  const [selectedColor, setSelectedColor] = useState("#000000");
  const currentTool = useUserStore((state:any) => state.currentTool);
  const [brushStroke, setBrushStroke] = useState(0)
  const handleFileChange = (e:any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
    loadImageOnCanvas();
  };

  // Draw on canvas using mouse events
  const startDrawing = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDrawing(true);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const draw = (e) => {
    if (!drawing) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.strokeStyle = selectedColor; 
    ctx.lineWidth = brushStroke;
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setDrawing(false);
  };

  // Add text to the canvas
  const addTextToCanvas = () => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.font = '20px Arial';
    ctx.fillStyle = 'red';
    ctx.fillText(text, 50, 50); // Add text at (50, 50) position
  };


  const loadImageOnCanvas=() => {
    const ctx = canvasRef.current.getContext('2d');
    const img = new Image();
    img.src = image;
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
    };
  }

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

  return (
    <div>
      <button className='btn btn-primary my-5' onClick={clearCanvas}>Clear Canvas</button>
      <h1>Current Tool: {currentTool}</h1>
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
     
      <input type="file" accept="image/*" onChange={handleFileChange} />
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
      
      <br />
      <button className='btn btn-primary' onClick={()=>{
        const ctx = canvasRef.current.getContext('2d');
        const img = new Image();
        img.src = image;
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
        };
      }}>
        Load
      
      </button>
      <input
        type="text"
        placeholder="Enter text to add"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button className='btn btn-primary' onClick={addTextToCanvas}>Add Text</button>
    </div>
  );
}

export default ImageEditor;
