// Default hex word list
const DEFAULT_WORDS = [
  "0B0E", "1CED", "1DEA", "A1DE", "ABBA", "AC1D", "ACED",
  "B0DE", "B0FF", "B1BB", "B1DE", "B1FF", "BABA",
  "BABE", "BEAD", "BEEF", "C0BB", "C0C0", "C0DE", "C1A0",
  "CAFE", "D0D0", "D0FF", "D1CE", "D1D0", "D1ED", "DADA", "DEAD",
  "DEAF", "DEC0", "DEED", "DEF1", "F00D", "F1D0", "F1FE", "FACE",
  "FADE", "FEED"
];

// Default blacklist
const DEFAULT_BLACKLIST = [
  "B00B", "B00C", "CACA"
];

let currentWordlist = [...DEFAULT_WORDS];
let currentBlacklist = [...DEFAULT_BLACKLIST];
let validLeetWords = [];

// Regular expression for validating hex words
const hexPattern = /^[A-F0-9]{4}$/;

// Initialize app
window.onload = function() {
  // Load last used blacklist from localStorage if available
  const savedBlacklist = localStorage.getItem('ipv6Blacklist');
  if (savedBlacklist) {
    currentBlacklist = JSON.parse(savedBlacklist);
  }

  // Load last used wordlist from localStorage if available
  const savedWordlist = localStorage.getItem('ipv6WordList');
  if (savedWordlist) {
    currentWordlist = JSON.parse(savedWordlist);
  } else {
    // If no saved wordlist, start with default words
    currentWordlist = [...DEFAULT_WORDS];
  }

  // Apply blacklist filter to ensure no blacklisted words are in the wordlist
  const blacklistedWordsInList = currentWordlist.filter(word => currentBlacklist.includes(word));
  if (blacklistedWordsInList.length > 0) {
    // Remove blacklisted words
    currentWordlist = filterBlacklistedWords(currentWordlist);

    // Save the filtered wordlist
    localStorage.setItem('ipv6WordList', JSON.stringify(currentWordlist));
  }

  // Update the textareas with the current lists
  document.getElementById('customWordInput').value = currentWordlist.join('\n');
  document.getElementById('blacklistInput').value = currentBlacklist.join('\n');

  // Display the wordlist and blacklist chips
  updateWordlistDisplay();
  updateBlacklistDisplay();

  // Hide progress bar initially
  document.getElementById('uploadProgress').style.display = 'none';

  // Show initial stats
  updateStats();

  // Set up initial output area
  const output = document.getElementById('output');
  if (output) {
    output.innerHTML = '# Ready to generate some spicy IPv6 addresses! 🌶️\n<span class="blinking-cursor"></span>';
  }
};

// Function to generate IPv6 addresses
function generateAddresses() {
  const numResults = parseInt(document.getElementById('numResults').value);
  const useUniqueWords = document.getElementById('uniqueWords').value === 'true';
  const caseStyle = document.getElementById('caseSelect').value;

  // Validate input
  if (isNaN(numResults) || numResults < 1 || numResults > 100) {
    alert('Please enter a valid number of addresses (1-100).');
    return;
  }

  if (currentWordlist.length === 0) {
    alert('No words available. Please add words to your wordlist first.');
    return;
  }

  // Check if we have enough words for unique generation
  if (useUniqueWords && currentWordlist.length < 8) {
    alert('Not enough words for unique generation. You need at least 8 different words.');
    return;
  }

  const output = document.getElementById('output');

  // Mexican-themed loading messages
  const loadingMessages = [
    '# Heating up the IPv6 salsa... 🌶️',
    '# Adding some spice to your network... 🔥',
    '# Preparing a fiesta of addresses... 💃',
    '# Mixing the perfect IPv6 guacamole... 🥑',
    '# Wrapping your addresses in a warm tortilla... 🌮'
  ];

  // Pick a random loading message
  const randomMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
  output.innerHTML = randomMessage + '\n\n';

  const addresses = [];

  for (let i = 0; i < numResults; i++) {
    const address = generateSingleAddress(useUniqueWords, caseStyle);
    addresses.push(address);

    // Add to output with copy button
    const resultDiv = document.createElement('div');
    resultDiv.classList.add('result');

    const addressText = document.createElement('span');
    addressText.textContent = address;

    const copyBtn = document.createElement('button');
    copyBtn.classList.add('copy-btn');
    copyBtn.textContent = 'Copy';
    copyBtn.onclick = function() {
      navigator.clipboard.writeText(address)
        .then(() => {
          copyBtn.textContent = 'Copied!';
          setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    };

    resultDiv.appendChild(addressText);
    resultDiv.appendChild(copyBtn);
    output.appendChild(resultDiv);
  }

  // Update stats
  const statsElement = document.getElementById('stats');

  // Calculate the number of possible unique addresses
  const wordCount = currentWordlist.length;
  const totalPossible = Math.pow(wordCount, 8);

  // Format the number in scientific notation
  let formattedNumber;
  if (totalPossible > 1e6) {
    const exponent = Math.floor(Math.log10(totalPossible));
    const mantissa = totalPossible / Math.pow(10, exponent);
    formattedNumber = `${mantissa.toFixed(2)}×10^${exponent}`;
  } else {
    formattedNumber = totalPossible.toLocaleString();
  }

  // Calculate comparison to IPv4
  const ipv4Count = 4294967296;
  const timesMoreThanIpv4 = totalPossible / ipv4Count;

  let comparisonText = '';
  if (timesMoreThanIpv4 > 1) {
    if (timesMoreThanIpv4 > 1e6) {
      const exponent = Math.floor(Math.log10(timesMoreThanIpv4));
      const mantissa = timesMoreThanIpv4 / Math.pow(10, exponent);
      comparisonText = `That's ${mantissa.toFixed(2)}×10^${exponent} times more than IPv4!`;
    } else {
      comparisonText = `That's ${Math.round(timesMoreThanIpv4).toLocaleString()} times more than IPv4!`;
    }
  }

  // Mexican-themed completion messages
  const completionMessages = [
    `¡Olé! ${numResults} spicy IPv6 address${numResults !== 1 ? 'es' : ''} ready to serve! 🌮 From ${formattedNumber} possibilities. ${comparisonText} 🔥`,
    `¡Ay caramba! ${numResults} hot IPv6 address${numResults !== 1 ? 'es' : ''} with ${useUniqueWords ? 'unique' : 'random'} flavor! 🌶️ Just ${numResults} out of ${formattedNumber} possible combinations!`,
    `¡Arriba! ${numResults} sizzling IPv6 address${numResults !== 1 ? 'es' : ''} fresh from the digital grill! 🔥 That's just a taste of the ${formattedNumber} possible addresses!`
  ];

  // Pick a random completion message
  const randomCompletion = completionMessages[Math.floor(Math.random() * completionMessages.length)];
  statsElement.textContent = randomCompletion;
}

// Function to generate a single IPv6 address
function generateSingleAddress(useUniqueWords, caseStyle) {
  let segments = [];
  let usedWords = [];

  // Generate 8 segments
  for (let i = 0; i < 8; i++) {
    let word;

    if (useUniqueWords) {
      // Filter out already used words
      const availableWords = currentWordlist.filter(w => !usedWords.includes(w));

      if (availableWords.length === 0) {
        // If we run out of unique words, reset the used words list
        usedWords = [];
        word = getRandomWord(currentWordlist);
      } else {
        word = getRandomWord(availableWords);
      }
    } else {
      word = getRandomWord(currentWordlist);
    }

    usedWords.push(word);
    segments.push(word);
  }

  // Apply case formatting
  if (caseStyle === 'lowercase') {
    segments = segments.map(segment => segment.toLowerCase());
  }

  // Join with colons to form IPv6 address
  return segments.join(':');
}

// Function to get a random word from the wordlist
function getRandomWord(wordlist) {
  const randomIndex = Math.floor(Math.random() * wordlist.length);
  return wordlist[randomIndex];
}

// Function to clear the output
function clearOutput() {
  const output = document.getElementById('output');

  // Mexican-themed ready messages
  const readyMessages = [
    '# Kitchen is clean and ready for some spicy IPv6 addresses... 🌶️',
    '# The digital tequila is ready to pour some fresh addresses... 🥃',
    '# Ready to make your network as hot as a Mexican summer... 🔥',
    '# HexMex chef is ready to cook up some delicious addresses... 🌮'
  ];

  // Pick a random ready message
  const randomReady = readyMessages[Math.floor(Math.random() * readyMessages.length)];
  output.innerHTML = randomReady + '\n<span class="blinking-cursor"></span>';

  // Clear stats in both tabs
  const statsElement = document.getElementById('stats');
  if (statsElement) {
    statsElement.textContent = '';
  }

  const wordlistStatsElement = document.getElementById('wordlistStats');
  if (wordlistStatsElement) {
    wordlistStatsElement.textContent = '';
  }
}

// Function to convert words to leet speak
function convertToLeet() {
  const inputText = document.getElementById('leetInput').value.trim();
  if (!inputText) {
    alert('Please enter some words to convert.');
    return;
  }

  // Get selected substitutions
  const substitutions = [];
  const checkboxes = document.querySelectorAll('#leetSubOptions input:checked');
  checkboxes.forEach(checkbox => {
    const [from, to] = checkbox.value.split(':');
    substitutions.push({ from, to });
  });

  if (substitutions.length === 0) {
    alert('Please select at least one leet speak substitution.');
    return;
  }

  // Parse input words
  const words = inputText.split(/[\s\n]+/)
    .map(word => word.trim())
    .filter(word => word);

  if (words.length === 0) {
    alert('No valid words found.');
    return;
  }

  // Convert words to leet speak
  const leetOutput = document.getElementById('leetOutput');
  leetOutput.innerHTML = '# Leet speak conversion results:\n\n';

  validLeetWords = [];

  words.forEach(word => {
    let leetWord = word.toUpperCase();

    // Apply substitutions
    substitutions.forEach(sub => {
      const regex = new RegExp(sub.from, 'gi');
      leetWord = leetWord.replace(regex, sub.to);
    });

    // Check if the result is a valid hex word
    const isValid = isValidHexWord(leetWord);

    // Add to output
    const resultDiv = document.createElement('div');
    resultDiv.classList.add('result');

    if (isValid) {
      resultDiv.innerHTML = `${word} → <strong>${leetWord}</strong> ✓`;
      validLeetWords.push(leetWord);
    } else {
      resultDiv.innerHTML = `${word} → <strong>${leetWord}</strong> ✗ (not valid hex)`;
    }

    leetOutput.appendChild(resultDiv);
  });

  // Update stats
  const leetStats = document.getElementById('leetStats');
  leetStats.textContent = `Valid Hex Words Found: ${validLeetWords.length}`;
}

// Function to add valid leet words to the wordlist
function addLeetWordsToList() {
  if (validLeetWords.length === 0) {
    alert('No valid leet words to add. Convert some words first.');
    return;
  }

  // Add to current wordlist, avoiding duplicates
  const newWords = validLeetWords.filter(word => !currentWordlist.includes(word));

  if (newWords.length === 0) {
    alert('All valid leet words are already in your wordlist.');
    return;
  }

  currentWordlist = [...currentWordlist, ...newWords];
  localStorage.setItem('ipv6WordList', JSON.stringify(currentWordlist));

  // Update the textarea and display
  document.getElementById('customWordInput').value = currentWordlist.join('\n');
  updateWordlistDisplay();

  // Provide feedback
  alert(`Added ${newWords.length} new word${newWords.length !== 1 ? 's' : ''} to your wordlist.`);

  // Clear the valid leet words array
  validLeetWords = [];

  // Update leet stats
  const leetStats = document.getElementById('leetStats');
  leetStats.textContent = '';

  // Update the generator tab output with the results
  const output = document.getElementById('output');
  if (output) {
    output.innerHTML = `# Added ${newWords.length} new word${newWords.length !== 1 ? 's' : ''} to your wordlist.\n# Total of ${currentWordlist.length} words now available.\n`;
  }
}

// Function to handle tab switching
function openTab(evt, tabName) {
  const tabcontent = document.getElementsByClassName("tab-content");
  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].classList.remove("active");
  }

  const tablinks = document.getElementsByClassName("tab");
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove("active");
  }

  document.getElementById(tabName).classList.add("active");
  evt.currentTarget.classList.add("active");
}

// Function to toggle accordions
function toggleAccordion(element) {
  element.parentElement.classList.toggle('accordion-expanded');
}

function updateWordlistDisplay() {
  const container = document.getElementById('wordlistDisplay');
  container.innerHTML = '';

  if (currentWordlist.length === 0) {
    container.innerHTML = '<div style="color: var(--error-color);">No words in list</div>';
    return;
  }

  currentWordlist.forEach(word => {
    const chip = document.createElement('div');
    chip.classList.add('word-chip');
    chip.textContent = word;
    container.appendChild(chip);
  });

  // Update stats
  updateStats();
}

function updateBlacklistDisplay() {
  const container = document.getElementById('blacklistDisplay');
  container.innerHTML = '';

  if (currentBlacklist.length === 0) {
    container.innerHTML = '<div style="color: var(--accent-color);">No blacklisted words</div>';
    return;
  }

  currentBlacklist.forEach(word => {
    const chip = document.createElement('div');
    chip.classList.add('word-chip', 'blacklist-chip');
    chip.textContent = word;
    container.appendChild(chip);
  });
}

function updateStats() {
  // Calculate the number of possible unique addresses
  // For n words, with 8 segments, if we allow repeats: n^8 possible combinations
  // If we don't allow repeats (unique words only): n!/(n-8)! if n>=8, or 0 if n<8
  const wordCount = currentWordlist.length;

  // Calculate total possible addresses (with repeats)
  const totalPossible = Math.pow(wordCount, 8);

  // Format the number in scientific notation
  let formattedNumber;
  if (totalPossible > 1e6) {
    const exponent = Math.floor(Math.log10(totalPossible));
    const mantissa = totalPossible / Math.pow(10, exponent);
    formattedNumber = `${mantissa.toFixed(2)}×10^${exponent}`;
  } else {
    formattedNumber = totalPossible.toLocaleString();
  }

  // Calculate comparison to IPv4 (which has 2^32 = 4,294,967,296 addresses)
  const ipv4Count = 4294967296;
  const timesMoreThanIpv4 = totalPossible / ipv4Count;

  let comparisonText = '';
  if (timesMoreThanIpv4 > 1) {
    if (timesMoreThanIpv4 > 1e6) {
      const exponent = Math.floor(Math.log10(timesMoreThanIpv4));
      const mantissa = timesMoreThanIpv4 / Math.pow(10, exponent);
      comparisonText = ` That's ${mantissa.toFixed(2)}×10^${exponent} times more than IPv4! 🔥`;
    } else {
      comparisonText = ` That's ${Math.round(timesMoreThanIpv4).toLocaleString()} times more than IPv4! 🔥`;
    }
  }

  // Create the stats message
  const statsMessage = `Available Hex Words: ${wordCount} (${formattedNumber} possible unique addresses.${comparisonText})`;

  // Update stats in generator tab
  const statsElement = document.getElementById('stats');
  if (statsElement) {
    statsElement.textContent = statsMessage;
  }

  // Update stats in wordlist tab
  const wordlistStatsElement = document.getElementById('wordlistStats');
  if (wordlistStatsElement) {
    wordlistStatsElement.textContent = statsMessage;
  }

  // Update leet stats
  const leetStats = document.getElementById('leetStats');
  if (leetStats && validLeetWords.length > 0) {
    leetStats.textContent = `Valid Hex Words Found: ${validLeetWords.length}`;
  } else if (leetStats) {
    leetStats.textContent = '';
  }
}

function updateWordlist() {
  const textarea = document.getElementById('customWordInput');
  const words = parseWordsFromText(textarea.value);

  if (words.length === 0) {
    alert('No valid hex words found. Words must only contain characters 0-9 and A-F, and be 4 characters long.');
    return;
  }

  // Store original words for comparison
  const originalWords = [...words];

  // Always apply blacklist filter to ensure no blacklisted words are in the wordlist
  const filteredWords = filterBlacklistedWords(words);
  currentWordlist = filteredWords;

  // Check if any words were filtered out
  const filteredOutWords = originalWords.filter(word => !filteredWords.includes(word));

  localStorage.setItem('ipv6WordList', JSON.stringify(currentWordlist));
  updateWordlistDisplay();

  // Provide feedback
  const output = document.getElementById('output');
  let message = `# Wordlist updated with ${currentWordlist.length} valid hex words.\n`;

  if (filteredOutWords.length > 0) {
    message += `# ${filteredOutWords.length} blacklisted word${filteredOutWords.length !== 1 ? 's were' : ' was'} filtered out: ${filteredOutWords.join(', ')}.\n`;
  }

  output.innerHTML = message;

  // Switch to generator tab
  openTab({ currentTarget: document.querySelector('.tab:first-child') }, 'generatorTab');
}

function updateBlacklist() {
  const textarea = document.getElementById('blacklistInput');
  const newBlacklistWords = textarea.value.split(/[\s\n]+/)
    .map(word => word.trim().toUpperCase())
    .filter(word => word && isValidHexWord(word));

  // Find words that are being removed from the blacklist
  const removedFromBlacklist = currentBlacklist.filter(word => !newBlacklistWords.includes(word));

  // Save the new blacklist state
  const oldBlacklist = [...currentBlacklist]; // Keep a copy of the old blacklist
  currentBlacklist = [...new Set(newBlacklistWords)]; // Remove duplicates
  localStorage.setItem('ipv6Blacklist', JSON.stringify(currentBlacklist));
  updateBlacklistDisplay();

  // Handle words removed from blacklist
  let addedToWordlist = [];
  if (removedFromBlacklist.length > 0 && document.getElementById('addRemovedWordsCheckbox').checked) {
    // Add words removed from blacklist to the wordlist
    const wordsToAdd = removedFromBlacklist.filter(word => !currentWordlist.includes(word));
    if (wordsToAdd.length > 0) {
      addedToWordlist = [...wordsToAdd]; // Keep track of added words
      currentWordlist = [...currentWordlist, ...wordsToAdd];
      localStorage.setItem('ipv6WordList', JSON.stringify(currentWordlist));

      // Update the textarea
      document.getElementById('customWordInput').value = currentWordlist.join('\n');
    }
  }

  // Count blacklisted words in the current wordlist
  const blacklistedWordsInList = currentWordlist.filter(word => currentBlacklist.includes(word));
  const blacklistedCount = blacklistedWordsInList.length;

  // Apply blacklist filter if auto-apply is checked
  if (document.getElementById('applyBlacklistCheckbox').checked && blacklistedCount > 0) {
    // Apply the filter to remove blacklisted words
    currentWordlist = filterBlacklistedWords(currentWordlist);

    localStorage.setItem('ipv6WordList', JSON.stringify(currentWordlist));

    // Update the textarea and display
    document.getElementById('customWordInput').value = currentWordlist.join('\n');
  }

  // Update the display
  updateWordlistDisplay();

  // Prepare feedback message
  let message = '';

  // Blacklist changes
  const addedToBlacklist = currentBlacklist.filter(word => !oldBlacklist.includes(word));

  if (addedToBlacklist.length > 0) {
    message += `# Added ${addedToBlacklist.length} word${addedToBlacklist.length !== 1 ? 's' : ''} to blacklist: ${addedToBlacklist.join(', ')}.\n`;
  }

  if (removedFromBlacklist.length > 0) {
    message += `# Removed ${removedFromBlacklist.length} word${removedFromBlacklist.length !== 1 ? 's' : ''} from blacklist: ${removedFromBlacklist.join(', ')}.\n`;

    if (addedToWordlist.length > 0) {
      message += `# Added ${addedToWordlist.length} previously blacklisted word${addedToWordlist.length !== 1 ? 's' : ''} to wordlist: ${addedToWordlist.join(', ')}.\n`;
    }
  }

  // Filtered words
  if (blacklistedCount > 0 && document.getElementById('applyBlacklistCheckbox').checked) {
    message += `# Filtered ${blacklistedCount} blacklisted word${blacklistedCount !== 1 ? 's' : ''} from wordlist: ${blacklistedWordsInList.join(', ')}.\n`;
  }

  if (message === '') {
    message = '# Blacklist updated. No changes detected.\n';
  }

  message += `# Current wordlist has ${currentWordlist.length} words.\n`;

  // Show the feedback
  const output = document.getElementById('output');
  if (output) {
    output.innerHTML = message;
  }
}

function applyBlacklistFilter() {
  // Find blacklisted words in the current wordlist
  const blacklistedWordsInList = currentWordlist.filter(word => currentBlacklist.includes(word));
  const blacklistedCount = blacklistedWordsInList.length;

  if (blacklistedCount === 0) {
    // No blacklisted words to remove
    const output = document.getElementById('output');
    if (output) {
      output.innerHTML = `# No blacklisted words found in your current wordlist. Nothing to remove.\n`;
    }
    return;
  }

  // Apply the filter to remove blacklisted words
  currentWordlist = filterBlacklistedWords(currentWordlist);
  localStorage.setItem('ipv6WordList', JSON.stringify(currentWordlist));

  // Update the textarea
  document.getElementById('customWordInput').value = currentWordlist.join('\n');

  // Update display
  updateWordlistDisplay();

  // Provide detailed feedback
  const output = document.getElementById('output');
  if (output) {
    output.innerHTML = `# Blacklist applied: Removed ${blacklistedCount} word${blacklistedCount !== 1 ? 's' : ''}: ${blacklistedWordsInList.join(', ')}.\n# ${currentWordlist.length} words remaining.\n`;
  }
}

function filterBlacklistedWords(wordlist) {
  return wordlist.filter(word => !currentBlacklist.includes(word));
}

function resetToDefaultWords() {
  currentWordlist = [...DEFAULT_WORDS];
  document.getElementById('customWordInput').value = currentWordlist.join('\n');
  localStorage.setItem('ipv6WordList', JSON.stringify(currentWordlist));
  updateWordlistDisplay();

  // Provide feedback
  const output = document.getElementById('output');
  output.innerHTML = '# Wordlist reset to default values.\n';

  // Switch to generator tab
  openTab({ currentTarget: document.querySelector('.tab:first-child') }, 'generatorTab');
}

function isValidHexWord(word) {
  return hexPattern.test(word);
}

function parseWordsFromText(text) {
  return text.split(/[\s\n]+/)
    .map(word => word.trim().toUpperCase())
    .filter(word => word && isValidHexWord(word));
}

function handleFileUpload() {
  const fileInput = document.getElementById('wordlistFile');
  const progressBar = document.getElementById('uploadProgress');
  const progressFill = document.getElementById('uploadProgressFill');
  const statusMsg = document.getElementById('uploadStatus');
  const fileNameDisplay = document.getElementById('fileNameDisplay');

  if (!fileInput.files.length) {
    return;
  }

  const file = fileInput.files[0];
  fileNameDisplay.textContent = file.name;

  if (file.size > 5 * 1024 * 1024) { // 5MB limit
    statusMsg.textContent = 'File is too large. Maximum size is 5MB.';
    statusMsg.className = 'status-message error';
    return;
  }

  // Show progress bar
  progressBar.style.display = 'block';
  progressFill.style.width = '0%';
  statusMsg.textContent = 'Reading file...';
  statusMsg.className = 'status-message';

  const reader = new FileReader();

  reader.onprogress = function(event) {
    if (event.lengthComputable) {
      const percentLoaded = Math.round((event.loaded / event.total) * 100);
      progressFill.style.width = percentLoaded + '%';
    }
  };

  reader.onload = function(event) {
    progressFill.style.width = '100%';
    statusMsg.textContent = 'Processing words...';

    const words = parseWordsFromText(event.target.result);

    // Store original words for comparison
    const originalWords = [...words];

    // Apply blacklist filter to the new words
    const filteredWords = filterBlacklistedWords(words);

    // Check if any words were filtered out
    const filteredOutWords = originalWords.filter(word => !filteredWords.includes(word));

    if (document.getElementById('appendWordsCheckbox').checked) {
      // Append filtered words to current wordlist
      currentWordlist = [...new Set([...currentWordlist, ...filteredWords])];
    } else {
      // Replace with filtered words
      currentWordlist = filteredWords;
    }

    localStorage.setItem('ipv6WordList', JSON.stringify(currentWordlist));
    updateWordlistDisplay(); // This already calls updateStats()

    // Provide more detailed feedback
    let statusMessage = `File processed successfully. ${filteredWords.length} words imported`;
    if (filteredOutWords.length > 0) {
      statusMessage += `, ${filteredOutWords.length} blacklisted word${filteredOutWords.length !== 1 ? 's' : ''} filtered out`;
    }
    statusMessage += `. ${currentWordlist.length} total words available.`;

    statusMsg.textContent = statusMessage;
    statusMsg.className = 'status-message success';

    // Also update the generator tab output with the results
    const output = document.getElementById('output');
    if (output) {
      let message = `# Word list updated with ${filteredWords.length} imported words.\n`;

      if (filteredOutWords.length > 0) {
        message += `# ${filteredOutWords.length} blacklisted word${filteredOutWords.length !== 1 ? 's were' : ' was'} filtered out: ${filteredOutWords.join(', ')}.\n`;
      }

      message += `# Total of ${currentWordlist.length} words now available.\n`;
      output.innerHTML = message;
    }
  };

  reader.readAsText(file);
}
