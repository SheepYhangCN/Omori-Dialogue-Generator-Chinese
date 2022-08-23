const normalFont = new FontFace("OMORI_MAIN", "url(./css/fonts/OMORI_GAME.ttf)");
const disturbedFont = new FontFace("OMORI_DISTURBED", "url(./css/fonts/OMORI_GAME2.ttf)");
// const disturbedFont = new FontFace("OMORI_MAIN", "url(./css/fonts/OMORI_GAME.ttf)");
document.fonts.add(normalFont);
document.fonts.add(disturbedFont);
console.log("Fonts loaded");

// Cursed workarounds - the dialogue boxes and portrait boxes respectively.
// This is needed to prevent issues with toDataURL DOM issues ("tainted canvas")
const img_dialogue = new Image();
img_dialogue.crossOrigin = "anonymous";
img_dialogue.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAmAAAABwCAYAAAC5IsxiAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAI1SURBVHhe7dmxDcMwDABBMfvv7Ci2q6SNv7oDBFAbPMhZax37AQAQOQNsu34AADxqZtbrngEAiAgwAIDYzwnysxYDAOB/vlvLBgwAICbAAABiAgwAICbAAABiAgwAICbAAABiAgwAICbAAABiAgwAICbAAABiAgwAICbAAABiAgwAICbAAABiAgwAICbAAABiAgwAICbAAABiAgwAICbAAABiAgwAICbAAABiAgwAICbAAABiAgwAICbAAABiAgwAICbAAABiAgwAICbAAABiAgwAICbAAABiAgwAICbAAABiAgwAICbAAABiAgwAICbAAABiAgwAICbAAABiAgwAICbAAABiAgwAICbAAABiAgwAICbAAABiAgwAICbAAABiAgwAICbAAABiAgwAICbAAABiAgwAICbAAABiAgwAICbAAABiAgwAICbAAABiAgwAICbAAABiAgwAICbAAABiAgwAICbAAABiAgwAICbAAABiAgwAICbAAABiAgwAICbAAABiAgwAICbAAABiAgwAICbAAABiAgwAICbAAABiAgwAICbAAABiAgwAICbAAABiAgwAICbAAABiAgwAICbAAABiAgwAICbAAABiAgwAICbAAABiAgwAICbAAABiAgwAICbAAABiAgwAICbAAABiAgwAICbAAABiAgwAICbAAABiAgwAICbAAABiAgwAICbAAABiAgwAIDb7Hdv1AwDgUTNjAwYAUBNgAACx8wR5jQAAPG+tN+QPEde1pEOrAAAAAElFTkSuQmCC";

const img_portrait = new Image();
img_portrait.crossOrigin = "anonymous";
img_portrait.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHIAAAByCAYAAACP3YV9AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAE+SURBVHhe7dTBDQIxDADBmP57hnDHCxogqxkpkvNe2bPWeu7H4a6Q2/3jSDOzHp+ZwwkZ8XNa32vK//tuZiMjhIwQMkLICCEjhIwQMkLICCEjhIwQMkLICCEjhIwQMkLICCEjhIwQMkLICCEjhIwQMkLICCEjhIwQMkLICCEjhIwQMkLICCEjhIwQMkLICCEjhIwQMkLICCEjhIwQMkLICCEjhIwQMkLICCEjhIwQMkLICCEjhIwQMkLICCEjhIwQMkLICCEjhIwQMkLICCEjhIwQMkLICCEjhIwQMkLICCEjhIwQMkLICCEjhIwQMkLICCEjhIwQMkLICCEjhIwQMkLICCEjhIwQMkLICCEjhIwQMkLICCEjhIwQMkLICCEjhIwQMkLICCEjZr/ndv840szYyAohI67Teo+ca60X0ncR2/R13icAAAAASUVORK5CYII=";

// TODO: make this modular

function renderCanvas(idFrame, idDownload) {

  const frame = document.getElementById(idFrame);
  let canvas = frame.getElementsByTagName("canvas")[0];
  canvas.style.display = "block";
  let ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let img_char = new Image();

  // Load character image and portrait box
  if (document.getElementsByClassName("toggle-portrait")[0].checked) {
    img_char.src = frame.getElementsByTagName("img")[0].src;
    ctx.drawImage(img_portrait, 494, 0);
    ctx.drawImage(img_char, 499, 5, 104, 104);
  }
  // Load dialogue box
  ctx.drawImage(img_dialogue, 0, 118);


  // Load character name details
  let charName = document.getElementsByClassName("char-name")[0].value;
  ctx.font = "28px OMORI_MAIN";

  // Load character name box
  let a = ctx.measureText(charName)
  let lengthOfCharName = a.width;
  let fullRectangleWidth = lengthOfCharName + 24;

  // black outside
  ctx.fillStyle = "black";
  ctx.fillRect(0, 70, fullRectangleWidth, 44);
  // white outside
  ctx.fillStyle = "white";
  ctx.fillRect(1, 71, fullRectangleWidth - 2, 42);
  // black inside
  ctx.fillStyle = "black";
  ctx.fillRect(4, 74, fullRectangleWidth - 8, 36);

  // Load character name
  ctx.fillStyle = "white";
  ctx.fillText(charName, 12, 100);

  // Load textarea
  let dialogue = document.getElementsByClassName("dialogue-box")[0].value;
  let splitDialogue = dialogue.split("\n");
  console.log(splitDialogue);

  // 29px between lines
  // max 585px

  function insertDialogue(context, unsplitText) {
    // Source/Adapted from: https://gh.princessrtfm.com/niko.html
    // Check out https://github.com/PrincessRTFM, they're hella huge brain
    // for the logic of this thing.
    let yBase = 154; // Determined from doing some alignment in Paint.NET
    let maxLineLength = 572; // Determined by same method
    let splitText = unsplitText.split("\n");

    for (let lineNo = 0; lineNo < splitText.length; lineNo++) {
      console.log(lineNo);
      if (lineNo >= 3) {
        alert('只能容纳三行。第四行及以上未被渲染。');
        break;
      }
      let line = splitText[lineNo];

      // Check if
      if (context.measureText(line).width > maxLineLength) {
        const words = line.split(/\s/u);
        for (let word = words.length; word > 0; word--) {
          const left = words.slice(0, word).join(" ");
          debugger;
          if (context.measureText(left).width <= maxLineLength) {
            line = left;
            splitText.splice(lineNo + 1, 0, words.slice(word).join(" "));
            break;
          }
        }
      }
      context.fillText(line, 12, yBase + (29 * lineNo), maxLineLength);
    }
  }

  function changeDownloadLink() {
    let downloadLink = document.getElementById(idDownload);
    canvas = frame.getElementsByTagName("canvas")[0];
    downloadLink.href = canvas.toDataURL("image/png");
  }

  // Had to be explicit here with everthing, otherwise dialogue would just
  // refuse to render.
  ctx.fillStyle = "white";
  if (document.getElementById("toggle_disturbed_0").checked) {
    disturbedFont.load().then(function() {
      ctx.font = "28px OMORI_DISTURBED";
      insertDialogue(ctx, dialogue);
      changeDownloadLink();
    });
  } else {
    ctx.font = "28px OMORI_MAIN";
    insertDialogue(ctx, dialogue);
    changeDownloadLink();
  }



  /*
  Credits - giving credit where credit is due.

  Noel A Rodriguez, https://dev.to/thehomelessdev/how-to-add-a-custom-font-to-an-html-canvas-1m3g
  Jerry, https://stackoverflow.com/a/66969479
  https://dopiaza.org/tools/datauri/index.php

  */
}
