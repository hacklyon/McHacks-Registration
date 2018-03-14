angular.module('reg')
    .controller('HomeCtrl', [
        '$scope',
        '$stateParams',
        'AuthService',
        'settings',
        'Utils',
        function ($scope, $stateParams, AuthService, settings, Utils) {
            let token = $stateParams.token;

            $scope.loading = true;
            // Is registration open?
            let Settings = settings.data;
            $scope.regIsOpen = Utils.isRegOpen(Settings);

            $scope.sponsors = [
                {
                    name: "Epitech",
                    logo: "data:image/png;base64,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",
                    href: "http://lyon.epitech.eu/"
                }
            ];

            $scope.faqs = [
                {
                    q: "What is Alpha?",
                    a: "Alpha is a student run hackathon held at The Web Tour, Lyon."
                }, {
                    q: "Will there be any travel reimbursements?",
                    a: "We are unable to provide this information at the moment."
                }, {
                    q: "What is a hackathon?",
                    a: "A hackathon is an event in which computer programmers and others in the field of software development, like graphic designers, interface designers and project managers collaborate intensively on software-related projects."
                }, {
                    q: "Code of Conduct?",
                    a: "It will be available soon."
                }, {
                    q: "Who can apply?",
                    a: "If you are a student and over 18 you are welcome to Alpha! If you graduated less than a year ago, you are very welcome to!"
                }, {
                    q: "What about sleep?",
                    a: "Classrooms will be available to get a nap. Don't forget to bring a sleeping bag and a pillow."
                }, {
                    q: "How much does it cost to attend?",
                    a: "Zero. Cero. Zéro. Null."
                }, {
                    q: "What do I need to bring?",
                    a: "We put food, power and wifi. You just need to bring a laptop and a charger."
                }, {
                    q: "What is the maximum size of a team?",
                    a: "Teams can be up to 5 students. If you don't have a team, we will help you to find one at the beginning of the event."
                }, {
                    q: "Who owns the intellectual property of hacks?",
                    a: "All the hacks belong to hackers."
                }, {
                    q: "How can I form my team?",
                    a: "Teams can be pre-made or done at the beginning of the event. We will help you find one if need be."
                }, {
                    q: "What about the schedule?",
                    a: "We will make it available closer to the event."
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
                // map
                init();

                // https://codepen.io/Kyzer/pen/XKKQpq
                let c = document.getElementById("neural-back");
                let w = (c.width = window.innerWidth),
                    h = (c.height = window.innerHeight),
                    ctx = c.getContext("2d"),
                    opts = {
                        range: 260,
                        baseConnections: 9,
                        addedConnections: 4,
                        baseSize: 5,
                        minSize: 1,
                        dataToConnectionSize: 0.4,
                        sizeMultiplier: 0.8,
                        allowedDist: 40,
                        baseDist: 40,
                        addedDist: 30,
                        connectionAttempts: 10,

                        dataToConnections: 10,
                        baseSpeed: 0.04,
                        addedSpeed: 0.05,
                        baseGlowSpeed: 0.1,
                        addedGlowSpeed: 0.5,

                        rotVelX: 0.003,
                        rotVelY: 0.002,

                        repaintColor: "#111",
                        connectionColor: "hsla(100,30%,light%,alp)",
                        rootColor: "hsla(0,80%,light%,alp)",
                        endColor: "hsla(200,30%,light%,alp)",
                        dataColor: "hsla(40,90%,light%,alp)",

                        wireframeWidth: 0.1,
                        wireframeColor: "#88f",

                        depth: 250,
                        focalLength: 250,
                        vanishPoint: {
                            x: w / 2,
                            y: h / 2
                        }
                    },
                    squareRange = opts.range * opts.range,
                    squareAllowed = opts.allowedDist * opts.allowedDist,
                    mostDistant = opts.depth + opts.range,
                    sinX = (sinY = 0),
                    cosX = (cosY = 0),
                    connections = [],
                    toDevelop = [],
                    data = [],
                    all = [],
                    tick = 0,
                    totalProb = 0,
                    animating = false,
                    Tau = Math.PI * 2;

                ctx.fillStyle = "#777";
                ctx.fillRect(0, 0, w, h);
                ctx.fillStyle = "#ccc";
                ctx.font = "50px Verdana";
                ctx.fillText(
                    "Loading...",
                    w / 2 - ctx.measureText("Loading...").width / 2,
                    h / 2 - 15
                );

                window.setTimeout(init_neural, 4); // to render the loading screen

                function init_neural() {
                    connections.length = 0;
                    data.length = 0;
                    all.length = 0;
                    toDevelop.length = 0;

                    let connection = new Connection(0, 0, 0, opts.baseSize);
                    connection.step = Connection.rootStep;
                    connections.push(connection);
                    all.push(connection);
                    connection.link();

                    while (toDevelop.length > 0) {
                        toDevelop[0].link();
                        toDevelop.shift();
                    }

                    if (!animating) {
                        animating = true;
                        anim();
                    }
                    opts.rotVelX = 100 / 99000;
                    opts.rotVelY = 100 / 99000;
                }
                function Connection(x, y, z, size) {
                    this.x = x;
                    this.y = y;
                    this.z = z;
                    this.size = size;

                    this.screen = {};

                    this.links = [];
                    this.probabilities = [];
                    this.isEnd = false;

                    this.glowSpeed = opts.baseGlowSpeed + opts.addedGlowSpeed * Math.random();
                }
                Connection.prototype.link = function() {
                    if (this.size < opts.minSize) return (this.isEnd = true);

                    let links = [],
                        connectionsNum =
                            (opts.baseConnections + Math.random() * opts.addedConnections) | 0,
                        attempt = opts.connectionAttempts,
                        alpha,
                        beta,
                        len,
                        cosA,
                        sinA,
                        cosB,
                        sinB,
                        pos = {},
                        passedExisting,
                        passedBuffered;

                    while (links.length < connectionsNum && --attempt > 0) {
                        alpha = Math.random() * Math.PI;
                        beta = Math.random() * Tau;
                        len = opts.baseDist + opts.addedDist * Math.random();

                        cosA = Math.cos(alpha);
                        sinA = Math.sin(alpha);
                        cosB = Math.cos(beta);
                        sinB = Math.sin(beta);

                        pos.x = this.x + len * cosA * sinB;
                        pos.y = this.y + len * sinA * sinB;
                        pos.z = this.z + len * cosB;

                        if (pos.x * pos.x + pos.y * pos.y + pos.z * pos.z < squareRange) {
                            passedExisting = true;
                            passedBuffered = true;
                            for (var i = 0; i < connections.length; ++i)
                                if (squareDist(pos, connections[i]) < squareAllowed) passedExisting = false;

                            if (passedExisting)
                                for (var i = 0; i < links.length; ++i)
                                    if (squareDist(pos, links[i]) < squareAllowed) passedBuffered = false;

                            if (passedExisting && passedBuffered)
                                links.push({ x: pos.x, y: pos.y, z: pos.z });
                        }
                    }

                    if (links.length === 0) this.isEnd = true;
                    else {
                        for (let i = 0; i < links.length; ++i) {
                            let posi = links[i],
                                connection = new Connection(
                                    posi.x,
                                    posi.y,
                                    posi.z,
                                    this.size * opts.sizeMultiplier
                                );

                            this.links[i] = connection;
                            all.push(connection);
                            connections.push(connection);
                        }
                        for (let i = 0; i < this.links.length; ++i) toDevelop.push(this.links[i]);
                    }
                };
                Connection.prototype.step = function() {
                    this.setScreen();
                    this.screen.color = (this.isEnd ? opts.endColor : opts.connectionColor)
                        .replace("light", 30 + (tick * this.glowSpeed) % 30)
                        .replace("alp", 0.2 + (1 - this.screen.z / mostDistant) * 0.8);

                    for (let i = 0; i < this.links.length; ++i) {
                        ctx.moveTo(this.screen.x, this.screen.y);
                        ctx.lineTo(this.links[i].screen.x, this.links[i].screen.y);
                    }
                };
                Connection.rootStep = function() {
                    this.setScreen();
                    this.screen.color = opts.rootColor
                        .replace("light", 30 + (tick * this.glowSpeed) % 30)
                        .replace("alp", (1 - this.screen.z / mostDistant) * 0.8);

                    for (let i = 0; i < this.links.length; ++i) {
                        ctx.moveTo(this.screen.x, this.screen.y);
                        ctx.lineTo(this.links[i].screen.x, this.links[i].screen.y);
                    }
                };
                Connection.prototype.draw = function() {
                    ctx.fillStyle = this.screen.color;
                    ctx.beginPath();
                    ctx.arc(this.screen.x, this.screen.y, Math.abs(this.screen.scale * this.size), 0, Tau);
                    ctx.fill();
                };
                function Data(connection) {
                    this.glowSpeed = opts.baseGlowSpeed + opts.addedGlowSpeed * Math.random();
                    this.speed = opts.baseSpeed + opts.addedSpeed * Math.random();

                    this.screen = {};

                    this.setConnection(connection);
                }
                Data.prototype.reset = function() {
                    this.setConnection(connections[0]);
                    this.ended = 2;
                };
                Data.prototype.step = function() {
                    this.proportion += this.speed;

                    if (this.proportion < 1) {
                        this.x = this.ox + this.dx * this.proportion;
                        this.y = this.oy + this.dy * this.proportion;
                        this.z = this.oz + this.dz * this.proportion;
                        this.size = (this.os + this.ds * this.proportion) * opts.dataToConnectionSize;
                    } else this.setConnection(this.nextConnection);

                    this.screen.lastX = this.screen.x;
                    this.screen.lastY = this.screen.y;
                    this.setScreen();
                    this.screen.color = opts.dataColor
                        .replace("light", 40 + (tick * this.glowSpeed) % 50)
                        .replace("alp", 0.2 + (1 - this.screen.z / mostDistant) * 0.6);
                };
                Data.prototype.draw = function() {
                    if (this.ended) return --this.ended; // not sre why the thing lasts 2 frames, but it does

                    ctx.beginPath();
                    ctx.strokeStyle = this.screen.color;
                    ctx.lineWidth = this.size * this.screen.scale;
                    ctx.moveTo(this.screen.lastX, this.screen.lastY);
                    ctx.lineTo(this.screen.x, this.screen.y);
                    ctx.stroke();
                };
                Data.prototype.setConnection = function(connection) {
                    if (connection.isEnd) this.reset();
                    else {
                        this.connection = connection;
                        this.nextConnection =
                            connection.links[(connection.links.length * Math.random()) | 0];

                        this.ox = connection.x; // original coordinates
                        this.oy = connection.y;
                        this.oz = connection.z;
                        this.os = connection.size; // base size

                        this.nx = this.nextConnection.x; // new
                        this.ny = this.nextConnection.y;
                        this.nz = this.nextConnection.z;
                        this.ns = this.nextConnection.size;

                        this.dx = this.nx - this.ox; // delta
                        this.dy = this.ny - this.oy;
                        this.dz = this.nz - this.oz;
                        this.ds = this.ns - this.os;

                        this.proportion = 0;
                    }
                };
                Connection.prototype.setScreen = Data.prototype.setScreen = function() {
                    let x = this.x,
                        y = this.y,
                        z = this.z;

                    // apply rotation on X axis
                    let Y = y;
                    y = y * cosX - z * sinX;
                    z = z * cosX + Y * sinX;

                    // rot on Y
                    let Z = z;
                    z = z * cosY - x * sinY;
                    x = x * cosY + Z * sinY;

                    this.screen.z = z;

                    // translate on Z
                    z += opts.depth;

                    this.screen.scale = opts.focalLength / z;
                    this.screen.x = opts.vanishPoint.x + x * this.screen.scale;
                    this.screen.y = opts.vanishPoint.y + y * this.screen.scale;
                };
                function squareDist(a, b) {
                    let x = b.x - a.x,
                        y = b.y - a.y,
                        z = b.z - a.z;

                    return x * x + y * y + z * z;
                }

                function anim() {
                    window.requestAnimationFrame(anim);

                    ctx.globalCompositeOperation = "source-over";
                    ctx.fillStyle = opts.repaintColor;
                    ctx.fillRect(0, 0, w, h);

                    ++tick;

                    let rotX = tick * opts.rotVelX,
                        rotY = tick * opts.rotVelY;

                    cosX = Math.cos(rotX);
                    sinX = Math.sin(rotX);
                    cosY = Math.cos(rotY);
                    sinY = Math.sin(rotY);

                    if (data.length < connections.length * opts.dataToConnections && data.length < 500) {
                        let datum = new Data(connections[0]);
                        data.push(datum);
                        all.push(datum);
                    }

                    ctx.globalCompositeOperation = "lighter";
                    ctx.beginPath();
                    ctx.lineWidth = opts.wireframeWidth;
                    ctx.strokeStyle = opts.wireframeColor;
                    all.map(function(item) {
                        item.step();
                    });
                    ctx.stroke();
                    ctx.globalCompositeOperation = "source-over";
                    all.sort(function(a, b) {
                        return b.screen.z - a.screen.z;
                    });
                    all.map(function(item) {
                        item.draw();
                    });

                    /*ctx.beginPath();
                    ctx.strokeStyle = 'red';
                    ctx.arc( opts.vanishPoint.x, opts.vanishPoint.y, opts.range * opts.focalLength / opts.depth, 0, Tau );
                    ctx.stroke();*/
                }

                window.addEventListener("resize", function() {
                    opts.vanishPoint.x = (w = c.width = window.innerWidth) / 2;
                    opts.vanishPoint.y = (h = c.height = window.innerHeight) / 2;
                    ctx.fillRect(0, 0, w, h);
                });

                window.addEventListener("click", init_neural);
            });

        }]);