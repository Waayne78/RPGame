const game = document.querySelector('.container');

class Game {
    static new() {
        game.innerHTML =
            `<h1>Welcome</h1>
            <input type="text" name="text" placeholder="Choose your name">
            <label for="class">Choose your spec :</label>
            <select name="class">
                <option value="warrior">Warrior</option>
                <option value="archer">Archer</option>
                <option value="mage">Mage</option>
                <option value="rogue">Rogue</option>
            </select>
            <button>Go</button>
            `;

        const button = document.querySelector('button');
        button.addEventListener('click', () => {
            const name = document.querySelector('input').value;
            const spec = document.querySelector('select').value;

            game.innerHTML = `<div class="zone"></div>`;

            Player.getCharactersInfo().then(() => {
                const player1 = new Player(name, spec);
                const player2 = Player.randomOpponent;
                player1.setOpponent(player2);
                player2.setOpponent(player1);
            });
        });
    }

    static newDice() {
        const dice = document.createElement('img');
        const random = Math.floor(Math.random() * 6) + 1;
        dice.src = `./dice-assets/dice-six-faces-${random}.png`;
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
        this.mana = 100;
        this.opponent = null;
        this.div = this.createPlayer();
    }

    static async getCharactersInfo() {
        const url = "https://thronesapi.com/api/v2/Characters";
        try {
            const response = await fetch(url);
            const data = await response.json();
            const random = Math.floor(Math.random() * data.length);
            const name = data[random].fullName;
            const spec = data[random].family;
            Player.randomOpponent = new Player(name, spec);
        } catch (error) {
            console.error(error);
        }
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
                    zone.innerHTML = `<h2 style="color: darkgreen">Attack success</h2>`;
                } else {
                    zone.innerHTML = `<h2 style="color: darkred">Attack failed</h2>`;
                }
            }, 1600);
        });

        div.querySelector('.special-attack-btn').addEventListener('click', () => {
            const zone = document.querySelector('.zone');
            Game.rollDice();

            setTimeout(() => {
                const dice = document.querySelector('img');
                const number = dice.src.slice(-5, -4);
                if (number > 3) {
                    this.specialAttack();
                    zone.innerHTML = `<h2 style="color: darkgreen">Special Attack success</h2>`;
                } else {
                    zone.innerHTML = `<h2 style="color: darkred">Special Attack failed</h2>`;
                }
            }, 1600);
        });

        return div;
    }

    setOpponent(opponentPlayer) {
        this.opponent = opponentPlayer;
    }

    specialAttack() {
        if (this.opponent.health > 20) {
            this.opponent.health -= 20;
            this.mana -= 10;
            this.opponent.div.querySelector('.health').textContent = "Health: " + this.opponent.health;
            this.div.querySelector('.mana').textContent = "Mana: " + this.mana;
        } else {
            this.opponent.div.innerHTML = `<h2 style="color: darkred">${this.opponent.name} IS DEAD...</h2>`;
        }
    }
}

Game.new();
