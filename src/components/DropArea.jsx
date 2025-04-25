import React, { useState } from 'react';
import './DropArea.scss';

const DropArea = ({ onDrop }) => {
  const [showDrop, setShowDrop] = useState(false);

  return (    
    <div 
      onDragEnter={() => setShowDrop(true)} 
      onDragLeave={() => setShowDrop(false)} 
      onDrop={() => {
        onDrop();
        setShowDrop(false);
      }}
      onDragOver={(e) => e.preventDefault()}
      className={showDrop ? "drop_area active" : "drop_area"}
    > 
      Drop Here
    </div>
  );
};

export default DropArea;