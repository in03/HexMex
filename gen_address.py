import random


# Function to load a local dictionary file
def load_words(filepath="dictionary.txt"):
    with open(filepath, "r") as f:
        words = f.read().splitlines()
    return words

# Generate all possible combinations of 8 valid blocks
def generate_ipv6_combos(words, max_results=1, unique_words=True, case="lowercase"):
    print(f"Total usable hex-words: {len(words)}")
    generated = set()
    while len(generated) < max_results:
        if unique_words:
            if len(words) < 8:
                print("Not enough unique words to generate an IPv6 address.")
                break
            combo = tuple(random.sample(words, 8))
        else:
            combo = tuple(random.choices(words, k=8))
        ipv6 = "::".join(combo)
        if case == "lowercase":
            ipv6 = ipv6.lower()
        else:
            ipv6 = ipv6.upper()
        if ipv6 not in generated:
            generated.add(ipv6)
            print(ipv6)

if __name__ == "__main__":
    hex_words = load_words()
    generate_ipv6_combos(hex_words)
