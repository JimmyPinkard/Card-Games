//Create the variables we're going to need
players = [];
deck = [];
playerHand = [];
dealerHand = [];
whoseTurn = 'player';
playerStay = false;
cpuStay = false;
playerBust = false;
cpuBust = false;
playerTurn = true;
playerIndex = 0;
cpuIndex = 0;
hand = document.getElementById('hand');
dHand = document.getElementById('dealer-hand');
hitElement = document.getElementById('Hit');
stayElement = document.getElementById('Stay');
startGame();
//does the game setup
function startGame()
{
    makePlayers();
    makeDeck();
    deal();
    buttonFunction();
}
//to be updated in a future version

function makePlayers()
{
    let hand = document.createElement('img');
    hand.id = 'hand1';
    let hand2 = document.createElement('img');
    hand2.id = 'hand2';
    players[0] = makePlayer('player', true, [], 0, false, false, hand);
    players[1] = makePlayer('computer', false, [], 0, false, false, hand2);
}
//create a player object
function makePlayer(name, myTurn, hand, handSize, stay, bust, element)
{
    return {
        name: name,
        myTurn: myTurn,
        hand: hand,
        handSize: handSize,
        stay: false,
        element: element
    };
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
            let card =
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
    if(who === "player")
    {
        playerHand[playerIndex] = deck.pop();
        addImage(who);
    }
    else
    {
        dealerHand[cpuIndex] = deck.pop();
        addImage(who);
    }
    bust();
}
function addImage(who)
{
    if(who === 'player')
    {
        hand.appendChild(playerHand[playerIndex].img);
        ++playerIndex;
    }
    else
    {
        let redCard = document.createElement('img');
        redCard.height = 200;
        redCard.width = 200;
        redCard.src = 'card-images/red_back.png';
        dHand.appendChild(redCard);
        ++cpuIndex;
    }
}
function checkValue(who)
{
    let value = 0;
    if(who === 'player')
    {
        for(let i = 0; i < playerIndex; ++i)
        {
            switch(playerHand[i].rank)
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
                default: value+=parseInt(playerHand[i].rank, 10);
            }
        }
    }
    else
    {
        for(let i = 0; i < cpuIndex; ++i)
        {
            switch(dealerHand[i].rank)
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
                default: value+=parseInt(dealerHand[i].rank, 10);
            }
        }
    }
    return value;
}
function bust()
{
    if(checkValue('player') > 21)
    {
        playerStay = true;
        cpuStay = true;
        playerBust = true;
        compareScores();
    }
    else if(checkValue('cpu') > 21)
    {
        cpuBust = true;
        playerStay = true;
        cpuStay = true;
        compareScores();
    }
}
function compareScores()
{
    if(playerBust)
    {
        ending('cpu');
    }
    else if(cpuBust)
    {
        ending('player');
    }
    else if(checkValue('player') >= checkValue('cpu'))
    {
        ending('player');
    }
    else
    {
        ending('cpu');
    }
}
function ending(winner)
{
    let ending = document.getElementById('ending');
    if(winner === 'player')
    {
        ending.innerText = 'The Player Wins';
    }
    else
    {
        ending.innerText = 'The Computer Wins';
    }
    displayCpuHand()
}
function displayCpuHand()
{
    for(let i = 0; i < cpuIndex; ++i)
    {
        dHand.replaceChild(dealerHand[i].img, dHand.childNodes[i]);
    }
}
function ai()
{
    while(checkValue('computer') <= 14)
    {
        draw();
        if(!playerStay)
        {
            playerTurn = true;
            return;
        }
    }
    if(checkValue('computer') > 14)
    {
        cpuStay = true;
        if(playerStay)
        {
            compareScores();
        }
        else
        {
            playerTurn = true;

        }
    }
}
function buttonFunction()
{
    hitElement.addEventListener('click', () =>
    {
        if(!playerStay && playerTurn)
        {
            draw('player');
            playerTurn = false;
            ai();
        }
    });
    stayElement.addEventListener('click', () =>
    {
        playerStay = true;
        playerTurn = false;
        ai();
    });
}

