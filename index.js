const fetchWikiEntry = async (url) => {
  try {
    const response = await fetch(url);
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
};

const makeElements = (type, properties) => {
  const element = document.createElement(type);
  Object.entries(properties).forEach((property) => {
    const [propertyName, propertyValue] = property;
    element[propertyName] = propertyValue;
  });
  return element;
};
let score = 0;
const scoreCount = makeElements("p", { textContent: `score: ${score}` });
document.body.append(scoreCount);
const gameQuery = makeElements("h3", {
  textContent: "Which side is the longer article?",
});
document.body.append(gameQuery);
const pages = {};
pages.pageLength = [];
const randomUrl =
  "https://en.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&grnlimit=2&prop=info|pageimages&piprop=original&origin=*&format=json";
const wikiPages = async () => {
  pages.result = await fetchWikiEntry(randomUrl);
  pages.image = await fetchWikiEntry("https://random.dog/woof.json");
  printTitleAndImage();
  console.log(pages);
};
wikiPages();
const printTitleAndImage = () => {
  const currentPageObject = pages.result.query.pages;
  const bothPages = makeElements("div", { className: "wikiContainer" });
  Object.keys(currentPageObject).forEach((page) => {
    pages.pageLength.push(currentPageObject[page].length);
    const pageContainer = makeElements("div", { className: "pageContainer" });
    const title = makeElements("h3", {
      textContent: currentPageObject[page].title,
    });
    pageContainer.appendChild(title);
    if (currentPageObject[page].original) {
      const image = makeElements("img", {
        src: currentPageObject[page].original.source,
      });
      pageContainer.appendChild(image);
    } else {
      const image = makeElements("img", {
        src: pages.image.url,
      });
      pageContainer.appendChild(image);
    }
    bothPages.appendChild(pageContainer);
  });
  const gameElements = makeElements("div", { className: "gameElements" });
  const leftBtn = makeElements("button", { textContent: "Left!" });
  const rightBtn = makeElements("button", { textContent: "Right!" });
  const answer = makeElements("h3", { textContent: "" });
  leftBtn.addEventListener("click", () =>
    lengthCompare(pages.pageLength[0], pages.pageLength[1])
  );
  rightBtn.addEventListener("click", () =>
    lengthCompare(pages.pageLength[1], pages.pageLength[0])
  );
  document.body.appendChild(bothPages);
  pages.gameElements = {
    divs: [gameElements, bothPages],
    buttons: [leftBtn, rightBtn],
    question: gameQuery,
    answerText: answer,
  };
  document.body.append(gameElements, answer);
  gameElements.append(leftBtn, rightBtn);
};
const refreshBtn = makeElements("button", { textContent: "Try Again!" });
refreshBtn.addEventListener("click", () => removeElements());
const lengthCompare = (a, b) => {
  if (a > b) {
    pages.gameElements.answerText.textContent = "yes!";
    score++;
  } else {
    pages.gameElements.answerText.textContent = "no!";
    score = 0;
  }
  scoreCount.textContent = `score: ${score}`;
  pages.gameElements.buttons.forEach((button) => button.remove());
  document.body.append(refreshBtn);
};

const removeElements = () => {
  pages.gameElements.divs.forEach((div) => div.remove());
  pages.gameElements.answerText.remove();
  pages.pageLength = [];
  refreshBtn.remove();
  wikiPages();
};
