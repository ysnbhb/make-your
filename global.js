import { Continue, RestartBtn } from "./make.js";

export let showStory = {
  story: true,
};
export const pauseMue = `
    <div>Choose your Option</div>
      <div class="button-container">
        <button id="Restart">Restart</button>
        <button id="Continue">Continue</button>
      </div>
`;

export const Losemuen = `
   <div>
   <h1>Game Over</h1>
   <p>You fought bravely, but the kingdom has fallen into darkness. The dark wizard's power now reigns supreme, casting a shadow over Valoran. 
   Yet, even in the darkest times, there remains hope. Perhaps next time, with stronger resolve and sharper strategies, you can bring light back to the land.</p>
</div>
<div class="button-container">
   <button id="Restart">Try Again</button>
</div>

`;

export const timeOut = `
   <div>You Lose The Game | Time out</div>
      <div class="button-container">
        <button id="Restart">Restart</button>
      </div>
    <div>
`;

const Story = `
      <h1>Hello player</h1>
        <p>
          In a faraway world, where parallel dimensions converge and mysterious
          forces harmonize, there existed a creature named "Vizarion," an
          ancient guardian of the universe's core energy source. This source,
          known as the "Eternal Crystal," However, one fateful day, a cosmic
          attack shattered this source, causing the crystal to break into small
          fragments scattered across various realms. As the fragments spread
          across distant places in space, Vizarion could no longer bear the
          chaos. He decided to use his powers to retrieve each missing piece of
          the crystal and return them to their rightful place. But there was a
          great challenge ahead: mysterious brick barriers stood in his way,
          preventing him from reaching the crystal pieces. This is where your
          journey begins! You are the hero controlling the "Silver Beam," a
          being that guides the ball through the obstacles in its path. Your
          task is to destroy these barriers, collect the fragments, and
          reassemble the Eternal Crystal to restore balance to the universe
          before time runs out. As you progress through the levels, you'll face
          more complex barriers and stronger enemies. With each new level,
          you'll uncover new elements to aid your journey. 🔵 Show ball ➡️​ Move
          left ⬅️​ Move right 🟦​ Brick
        </p>`;

export function getStartGameHTML() {
  return `
            ${showStory.story ? Story : ""}
            <div class="button-container">
              <h2>Select Difficulty</h2>
              <div class="button-group">
                <button id="easyBtn" class="difficulty-btn">Easy</button>
                <button id="mediumBtn" class="difficulty-btn">Medium</button>
                <button id="hardBtn" class="difficulty-btn">Hard</button>
              </div>
            </div>
          `;
}

export const Win = `
   <div>
   <h1>You Win The Game<h1/>
   <p>Well done, the kingdom has returned to peace, and the people of Valoran live in peace and security after you got rid of the dark wizard. You are now a hero in the kingdom, not only because you defeated a "wizard", but because you proved that courage and strong will can overcome any evil force, no matter how great.</p>
   </div>
      <div class="button-container">
        <button id="Restart">Restart</button>
      </div>
    <div>
`;

export const message = `
  <div class="button-container">
  <p> A little ball that lived in the dark until it first touched the light. It felt warm and alive, discovered the beauty of hope and change, and began a new journey full of discoveries.</p>
  <button id="Continue">Continue</button>
  </div>
`;

export const message1 = `
  <div class="button-container">
  <p> You, the brave player, are at the heart of this adventure. In your hands is the magic wand that controls the fate of the silver ball.</p>
  <button id="Continue">Continue</button>
  </div>
`;

export function lose(Losemuen) {
  const minue = document.getElementById("PusedMine");
  minue.innerHTML = Losemuen;
  minue.style.display = "";
  RestartBtn(minue);
}

export function showmine(div) {
  const minue = document.getElementById("PusedMine");
  minue.innerHTML = div;
  minue.style.display = "";
  Continue(minue);
  RestartBtn(minue);
}

export function debounce(func, wait) {
  let timer;
  return function (...arg) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...arg);
    }, wait);
  };
}

export function anon(Losemuen) {
  const minue = document.getElementById("PusedMine");

  minue.innerHTML = Losemuen;
  minue.style.display = "";
  Continue(minue);
}
