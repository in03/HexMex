import re

from rich.progress import Progress

# Regex to match hex words using only A-F (real hex)
hex_pattern = re.compile(r"^[A-F0-9]{4}$")

# Map of possible leetspeak substitutions that would make a word hex-compatible
leet_substitutions = {
    # 'S': '5',
    'O': '0',
    # 'T': '7',
    'I': '1',
    # 'Z': '2',
    # 'G': '6',
    # 'B': '8'
}

# Function to convert a word to its leetspeak equivalent and check if it's valid hex
def convert_to_hex_with_leet(word):
    # Replace eligible letters with their leet equivalents
    substituted = ''.join(leet_substitutions.get(c, c) for c in word)
    # Check if the substituted word is a valid hex string
    if hex_pattern.match(substituted):
        return substituted
    return None

# Open the word list and output files
with open("wordlist.txt", "r") as f, open("dictionary.txt", "w") as out_file:
    total_lines = sum(1 for _ in open("wordlist.txt", "r"))

    with Progress() as progress:
        task = progress.add_task("[cyan]Processing words...", total=total_lines)

        valid_hex_words = set()  # Use a set to ensure deduplication

        f.seek(0)  # Go back to start of file
        for line in f:
            word = line.strip().upper()

            # If the word is already valid hex, retain it
            if hex_pattern.match(word):
                valid_hex_words.add(word)
            else:
                # Convert leetspeak-compatible words to hex and save
                converted = convert_to_hex_with_leet(word)
                if converted:
                    valid_hex_words.add(converted)

            progress.update(task, advance=1)

        # Write deduplicated results to the output file
        for hex_word in sorted(valid_hex_words):  # Sort for consistent output
            out_file.write(hex_word + "\n")

print(f"Found {len(valid_hex_words)} unique valid hex words.")
