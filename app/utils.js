function getBase64Image(photo) {
    var canvas = document.createElement("canvas");
    var img = new Image();
    img.onload = function () {
        var ctx = canvas.getContext('2d');
        var scaled = calculateAspectRatioFit(this.width, this.height, canvas.width, canvas.height);
        ctx.drawImage(this,
            0, 0,
            this.width, this.height,
            0, 0,
            scaled.width, scaled.height);
    }
    img.src = photo;
    var x=canvas.toDataURL("image/jpeg");
    return canvas.toDataURL("image/jpeg");
}

function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
    var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
    return { width: srcWidth * ratio, height: srcHeight * ratio };
}
