+++
authors = ["Caleb Trevatt"]
title = "Fancy IPv6 Address Generator"
description = "Let's make IPv6 popular"
date = 2025-02-25

[extra]

[taxonomies]
tags = ["ipv6", "network", "generator", "goof"]
+++

## Why?
1. I wanted to make IPv6 addresses easier to type out when copy/paste isn't accessible.  
2. If you can spell "cabbage" with musical letter notation, you can spell even more with hexidecimal. 

## Generating the Wordlist

My wordlist is pretty unscientific. I just took a huge list of dictionary words and decided I would filter the ones that meet my criteria. I ended up doing this in Python.

1. I started with the ENABLE dict from here https://norvig.com/ngrams/enable1.txt
2. Check for valid hexadecimal strings using a regex.
3. Attempt leetspeak substitutions if not valid and check again.
4. Dedupe and sort.
5. Output an adjusted wordlist.
6. Manually remove words I didn't like. Some of the substitutions were obtuse, or the words were too uncommon.

It's actually very fast to generate, even using larger wordlists like SCOWL 95. But I noticed no obvious missing words when using the larger lists, so opted to stay with the more simple ENABLE list.

I actually disabled most of the substitutions, because with words this short, they can be pretty hard to interpret. Guess I'm not 1337 enough.

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

In a future version, I might add the ability to enable/disable substitutions to the address generator. I may be able to keep my pre-processing approach by doing json, but given the low performance requirements, I might move the entire dictionary generation into the address generator. It could be interesting allowing users to pass in custom dictionaries.

<iframe src="./generator.html" style="height: 130vh; border: none; margin: 0; padding: 0; overflow: hidden; box-sizing: border-box;"></iframe>
