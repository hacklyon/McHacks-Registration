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
                    name: "Webcome Lyon",
                    href: "https://webcomelyon.fr/events/hacker-les-transports/",
                    logo: "/assets/images/logos/webcome.png",
                    show: true
                },
                {
                    name: "IBM",
                    logo: "/assets/images/logos/ibmpos_blurgb.jpg?v=new",
                    href: "https://ibm.com/",
                    show: true
                },
                {
                    name: "Major League Hacking",
                    href: "https://mlh.io/",
                    logo: "/assets/images/logos/mlh.png",
                    show: true
                },
                {
                    name: "Epitech Lyon",
                    logo: "/assets/images/logos/epitech.png",
                    href: "http://lyon.epitech.eu/",
                    show: true
                },
                {
                    name: "ETIC INSA Technologies",
                    href: "http://www.etic-insa.com/",
                    logo: "/assets/images/logos/etic.png",
                    show: false
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
                $(".more-content > span > i").click(function () {
                    $('html, body').animate({
                        scrollTop: $("#info").offset().top
                    }, 700);
                });

                $("#faq-show-more-btn").click(function () {
                    $("#faq-content").toggleClass("expanded");
                    $(".faq-show-more").toggle();
                });

                let element = $('.chatbot');
                let myStorage = localStorage;

                if (!myStorage.getItem('chatID')) {
                    myStorage.setItem('chatID', "AlphaBot");
                }

                setTimeout(function () {
                    element.addClass('enter');
                }, 1000);

                element.click(openElement);

                function openElement() {
                    var messages = element.find('.messages');
                    var textInput = element.find('.text-box');
                    $('.chatbot-logo').hide();
                    element.find('>i').hide();
                    element.addClass('expand');
                    element.find('.chat').addClass('enter');
                    var strLength = textInput.val().length * 2;
                    textInput.keydown(onMetaAndEnter).prop("disabled", false);
                    element.off('click', openElement);
                    element.find('.header button').click(closeElement);
                    element.find('#sendMessage').click(sendNewMessage);
                    messages.scrollTop(messages.prop("scrollHeight"));
                }

                function closeElement() {
                    element.find('.chat').removeClass('enter').hide();
                    element.find('>i').show();
                    element.removeClass('expand');
                    element.find('.header button').off('click', closeElement);
                    element.find('#sendMessage').off('click', sendNewMessage);
                    element.find('.text-box').off('keydown', onMetaAndEnter).prop("disabled", true).blur();
                    $('.chatbot-logo').show();
                    setTimeout(function () {
                        element.find('.chat').removeClass('enter').show()
                        element.click(openElement);
                    }, 500);
                }

                sendNewMessage = function sendNewMessage() {
                    var userInput = $('.text-box');
                    var newMessage = userInput.html().replace(/\<div\>|\<br.*?\>/ig, '\n').replace(/\<\/div\>/g, '').trim().replace(/\n/g, '<br>');

                    if (!newMessage) return;

                    var messagesContainer = $('.messages');

                    messagesContainer.append([
                        '<li class="self">',
                        newMessage,
                        '</li>'
                    ].join(''));

                    // clean out old message
                    userInput.html('');
                    // focus on input
                    userInput.focus();

                    messagesContainer.finish().animate({
                        scrollTop: messagesContainer.prop("scrollHeight")
                    }, 250);

                    var _0x5666 = ["\x68\x74\x74\x70\x73\x3A\x2F\x2F\x6F\x70\x65\x6E\x77\x68\x69\x73\x6B\x2E\x65\x75\x2D\x64\x65\x2E\x62\x6C\x75\x65\x6D\x69\x78\x2E\x6E\x65\x74\x2F\x61\x70\x69\x2F\x76\x31\x2F\x77\x65\x62\x2F\x48\x61\x63\x6B\x4C\x79\x6F\x6E\x5F\x61\x6C\x70\x68\x61\x2F\x73\x6C\x61\x63\x6B\x61\x70\x70\x2F\x63\x6F\x6E\x76\x65\x72\x73\x65", "\x68\x61\x63\x6B\x6C\x79\x6F\x6E\x5F\x61\x6C\x70\x68\x61", "\x62\x79\x5F\x69\x64", "\x63\x68\x61\x74\x49\x44", "\x67\x65\x74\x49\x74\x65\x6D", "\x72\x65\x73\x70\x6F\x6E\x73\x65", "", "\x6A\x6F\x69\x6E", "\x3C\x6C\x69\x20\x63\x6C\x61\x73\x73\x3D\x22\x6F\x74\x68\x65\x72\x22\x3E", "\x3C\x2F\x6C\x69\x3E", "\x61\x70\x70\x65\x6E\x64", "\x66\x6F\x72\x45\x61\x63\x68", "\x75\x73\x65\x72\x5F\x69\x64", "\x73\x65\x74\x49\x74\x65\x6D", "\x73\x63\x72\x6F\x6C\x6C\x48\x65\x69\x67\x68\x74", "\x70\x72\x6F\x70", "\x61\x6E\x69\x6D\x61\x74\x65", "\x66\x69\x6E\x69\x73\x68", "\x6A\x73\x6F\x6E", "\x70\x6F\x73\x74"];
                    return $[_0x5666[19]](_0x5666[0], {
                        cftoken: _0x5666[1],
                        filter: _0x5666[2],
                        value: myStorage[_0x5666[4]](_0x5666[3]),
                        context: {},
                        text: newMessage
                    }, function (_0xfb3dx1) {
                        if (_0xfb3dx1[_0x5666[5]]) {
                            _0xfb3dx1[_0x5666[5]][_0x5666[11]]((_0xfb3dx2) => {
                                messagesContainer[_0x5666[10]]([_0x5666[8], _0xfb3dx2, _0x5666[9]][_0x5666[7]](_0x5666[6]))
                            })
                        }
                        ;
                        if (_0xfb3dx1[_0x5666[12]]) {
                            myStorage[_0x5666[13]](_0x5666[3], _0xfb3dx1[_0x5666[12]])
                        }
                        ;messagesContainer[_0x5666[17]]()[_0x5666[16]]({scrollTop: messagesContainer[_0x5666[15]](_0x5666[14])}, 250);
                        return false
                    }, _0x5666[18])
                };


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
