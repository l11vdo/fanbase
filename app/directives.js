app.directive('focus', function () {
    return function (scope, element) {
        element[0].focus();
    }
});

app.directive('passwordMatch', [function () {
    return {
        restrict: 'A',
        scope: true,
        require: 'ngModel',
        link: function (scope, elem, attrs, control) {
            var checker = function () {

                //get the value of the first password
                var e1 = scope.$eval(attrs.ngModel);

                //get the value of the other password  
                var e2 = scope.$eval(attrs.passwordMatch);
                if (e2 != null)
                    return e1 == e2;
            };
            scope.$watch(checker, function (n) {

                //set the form control to valid if both 
                //passwords are the same, else invalid
                control.$setValidity("passwordNoMatch", n);
            });
        }
    };
}]);

app.directive('compile', ['$compile', function ($compile) {
    return function (scope, element, attrs) {
        scope.$watch(
            function (scope) {
                // watch the 'compile' expression for changes
                return scope.$eval(attrs.compile);
            },
            function (value) {
                // when the 'compile' expression changes
                // assign it into the current DOM
                element.html(value);

                // compile the new DOM and link it to the current
                // scope.
                // NOTE: we only compile .childNodes so that
                // we don't get into infinite loop compiling ourselves
                $compile(element.contents())(scope);
            }
        );
    };
}]);

app.directive('fbController', ['$compile', '$parse', function ($compile, $parse) {
    return {
        restrict: 'A',
        scope: { fbController: '=' },
        terminal: true,
        priority: 100000,
        link: function (scope, elem, attrs) {
            scope.$watch('fbController', function (value) {
                elem.val(value);
                //            var name = $parse(elem.attr('fb-controller'))(scope);
                elem.removeAttr('fb-controller');
                //            elem.attr('ng-controller', name);
                elem.attr('ng-controller', value);

                // Compile the element with the ng-controller attribute
                $compile(elem)(scope);
            });
        }
    };
}]);

app.directive('canSave', function ($compile) {
    return {
        priority: 1001, // compiles first
        terminal: true, // prevent lower priority directives to compile after it
        compile: function (el) {
            el.removeAttr('can-save'); // necessary to avoid infinite compile loop
            return function (scope) {
                var save = scope.footerButton.save;
                if (save === 'N') {
                    el.attr('ng-disabled', true);
                }
                var fn = $compile(el);
                fn(scope);
            };
        }
    };
});

app.directive('fbUpload', [function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            var reader = new FileReader();
            reader.onload = function (e) {
                scope.fileUpload = e.target.result;
                scope.$root.loading = true;
                scope.$apply();
            }
            elem.on('change', function () {
                reader.readAsDataURL(elem[0].files[0]);
            });
        }
    };
}]);

app.directive('fbFooter', function () {
    return {
        templateUrl: 'partials/footer.html'
    };
});

app.directive('fbPlayerSetup', ['$window', '$timeout', function ($window, $timeout) {
    return {
        restrict: 'A',
        link: link
    };
    function link(scope, element) {
        angular.element($window).bind('resize', function () {
            if (document.getElementById('fb_homeplayer')) {
                var playerSize = element[0].offsetWidth;
                if (playerSize <= 0) {
                    playerSize = document.getElementById('fb_homeplayer').clientWidth;
                }
                if (playerSize > 0) {
                    scope.$apply(function () {
                        var factor = playerSize <= 400 ? .15 : .1;
                        var progressFactor = playerSize <= 400 ? .25 : .2;

                        element[0].style.height = Math.floor(playerSize * factor) + 20 + "px";
                        scope.playerStyle = {
                            "display": "inline-block",
                            "background-color": "#1C18E4",
                            "background-image": "url('image/bannerplayer.jpg')",
                            "background-repeat": "no-repeat",
                            "background-size": "auto 100%",
                            "background-position": "center"
                        };
                        scope.playerWidth = {
                            "width": Math.floor(playerSize * (1.0 - factor)) + "px",
                            "left": Math.floor(playerSize * factor) + "px",
                            "height": Math.floor(playerSize * factor) + "px"
                        };
                        scope.progressWidth = {
                            "width": Math.floor((playerSize * (1.0 - progressFactor))) - 24 + "px",
                            "left": Math.floor((playerSize * factor) + 6) + "px",
                            "height": Math.floor(playerSize * factor) + "px",
                            "vertical-align": "middle"
                        };
                        scope.captionWidth = {
                            "font-size": playerSize <= 400 ? "1em" : "1.5em",
                            "width": Math.floor((playerSize * (1.0 - progressFactor))) - 28 + "px"
                        }
                        scope.playerImgWidth = {
                            "width": Math.floor(playerSize * factor) + "px",
                            "height": Math.floor(playerSize * factor) + "px",
                            "border-right": "0px",
                            "border-bottom": "0px",
                            "border-left": "2px solid #B5B5B5",
                            "border-top": "2px solid #B5B5B5"
                        };
                        scope.buttonHeight = {
                            "top": Math.floor(playerSize * factor) + 5 + "px"
                        };
                        scope.playListContainer = playerSize <= 400 ? { "padding": "5px" } : { "padding": "10px" };

                        scope.playListBtn = playerSize <= 400 ? { "padding": "3px" } : {};

                        scope.iconSize = playerSize <= 400 ? { "font-size": "1em" } : { "font-size": "2em" };

                    });
                }
                else {
                    $timeout(function () { $window.dispatchEvent(new Event("resize")); }, 200);
                    // builds correctly only after the other elements have rendered??!!
                }
            }
        });
    }
}]);

app.directive('fbEmbedWeblink', ['$sce', function ($sce) {
    return {
        restrict: 'E',
        template: '<iframe src="{{ trustedUrl }}" frameborder="0" allowfullscreen></iframe>',
        link: function (scope, element, attr) {
            var ind = attr.linkid;
            scope.src = scope.weblinkList[ind].fb_link;
            scope.src = scope.src.replace("http://","//");
            scope.src = scope.src.replace("https://","//");
            scope.trustedUrl = $sce.trustAsResourceUrl(scope.src);
        }
    }
}]);
