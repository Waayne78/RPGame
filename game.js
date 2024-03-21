const game = document.querySelector('.container');
class Game {
    static new() {
        const container = document.querySelector('.container');
        container.innerHTML =
            `<h1>Welcome</h1>
        <input type="text" name="text" placeholder="Choose your name">
        <label for="class">Choose your spec :</label>
        <select name="class">
            <option value="warrior">Warrior</option>
            <option value="archer">Archer</option>
            <option value="mage">Mage</option>
            <option value="rogue">Rogue</option>
        </select>
        <button>Play</button>
        `;
        const button = document.querySelector('button');
        button.addEventListener('click', () => {
            const name = document.querySelector('input').value;
            const spec = document.querySelector('select').value;

            container.innerHTML = `<div class="zone"></div>`;

            Player.getCharactersInfo().then(() => {
                const player1 = new Player(name, spec);
                const player2 = Player.randomOpponent;
                player1.setOpponent(player2);
                player2.setOpponent(player1);
                container.style.flexDirection = "row";
            });
        });
        container.style.flexDirection = "column";
    }

    static newDice() {
        const dice = document.createElement('img');
        const random = Math.floor(Math.random() * 6) + 1;
        dice.src = `./dice-assets/dice-six-faces-${random}.png`;
        dice.classList.add('dice');
        return dice;
    }

    static rollDice() {
        const zone = document.querySelector('.zone');
        let newDice = this.newDice();
        zone.innerHTML = newDice.outerHTML;
        const interval = setInterval(() => {
            const dice = this.newDice();
            const img = zone.querySelector('img');
            img.src = dice.src;
        }, 80);
        setTimeout(() => {
            clearInterval(interval);
        }, 1500);
    }
}

class Player {

    static randomOpponent = null;

    constructor(name, spec) {
        this.name = name;
        this.spec = spec;
        this.health = 100;
        this.mana = 0;
        this.opponent = null;
        this.div = this.createPlayer();
    }

    static async getCharactersInfo() {
        const url = "https://thronesapi.com/api/v2/Characters";
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        const characters = data;
        const random = Math.floor(Math.random() * characters.length);
        const randomCharacter = characters[random];
        Player.randomOpponent = new Player(randomCharacter.fullName, randomCharacter.title);
    }


    attack() {
        if (this.opponent.health > 10) {
            this.opponent.health -= 10;
            this.opponent.div.querySelector('.health').textContent = "Health: " + this.opponent.health;
        } else {
            this.opponent.div.innerHTML = `<h2 style="color: darkred">${this.opponent.name} IS DEAD...</h2>`;
        }
    }

    getDetails() {
        return `${this.name}  (${this.spec})`;
    }

    createPlayer() {
        const div = document.createElement('div');
        div.classList.add('player');

        div.innerHTML =
            `<h2>${this.getDetails()}</h2>
            <p class="health">Health: ${this.health}</p>
            <p class="mana">Mana: ${this.mana}</p>
            <button class="attack-btn">Attack</button>
            <button class="special-attack-btn">Special Attack</button>`;

        game.appendChild(div);

        div.querySelector('.attack-btn').addEventListener('click', () => {
            const zone = document.querySelector('.zone');
            Game.rollDice();
            setTimeout(() => {
                const dice = document.querySelector('img');
                const number = dice.src.slice(-5, -4);
                if (number > 3) {
                    this.attack();
                    zone.innerHTML = `<h2 style="color: darkgreen" class="attack-message">Attack success</h2>`;
                    this.mana += 10;
                    this.div.querySelector('.mana').textContent = "Mana: " + this.mana;
                } else {
                    zone.innerHTML = `<h2 style="color: darkred" class="attack-message">Attack failed</h2>`;
                }
            }, 1600);
        });

        div.querySelector('.special-attack-btn').addEventListener('click', () => {
            const zone = document.querySelector('.zone');
            Game.rollDice();
            setTimeout(() => {
                const dice = document.querySelector('img');
                const number = dice.src.slice(-5, -4);
                if (number > 4) {
                    this.specialAttack();
                    zone.innerHTML = `<h2 style="color: darkgreen" class="attack-message">Special Attack success</h2>`;
                    
                } else {
                    zone.innerHTML = `<h2 style="color: darkred" class="attack-message">Special Attack failed</h2>`;
                }
            }, 1600);
        });

        return div;
    }

    setOpponent(opponentPlayer) {
        this.opponent = opponentPlayer;
    }

    specialAttack() {
        if (this.opponent.health > 20  ) {
            this.opponent.health -= 20;
            this.mana -= 10;
            this.opponent.div.querySelector('.health').textContent = "Health: " + this.opponent.health;
            this.div.querySelector('.mana').textContent = "Mana: " + this.mana;
            const specialImage = document.createElement('img');
            specialImage.src = './dice-assets/special.png';
            specialImage.classList.add('animate__animated', 'animate__zoomIn', 'special-image');
            const zone = document.querySelector('.zone');
            zone.appendChild(specialImage);
            setTimeout(() => {
                if (zone.contains(specialImage)) {
                    zone.removeChild(specialImage);
                }
            }, 2000);
        } else {
            this.opponent.div.innerHTML = `<h2 style="color: darkred">${this.opponent.name} IS DEAD...</h2>
            <button class="restart-btn">Restart</button>
            `;
        }
        const restartBtn = document.querySelector('.restart-btn');
        restartBtn.addEventListener('click', () => {
            Game.new();
        });
    }
}

Game.new();
