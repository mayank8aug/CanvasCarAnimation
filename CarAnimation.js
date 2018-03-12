var start = function() {
        var button = document.getElementById('start').disabled = true;
        var carObj = document.getElementById('carImg');
        var canvas = document.getElementById('mainCanvas');
        var startX = 300;
        var startY = 20;
        var endX = startX + carObj.width + 20;
        var endY = 650;
        var currentX;
        var currentY;
        var wheelEventTimer = null;
        var context;
        if(canvas.getContext) {
            context = canvas.getContext('2d');

            //Creating the path using two parallel vertical strokes
            context.beginPath();
            context.strokeStyle = "blue";
            context.moveTo(startX, startY);
            context.lineTo(startX, endY);
            context.stroke();
            context.beginPath();
            context.strokeStyle = "blue";
            context.moveTo(endX, startY);
            context.lineTo(endX, endY);
            context.stroke();

            //Path width
            var pathWidth = endX - startX;

            if(carObj) {
                currentX = startX + pathWidth/2;
                currentY = startY;
                var width = carObj.width;
                var height = carObj.height;

                //Since we have to rotate the car object over the canvas, saving the context state before transform and later restoring it back.
                context.save();
                context.translate(endY-startX, - startX);
                context.rotate(90*Math.PI/180);

                // Drawing the rotated car object at the path start point
                context.drawImage(carObj, currentX-width/2, currentY-height/2, width, height);

                //Restoring the context back to initial state
                context.restore();

                //Listening for mouse whee event with a wait timeout of 150ms
                window.addEventListener('wheel', function(e) {
                    if (wheelEventTimer !== null) {
                        window.clearTimeout(wheelEventTimer);
                    }
                    wheelEventTimer = window.setTimeout(function() {

                        //Assumed some movement per mouse scroll
                        var movedY = 12.5;
                        if(e.deltaY > 0) {//Moving downwards

                            //Don't move upwards when reached initial point
                            if(currentX + movedY > endY + startX) {
                                return;
                            }

                            //Transforming the image position by redrawing the object with different coordinates
                            currentX = currentX + movedY;
                            context.save();
                            context.translate(endY-startX, -startX);
                            context.rotate(90*Math.PI/180);
                            context.clearRect(currentX-width+movedY/2, currentY-height, height, width);
                            context.drawImage(carObj, currentX-width/2, currentY-height/2, width, height);
                            context.restore();

                        } else if(e.deltaY < 0) {//Moving upwards

                            movedY = -movedY;

                            //Don't move downwards when reached end point
                            if(currentX + movedY < startX + startY) {
                                return;
                            }

                            //Transforming the image position by redrawing the object with different coordinates
                            currentX = currentX + movedY;
                            context.save();
                            context.translate(endY-startX, -startX);
                            context.rotate(90*Math.PI/180);
                            context.clearRect(currentX-movedY, currentY-height, height, width);
                            context.drawImage(carObj, currentX-width/2, currentY-height/2, width, height);
                            context.restore();
                        }
                    }, 150);
                });
            }
        }
    }