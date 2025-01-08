import { Continue, RestartBtn } from "./test.js";

export const pauseMue = `
    <div>Choose your Option</div>
      <div class="button-container">
        <button id="Restart">Restart</button>
        <button id="Continue">Continue</button>
      </div>
`;

export const Losemuen = `
   <div>You Lose The Game | lives end</div>
      <div class="button-container">
        <button id="Restart">Restart</button>
      </div>
    <div>
`;

export const timeOut = `
   <div>You Lose The Game | Time out</div>
      <div class="button-container">
        <button id="Restart">Restart</button>
      </div>
    <div>
`;

export const DivstartGame = `
  <div class="button-container">
        <button id="start" >Start</button>
  </div>
`;

export const Win = `
   <div>You Win The Game </div>
      <div class="button-container">
        <button id="Restart">Restart</button>
      </div>
    <div>
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
