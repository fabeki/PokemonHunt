"use strict";

const notFoundDiv = document.getElementById("notFound");

readData();

async function readData() {
  const response = await fetch("game-data.json");
  if (response.ok) {
    notFoundDiv.hidden = true;
    const data = await response.json();
    processData(data);
  } else {
    notFoundDiv.hidden = false;
  }
}
