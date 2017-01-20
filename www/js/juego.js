var app = {
    inicio: function () {
        DIAMETRO_BOLA = 50;
        MAX_AGITACION = 15;

        TARGET1_POINTS = 1;
        TARGET2_POINTS = 10;

        NORMAL_BG_COLOR = '#f27d0c';
        COLLIDE_BG_COLOR = '#400909';

        dificultad = 0;
        velocidadX = 0;
        velocidadY = 0;
        puntuacion = 0;
        isCollideWorld = 0;

        alto  = document.documentElement.clientHeight;
        ancho = document.documentElement.clientWidth;

        app.vigilaSensores();
        app.iniciaJuego();
    },
    iniciaJuego: function () {
        function preload () {
            game.physics.startSystem(Phaser.Physics.ARCADE);

            game.stage.backgroundColor = NORMAL_BG_COLOR;
            game.load.image('bola', 'assets/bola.png');
            game.load.image('objetivo1', 'assets/objetivo1.png');
            game.load.image('objetivo2', 'assets/objetivo2.png');
        }

        function create () {
            scoreText = game.add.text(16, 16, puntuacion, { fontSize: '32px', fill: '#757676' });
            objetivo1 = game.add.sprite(app.inicioX(), app.inicioY(), 'objetivo1');
            objetivo2 = game.add.sprite(app.inicioX(), app.inicioY(), 'objetivo2');
            bola = game.add.sprite(app.inicioX(), app.inicioY(), 'bola');

            objetivo1.data.points = TARGET1_POINTS;
            objetivo2.data.points = TARGET2_POINTS;

            game.physics.arcade.enable(bola);
            game.physics.arcade.enable(objetivo1);
            game.physics.arcade.enable(objetivo2);

            bola.body.collideWorldBounds = true;
            bola.body.onWorldBounds = new Phaser.Signal();
            bola.body.onWorldBounds.add(app.onWorldBounds, this);
        }

        function update () {
            app.setStageBackground();
            factorDificultad = (300 + (dificultad * 100));
            bola.body.velocity.x = (velocidadX * (-1 * factorDificultad));
            bola.body.velocity.y = (velocidadY * factorDificultad);

            game.physics.arcade.overlap(bola, objetivo1, app.incrementaPuntuacion, null, this);
            game.physics.arcade.overlap(bola, objetivo2, app.incrementaPuntuacion, null, this);
        }

        var estados = { preload: preload, create: create, update: update };
        game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phazer', estados);
    },
    onWorldBounds: function () {
        isCollideWorld = true;
        app.decrementaPuntuacion();
    },
    decrementaPuntuacion: function () {
        game.stage.backgroundColor = COLLIDE_BG_COLOR;
        puntuacion = puntuacion - 1;
        scoreText.text = puntuacion;
    },
    incrementaPuntuacion: function (ball, target) {
        puntuacion = puntuacion + target.data.points;
        scoreText.text = puntuacion;

        target.body.x = app.inicioX();
        target.body.y = app.inicioY();

        if (puntuacion > 0) {
            dificultad = dificultad + 1;
        }
    },
    setStageBackground: function () {
        if (isCollideWorld) {
            game.stage.backgroundColor = COLLIDE_BG_COLOR;
            isCollideWorld = false;
        } else {
            game.stage.backgroundColor = NORMAL_BG_COLOR;
        }
    },
    inicioX: function () {
        return app.numeroAleatorioHasta(ancho - DIAMETRO_BOLA);
    },
    inicioY: function () {
        return app.numeroAleatorioHasta(alto - DIAMETRO_BOLA);
    },
    numeroAleatorioHasta: function (limite) {
        return Math.floor(Math.random() * limite);
    },
    vigilaSensores: function () {

        function onError() {
            console.log('onError!');
        }

        function onSuccess(datosAceleracion) {
            app.detectaAgitacion(datosAceleracion);
            app.registraDirecciones(datosAceleracion);
        }

        navigator.accelerometer.watchAcceleration(onSuccess, onError, { frequency: 100 });
    },
    detectaAgitacion: function (datosAceleracion) {
        var agitacionX = Math.abs(datosAceleracion.x) > MAX_AGITACION;
        var agitacionY = Math.abs(datosAceleracion.y) > MAX_AGITACION;

        if (agitacionX || agitacionY) {
            setTimeout(app.recomienza, 1000);
        }
    },
    recomienza: function () {
        document.location.reload(true);
    },
    registraDirecciones: function (datosAceleracion) {
        velocidadX = datosAceleracion.x;
        velocidadY = datosAceleracion.y;
    }
};

if ('addEventListener' in document) {
    document.addEventListener('deviceready', function () {
        app.inicio();
    }, false);
}