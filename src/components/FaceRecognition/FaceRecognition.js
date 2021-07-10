import React from 'react';

const FaceRecognition = ({ imageUrl }) => {
    return (
        <div className='center ma'>
            <div className='absolue mt2'>
                <img src={imageUrl} alt='detect' width='500px' height='auto' />
            </div>
        </div>
    );
}

export default FaceRecognition;