"use strict";

const slides = Array.from(document.querySelectorAll(".slide"));
const previous = document.querySelector("#prev");
const next = document.querySelector("#next");
const picker = document.querySelector("#slide-picker");
const pageCount = document.querySelector("#page-count");
const progress = document.querySelector("#progress");
const pad = number => String(number).padStart(2, "0");
let currentPage = 1;

function pageFromHash() {
  const page = Number(/^#slide-(\d+)$/.exec(location.hash)?.[1]);
  return page >= 1 && page <= slides.length ? page : 1;
}

function showPage(page, focusHeading = false) {
  if (!Number.isInteger(page) || page < 1 || page > slides.length) return;
  currentPage = page;
  slides.forEach((slide, index) => { slide.hidden = index + 1 !== page; });
  previous.disabled = page === 1;
  next.disabled = page === slides.length;
  picker.value = String(page);
  pageCount.textContent = pad(page) + " / " + slides.length;
  progress.value = page;
  if (focusHeading) {
    slides[page - 1].querySelector("h1, h2").focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
}

function goTo(page) {
  if (page < 1 || page > slides.length) return;
  showPage(page, true);
  const hash = "#slide-" + page;
  if (location.hash !== hash) history.pushState(null, "", hash);
}

previous.addEventListener("click", () => goTo(currentPage - 1));
next.addEventListener("click", () => goTo(currentPage + 1));
picker.addEventListener("change", () => goTo(Number(picker.value)));
function restorePage() {
  const page = pageFromHash();
  if (page !== currentPage) showPage(page, true);
}
history.scrollRestoration = "manual";
window.addEventListener("popstate", restorePage);
window.addEventListener("hashchange", restorePage);
window.addEventListener("load", () => window.scrollTo(0, 0), { once: true });

document.addEventListener("keydown", event => {
  if (event.defaultPrevented || event.isComposing || event.altKey ||
      event.ctrlKey || event.metaKey || event.shiftKey ||
      event.target.closest("button, select, input, textarea, a, summary, [contenteditable]")) return;
  const offset = { ArrowLeft: -1, ArrowUp: -1, ArrowRight: 1, ArrowDown: 1 }[event.key];
  if (offset) {
    event.preventDefault();
    goTo(currentPage + offset);
  }
});

const movies = [
  { title: "週末劇場", genre: "喜劇", popularity: 95 },
  { title: "星港", genre: "科幻", popularity: 82 },
  { title: "島嶼漫步", genre: "紀錄片", popularity: 70 }
];
const persona = document.querySelector("#persona");
const preference = document.querySelector("#preference");

function orderedMovies(genre, isExplicit) {
  return [...movies]
    .sort((a, b) =>
      Number(b.genre === genre) - Number(a.genre === genre) || b.popularity - a.popularity)
    .map(movie => {
      let reason = "依整體熱門度推薦";
      if (genre) {
        reason = "未符合偏好，依熱門度排序";
        if (movie.genre === genre) {
          reason = isExplicit ? "符合你選的" + genre : "符合歷史偏好的" + genre;
        }
      }
      return { ...movie, reason };
    });
}

function showCell(button) {
  const { user, film, score } = button.dataset;
  button.closest("table").querySelectorAll("[data-cell]").forEach(cell => {
    cell.setAttribute("aria-pressed", String(cell === button));
  });
  document.querySelector("#cell-value").textContent = score || "未評";
  document.querySelector("#cell-detail").textContent = score
    ? user + "給《" + film + "》" + score + " 分。這個格子有已知評分。"
    : user + "沒有《" + film + "》的評分紀錄。是否喜歡仍是未知的。";
}

const answers = {
  matrix: [1, "矩陣只記已知評分。空格表示沒有觀測到評分，仍無法判斷是否喜歡。"],
  content: [0, "答案是內容式推薦。用的是你的偏好與電影標籤。"],
  rerank: [1, "答案是重排序。清單已經初排，這一步依類型變化這個額外目標調整。"]
};

function answerQuestion(button) {
  const question = button.closest("[data-question]");
  const [answer, explanation] = answers[question.dataset.question];
  const correct = Number(button.dataset.answer) === answer;
  question.querySelectorAll("[data-answer]").forEach(option => {
    option.setAttribute("aria-pressed", String(option === button));
  });
  const feedback = question.querySelector(".feedback");
  feedback.dataset.result = correct ? "correct" : "incorrect";
  feedback.textContent = (correct ? "答對了。" : "這個選項不正確。") + explanation;
  question.querySelector(".quiz-source").hidden = false;
}


const find = selector => document.querySelector(selector);
const elements = selector => [...document.querySelectorAll(selector)];

function item(html, className = "") {
  const entry = document.createElement("li");
  entry.className = className;
  entry.innerHTML = html;
  return entry;
}

const observed = new Set();
const eventLabels = { click: "點開《星港》", watch: "看完《星港》", rate: "給《星港》5 分" };

function renderSignals() {
  for (const [target, events] of [["#implicit-log", ["click", "watch"]], ["#explicit-log", ["rate"]]]) {
    const recorded = events.filter(event => observed.has(event));
    find(target).replaceChildren(...(recorded.length
      ? recorded.map(event => item(eventLabels[event]))
      : [item("尚無紀錄", "empty")]));
  }
  elements("[data-signal]").forEach(button => {
    button.setAttribute("aria-pressed", String(observed.has(button.dataset.signal)));
  });
}

const library = [
  { title: "星港", genre: "科幻", score: 92, art: "star" },
  { title: "週末劇場", genre: "喜劇", score: 66, art: "weekend" },
  { title: "島嶼漫步", genre: "紀錄片", score: 71, art: "island" },
  { title: "雲端來信", genre: "科幻", score: 84, art: "screen" },
  { title: "雨夜節奏", genre: "音樂", score: 58, art: "sound" }
];
const flowSteps = {
  retrieve: ["候選生成 · Candidate generation", "這一輪先挑出兩部科幻片和一部紀錄片。其餘電影留在片庫；此時尚未打分。", [0, 1, 2, 3, 4]],
  score: ["評分 · Scoring", "替三部候選填入示意相關性分數，依分數由高到低排序。", [0, 3, 2]],
  rerank: ["重排序 · Re-ranking", "示意條件是前兩名有不同類型，所以把《島嶼漫步》從第三移到第二。原本分數保留。", [0, 2, 3]]
};

function showStage(stage) {
  const [title, explanation, indices] = flowSteps[stage];
  find("#stage-title").textContent = title;
  find("#stage-detail").textContent = explanation;
  find("#stage-list").classList.toggle("catalog", stage === "retrieve");
  find("#stage-list").replaceChildren(...indices.map((index, rank) => {
    const movie = library[index];
    const omitted = stage === "retrieve" && (index === 1 || index === 4);
    const value = stage === "retrieve"
      ? `<span class="tag">${omitted ? "留在片庫" : "進入候選"}</span>`
      : `<span class="score"><meter min="0" max="100" value="${movie.score}" aria-label="示意相關性分數"></meter><b>${movie.score}</b></span>`;
    return item(`<span class="rank">${stage === "retrieve" ? "·" : pad(rank + 1)}</span>
      <div class="poster ${movie.art}" aria-hidden="true"></div>
      <div><strong>${movie.title}</strong><small>${movie.genre}</small></div>${value}`,
      omitted ? "omitted" : "");
  }));
}

const films = elements("#content-films .film");
function highlightGenre(genre) {
  const ranked = [...films].sort((a, b) => Number(b.dataset.genre === genre) - Number(a.dataset.genre === genre));
  ranked.forEach((film, index) => {
    const match = film.dataset.genre === genre;
    film.classList.toggle("match", match);
    film.querySelector(".film-rank").textContent = pad(index + 1);
    film.querySelector(".match-label").textContent = match ? "符合「" + genre + "」偏好" : "類型未匹配";
  });
  find("#content-films").append(...ranked);
  find("#genre-detail").textContent = "《" + ranked[0].querySelector("h3").textContent + "》的類型符合偏好，移到第一名。其餘維持原始順序。";
}

const graphUsers = [
  { id: "rain", label: "小雨", x: 15, y: 32 },
  { id: "lin", label: "小林", x: 15, y: 68 }
];
const graphFilms = [
  { id: "star", label: "星港", x: 80, y: 18 },
  { id: "letter", label: "月台來信", x: 80, y: 49 },
  { id: "weekend", label: "週末劇場", x: 80, y: 81 }
];
const graphLinks = [
  ["rain", "star", 5], ["rain", "letter", 4],
  ["lin", "star", 5], ["lin", "letter", 5], ["lin", "weekend", 4]
];
const graphNodes = [...graphUsers, ...graphFilms];
const nodeFor = id => graphNodes.find(node => node.id === id);

function selectGraph(id) {
  const related = graphLinks.filter(([user, film]) => user === id || film === id);
  elements("#relation-graph [data-edge]").forEach((edge, index) => {
    edge.classList.toggle("active", related.includes(graphLinks[index]));
  });
  const connectedIds = new Set(related.flatMap(([user, film]) => [user, film]));
  elements("[data-node]").forEach(button => {
    button.classList.toggle("related", connectedIds.has(button.dataset.node));
    button.setAttribute("aria-pressed", String(button.dataset.node === id));
  });
  const details = related.map(([user, film, score]) => nodeFor(user).label + "給《" + nodeFor(film).label + "》" + score + " 分");
  find("#graph-detail").textContent = details.join("、") + "。";
}

function buildGraph() {
  const edges = graphLinks.map(([user, film], index) => {
    const a = nodeFor(user);
    const b = nodeFor(film);
    return `<line data-edge x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" style="--edge:${index}"/>`;
  });
  find("#relation-graph").innerHTML = `<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${edges.join("")}</svg>` +
    graphNodes.map(node => `<button type="button" data-node="${node.id}" aria-pressed="false" style="left:${node.x}%;top:${node.y}%">${node.label}</button>`).join("");
  selectGraph("rain");
}

function showRank(rank) {
  const titles = ["星港", "週末劇場", "雲端來信"];
  titles.splice(rank - 1, 0, "島嶼漫步");
  find("#rank-list").replaceChildren(...titles.map((title, index) => item(
    `<span class="rank">${pad(index + 1)}</span><strong>${title}</strong>
    ${title === "島嶼漫步" ? '<span class="tag">保留正例</span>' : ""}`,
    title === "島嶼漫步" ? "positive" : ""
  )));
  const hit = rank <= 3;
  find("#hit-number").textContent = hit ? "1" : "0";
  find("#rank-detail").textContent = hit ? "命中：保留正例在前三名。" : "未命中：保留正例在第四名。";
}

const coldCases = {
  "new-user": ["沒有個人觀看歷史。", ["popular", "preference"]],
  "new-film": ["新上架的電影尚無評分。", ["popular", "metadata"]]
};
const strategyLabels = { popular: "熱門推薦", preference: "主動選科幻", metadata: "使用類型標籤" };
let coldCase = "new-user";

function showColdStrategy(strategy) {
  find("#cold-title").textContent = strategyLabels[strategy];
  let lines;
  let detail;
  if (strategy === "preference") {
    lines = [["你的偏好", "科幻"], ["符合的電影", "星港"]];
    detail = "使用者主動給出偏好，系統可以利用類型特徵開始比對。";
  } else if (strategy === "metadata") {
    lines = [["新電影 · 月台來信", "科幻"], ["可做的比對", "推薦給偏好科幻的觀眾"]];
    detail = "已有內容標籤的新電影可以參與類型比對，即使尚無評分。";
  } else {
    lines = [["週末劇場", "熱門度 95"], ["星港", "熱門度 82"], ["島嶼漫步", "熱門度 70"]];
    detail = coldCase === "new-user"
      ? "先提供一份整體熱門清單。這一步不需要新使用者的偏好。"
      : "沿用既有作品的熱門度。此例的新電影尚無可用熱門度，仍需要其他訊號才能納入比對。";
  }
  find("#cold-visual").innerHTML = lines.map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join("");
  find("#cold-detail").textContent = detail;
}

function showColdCase(selection) {
  coldCase = selection;
  const [gap, strategies] = coldCases[selection];
  find("#cold-gap").textContent = gap;
  find("#cold-strategies").innerHTML = `<div class="choices" role="group" aria-label="選擇冷啟動策略">${strategies.map((strategy, index) =>
    `<button type="button" data-choice="strategy" data-value="${strategy}" aria-pressed="${index === 0}">${strategyLabels[strategy]}</button>`
  ).join("")}</div>`;
  showColdStrategy(strategies[0]);
}

const movieArt = { "週末劇場": "weekend", "星港": "star", "島嶼漫步": "island" };

function renderRecommendations() {
  const history = persona.value === "B" ? "紀錄片" : "";
  const chosenGenre = preference.value;
  const genre = chosenGenre || history;
  find("#scenario-detail").textContent = history
    ? "歷史偏好為紀錄片。手動選擇只改變本次推薦。"
    : "無個人偏好紀錄。可以先選一個類型。";
  find("#sort-rule").textContent = genre
    ? "符合「" + genre + "」的電影優先，同組依熱門度。"
    : "無個人偏好，依整體熱門度排序。";
  const entries = orderedMovies(genre, Boolean(chosenGenre)).map((movie, index) => item(
    `<div class="poster ${movieArt[movie.title]}" aria-hidden="true"><span class="film-rank">${pad(index + 1)}</span></div>
      <div class="film-copy"><span class="tag">${movie.genre} · 熱門度 ${movie.popularity}</span>
      <strong>${movie.title}</strong><p class="reason">${movie.reason}</p></div>`, "film recommendation"
  ));
  find("#recommendations").replaceChildren(...entries);
}

function resetScenario() {
  preference.value = "";
  renderRecommendations();
}

const exposureMovies = [
  ["星港", "科幻", 95, "star"],
  ["雲端來信", "科幻", 88, "screen"],
  ["極夜航程", "科幻", 82, "star"],
  ["島嶼漫步", "紀錄片", 70, "island"]
];

function showExposure(mode) {
  const indices = mode === "popular" ? [0, 1, 2] : [0, 1, 3];
  find("#exposure-list").replaceChildren(...indices.map((index, rank) => {
    const [title, genre, popularity, art] = exposureMovies[index];
    return item(`<span class="rank">${pad(rank + 1)}</span><div class="poster ${art}" aria-hidden="true"></div>
      <div><strong>${title}</strong><small>${genre} · 熱門度 ${popularity}</small></div>`);
  }));
  find("#exposure-detail").textContent = mode === "popular"
    ? "1 種類型：三個展示位置都給了科幻片。"
    : "2 種類型：第三個展示位置給了紀錄片，觀眾多一次看到它的機會。";
}

function showQuiz(id) {
  elements("[data-question]").forEach(question => {
    question.hidden = question.dataset.question !== id;
  });
}

function updateQuizCount() {
  find("#quiz-count").textContent = "已作答 " + elements('.quiz [aria-pressed="true"]').length + " / 3";
}

function resetQuiz() {
  elements(".quiz [data-answer]").forEach(button => button.setAttribute("aria-pressed", "false"));
  elements(".feedback").forEach(feedback => {
    feedback.textContent = "";
    delete feedback.dataset.result;
  });
  elements(".quiz-source").forEach(source => { source.hidden = true; });
  choose(find('[data-choice="quiz"][data-value="matrix"]'));
  updateQuizCount();
}

const actions = {
  stage: showStage, genre: highlightGenre, rank: value => showRank(Number(value)),
  cold: showColdCase, strategy: showColdStrategy, exposure: showExposure, quiz: showQuiz
};

function choose(button) {
  button.closest("[role='group']").querySelectorAll("button").forEach(option => {
    option.setAttribute("aria-pressed", String(option === button));
  });
  actions[button.dataset.choice](button.dataset.value);
}

persona.addEventListener("change", resetScenario);
preference.addEventListener("change", renderRecommendations);
find("#reset-sim").addEventListener("click", resetScenario);
find("#reset-quiz").addEventListener("click", resetQuiz);
find("#clear-signals").addEventListener("click", () => {
  observed.clear();
  renderSignals();
  find("#signal-detail").textContent = "已清除訊號。再試點開、看完或評分。";
});

find("#deck").addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.dataset.go) goTo(Number(button.dataset.go));
  if (button.dataset.choice) choose(button);
  if (button.hasAttribute("data-cell")) showCell(button);
  if (button.dataset.node) selectGraph(button.dataset.node);
  if (button.dataset.signal) {
    observed.add(button.dataset.signal);
    renderSignals();
    const type = button.dataset.signal === "rate" ? "顯式回饋" : "隱式回饋";
    find("#signal-detail").textContent = "已記錄" + eventLabels[button.dataset.signal] + "，列為" + type + "。觀看或點開只提供偏好線索。";
  }
  if (button.hasAttribute("data-answer")) {
    answerQuestion(button);
    updateQuizCount();
  }
});
find(".brand").addEventListener("click", event => {
  event.preventDefault();
  goTo(1);
});

showPage(pageFromHash());
renderSignals();
showStage("retrieve");
highlightGenre("科幻");
buildGraph();
showRank(3);
showColdCase("new-user");
resetScenario();
showExposure("popular");
