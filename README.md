
- Downloaded text dict, e.g ENABLE dict: https://norvig.com/ngrams/enable1.txt
- Pre-process with `dict_gen.py` for generation speed.

With 46 words to choose from, my 1337-word limited adressing scheme still provides an enormous 117 trillion possibilities. Ipv4 offers 4.3 billion. 1337-ipv6 still offers over 27,000× more.

## Generating the Wordlist

My wordlist is pretty unscientific. 
1. I the ENABLE dict from here https://norvig.com/ngrams/enable1.txt
2. Check for valid hexadecimal strings using a regex.
3. Attempt leetspeak substitutions if not valid and check again.
4. Dedupe and sort.
6. Remove words I didn't like. Some of the substitutions were obtuse, or the words were too uncommon.

I actually disabled most of the substitutions because with words this short, it was pretty unreadable.
```python
leet_substitutions = {
    # 'S': '5',
    'O': '0',
    # 'T': '7',
    'I': '1',
    # 'Z': '2',
    # 'G': '6',
    # 'B': '8'
}
```

It's actually very fast to generate, even using larger wordlists like SCOWL 95. But I noticed no obvious missing words when using the larger lists, so opted to stay with the more simple ENABLE list.
