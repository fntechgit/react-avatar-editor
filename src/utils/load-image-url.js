/* eslint-env browser, node */

function isDataURL(str) {
  if (str === null) {
    return false
  }
  const regex = /^\s*data:([a-z]+\/[a-z]+(;[a-z-]+=[a-z-]+)?)?(;base64)?,[a-z0-9!$&',()*+;=\-._~:@/?%\s]*\s*$/i
  return !!str.match(regex)
}

function generateDataImage(image, url) {
  return new Promise((resolve, reject) => {
    let imageData;
    image.onload = function () {
      let canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;

      let context = canvas.getContext('2d');
      context.fillStyle = {
        type: 'image',
        quality: 1,
        originalSize: false,
        fillBg: '#fff'
      };

      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      imageData = canvas.toDataURL("data:image");
      URL.revokeObjectURL(url);
      resolve(imageData);
    }
  })
}

function imageURLToDataURL(imageURL) {
  let xhr = new XMLHttpRequest();
  return new Promise((resolve, reject) => {

    xhr.onload = function () {
      let url = URL.createObjectURL(this.response),
        image = new Image();

      generateDataImage(image, url).then(blob => {
        return image.src = blob;
      });
      image.src = url;
      resolve(image)
    };

    xhr.open('GET', imageURL, true);
    xhr.responseType = 'blob';
    xhr.send();
  })
}

export default function loadImageURL(imageURL, crossOrigin, allowCrossOrigin) {
  console.log('allow', allowCrossOrigin);
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image)
    image.onerror = reject
    if (isDataURL(imageURL) === false && crossOrigin) {
      image.crossOrigin = crossOrigin
    }
    image.src = imageURL;
    if (allowCrossOrigin) {
      imageURLToDataURL(imageURL).then(imageData => image.src = imageData);
    }
  })
}
