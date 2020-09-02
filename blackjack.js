//Create the variables we're going to need

class Player
{
    constructor(name, myTurn)
    {
        this.name = name;
        this.myTurn = myTurn;
        this.hand = [];
        name = document.createElement('a');
        name.innerHTML = this.name + '\'s hand &nbsp;';
        document.body.appendChild(name);
        this.handElement = document.createElement('div');
        this.handElement.id = this.name + '\'s-hand';
        this.handElement.style.display = 'flex';
        this.handElement.style.padding = '5px';
        this.handElement.style.justifyContent = 'center';
        this.handElement.style.alignContent = 'space-around';
        this.handElement.style.flexWrap = 'wrap';
        document.body.appendChild(this.handElement);
        this.staying = false;
        this.busted = false;
    }
    addCard(card)
    {
        this.hand.push(card);
        this.addImage();
        this.bust();
    }
    addImage()
    {
        if(this.name !== players[0].name)
        {
            let redCard = document.createElement('img');
            redCard.src = 'card-images/red_back.png';
            redCard.height = 200;
            redCard.width = 200;
            this.handElement.appendChild(redCard);
            return;
        }
        this.handElement.appendChild(this.hand[this.hand.length-1].img);
    }
    checkValue()
    {
        let value = 0;
        for(let i = 0; i < this.hand.length; ++i)
        {
            switch(this.hand[i].rank)
            {
                case 'Jack': value+=10; break;
                case 'Queen': value+=10; break;
                case 'King': value+=10; break;
                case 'Ace':
                {
                    if(value <= 10)
                    {
                        value+=11;
                    }
                    else
                    {
                        ++value;
                    }
                    break;
                }
                default: value+=parseInt(this.hand[i].rank, 10);
            }
        }
        return value;
    }
    bust()
    {
        if(this.checkValue() > 21)
        {
            this.busted = true;
            this.staying = true;
            compareScores();
        }
    }
}
players = [];
deck = [];
startGame();
//does the game setup
function startGame()
{
    makeDeck();
    makePlayers();
    deal();
    buttonFunction();
}
//to be updated in a future version

function makePlayers()
{
    players[0] = new Player('Player', true);
    players[1] = new Player('Computer', false);
}
//Creates the deck then shuffles it
function makeDeck()
{
    let suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    let ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];
    for(let i = 0; i < suits.length; i++)
    {
        for(let j = 0; j < ranks.length; j++)
        {
            const card =
                {
                    rank : ranks[j],
                    suit : suits[i],
                    img : makeImage(ranks[j], suits[i])
                };
            deck.push(card);
        }
    }
    shuffle();
}
function makeImage(rank, suit)
{
    let img = document.createElement('img');
    if(rank === '10')
    {
        img.src = 'card-images/'+rank+suit.charAt(0)+'.png';
    }
    else
    {
        img.src = 'card-images/'+rank.charAt(0)+suit.charAt(0)+'.png';
    }
    img.height = 200;
    img.width = 200;
    return img;
}
function shuffle()
{
    for(let j = 0; j < 10; j++)
    {
        for(let i = 0; i < deck.length; i++)
        {
            let ri = Math.floor(Math.random()*deck.length);
            let temp = deck[i];
            deck[i] = deck[ri];
            deck[ri] = temp;
        }
    }
    //where two or more are gathered the holy spirit is present
}
//Deals out the cards
function deal()
{
    for(let i = 0; i < players.length; ++i)
    {
        for(let j = 0; j < 2; ++j)
        {
            draw(players[i].name);
        }
    }
}
function draw(who)
{
    for(let i = 0; i < players.length; ++i)
    {
        if(players[i].name === who)
        {
            players[i].addCard(deck.pop());
        }
    }
}
function compareScores()
{
    if(players[0].busted)
    {
        ending(players[1].name);
    }
    else if(players[1].busted)
    {
        ending(players[0].name);
    }
    else
    {
        let winner = players[0];
        for(let i = 0; i < players.length; ++i)
        {
            if(players[i].checkValue() > winner.checkValue())
            {
                winner = players[i];
            }
        }
        ending(winner.name);
    }
}
function ending(winner)
{
    let ending = document.getElementById('ending');
    ending.innerText = winner + " wins";
    displayCpuHand();
}
function displayCpuHand()
{
    for(let i = 0; i < players[1].hand.length; ++i)
    {
        players[1].handElement.replaceChild(players[1].hand[i].img, players[1].handElement.childNodes[i]);
    }
}
function ai()
{
    while(players[1].checkValue() < 17)
    {
        draw(players[1].name);
        if(players[0].staying === false)
        {
            players[0].myTurn = true;
            return;
        }
    }
    if(players[1].checkValue() >= 17)
    {
        players[1].staying = true;
        if(players[0].staying)
        {
            compareScores();
        }
        else
        {
            players[0].myTurn = true;
        }
    }
}
function buttonFunction()
{
    let buttons = document.createElement('div');
    buttons.className = 'buttons';
    let hitElement = document.createElement('button');
    hitElement.className = 'buttons';
    hitElement.innerText = 'hit';
    hitElement.style.height = '50px';
    hitElement.style.width = '50px';
    hitElement.style.padding = '10px';
    let stayElement = document.createElement('button');
    stayElement.innerText = 'stay';
    stayElement.style.height = '50px';
    stayElement.style.width = '50px';
    stayElement.style.padding = '10px';
    /*let againElement = document.createElement('button');
    againElement.innerText = 'play again?';*/
    buttons.append(hitElement, stayElement);
    document.body.appendChild(buttons);
    hitElement.addEventListener('click', () =>
    {
        if(!players[0].staying && players[0].myTurn)
        {
            draw(players[0].name);
            players[0].myTurn = false;
            ai();
        }
    });
    stayElement.addEventListener('click', () =>
    {
        players[0].staying = true;
        players[0].myTurn = false;
        ai();
    });
    /*againElement.addEventListener('click', () =>
    {
        startGame();
    });*/
}