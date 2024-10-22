document.addEventListener("DOMContentLoaded", function() {
    const tickButton = document.getElementById("tick-button")
    tickButton.addEventListener(('mouseover'), () => {
        tickButton.textContent = "check";
        tickButton.style.fontSize = '400%'

    })
    tickButton.addEventListener(('mouseout'), () => {
        tickButton.textContent = "";
        tickButton.style.fontSize = '100%'
        tickButton.style.fontFamily = 'Impact'
    })

    const canvasDrawer = new CanvasDrawer();
    canvasDrawer.redrawAll()

    document.querySelectorAll('input[name="Radius"]').forEach(radio => {
        radio.addEventListener('click', () => {
            canvasDrawer.redrawAll(parseInt(radio.value));
        })
    })

    function sendRequest(x1 = null, y1 = null, r1 = null) {
        $.ajax({
            type: "GET",
            url: "/fcgi-bin/fastCGI.jar",
            data: {
                x: x1,
                y: y1,
                r: r1
            },
            success: function (msg) {
                console.log("received success ", msg)
                processSuccess(msg);
            },
            error: function (msg) {
                console.log("received error ", msg.status)
                processError(msg.responseJSON);
            }
        });
    }

    function processError(msgJson) {
        const errorLabel = document.getElementById("error")
        console.log(msgJson);
        errorLabel.textContent = msgJson.error;
    }

    function processSuccess(msgJson) {
        addRowToStats(msgJson);
        canvasDrawer.drawBOOM(msgJson.x, msgJson.y);

        setTimeout(() => {
            canvasDrawer.redrawAll(msgJson.r)
            canvasDrawer.drawPoint(msgJson.x, msgJson.y,msgJson.success === "success")
            canvasDrawer.addPoint(msgJson)
        }, 350);


    }

    document.getElementById('tick-button').addEventListener('click', function(event)  {
        if (validateX() && validateY()) {
            const tickButton = document.getElementById("tick-button")
            const replacement = document.getElementById('replacement');
            tickButton.style.display = 'none';  // Hide button
            replacement.style.display = 'block';

            setTimeout(() => {
                replacement.style.display = 'none';
                tickButton.style.display = 'inline';  // Show button after 5 seconds
            }, 1000);


            let x = getX();
            let y = getY();
            let R = getR();
            console.log("checked values", x, y, R);
            cleanErrorLabel();
            sendRequest(x, y, R);
        }
    })

    function cleanErrorLabel() {
        const errorLabel = document.getElementById("error");
        errorLabel.textContent = ""
    }

    function addRowToStats(data) {
        const table = document.getElementById("stats");
        const newRow = table.insertRow();


        const cellX = newRow.insertCell(0);
        const cellY = newRow.insertCell(1);
        const cellR = newRow.insertCell(2);
        const cellResult = newRow.insertCell(3);
        const cellExecutionTime = newRow.insertCell(4);
        const cellTime = newRow.insertCell(5);


        cellX.textContent = parseInt(data.x);
        cellY.textContent = parseFloat(data.y).toFixed(2);
        cellR.textContent = parseInt(data.r);
        cellExecutionTime.textContent = (data.execution_time / 10**6).toFixed (2) + "ms";
        let [timeWithoutMilliseconds] = data.current_time.split('.');
        cellTime.textContent = timeWithoutMilliseconds;

        const video = document.createElement("video");
        video.classList.add("status-video");
        video.width = 15;
        video.loop = true;
        video.autoplay = true;
        video.muted = true;

        if (data.success === "success") {
            video.src = "../resources/tick_gif.mov";
        } else if (data.success === "miss") {
            video.src = "../resources/cross_gif.mov";
        }

        cellResult.appendChild(video);
    }

    const xInputs = document.querySelectorAll('#X-input input[type="checkbox"]');
    xInputs.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            if (this.checked) {
                xInputs.forEach(otherCheckbox => {
                    if (otherCheckbox !== this) {
                        otherCheckbox.checked = false;  // сброс всех остальных чекбоксов
                    }
                });
            }
        });
    });

    const yText = document.getElementById("Y-input");

    yText.addEventListener("focus", validateY);
    yText.addEventListener("input", () => {
        validateY();
        let tmp = yText.value;
        let foundDot = false;
        if (!tmp) return;
        y = "";
        let negative = false;
        for (let i = 0; i < tmp.length; i++) {
            if (tmp[i] === '-' && i === 0) {
                negative = true;
            } else if (tmp[i] === '.' && !foundDot) {
                foundDot = true;
            } else if (isNaN(parseFloat(tmp[i]))) continue;
            y += tmp[i];
        }
        if (y.length > 1 && y[1] !== '.' && y[0] === '0') {
            y = y.substring(1);
        }
        while (y.includes('-0') && !y.includes('.')) {
            y = y.replace('-0', '-');
        }
        yText.value = y;
    });


    function getX() {
        const xCheckboxes = document.querySelectorAll('input[name="x_coord"]');
        let result = "";

        xCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                result = checkbox.value
            }
        });
        return result;

    }

    function getY() {
        const yInput = document.querySelector('input[name="y_coord"]');
        const yValue = yInput.value.trim();

        if (yValue == null) return "";

        return yValue
    }

    function getR() {
        let result = "";
        document.querySelectorAll('input[name="Radius"]').forEach(radio => {
            if (radio.checked) {
                result = radio.value;
            }
        })
        return result
    }
})
console.log('Happy developing ✨')

