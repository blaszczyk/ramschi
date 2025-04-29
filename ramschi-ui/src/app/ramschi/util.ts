
// inspired by https://jsfiddle.net/wn655txt/2/

const MAX_AREA = 1_000_000;

export function scaleImage(file: File, consumer: (blob: Blob) => any) {
    const image = new Image();
    image.onload = () => {
        const width = image.width;
        const height = image.height;
        const area = width * height;

        if (area < MAX_AREA) {
            consumer(file);
        }
        else {
            const factor = Math.sqrt(MAX_AREA / area);
            const newWidth = width * factor;
            const newHeight = height * factor;

            const canvas = document.createElement('canvas');
            canvas.width = newWidth;
            canvas.height = newHeight;
    
            const context = canvas.getContext('2d')!;
    
            context.drawImage(image, 0, 0, newWidth, newHeight);
    
            canvas.toBlob(blob => {
                consumer(blob!);
            }, file.type);
            
        }
    };
    image.src = URL.createObjectURL(file);
}
