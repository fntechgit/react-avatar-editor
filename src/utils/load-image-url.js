/* eslint-env browser, node */

function isDataURL(str) {
  if (str === null) {
    return false
  }
  const regex = /^\s*data:([a-z]+\/[a-z]+(;[a-z-]+=[a-z-]+)?)?(;base64)?,[a-z0-9!$&',()*+;=\-._~:@/?%\s]*\s*$/i
  return !!str.match(regex)
}

function getXHRImage(imageURL) {
  let xhr = new XMLHttpRequest();
  return new Promise((resolve, reject) => {

    xhr.onload = function () {
      let url = URL.createObjectURL(this.response),
        image = new Image();

      image.src = url;
      resolve(url);
    };

    xhr.open('GET', imageURL, true);
    xhr.responseType = 'blob';
    xhr.send();
  })
}

export default function loadImageURL(imageURL, crossOrigin, allowCrossOrigin) {
  console.log('allow', allowCrossOrigin);
  return new Promise((resolve, reject) => {
    let image = new Image();
    image.onload = () => resolve(image)
    image.onerror = reject
    if (isDataURL(imageURL) === false && crossOrigin) {
      image.crossOrigin = crossOrigin
    }
    if (allowCrossOrigin) {
      getXHRImage(imageURL).then(imageData => {
        return image.src = imageData
      });
    } else {
      image.src = imageURL;
    }    
  })
}
