import { init as coreInit } from '@cornerstonejs/core';
import { init as dicomImageLoaderInit } from '@cornerstonejs/dicom-image-loader';
window.addEventListener("load", () => {

    function initCornerstone() {
        await coreInit();
        await diconImage()
    }
    await con
})
await coreInit();
await dicomImageLoaderInit();

const content = document.getElementById('content');
const element = document.createElement('div');

element.style.width = '500px';
element.style.height = '500px';
element.style.backgroundColor = 'blue';

content.appendChild(element);