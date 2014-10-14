(function () {
    'use strict';

    var app = angular.module('app');

    app.directive('ccImgPerson', ['config', function (config) {
        //Usage:
        //<img data-cc-img-person="{{s.speaker.imageSource}}"/>
        var basePath = config.imageSettings.imageBasePath;
        var unknownImage = config.imageSettings.unknownPersonImageSource;
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            attrs.$observe('ccImgPerson', function (value) {
                value = basePath + (value || unknownImage);
                attrs.$set('src', value);
            });
        }
    }]);


    app.directive('ccSidebar', function () {
        // Opens and clsoes the sidebar menu.
        // Usage:
        //  <div data-cc-sidebar>
        // Creates:
        //  <div data-cc-sidebar class="sidebar">
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            var $sidebarInner = element.find('.sidebar-inner');
            var $dropdownElement = element.find('.sidebar-dropdown a');
            element.addClass('sidebar');
            $dropdownElement.click(dropdown);

            function dropdown(e) {
                var dropClass = 'dropy';
                e.preventDefault();
                if (!$dropdownElement.hasClass(dropClass)) {
                    hideAllSidebars();
                    $sidebarInner.slideDown(350);
                    $dropdownElement.addClass(dropClass);
                } else if ($dropdownElement.hasClass(dropClass)) {
                    $dropdownElement.removeClass(dropClass);
                    $sidebarInner.slideUp(350);
                }

                function hideAllSidebars() {
                    $sidebarInner.slideUp(350);
                    $('.sidebar-dropdown a').removeClass(dropClass);
                }
            }
        }
    });


    app.directive('ccWidgetClose', function () {
        // Usage:
        // <a data-cc-widget-close></a>
        // Creates:
        // <a data-cc-widget-close="" href="#" class="wclose">
        //     <i class="fa fa-remove"></i>
        // </a>
        var directive = {
            link: link,
            template: '<i class="fa fa-remove"></i>',
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            attrs.$set('href', '#');
            attrs.$set('wclose');
            element.click(close);

            function close(e) {
                e.preventDefault();
                element.parent().parent().parent().hide(100);
            }
        }
    });

    app.directive('ccWidgetMinimize', function () {
        // Usage:
        // <a data-cc-widget-minimize></a>
        // Creates:
        // <a data-cc-widget-minimize="" href="#"><i class="fa fa-chevron-up"></i></a>
        var directive = {
            link: link,
            template: '<i class="fa fa-chevron-up"></i>',
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            //$('body').on('click', '.widget .wminimize', minimize);
            attrs.$set('href', '#');
            attrs.$set('wminimize');
            element.click(minimize);

            function minimize(e) {
                e.preventDefault();
                var $wcontent = element.parent().parent().next('.widget-content');
                var iElement = element.children('i');
                if ($wcontent.is(':visible')) {
                    iElement.removeClass('fa fa-chevron-up');
                    iElement.addClass('fa fa-chevron-down');
                } else {
                    iElement.removeClass('fa fa-chevron-down');
                    iElement.addClass('fa fa-chevron-up');
                }
                $wcontent.toggle(500);
            }
        }
    });

    app.directive('ccScrollToTop', ['$window',
        // Usage:
        // <span data-cc-scroll-to-top></span>
        // Creates:
        // <span data-cc-scroll-to-top="" class="totop">
        //      <a href="#"><i class="fa fa-chevron-up"></i></a>
        // </span>
        function ($window) {
            var directive = {
                link: link,
                template: '<a href="#"><i class="fa fa-chevron-up"></i></a>',
                restrict: 'A'
            };
            return directive;

            function link(scope, element, attrs) {
                var $win = $($window);
                element.addClass('totop');
                $win.scroll(toggleIcon);

                element.find('a').click(function (e) {
                    e.preventDefault();
                    // Learning Point: $anchorScroll works, but no animation
                    //$anchorScroll();
                    $('body').animate({ scrollTop: 0 }, 500);
                });

                function toggleIcon() {
                    $win.scrollTop() > 300 ? element.slideDown() : element.slideUp();
                }
            }
        }
    ]);

    app.directive('ccSpinner', ['$window', function ($window) {
        // Description:
        //  Creates a new Spinner and sets its options
        // Usage:
        //  <div data-cc-spinner="vm.spinnerOptions"></div>
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            scope.spinner = null;
            scope.$watch(attrs.ccSpinner, function (options) {
                if (scope.spinner) {
                    scope.spinner.stop();
                }
                scope.spinner = new $window.Spinner(options);
                scope.spinner.spin(element[0]);
            }, true);
        }
    }]);

    app.directive('ccWidgetHeader', function () {
        //Usage:
        //<div data-cc-widget-header title="vm.map.title"></div>
        var directive = {
            link: link,
            scope: {
                'title': '@',
                'subtitle': '@',
                'rightText': '@',
                'allowCollapse': '@'
            },
            templateUrl: '/app/layout/widgetheader.html',
            restrict: 'A',
        };
        return directive;

        function link(scope, element, attrs) {
            attrs.$set('class', 'widget-head');
        }
    });

    app.directive('cbFabricCanvas', ['canvasService', 'authentication', '$timeout', '$location', '$rootScope', function (canvasService, auth, $timeout, $location, $rootScope) {
        //Usage:
        //<data-cb-fabric-canvas></data-cb-fabric-canvas>
        var directive = {
            link: link,
            scope: {
            },
            templateUrl: '/app/layout/fabric-canvas.html',
            restrict: 'E',
        };

        return directive;

        function setupCanvasService(canvas) {
            var sendTimeout;
            var canvasOnFn = function (options) {
                if (sendTimeout) {
                    $timeout.cancel(sendTimeout);
                }
                sendTimeout = $timeout(function () {
                    canvas.off('after:render', canvasOnFn);
                    canvasService.sync($location.path(), auth.authentication.userName, canvas.toDatalessJSON());
                    canvas.on('after:render', canvasOnFn);
                }, 250);
            }
            canvas.on('after:render', canvasOnFn);

            var updateTimeout;
            canvasService.receiveJSON = function (name, sceneJSON) {
                if (updateTimeout) {
                    $timeout.cancel(updateTimeout);
                }
                updateTimeout = $timeout(function () {
                    canvas.off('after:render', canvasOnFn);
                    canvas.clear();
                    canvas.loadFromDatalessJSON(sceneJSON, function () {
                        canvas.renderAll();
                        canvas.on('after:render', canvasOnFn);
                    });
                }, 250);
            }

            canvasService.join($location.path());

            var deregisterLocationChange = $rootScope.$on('$locationChangeSuccess', function (evt, newUrl, oldUrl) {
                canvasService.leave(oldUrl.substring(oldUrl.indexOf('#') + 1));
                deregisterLocationChange();
            });
        }

        function link(scope, element, attrs) {

            var $ = function (id) { return document.getElementById(id) };

            var canvas = new fabric.Canvas('c', {
                isDrawingMode: true
            });

            canvas.loadFromDatalessJSON(attrs['scene']);
            setupCanvasService(canvas);

            fabric.Object.prototype.transparentCorners = false;

            var drawingModeEl = $('drawing-mode'),
                drawingOptionsEl = $('drawing-mode-options'),
                drawingColorEl = $('drawing-color'),
                drawingShadowColorEl = $('drawing-shadow-color'),
                drawingLineWidthEl = $('drawing-line-width'),
                drawingShadowWidth = $('drawing-shadow-width'),
                drawingShadowOffset = $('drawing-shadow-offset'),
                clearEl = $('clear-canvas');

            clearEl.onclick = function () { canvas.clear() };

            drawingModeEl.onclick = function () {
                canvas.isDrawingMode = !canvas.isDrawingMode;
                if (canvas.isDrawingMode) {
                    drawingModeEl.innerHTML = 'Cancel drawing mode';
                    drawingOptionsEl.style.display = '';
                }
                else {
                    drawingModeEl.innerHTML = 'Enter drawing mode';
                    drawingOptionsEl.style.display = 'none';
                }
            };

            if (fabric.PatternBrush) {
                var vLinePatternBrush = new fabric.PatternBrush(canvas);
                vLinePatternBrush.getPatternSrc = function () {

                    var patternCanvas = fabric.document.createElement('canvas');
                    patternCanvas.width = patternCanvas.height = 10;
                    var ctx = patternCanvas.getContext('2d');

                    ctx.strokeStyle = this.color;
                    ctx.lineWidth = 5;
                    ctx.beginPath();
                    ctx.moveTo(0, 5);
                    ctx.lineTo(10, 5);
                    ctx.closePath();
                    ctx.stroke();

                    return patternCanvas;
                };

                var hLinePatternBrush = new fabric.PatternBrush(canvas);
                hLinePatternBrush.getPatternSrc = function () {

                    var patternCanvas = fabric.document.createElement('canvas');
                    patternCanvas.width = patternCanvas.height = 10;
                    var ctx = patternCanvas.getContext('2d');

                    ctx.strokeStyle = this.color;
                    ctx.lineWidth = 5;
                    ctx.beginPath();
                    ctx.moveTo(5, 0);
                    ctx.lineTo(5, 10);
                    ctx.closePath();
                    ctx.stroke();

                    return patternCanvas;
                };

                var squarePatternBrush = new fabric.PatternBrush(canvas);
                squarePatternBrush.getPatternSrc = function () {

                    var squareWidth = 10, squareDistance = 2;

                    var patternCanvas = fabric.document.createElement('canvas');
                    patternCanvas.width = patternCanvas.height = squareWidth + squareDistance;
                    var ctx = patternCanvas.getContext('2d');

                    ctx.fillStyle = this.color;
                    ctx.fillRect(0, 0, squareWidth, squareWidth);

                    return patternCanvas;
                };

                var diamondPatternBrush = new fabric.PatternBrush(canvas);
                diamondPatternBrush.getPatternSrc = function () {

                    var squareWidth = 10, squareDistance = 5;
                    var patternCanvas = fabric.document.createElement('canvas');
                    var rect = new fabric.Rect({
                        width: squareWidth,
                        height: squareWidth,
                        angle: 45,
                        fill: this.color
                    });

                    var canvasWidth = rect.getBoundingRectWidth();

                    patternCanvas.width = patternCanvas.height = canvasWidth + squareDistance;
                    rect.set({ left: canvasWidth / 2, top: canvasWidth / 2 });

                    var ctx = patternCanvas.getContext('2d');
                    rect.render(ctx);

                    return patternCanvas;
                };

                var img = new Image();
                img.src = "/Content/images/honey_im_subtle.png";

                var texturePatternBrush = new fabric.PatternBrush(canvas);
                texturePatternBrush.source = img;
            }

            $('drawing-mode-selector').onchange = function () {

                if (this.value === 'hline') {
                    canvas.freeDrawingBrush = vLinePatternBrush;
                }
                else if (this.value === 'vline') {
                    canvas.freeDrawingBrush = hLinePatternBrush;
                }
                else if (this.value === 'square') {
                    canvas.freeDrawingBrush = squarePatternBrush;
                }
                else if (this.value === 'diamond') {
                    canvas.freeDrawingBrush = diamondPatternBrush;
                }
                else if (this.value === 'texture') {
                    canvas.freeDrawingBrush = texturePatternBrush;
                }
                else {
                    canvas.freeDrawingBrush = new fabric[this.value + 'Brush'](canvas);
                }

                if (canvas.freeDrawingBrush) {
                    canvas.freeDrawingBrush.color = drawingColorEl.value;
                    canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
                    canvas.freeDrawingBrush.shadowBlur = parseInt(drawingShadowWidth.value, 10) || 0;
                }
            };

            drawingColorEl.onchange = function () {
                canvas.freeDrawingBrush.color = this.value;
            };
            drawingShadowColorEl.onchange = function () {
                canvas.freeDrawingBrush.shadowColor = this.value;
            };
            drawingLineWidthEl.onchange = function () {
                canvas.freeDrawingBrush.width = parseInt(this.value, 10) || 1;
                this.previousSibling.innerHTML = this.value;
            };
            drawingShadowWidth.onchange = function () {
                canvas.freeDrawingBrush.shadowBlur = parseInt(this.value, 10) || 0;
                this.previousSibling.innerHTML = this.value;
            };
            drawingShadowOffset.onchange = function () {
                canvas.freeDrawingBrush.shadowOffsetX =
                canvas.freeDrawingBrush.shadowOffsetY = parseInt(this.value, 10) || 0;
                this.previousSibling.innerHTML = this.value;
            };

            if (canvas.freeDrawingBrush) {
                canvas.freeDrawingBrush.color = drawingColorEl.value;
                canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
                canvas.freeDrawingBrush.shadowBlur = 0;
            }
        }
    }]);

    app.directive('cbChat', ['chatService', 'authentication', '$location', '$rootScope', function (chatService, auth, $location, $rootScope) {

        //Usage:
        //<data-cb-fabric-canvas></data-cb-fabric-canvas>
        var directive = {
            link: link,
            scope: {

            },
            templateUrl: '/app/layout/chat.html',
            restrict: 'E',
        };

        return directive;

        // This optional function html-encodes messages for display in the page.
        function htmlEncode(value) {
            var encodedValue = $('<div />').text(value).html();
            return encodedValue;
        }

        function link(scope, element, attrs) {
            $('#message').on('keypress', function (evt) {
                //On enter key press
                if (evt.keyCode == 13) {
                    submitMessage();
                }
            });

            $('#sendmessage').click(submitMessage);

            function submitMessage() {
                chatService.send(auth.authentication.userName, $('#message').val());
                // Clear text box and reset focus for next comment. 
                $('#message').val('').focus();
            }

            chatService.receive = function (name, message) {
                // Add the message to the page. 
                $('#discussion').append('<li><strong>' + htmlEncode(name)
                    + '</strong>: ' + htmlEncode(message) + '</li>');
            }

            chatService.join($location.path());

            var deregisterLocationChange = $rootScope.$on('$locationChangeSuccess', function (evt, newUrl, oldUrl) {
                chatService.leave(oldUrl.substring(oldUrl.indexOf('#') + 1));
                deregisterLocationChange();
            });
        }
    }])
})();