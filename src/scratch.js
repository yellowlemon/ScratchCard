class ScratchCard {
    constructor(cardDiv, config = {}) {
        this.coverColor = config.coverColor || '#C5C5C5';
        this.ratio = config.ratio || 0.5;
        this.coverImg = config.coverImg || '';
        this.radius = config.radius || 20;
        this.startCallback = config.startCallback || '';
        this.moveCallback = config.moveCallback || '';
        this.endCallback = config.endCallback || '';
        this._cWidth = '';
        this._cHeight = '';
        this._cardDiv = document.querySelector(cardDiv);
        this._canvas = null;
        this._ctx = null;
        this._startType = '';
        this._moveType = '';
        this._endType = '';
        this._isMove = true;

        this._init();
        this._drawCover();
        this._checkEventType();

        this._canvas.addEventListener(this._startType, this._touchStart.bind(this), false);
        this._canvas.addEventListener(this._moveType, this._touchMove.bind(this), false);
        this._canvas.addEventListener(this._endType, this._touchEnd.bind(this), false);
    }

    /***
     * 初始化代码
     * @private
     */
    _init() {
        if (!this._isCanvasSupported()) {
            throw new Error('对不起，当前浏览器不支持Canvas！');
        }

        let canvasDiv = document.createElement("canvas");
        this._cWidth = this._cardDiv.offsetWidth;
        this._cHeight = this._cardDiv.offsetHeight;
        console.log('position', getComputedStyle(this._cardDiv).position)
        this._cardDiv.style.position = 'relative';
        canvasDiv.setAttribute("width", this._cWidth + 'px');
        canvasDiv.setAttribute("height", this._cHeight + 'px');
        this._canvas = canvasDiv;
        this._cardDiv.appendChild(canvasDiv);
    }

    /***
     * 渲染画布
     * @private
     */
    _drawCover() {
        this._ctx = this._canvas.getContext("2d");

        if (this.coverImg) {
            let coverImg = new Image();
            coverImg.src = this.coverImg;
            coverImg.onload =  ()=> {
                this._ctx.drawImage(coverImg, 0, 0, this._cWidth, this._cHeight);
            }
        } else {
            this._ctx.fillStyle = this.coverColor;
            this._ctx.fillRect(0, 0, this._cWidth, this._cHeight);
        }
    }

    /***
     * 判断事件类型
     * @private
     */
    _checkEventType() {
        let isTouch = "ontouchstart" in window;
        this._startType = isTouch ? "touchstart" : "mousedown";
        this._moveType = isTouch ? "touchmove" : "mousemove";
        this._endType = isTouch ? "touchend" : "mouseup";
    }

    /***
     * 返回擦除面积
     * @param canvas 当前刮刮卡canvas对象
     * @returns {number}
     * @private
     */
    _getPercent() {
        let _data = this._ctx.getImageData(0, 0, this._cWidth, this._cHeight).data,
            _pixArr = 0,
            _dataLen = _data.length;
        for (let i = 0; i < _dataLen; i += 4) {
            if (_data[i + 3] === 0) {
                _pixArr++;
            }
        }
        return ((_pixArr / (_dataLen / 4)) * 100).toFixed(2) - 0;
    }

    /***
     * 判断是否支持canvas
     * @returns {boolean}
     * @private
     */
    _isCanvasSupported() {
        let elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    }

    /***
     * 触摸开始事件
     * @param e 触屏事件对象
     * @private
     */
    _touchStart(e) {
        this._isMove = true;
        this._ctx.globalCompositeOperation = 'destination-out';
        this._wipeCircle(e);
        this.startCallback && this.startCallback();
    }

    /***
     * 触摸移动事件
     * @param e 触屏事件对象
     * @private
     */
    _touchMove(e) {
        if (this._isMove) {
            this._wipeCircle(e);
            this.moveCallback && this.moveCallback();
        }
    }

    /***
     * 触摸结束事件
     * @private
     */
    _touchEnd() {
        this._isMove = false;
        console.log(this._getPercent());
        if (this._getPercent() >= this.ratio * 100) {
            setTimeout(() => {
                this._ctx.clearRect(0, 0, this._cWidth, this._cHeight);
                this.endCallback && this.endCallback();
            }, 300);
        }
    }

    /***
     * 返回擦除对象
     * @param e 触屏事件对象
     * @private
     */
    _wipeCircle(e) {
        const evt = 'ontouchstart' in window ? e.touches[0] : e;
        const coverPos = this._canvas.getBoundingClientRect();
        const pageScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const pageScrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
        const mouseX = evt.pageX - coverPos.left - pageScrollLeft;
        const mouseY = evt.pageY - coverPos.top - pageScrollTop;
        this._ctx.beginPath();
        this._ctx.arc(mouseX, mouseY, this.radius, 0, 2 * Math.PI);
        this._ctx.closePath();
        this._ctx.fill();
    }
}

module.exports = ScratchCard;
