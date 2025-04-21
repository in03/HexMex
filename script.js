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

  // Set up search input event listeners
  setupSearchListeners();

  // Set up leet converter
  setupLeetConverter();
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

// Current leet word being converted
let currentLeetWord = null;

// Function to set up leet converter
function setupLeetConverter() {
  const leetInput = document.getElementById('leetInput');
  const checkboxes = document.querySelectorAll('#leetSubOptions input[type="checkbox"]');

  // Add event listener for input changes
  leetInput.addEventListener('input', function() {
    convertLeetRealtime();
  });

  // Add event listeners for checkbox changes
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      convertLeetRealtime();
    });
  });

  // Initial setup
  document.getElementById('addLeetWordBtn').disabled = true;
}

// Function to convert word in real-time
function convertLeetRealtime() {
  const inputText = document.getElementById('leetInput').value.trim();
  const originalWordSpan = document.getElementById('originalWord');
  const convertedWordSpan = document.getElementById('convertedWord');
  const validationDiv = document.getElementById('leetValidation');
  const addButton = document.getElementById('addLeetWordBtn');

  // Reset current leet word
  currentLeetWord = null;
  addButton.disabled = true;

  // Clear displays if no input
  if (!inputText) {
    originalWordSpan.textContent = '-';
    convertedWordSpan.textContent = '-';
    validationDiv.textContent = 'Enter a word to convert';
    validationDiv.className = 'leet-validation';
    return;
  }

  // Get selected substitutions
  const substitutions = [];
  const checkboxes = document.querySelectorAll('#leetSubOptions input:checked');
  checkboxes.forEach(checkbox => {
    const [from, to] = checkbox.value.split(':');
    substitutions.push({ from, to });
  });

  // Update original word display
  originalWordSpan.textContent = inputText;

  // Convert to leet speak
  let leetWord = inputText.toUpperCase();

  // Apply substitutions
  substitutions.forEach(sub => {
    const regex = new RegExp(sub.from, 'gi');
    leetWord = leetWord.replace(regex, sub.to);
  });

  // Update converted word display
  convertedWordSpan.textContent = leetWord;

  // Validate the converted word
  validateLeetWord(leetWord);
}

// Function to validate the converted leet word
function validateLeetWord(leetWord) {
  const validationDiv = document.getElementById('leetValidation');
  const addButton = document.getElementById('addLeetWordBtn');

  // Check if it's a valid hex word
  if (!isValidHexWord(leetWord)) {
    validationDiv.textContent = 'Not a valid hex word! Must only contain characters 0-9 and A-F, and be 4 characters long.';
    validationDiv.className = 'leet-validation invalid';
    return;
  }

  // Check if it's already in the wordlist
  if (currentWordlist.includes(leetWord)) {
    validationDiv.textContent = 'This word is already in your wordlist!';
    validationDiv.className = 'leet-validation warning';
    return;
  }

  // Check if it's in the blacklist
  if (currentBlacklist.includes(leetWord)) {
    validationDiv.textContent = 'This word is in your blacklist!';
    validationDiv.className = 'leet-validation invalid';
    return;
  }

  // If we got here, the word is valid
  validationDiv.textContent = 'Valid hex word! Ready to add to your wordlist.';
  validationDiv.className = 'leet-validation valid';
  currentLeetWord = leetWord;
  addButton.disabled = false;
}

// Function to add the current leet word to the wordlist
function addCurrentLeetWord() {
  if (!currentLeetWord) {
    return;
  }

  // Add to wordlist
  currentWordlist.push(currentLeetWord);
  localStorage.setItem('ipv6WordList', JSON.stringify(currentWordlist));

  // Update the wordlist display
  updateWordlistDisplay();

  // Add to recent leet words display
  addToRecentLeetWords(currentLeetWord);

  // Clear the input and reset
  document.getElementById('leetInput').value = '';
  document.getElementById('originalWord').textContent = '-';
  document.getElementById('convertedWord').textContent = '-';

  const validationDiv = document.getElementById('leetValidation');
  validationDiv.textContent = 'Word added successfully!';
  validationDiv.className = 'leet-validation valid';

  // Store the word for feedback before resetting
  const addedWord = currentLeetWord;

  // Disable the add button and reset current leet word
  document.getElementById('addLeetWordBtn').disabled = true;
  currentLeetWord = null;

  // Provide feedback in the generator tab
  const output = document.getElementById('output');
  if (output) {
    output.innerHTML = `# Added "${addedWord}" to your wordlist.\n# Total of ${currentWordlist.length} words now available.\n`;
  }
}

// Function to add a word to the recent leet words display
function addToRecentLeetWords(word) {
  const container = document.getElementById('recentLeetWords');

  // Remove empty message if present
  const emptyMessage = container.querySelector('.empty-message');
  if (emptyMessage) {
    emptyMessage.remove();
  }

  // Create a new word chip
  const chip = document.createElement('div');
  chip.classList.add('word-chip');

  const wordText = document.createElement('span');
  wordText.classList.add('word-chip-text');
  wordText.textContent = word;

  chip.appendChild(wordText);

  // Add to the beginning of the container
  if (container.firstChild) {
    container.insertBefore(chip, container.firstChild);
  } else {
    container.appendChild(chip);
  }

  // Limit to 20 recent words
  const chips = container.querySelectorAll('.word-chip');
  if (chips.length > 20) {
    container.removeChild(chips[chips.length - 1]);
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

function updateWordlistDisplay(filter = '') {
  const container = document.getElementById('wordlistDisplay');
  container.innerHTML = '';

  // Update count badge
  const countBadge = document.getElementById('wordlistCount');
  countBadge.textContent = currentWordlist.length;

  if (currentWordlist.length === 0) {
    container.innerHTML = '<div style="color: var(--error-color);">No words in list</div>';
    return;
  }

  // Filter words if a search term is provided
  const displayWords = filter ?
    currentWordlist.filter(word => word.includes(filter.toUpperCase())) :
    currentWordlist;

  // Show filtered count if filtering
  if (filter && displayWords.length < currentWordlist.length) {
    countBadge.textContent = `${displayWords.length}/${currentWordlist.length}`;
  } else {
    countBadge.textContent = currentWordlist.length;
  }

  displayWords.forEach(word => {
    const chip = document.createElement('div');
    chip.classList.add('word-chip');

    // Highlight the matching part if filtering
    if (filter && word.includes(filter.toUpperCase())) {
      const matchIndex = word.indexOf(filter.toUpperCase());
      const beforeMatch = word.substring(0, matchIndex);
      const match = word.substring(matchIndex, matchIndex + filter.length);
      const afterMatch = word.substring(matchIndex + filter.length);

      const wordText = document.createElement('span');
      wordText.classList.add('word-chip-text');

      if (beforeMatch) {
        const beforeSpan = document.createElement('span');
        beforeSpan.textContent = beforeMatch;
        wordText.appendChild(beforeSpan);
      }

      const matchSpan = document.createElement('span');
      matchSpan.textContent = match;
      matchSpan.classList.add('highlight-match');
      wordText.appendChild(matchSpan);

      if (afterMatch) {
        const afterSpan = document.createElement('span');
        afterSpan.textContent = afterMatch;
        wordText.appendChild(afterSpan);
      }

      chip.appendChild(wordText);
    } else {
      const wordText = document.createElement('span');
      wordText.classList.add('word-chip-text');
      wordText.textContent = word;
      chip.appendChild(wordText);
    }

    const removeBtn = document.createElement('span');
    removeBtn.classList.add('remove-word');
    removeBtn.textContent = '×';
    removeBtn.title = 'Remove from wordlist';
    removeBtn.onclick = function(e) {
      e.stopPropagation();
      removeWordFromList(word);
    };

    chip.appendChild(removeBtn);
    container.appendChild(chip);
  });

  // Update stats
  updateStats();
}

function updateBlacklistDisplay(filter = '') {
  const container = document.getElementById('blacklistDisplay');
  container.innerHTML = '';

  // Update count badge
  const countBadge = document.getElementById('blacklistCount');
  countBadge.textContent = currentBlacklist.length;

  if (currentBlacklist.length === 0) {
    container.innerHTML = '<div style="color: var(--accent-color);">No blacklisted words</div>';
    return;
  }

  // Filter words if a search term is provided
  const displayWords = filter ?
    currentBlacklist.filter(word => word.includes(filter.toUpperCase())) :
    currentBlacklist;

  // Show filtered count if filtering
  if (filter && displayWords.length < currentBlacklist.length) {
    countBadge.textContent = `${displayWords.length}/${currentBlacklist.length}`;
  } else {
    countBadge.textContent = currentBlacklist.length;
  }

  displayWords.forEach(word => {
    const chip = document.createElement('div');
    chip.classList.add('word-chip', 'blacklist-chip');

    // Highlight the matching part if filtering
    if (filter && word.includes(filter.toUpperCase())) {
      const matchIndex = word.indexOf(filter.toUpperCase());
      const beforeMatch = word.substring(0, matchIndex);
      const match = word.substring(matchIndex, matchIndex + filter.length);
      const afterMatch = word.substring(matchIndex + filter.length);

      const wordText = document.createElement('span');
      wordText.classList.add('word-chip-text');

      if (beforeMatch) {
        const beforeSpan = document.createElement('span');
        beforeSpan.textContent = beforeMatch;
        wordText.appendChild(beforeSpan);
      }

      const matchSpan = document.createElement('span');
      matchSpan.textContent = match;
      matchSpan.classList.add('highlight-match');
      wordText.appendChild(matchSpan);

      if (afterMatch) {
        const afterSpan = document.createElement('span');
        afterSpan.textContent = afterMatch;
        wordText.appendChild(afterSpan);
      }

      chip.appendChild(wordText);
    } else {
      const wordText = document.createElement('span');
      wordText.classList.add('word-chip-text');
      wordText.textContent = word;
      chip.appendChild(wordText);
    }

    const removeBtn = document.createElement('span');
    removeBtn.classList.add('remove-word');
    removeBtn.textContent = '×';
    removeBtn.title = 'Remove from blacklist';
    removeBtn.onclick = function(e) {
      e.stopPropagation();
      removeWordFromBlacklist(word);
    };

    chip.appendChild(removeBtn);
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
  localStorage.setItem('ipv6WordList', JSON.stringify(currentWordlist));
  updateWordlistDisplay();

  // Provide feedback
  const output = document.getElementById('output');
  output.innerHTML = '# Wordlist reset to default values.\n';
}

function isValidHexWord(word) {
  return hexPattern.test(word);
}

function parseWordsFromText(text) {
  // Split by any whitespace (spaces, tabs, newlines)
  // Also handle commas and other common separators
  return text.split(/[\s\n,;:]+/)
    .map(word => {
      // Remove any special characters and trim
      return word.replace(/[^A-Za-z0-9]/g, '').trim().toUpperCase();
    })
    .filter(word => word && isValidHexWord(word));
}

// Setup search input event listeners
function setupSearchListeners() {
  const unifiedSearch = document.getElementById('unifiedSearch');

  // Unified search
  unifiedSearch.addEventListener('input', function() {
    const searchTerm = this.value.trim().toUpperCase();
    updateWordlistDisplay(searchTerm);
    updateBlacklistDisplay(searchTerm);

    // Check if we need to show a suggestion
    if (searchTerm && isValidHexWord(searchTerm) &&
        !currentWordlist.includes(searchTerm) &&
        !currentBlacklist.includes(searchTerm)) {
      showSuggestion(searchTerm);
    } else {
      hideSuggestion();
    }
  });

  // Add word on Enter key
  unifiedSearch.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      const searchTerm = this.value.trim().toUpperCase();
      if (searchTerm && isValidHexWord(searchTerm)) {
        if (!currentWordlist.includes(searchTerm) && !currentBlacklist.includes(searchTerm)) {
          addWordToList(searchTerm);
        }
      }
    }
  });
}

// Show suggestion for a new word
function showSuggestion(word) {
  // Check if suggestion already exists
  let suggestionExists = document.querySelector('.suggestion-chip');
  if (suggestionExists) {
    hideSuggestion();
  }

  // Create suggestion in wordlist
  const wordlistContainer = document.getElementById('wordlistDisplay');
  const suggestionChip = document.createElement('div');
  suggestionChip.classList.add('word-chip', 'suggestion-chip');
  suggestionChip.setAttribute('data-word', word);

  const wordText = document.createElement('span');
  wordText.classList.add('word-chip-text');
  wordText.textContent = word;

  const addBtn = document.createElement('span');
  addBtn.classList.add('add-word');
  addBtn.textContent = '+';
  addBtn.title = 'Add to wordlist';
  addBtn.onclick = function(e) {
    e.stopPropagation();
    addWordToList(word);
  };

  suggestionChip.appendChild(wordText);
  suggestionChip.appendChild(addBtn);

  // Add to beginning of wordlist
  if (wordlistContainer.firstChild) {
    wordlistContainer.insertBefore(suggestionChip, wordlistContainer.firstChild);
  } else {
    wordlistContainer.appendChild(suggestionChip);
  }

  // Also create suggestion in blacklist
  const blacklistContainer = document.getElementById('blacklistDisplay');
  const blacklistSuggestion = suggestionChip.cloneNode(true);
  blacklistSuggestion.querySelector('.add-word').onclick = function(e) {
    e.stopPropagation();
    addWordToBlacklist(word);
  };
  blacklistSuggestion.querySelector('.add-word').title = 'Add to blacklist';

  // Add to beginning of blacklist
  if (blacklistContainer.firstChild) {
    blacklistContainer.insertBefore(blacklistSuggestion, blacklistContainer.firstChild);
  } else {
    blacklistContainer.appendChild(blacklistSuggestion);
  }
}

// Hide suggestion
function hideSuggestion() {
  const suggestions = document.querySelectorAll('.suggestion-chip');
  suggestions.forEach(suggestion => suggestion.remove());
}

// Add a word to the wordlist
function addWordToList(wordToAdd) {
  const searchInput = document.getElementById('unifiedSearch');
  const word = wordToAdd || searchInput.value.trim().toUpperCase();

  if (!word) {
    return;
  }

  if (!isValidHexWord(word)) {
    alert('Invalid hex word. Words must only contain characters 0-9 and A-F, and be 4 characters long.');
    return;
  }

  if (currentWordlist.includes(word)) {
    alert('This word is already in your wordlist.');
    return;
  }

  if (currentBlacklist.includes(word)) {
    alert('This word is in your blacklist. Remove it from the blacklist first.');
    return;
  }

  // Add the word
  currentWordlist.push(word);
  localStorage.setItem('ipv6WordList', JSON.stringify(currentWordlist));

  // Clear the search input
  searchInput.value = '';

  // Update display
  updateWordlistDisplay();
  updateBlacklistDisplay();
  hideSuggestion();

  // Provide feedback
  const output = document.getElementById('output');
  if (output) {
    output.innerHTML = `# Added "${word}" to your wordlist.\n# Total of ${currentWordlist.length} words now available.\n`;
  }
}

// Remove a word from the wordlist
function removeWordFromList(word) {
  currentWordlist = currentWordlist.filter(w => w !== word);
  localStorage.setItem('ipv6WordList', JSON.stringify(currentWordlist));

  // Update display
  const searchTerm = document.getElementById('unifiedSearch').value.trim().toUpperCase();
  updateWordlistDisplay(searchTerm);

  // Provide feedback
  const output = document.getElementById('output');
  if (output) {
    output.innerHTML = `# Removed "${word}" from your wordlist.\n# ${currentWordlist.length} words remaining.\n`;
  }
}

// Add a word to the blacklist
function addWordToBlacklist(wordToAdd) {
  const searchInput = document.getElementById('unifiedSearch');
  const word = wordToAdd || searchInput.value.trim().toUpperCase();

  if (!word) {
    return;
  }

  if (!isValidHexWord(word)) {
    alert('Invalid hex word. Words must only contain characters 0-9 and A-F, and be 4 characters long.');
    return;
  }

  if (currentBlacklist.includes(word)) {
    alert('This word is already in your blacklist.');
    return;
  }

  // Add the word to blacklist
  currentBlacklist.push(word);
  localStorage.setItem('ipv6Blacklist', JSON.stringify(currentBlacklist));

  // Remove from wordlist if present
  if (currentWordlist.includes(word)) {
    currentWordlist = currentWordlist.filter(w => w !== word);
    localStorage.setItem('ipv6WordList', JSON.stringify(currentWordlist));
    updateWordlistDisplay();
  }

  // Clear the search input
  searchInput.value = '';

  // Update display
  updateBlacklistDisplay();
  hideSuggestion();

  // Provide feedback
  const output = document.getElementById('output');
  if (output) {
    output.innerHTML = `# Added "${word}" to your blacklist.\n# Total of ${currentBlacklist.length} blacklisted words.\n`;
  }
}

// Remove a word from the blacklist
function removeWordFromBlacklist(word) {
  currentBlacklist = currentBlacklist.filter(w => w !== word);
  localStorage.setItem('ipv6Blacklist', JSON.stringify(currentBlacklist));

  // Update display
  const searchTerm = document.getElementById('unifiedSearch').value.trim().toUpperCase();
  updateBlacklistDisplay(searchTerm);

  // Provide feedback
  const output = document.getElementById('output');
  if (output) {
    output.innerHTML = `# Removed "${word}" from your blacklist.\n# ${currentBlacklist.length} blacklisted words remaining.\n`;
  }
}

// Clear the wordlist
function clearWordlist() {
  if (confirm('Are you sure you want to clear your entire wordlist?')) {
    currentWordlist = [];
    localStorage.setItem('ipv6WordList', JSON.stringify(currentWordlist));
    updateWordlistDisplay();

    // Provide feedback
    const output = document.getElementById('output');
    if (output) {
      output.innerHTML = '# Wordlist cleared. All words have been removed.\n';
    }
  }
}

// Clear the blacklist
function clearBlacklist() {
  if (confirm('Are you sure you want to clear your entire blacklist?')) {
    currentBlacklist = [];
    localStorage.setItem('ipv6Blacklist', JSON.stringify(currentBlacklist));
    updateBlacklistDisplay();

    // Provide feedback
    const output = document.getElementById('output');
    if (output) {
      output.innerHTML = '# Blacklist cleared. All words have been removed.\n';
    }
  }
}

// Reset blacklist to defaults
function resetToDefaultBlacklist() {
  currentBlacklist = [...DEFAULT_BLACKLIST];
  localStorage.setItem('ipv6Blacklist', JSON.stringify(currentBlacklist));

  // Apply blacklist to wordlist
  currentWordlist = filterBlacklistedWords(currentWordlist);
  localStorage.setItem('ipv6WordList', JSON.stringify(currentWordlist));

  // Update displays
  updateBlacklistDisplay();
  updateWordlistDisplay();

  // Provide feedback
  const output = document.getElementById('output');
  if (output) {
    output.innerHTML = '# Blacklist reset to default values.\n';
  }
}

// Add all missing words from search
function addAllMissingWords() {
  const searchInput = document.getElementById('wordlistSearch');
  const word = searchInput.value.trim().toUpperCase();

  if (!word || !isValidHexWord(word) || currentWordlist.includes(word) || currentBlacklist.includes(word)) {
    return;
  }

  // Add the word
  currentWordlist.push(word);
  localStorage.setItem('ipv6WordList', JSON.stringify(currentWordlist));

  // Clear the search input
  searchInput.value = '';

  // Update display
  updateWordlistDisplay();

  // Provide feedback
  const output = document.getElementById('output');
  if (output) {
    output.innerHTML = `# Added "${word}" to your wordlist.\n# Total of ${currentWordlist.length} words now available.\n`;
  }
}

// Add all missing words to blacklist from search
function addAllMissingToBlacklist() {
  const searchInput = document.getElementById('blacklistSearch');
  const word = searchInput.value.trim().toUpperCase();

  if (!word || !isValidHexWord(word) || currentBlacklist.includes(word)) {
    return;
  }

  // Add the word to blacklist
  currentBlacklist.push(word);
  localStorage.setItem('ipv6Blacklist', JSON.stringify(currentBlacklist));

  // Remove from wordlist if present
  if (currentWordlist.includes(word)) {
    currentWordlist = currentWordlist.filter(w => w !== word);
    localStorage.setItem('ipv6WordList', JSON.stringify(currentWordlist));
    updateWordlistDisplay();
  }

  // Clear the search input
  searchInput.value = '';

  // Update display
  updateBlacklistDisplay();

  // Provide feedback
  const output = document.getElementById('output');
  if (output) {
    output.innerHTML = `# Added "${word}" to your blacklist.\n# Total of ${currentBlacklist.length} blacklisted words.\n`;
  }
}

// Remove filtered words from wordlist
function removeFilteredWords() {
  const searchInput = document.getElementById('wordlistSearch');
  const filter = searchInput.value.trim().toUpperCase();

  if (!filter) {
    return;
  }

  // Get filtered words
  const filteredWords = currentWordlist.filter(word => word.includes(filter));

  if (filteredWords.length === 0) {
    return;
  }

  if (confirm(`Are you sure you want to remove ${filteredWords.length} filtered word(s) from your wordlist?`)) {
    // Remove filtered words
    currentWordlist = currentWordlist.filter(word => !word.includes(filter));
    localStorage.setItem('ipv6WordList', JSON.stringify(currentWordlist));

    // Clear the search input
    searchInput.value = '';

    // Update display
    updateWordlistDisplay();

    // Provide feedback
    const output = document.getElementById('output');
    if (output) {
      output.innerHTML = `# Removed ${filteredWords.length} filtered word(s) from your wordlist.\n# ${currentWordlist.length} words remaining.\n`;
    }
  }
}

// Remove filtered words from blacklist
function removeFilteredFromBlacklist() {
  const searchInput = document.getElementById('blacklistSearch');
  const filter = searchInput.value.trim().toUpperCase();

  if (!filter) {
    return;
  }

  // Get filtered words
  const filteredWords = currentBlacklist.filter(word => word.includes(filter));

  if (filteredWords.length === 0) {
    return;
  }

  if (confirm(`Are you sure you want to remove ${filteredWords.length} filtered word(s) from your blacklist?`)) {
    // Remove filtered words
    currentBlacklist = currentBlacklist.filter(word => !word.includes(filter));
    localStorage.setItem('ipv6Blacklist', JSON.stringify(currentBlacklist));

    // Clear the search input
    searchInput.value = '';

    // Update display
    updateBlacklistDisplay();

    // Provide feedback
    const output = document.getElementById('output');
    if (output) {
      output.innerHTML = `# Removed ${filteredWords.length} filtered word(s) from your blacklist.\n# ${currentBlacklist.length} blacklisted words remaining.\n`;
    }
  }
}

function handleFileUpload() {
  const fileInput = document.getElementById('wordlistFile');
  const progressBar = document.getElementById('uploadProgress');
  const progressFill = document.getElementById('uploadProgressFill');
  const statusMsg = document.getElementById('uploadStatus');

  if (!fileInput.files.length) {
    return;
  }

  const file = fileInput.files[0];

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

    // Always append to current wordlist
    const newWords = filteredWords.filter(word => !currentWordlist.includes(word));
    currentWordlist = [...currentWordlist, ...newWords];

    localStorage.setItem('ipv6WordList', JSON.stringify(currentWordlist));
    updateWordlistDisplay(); // This already calls updateStats()
    updateBlacklistDisplay();

    // Provide more detailed feedback
    let statusMessage = `File processed: ${newWords.length} new words added`;
    if (filteredOutWords.length > 0) {
      statusMessage += `, ${filteredOutWords.length} blacklisted word${filteredOutWords.length !== 1 ? 's' : ''} filtered out`;
    }
    statusMessage += `. ${currentWordlist.length} total words available.`;

    statusMsg.textContent = statusMessage;
    statusMsg.className = 'status-message success';

    // Clear the file input
    fileInput.value = '';

    // Hide progress bar after 3 seconds
    setTimeout(() => {
      progressBar.style.display = 'none';
      statusMsg.textContent = '';
    }, 3000);

    // Also update the generator tab output with the results
    const output = document.getElementById('output');
    if (output) {
      let message = `# Word list updated with ${newWords.length} new words.\n`;

      if (filteredOutWords.length > 0) {
        message += `# ${filteredOutWords.length} blacklisted word${filteredOutWords.length !== 1 ? 's were' : ' was'} filtered out.\n`;
      }

      message += `# Total of ${currentWordlist.length} words now available.\n`;
      output.innerHTML = message;
    }
  };

  reader.readAsText(file);
}
