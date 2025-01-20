import { Continue, RestartBtn } from "./make.js";

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

export const DivstartGame = `
  <div class="button-container">
        <button id="start" >Start</button>
  </div>
`;

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

export function anon(Losemuen) {
  const minue = document.getElementById("PusedMine");

  minue.innerHTML = Losemuen;
  minue.style.display = "";
  Continue(minue);
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
