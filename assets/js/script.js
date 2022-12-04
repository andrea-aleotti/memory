// array con le immagini
const images = [
    "1.jpg", "2.jpg", "3.jpg", "4.jpg",
    "1.jpg", "2.jpg", "3.jpg", "4.jpg"
];
const cardsFlipped = [];    // array carte girate
const cardsFound = [];  // array carte trovate
let score = 0;  // punteggio

$(document).ready(function () {
    /**
     * registriamo l'utente
     */
    $("#signup").on("click", () => {
        let userName = $("#user").val();
        $.ajax({
            type: "post",
            dataType: "json",
            url: "assets/includes/insert_user.inc.php",
            data: {
                userName: userName
            },
            success: function (data) {
                if(data !== -1) {
                    $("#error").addClass("d-none");
                    $("#classifica").append(data);
                } else {
                    $("#error").removeClass("d-none");
                    $("#error").html("<p><em>Mi spiace, questo user è già stato preso</em></p>");
                }
            }
        });
    })

    $("#play").on("click", () => {
        createBoard();// funzione che crea la tavola di gioco
        /**
         * ogni volta che clicco 'play' voglio vedere la classifica aggiornata,
         * quindi faccio un AJAX che rifà esattamente la stessa chiamata seguita nell'index.php,
         * ma alla fine di una giocata ci saranno i dati aggiornati
         */
        showClassifica("assets/includes/show_classifica.inc.php");
    });   
});

function showClassifica(URL_add) {
    $.ajax({
        type: "post",
        dataType: "json",
        url: URL_add,
        beforeSend: () => {
            $("#classifica").empty();
        },
        success: (data) => {
            data.forEach((user) => {
               $("#classifica").append(user); 
            });
        }
    });
}

function createBoard() {
    $("#board").empty();  // come prima cosa ripulisco le rows
    $("#score").empty(); // e resetto il punteggio
    score = 0;

    /**
     * Randomizzo le carte nell'array e poi creo la struttura a griglia
     * delle carte.
     */
    shuffleCards();
    for (let i = 0; i < images.length; i++) {
        let col = '<div class="col-sm-3">';
        col += '<div class="flip-card animation">';
        col += '<div class="flip-card-inner">';
        col += '<div class="flip-card-front">';
        col += '<img src="https://www.w3schools.com/howto/img_avatar.png" alt="Avatar">';
        col += '</div>';
        col += '<div class="flip-card-back">';
        col += '<img src="assets/images/' + images[i] + '" alt="img "' + i + '>'
        col += '</div></div></div</div>';
        $("#board").append(col);
    }
    // giro le carte
    flipCard();
}

// Randomizer 
function shuffleCards() {
    for (let i = images.length - 1; i > 0; i--) {
        let rand = Math.floor(Math.random() * (i + 1));
        let temp = images[i];
        images[i] = images[rand];
        images[rand] = temp;
    }
}

function flipCard() {
    $(".flip-card").on("click", function () {
        // al click su ogni carta aggiungo la classe per girarle
        $(this).addClass("flipped");
        $(this).find(".flip-card-back").addClass("show");
        // recupero l'src dell'immagine sul retro e l'aggiungo all'array delle carte girate
        let src = $(this).find(".flip-card-back img").attr("src");
        cardsFlipped.push(src);
        // se sono a due carte girate controllo se sono uguali tramite il src
        if (cardsFlipped.length === 2) {
            if (checkMatch(cardsFlipped)) {
                // se lo sono, pusho i loro src nell'array delle carte trovate
                cardsFound.push($(this).find(".flip-card-back img").attr("src"));
                // e aumento il punteggio
                score += 25;
                $("#score").text(score);
            } else {
                // altrimenti faccio vedere la carta per 0,5s e rimuovo le classi per rigirarle
                setTimeout(function () {
                    $(".flip-card").each(function (index, card) {
                        // questo if serve a conrollare di girare solo le carte i cui src non siano presenti nell'array delle trovate
                        if (jQuery.inArray($(card).find(".flip-card-back img").attr("src"), cardsFound) === -1) {
                            $(this).removeClass("flipped");
                            $(this).find(".flip-card-back").removeClass("show");
                        }
                    });
                    if (score > 0) {
                        score -= 15;
                        $("#score").text(score);
                    }
                }, 500);
            }
            cardsFlipped.length = 0;    // dopo le verifiche rresetto l'array delle carte girate
            // infine, controllo di non aver finito il gioco e nel caso lancio un alert
            if (cardsFound.length === images.length / 2) {
                /**
                 * una volta finito il gioco aggiorno il punteggio dell'utente
                 */
                let finalScore = $("#score").html();
                $.ajax({
                    type: "post",
                    dataType: "json",
                    url: "assets/includes/update_classifica.inc.php",
                    data: {
                        finalScore: finalScore
                    }
                });
                setTimeout(() => {
                    alert("hai vinto!");
                }, 500);
                /**
                 * resetto anche l'array delle carte trovate per non avere problemi quando
                 * l'utente riclicca per giocare sul pulsante, altrimenti le carte non si
                 * girerebbero, perchè questo array è pieno e per il codice sono tutte già
                 * trovate.
                 */
                cardsFound.length = 0;
            }
        }
    });
}

// confronto gli src delle due immagine: true sono uguali, altrimenti false
function checkMatch(imgArray) {
    if (imgArray[0] === imgArray[1]) {
        return true;
    } else {
        return false;
    }
}