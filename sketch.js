let typedText = ''; // Stores the typed text
let lastTypedTime = 0; // Time when last character was typed
let timeDifference = 0; // Time between last key press and current time
let delayActive = false; // Flag for stopping the time check
let delayDuration = 0; // How long to keep the width constant
let currentWidth = 100; // Default width axis value for variable font
let skipMappingTimeDifference = false; // Flag to skip mapping timeDifference for next letter

let typedLetters = []; // Store individual letters and their widths
let textDisplay; // HTML element for displaying text
let wrapper; // Wrapper div for handling line breaks

let thinkingLine; // Element for the thinking line

function setup() {
  noCanvas(); // We won't use the canvas

  // Select the wrapper div
  wrapper = select('#wrapper');

  // Select the paragraph element inside the wrapper for displaying the typed text
  textDisplay = select('#wrapper p');

  // Select the thinking-line element
  thinkingLine = select('#thinking-line');

  // Initialize lastTypedTime to current time
  lastTypedTime = millis();
}

function draw() {
  // Decrease the delay duration if active
  if (delayActive) {
    delayDuration--;
    if (delayDuration <= 0) {
      delayActive = false; // Allow width changes again after the delay period
    }
  }

  // Calculate timeDifference
  let currentTime = millis();
  timeDifference = currentTime - lastTypedTime;

  // Update the thinking line's length
  updateThinkingLine();

  // Display the typed text with individual widths for each letter
  let displayContent = ''; // To hold the final string with applied styles

  typedLetters.forEach((letterObj) => {
    if (letterObj.isLineBreak) {
      displayContent += '<br>'; // Add line break
    } else {
      displayContent += `<span style="font-variation-settings: 'wdth' ${letterObj.width};">${letterObj.char}</span>`;
    }
  });

  // Add the cursor at the end
  displayContent += '<span class="cursor"></span>';

  textDisplay.html(displayContent); // Update the HTML content with styled letters and cursor
}

function updateThinkingLine() {
  // Map timeDifference (0 to 10000 ms) to line width (0 to 450 pixels)
  let maxLineWidth = 450; // Maximum width of the line in pixels
  let mappedLineWidth = map(timeDifference, 0, 10000, 0, maxLineWidth, true); // Ensures the value stays within bounds

  // Update the line's width
  thinkingLine.style('width', mappedLineWidth + 'px');
}

function keyPressed() {
  // Define the keys to ignore for updating lastTypedTime
  function isIgnoredKey(keyCode) {
    return (
      keyCode === DELETE || // Delete key
      keyCode === SHIFT || // Shift key
      keyCode === CONTROL || // Control key
      keyCode === OPTION || // Option/Alt key
      keyCode === ALT || // Alt key (same as Option on Mac)
      keyCode === 20 || // Caps Lock key
      keyCode === 91 || // Command key (Left)
      keyCode === 93 // Command key (Right)
    );
  }

  if (keyCode === DELETE && typedLetters.length > 0) {
    // Remove the last typed letter if DELETE is pressed
    typedLetters.pop();

    // Set skipMappingTimeDifference to true for the next letter
    skipMappingTimeDifference = true;

    // Do not update lastTypedTime
  } else if (keyCode === BACKSPACE && typedLetters.length > 0) {
    // Remove the last typed letter if BACKSPACE is pressed
    typedLetters.pop();

    // Do not update lastTypedTime
  } else if (keyCode === RETURN) {
    // Handle line break
    typedLetters.push({ isLineBreak: true });

    // Update lastTypedTime
    lastTypedTime = millis();
  } else if (!isIgnoredKey(keyCode)) {
    // For all other keys that are not ignored
    let currentTime = millis(); // Current time in milliseconds
    timeDifference = currentTime - lastTypedTime; // Time between last key press and this one

    if (!delayActive && !skipMappingTimeDifference) {
      // Map the time difference between 0 to 10 seconds (0 to 10000ms) to the width axis (100 to 1000)
      currentWidth = map(timeDifference, 0, 10000, 100, 1000, true); // Ensure the width stays between 100 and 1000
      delayDuration = 120; // Hold this width for 2 seconds (120 frames at 60fps)
      delayActive = true; // Start the delay period
    }

    lastTypedTime = currentTime; // Update the time of the last key press

    if (key.length === 1) {
      // If skipMappingTimeDifference is true, set currentWidth to maximum and reset the flag
      if (skipMappingTimeDifference) {
        currentWidth = 1000; // Set width to maximum
        skipMappingTimeDifference = false; // Reset the flag
      }

      // Add the typed character with its corresponding width
      typedLetters.push({ char: key, width: currentWidth });
    }
  }
  // If the key is ignored, do nothing (do not update lastTypedTime)
}
