angular.module('reg')
    .controller('HomeCtrl', [
        '$scope',
        '$stateParams',
        '$translate',
        '$translatePartialLoader',
        'AuthService',
        'settings',
        'Utils',
        function ($scope, $stateParams, $translate, $translatePartialLoader, AuthService, settings, Utils) {
            let token = $stateParams.token;

            $translatePartialLoader.addPart('home');
            $translate.refresh();

            $scope.loading = true;
            // Is registration open?
            let Settings = settings.data;
            $scope.regIsOpen = Utils.isRegOpen(Settings);

            $scope.sponsors = [
                {
                    name: "Webcome Lyon ",
                    href: "https://webcomelyon.fr/",
                    logo: "/assets/images/logos/webcome.png",
                    show: true
                },
                {
                    name: "Epitech",
                    logo: "/assets/images/logos/epitech.png",
                    href: "http://lyon.epitech.eu/",
                    show: false
                },
                {
                    name: "ETIC INSA Technologies",
                    href: "http://www.etic-insa.com/",
                    logo: "/assets/images/logos/etic.png",
                    show: true
                }
            ];

            $scope.faqs = [
                {
                    q: "FAQ_Q_WHAT_HL",
                    a: "FAQ_A_WHAT_HL"
                }, {
                    q: "FAQ_Q_NASA",
                    a: "FAQ_A_NASA"
                }, {
                    q: "FAQ_Q_WHAT",
                    a: "FAQ_A_WHAT"
                }, {
                    q: "FAQ_Q_CODE_CONDUCT",
                    a: "FAQ_A_CODE_CONDUCT"
                }, {
                    q: "FAQ_Q_WHO",
                    a: "FAQ_A_WHO"
                }, {
                    q: "FAQ_Q_SLEEP",
                    a: "FAQ_A_SLEEP"
                }, {
                    q: "FAQ_Q_HOW_MUCH",
                    a: "FAQ_A_HOW_MUCH"
                }, {
                    q: "FAQ_Q_WHAT_BRING",
                    a: "FAQ_A_WHAT_BRING"
                }, {
                    q: "FAQ_Q_MAXSIZE_TEAM",
                    a: "FAQ_A_MAXSIZE_TEAM"
                }, {
                    q: "FAQ_Q_WHO_COPYRIGHT",
                    a: "FAQ_A_WHO_COPYRIGHT"
                }, {
                    q: "FAQ_Q_HOW_TEAM",
                    a: "FAQ_A_HOW_TEAM"
                }, {
                    q: "FAQ_Q_SCHEDULE",
                    a: "FAQ_A_SCHEDULE"
                }, {
                    q: "FAQ_Q_TRAVEL_REIMBURSEMENTS",
                    a: "FAQ_A_TRAVEL_REIMBURSEMENTS"
                }
            ];

            if (token) {
                AuthService.verify(token,
                    function (user) {
                        $scope.success = true;

                        $scope.loading = false;
                    },
                    function (err) {
                        $scope.loading = false;
                    });
            }

            $scope.$on('$viewContentLoaded', function () {
                $(".more-content > span > i").click(function() {
                    $('html, body').animate({
                        scrollTop: $("#info").offset().top
                    }, 700);
                });

                // map
                init();

                let width, height, largeHeader, canvas, ctx, points, target, animateHeader = true;

                // Main
                initHeader();
                initAnimation();
                addListeners();

                function initHeader() {
                    width = window.innerWidth;
                    height = window.innerHeight;
                    target = {x: width / 2, y: height / 2};

                    largeHeader = document.getElementsByClassName('hero-content')[0];
                    largeHeader.style.height = height + 'px';

                    canvas = document.getElementById('neural-back');
                    canvas.width = width;
                    canvas.height = height;
                    ctx = canvas.getContext('2d');

                    // create points
                    points = [];
                    for (var x = 0; x < width; x = x + width / 12) {
                        for (let y = 0; y < height; y = y + height / 12) {
                            let px = x + Math.random() * width / 12;
                            let py = y + Math.random() * height / 12;
                            let p = {x: px, originX: px, y: py, originY: py};
                            points.push(p);
                        }
                    }

                    // for each point find the 5 closest points
                    for (var i = 0; i < points.length; i++) {
                        let closest = [];
                        let p1 = points[i];
                        for (var j = 0; j < points.length; j++) {
                            let p2 = points[j];
                            if (!(p1 === p2)) {
                                let placed = false;
                                for (var k = 0; k < 5; k++) {
                                    if (!placed && closest[k] === undefined) {
                                        closest[k] = p2;
                                        placed = true;
                                    }
                                }

                                for (var k = 0; k < 5; k++) {
                                    if (!placed && getDistance(p1, p2) < getDistance(p1, closest[k])) {
                                        closest[k] = p2;
                                        placed = true;
                                    }
                                }
                            }
                        }
                        p1.closest = closest;
                    }

                    // assign a circle to each point
                    for (var i in points) {
                        let c = new Circle(points[i], 2 + Math.random() * 2, 'rgba(255,255,255,0.3)');
                        points[i].circle = c;
                    }
                }

                // Event handling
                function addListeners() {
                    if (!('ontouchstart' in window)) {
                        window.addEventListener('mousemove', mouseMove);
                    }
                    window.addEventListener('scroll', scrollCheck);
                    window.addEventListener('resize', resize);
                }

                function mouseMove(e) {
                    let posx = posy = 0;
                    if (e.pageX || e.pageY) {
                        posx = e.pageX;
                        posy = e.pageY;
                    }
                    else if (e.clientX || e.clientY) {
                        posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                        posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
                    }
                    target.x = posx;
                    target.y = posy;
                }

                function scrollCheck() {
                    if (document.body.scrollTop > height) animateHeader = false;
                    else animateHeader = true;
                }

                function resize() {
                    initHeader();
                    initAnimation();
                }

                // animation
                function initAnimation() {
                    animate();
                    for (var i in points) {
                        shiftPoint(points[i]);
                    }
                }

                function animate() {
                    if (animateHeader) {
                        ctx.clearRect(0, 0, width, height);
                        for (let i in points) {
                            // detect points in range
                            if (Math.abs(getDistance(target, points[i])) < 40000) {
                                points[i].active = 0.5;
                                points[i].circle.active = 0.8;
                            }
                            else if (Math.abs(getDistance(target, points[i])) < 60000) {
                                points[i].active = 0.4;
                                points[i].circle.active = 0.6;
                            } else if (Math.abs(getDistance(target, points[i])) < 140000) {
                                points[i].active = 0.1;
                                points[i].circle.active = 0.3;
                            } else {
                                points[i].active = 0;
                                points[i].circle.active = 0;
                            }

                            drawLines(points[i]);
                            points[i].circle.draw();
                        }
                    }
                    requestAnimationFrame(animate);
                }

                function shiftPoint(p) {
                    TweenLite.to(p, 1 + 1 * Math.random(), {
                        x: p.originX - 50 + Math.random() * 100,
                        y: p.originY - 50 + Math.random() * 100, ease: Circ.easeInOut,
                        onComplete: function () {
                            shiftPoint(p);
                        }
                    });
                }

                // Canvas manipulation
                function drawLines(p) {
                    if (!p.active) return;
                    for (var i in p.closest) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p.closest[i].x, p.closest[i].y);
                        ctx.strokeStyle = 'rgba(235,235,235,' + p.active + ')';
                        ctx.stroke();
                    }
                }

                function Circle(pos, rad, color) {
                    var _this = this;

                    // constructor
                    (function () {
                        _this.pos = pos || null;
                        _this.radius = rad || null;
                        _this.color = color || null;
                    })();

                    this.draw = function () {
                        if (!_this.active) return;
                        ctx.beginPath();
                        ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
                        ctx.fillStyle = 'rgba(235,235,235,' + _this.active + ')';
                        ctx.fill();
                    };
                }

                // Util
                function getDistance(p1, p2) {
                    return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
                }
            });

        }]);
