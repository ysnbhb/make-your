import { Continue, RestartBtn } from "./make.js";

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
  <div class="start-menu">
    <h2>Select Difficulty</h2>
    <div class="button-container">
      <button id="easyBtn" class="difficulty-btn">Easy</button>
      <button id="mediumBtn" class="difficulty-btn">Medium</button>
      <button id="hardBtn" class="difficulty-btn">Hard</button>
    </div>
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

export function debounce(func, wait) {
  let timer;
  return function (...arg) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...arg);
    }, wait);
  };
}
