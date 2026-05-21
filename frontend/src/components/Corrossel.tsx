import React from 'react';
import '../style/Carrossel.css';

interface CarrosselProps {
  images: string[];
  width: string;
  height: string;
}

const Carrossel = ({ images, width, height }: CarrosselProps) => {
  const quantity = images.length;

  return (
    <div 
      className="container" 
      style={{ 
        "--width": width, 
        "--height": height, 
        "--quantity": quantity 
      } as React.CSSProperties}
    >
      <div className="carrossel">
        {images.map((img, index) => (
          <div 
            key={index} 
            className="item" 
            // O cálculo do delay agora é feito com base no índice
            style={{ "--delay": index } as React.CSSProperties}
          >
            <img src={img} alt={`Parceiro ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carrossel;